import { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../src/database";

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
}

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Get all subscription plans
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await db("subscription_plans").select("*");
    res.json(plans);
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    res.status(500).json({ error: "Failed to fetch subscription plans" });
  }
};

// Get user's current subscription
export const getUserSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    const userId = req.session.userId;

    const subscription = await db("user_subscriptions")
      .join(
        "subscription_plans",
        "user_subscriptions.plan_id",
        "subscription_plans.id"
      )
      .where("user_subscriptions.user_id", userId)
      .select(
        "user_subscriptions.*",
        "subscription_plans.plan_name",
        "subscription_plans.price",
        "subscription_plans.description"
      )
      .first();

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

// Create a Stripe customer and subscription
export const createSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    const userId = req.session.userId;
    const { planId, paymentMethodId } = req.body;

    if (!planId || !paymentMethodId) {
      return res
        .status(400)
        .json({ error: "Plan ID and payment method are required" });
    }

    // Get the plan details
    const plan = await db("subscription_plans").where("id", planId).first();
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Get user details
    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already has a subscription
    const existingSubscription = await db("user_subscriptions")
      .where("user_id", userId)
      .first();

    if (existingSubscription) {
      return res.status(400).json({ error: "User already has a subscription" });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Use pre-created Stripe price ID from database
    if (!plan.stripe_price_id) {
      return res.status(400).json({
        error: "Plan not configured with Stripe. Please contact support.",
      });
    }

    // Create Stripe subscription using the pre-created price
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.stripe_price_id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // Save subscription to database
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.duration_days || 30));

    await db("user_subscriptions").insert({
      user_id: userId,
      plan_id: planId,
      status: "active",
      start_date: startDate,
      end_date: endDate,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
    });

    res.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        customerId: customer.id,
        plan: plan,
      },
      clientSecret: (subscription.latest_invoice as any)?.payment_intent
        ?.client_secret,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

// Cancel subscription
export const cancelSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    const userId = req.session.userId;

    // Get user's subscription
    const userSubscription = await db("user_subscriptions")
      .where("user_id", userId)
      .first();

    if (!userSubscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    // If no Stripe subscription exists, just update the database
    if (!userSubscription.stripe_subscription_id) {
      await db("user_subscriptions").where("user_id", userId).update({
        status: "canceled",
        canceled_at: new Date(),
      });

      return res.json({
        message: "Subscription canceled successfully (database only)",
      });
    }

    try {
      // Cancel in Stripe
      await stripe.subscriptions.update(
        userSubscription.stripe_subscription_id,
        {
          cancel_at_period_end: true,
        }
      );

      // Update database
      await db("user_subscriptions").where("user_id", userId).update({
        status: "canceled",
        canceled_at: new Date(),
      });

      res.json({ message: "Subscription canceled successfully" });
    } catch (stripeError: any) {
      // If Stripe subscription doesn't exist, just update the database
      if (stripeError.code === "resource_missing") {
        await db("user_subscriptions").where("user_id", userId).update({
          status: "canceled",
          canceled_at: new Date(),
          stripe_subscription_id: null, // Clear the invalid Stripe ID
        });

        return res.json({
          message:
            "Subscription canceled successfully (database only - Stripe subscription was invalid)",
        });
      }
      throw stripeError;
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
};

// Resubscribe to canceled subscription
export const resubscribe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    const userId = req.session.userId;

    // Get user's canceled subscription
    const userSubscription = await db("user_subscriptions")
      .where("user_id", userId)
      .where("status", "canceled")
      .first();

    if (!userSubscription) {
      return res.status(404).json({ error: "No canceled subscription found" });
    }

    // Check if subscription period has ended
    const endDate = new Date(userSubscription.end_date);
    if (endDate < new Date()) {
      return res.status(400).json({
        error:
          "Subscription period has ended. Please create a new subscription.",
      });
    }

    if (!userSubscription.stripe_subscription_id) {
      return res
        .status(400)
        .json({ error: "No Stripe subscription to reactivate" });
    }

    // Reactivate in Stripe
    await stripe.subscriptions.update(userSubscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    // Update database
    await db("user_subscriptions").where("user_id", userId).update({
      status: "active",
      canceled_at: null,
    });

    res.json({ message: "Subscription reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    res.status(500).json({ error: "Failed to reactivate subscription" });
  }
};

// Switch subscription plan
export const switchPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    const userId = req.session.userId;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: "Plan ID is required" });
    }

    // Get user's subscription
    const userSubscription = await db("user_subscriptions")
      .where("user_id", userId)
      .first();

    if (!userSubscription) {
      return res.status(404).json({ error: "No subscription found" });
    }

    // Get the new plan details
    const newPlan = await db("subscription_plans").where("id", planId).first();
    if (!newPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // If no Stripe subscription exists, just update the database
    if (!userSubscription.stripe_subscription_id) {
      await db("user_subscriptions").where("user_id", userId).update({
        plan_id: planId,
      });

      return res.json({
        message: "Plan switched successfully (database only)",
        newPlan: newPlan.plan_name,
        effectiveDate: new Date().toISOString(),
      });
    }

    // Use pre-created Stripe price ID from database
    if (!newPlan.stripe_price_id) {
      return res.status(400).json({
        error: "Plan not configured with Stripe. Please contact support.",
      });
    }

    try {
      // Update subscription in Stripe using the pre-created price
      const subscription = await stripe.subscriptions.retrieve(
        userSubscription.stripe_subscription_id
      );
      const currentItem = subscription.items.data[0];

      await stripe.subscriptions.update(
        userSubscription.stripe_subscription_id,
        {
          items: [
            {
              id: currentItem.id,
              price: newPlan.stripe_price_id,
            },
          ],
          proration_behavior: "create_prorations",
        }
      );

      // Update database
      await db("user_subscriptions").where("user_id", userId).update({
        plan_id: planId,
      });

      res.json({
        message: "Plan switched successfully",
        newPlan: newPlan.plan_name,
        effectiveDate: new Date().toISOString(),
      });
    } catch (stripeError: any) {
      // If Stripe subscription doesn't exist, just update the database
      if (stripeError.code === "resource_missing") {
        await db("user_subscriptions").where("user_id", userId).update({
          plan_id: planId,
          stripe_subscription_id: null, // Clear the invalid Stripe ID
        });

        return res.json({
          message:
            "Plan switched successfully (database only - Stripe subscription was invalid)",
          newPlan: newPlan.plan_name,
          effectiveDate: new Date().toISOString(),
        });
      }
      throw stripeError;
    }
  } catch (error) {
    console.error("Error switching plan:", error);
    res.status(500).json({ error: "Failed to switch plan" });
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (req: Request, res: Response) => {
  console.log(
    "🔔 Webhook received:",
    req.headers["stripe-signature"] ? "Signed" : "Unsigned"
  );

  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook signature verified");
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log(`📦 Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    console.log("✅ Webhook processed successfully");
    res.json({ received: true });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

// Webhook handlers
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userSubscription = await db("user_subscriptions")
    .where("stripe_subscription_id", subscription.id)
    .first();

  if (userSubscription) {
    await db("user_subscriptions")
      .where("stripe_subscription_id", subscription.id)
      .update({
        status: subscription.status,
        end_date: new Date(subscription.current_period_end * 1000),
      });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db("user_subscriptions")
    .where("stripe_subscription_id", subscription.id)
    .update({
      status: "canceled",
      canceled_at: new Date(),
    });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await db("user_subscriptions")
      .where("stripe_subscription_id", invoice.subscription as string)
      .update({
        status: "active",
      });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await db("user_subscriptions")
      .where("stripe_subscription_id", invoice.subscription as string)
      .update({
        status: "past_due",
      });
  }
}

// Get payment intent for client-side confirmation
export const createPaymentIntent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { amount, currency = "usd" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

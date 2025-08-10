require("dotenv").config();
const Stripe = require("stripe");

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Subscription plans data (matching database seeds)
const subscriptionPlans = [
  {
    name: "Free Trial",
    price: 0.0,
    duration_days: 14,
    description: "14-day free trial with full access to all features",
    note_limit: 100,
    task_limit: 50,
    galaxy_limit: 10,
    ai_insights_per_day: 20,
    interval: null, // Free trial doesn't need billing interval
  },
  {
    name: "Basic Monthly",
    price: 9.99,
    duration_days: 30,
    description:
      "Monthly subscription with basic features and limited AI insights",
    note_limit: 20,
    task_limit: 30,
    galaxy_limit: 10,
    ai_insights_per_day: 10,
    interval: "month",
  },
  {
    name: "Basic Annual",
    price: 99.99,
    duration_days: 365,
    description:
      "Annual subscription with basic features and limited AI insights (save 17%)",
    note_limit: 20,
    task_limit: 30,
    galaxy_limit: 10,
    ai_insights_per_day: 10,
    interval: "year",
  },
  {
    name: "Pro Monthly",
    price: 19.99,
    duration_days: 30,
    description:
      "Monthly subscription with unlimited AI insights and advanced features",
    note_limit: -1, // Unlimited
    task_limit: -1, // Unlimited
    galaxy_limit: -1, // Unlimited
    ai_insights_per_day: -1, // Unlimited
    interval: "month",
  },
  {
    name: "Pro Annual",
    price: 199.99,
    duration_days: 365,
    description:
      "Annual subscription with unlimited AI insights and advanced features (save 17%)",
    note_limit: -1, // Unlimited
    task_limit: -1, // Unlimited
    galaxy_limit: -1, // Unlimited
    ai_insights_per_day: -1, // Unlimited
    interval: "year",
  },
  {
    name: "Enterprise",
    price: 49.99,
    duration_days: 30,
    description:
      "Monthly enterprise plan with team collaboration and priority support",
    note_limit: -1, // Unlimited
    task_limit: -1, // Unlimited
    galaxy_limit: -1, // Unlimited
    ai_insights_per_day: -1, // Unlimited
    interval: "month",
  },
  {
    name: "Free Tier",
    price: 0.0,
    duration_days: null,
    description: "Permanent free tier with limited features and AI insights",
    note_limit: 5,
    task_limit: 10,
    galaxy_limit: 3,
    ai_insights_per_day: 5,
    interval: null, // Free tier doesn't need billing interval
  },
];

async function setupStripeSubscriptions() {
  console.log("🚀 Setting up Stripe subscription plans...\n");

  try {
    for (const plan of subscriptionPlans) {
      console.log(`📋 Processing: ${plan.name}`);

      // Skip free plans (Free Trial and Free Tier) as they don't need Stripe products
      if (plan.price === 0.0) {
        console.log(`   ⏭️  Skipping ${plan.name} (free plan)`);
        continue;
      }

      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          note_limit: plan.note_limit.toString(),
          task_limit: plan.task_limit.toString(),
          galaxy_limit: plan.galaxy_limit.toString(),
          ai_insights_per_day: plan.ai_insights_per_day.toString(),
          duration_days: plan.duration_days?.toString() || "",
        },
      });

      console.log(`   ✅ Created product: ${product.name} (ID: ${product.id})`);

      // Create price for the product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.price * 100), // Convert to cents
        currency: "usd",
        recurring: {
          interval: plan.interval,
        },
        metadata: {
          plan_name: plan.name,
          duration_days: plan.duration_days?.toString() || "",
        },
      });

      console.log(
        `   ✅ Created price: $${plan.price}/${plan.interval} (ID: ${price.id})`
      );
      console.log(
        `   📊 Limits: ${plan.note_limit} notes, ${plan.task_limit} tasks, ${plan.galaxy_limit} galaxies, ${plan.ai_insights_per_day} AI insights/day\n`
      );
    }

    console.log("🎉 All subscription plans have been created in Stripe!");
    console.log("\n📝 Next steps:");
    console.log("1. Copy the product and price IDs above");
    console.log(
      "2. Update your database seeds to include Stripe product/price IDs"
    );
    console.log("3. Test the subscription flow with these plans");
  } catch (error) {
    console.error("❌ Error setting up Stripe subscriptions:", error);
    process.exit(1);
  }
}

// Run the setup
setupStripeSubscriptions();

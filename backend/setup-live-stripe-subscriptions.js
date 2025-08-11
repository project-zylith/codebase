require("dotenv").config();
const Stripe = require("stripe");

// Use environment variable for the live key
const LIVE_STRIPE_SECRET_KEY = process.env.LIVE_STRIPE_SECRET_KEY;

if (!LIVE_STRIPE_SECRET_KEY) {
  console.error("❌ LIVE_STRIPE_SECRET_KEY environment variable is not set");
  console.error("Please add LIVE_STRIPE_SECRET_KEY to your .env file");
  process.exit(1);
}

console.log("🚀 Setting up LIVE MODE Stripe subscription plans...");
console.log("Mode: LIVE (Real Payments)");
console.log("Account:", LIVE_STRIPE_SECRET_KEY.substring(0, 12) + "...\n");

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
    note_limit: 10,
    task_limit: 10,
    galaxy_limit: 3,
    ai_insights_per_day: 5,
    interval: "month",
  },
];

async function setupLiveStripeSubscriptions() {
  try {
    if (!LIVE_STRIPE_SECRET_KEY) {
      throw new Error("LIVE_STRIPE_SECRET_KEY environment variable is not set");
    }

    const stripe = new Stripe(LIVE_STRIPE_SECRET_KEY);

    // Get account details
    const account = await stripe.accounts.retrieve();
    console.log("✅ Connected to Stripe account:", account.id);
    console.log("   Charges Enabled:", account.charges_enabled);
    console.log("   Payouts Enabled:", account.payouts_enabled);
    console.log("   Country:", account.country);
    console.log("   Currency:", account.default_currency);

    if (!account.charges_enabled) {
      console.log("\n⚠️  WARNING: Charges are not enabled on this account!");
      console.log(
        "   You need to complete Stripe onboarding to accept payments."
      );
    }

    const results = [];

    for (const plan of subscriptionPlans) {
      if (plan.price === 0) {
        // Skip free trial - no Stripe product needed
        console.log(`⏭️  Skipping ${plan.name} (free plan)`);
        results.push({
          name: plan.name,
          stripe_product_id: null,
          stripe_price_id: null,
          note: "Free plan - no Stripe product needed",
        });
        continue;
      }

      console.log(`\n📦 Creating product: ${plan.name}`);

      // Create or find existing product
      let product;
      try {
        // Try to find existing product by name
        const existingProducts = await stripe.products.list({
          limit: 100,
          active: true,
        });

        product = existingProducts.data.find((p) => p.name === plan.name);

        if (product) {
          console.log(`   ✅ Found existing product: ${product.id}`);
        } else {
          // Create new product
          product = await stripe.products.create({
            name: plan.name,
            description: plan.description,
            active: true,
          });
          console.log(`   ✅ Created new product: ${product.id}`);
        }
      } catch (error) {
        console.error(`   ❌ Error with product ${plan.name}:`, error.message);
        continue;
      }

      // Create or find existing price
      console.log(`💰 Creating price for ${plan.name}`);
      let price;
      try {
        // Try to find existing price
        const existingPrices = await stripe.prices.list({
          limit: 100,
          active: true,
          product: product.id,
        });

        // Look for price with matching amount and interval
        price = existingPrices.data.find(
          (p) =>
            p.unit_amount === Math.round(plan.price * 100) &&
            p.currency === "usd" &&
            p.recurring &&
            p.recurring.interval === plan.interval
        );

        if (price) {
          console.log(`   ✅ Found existing price: ${price.id}`);
        } else {
          // Create new price
          const priceData = {
            unit_amount: Math.round(plan.price * 100),
            currency: "usd",
            product: product.id,
            active: true,
          };

          if (plan.interval) {
            priceData.recurring = {
              interval: plan.interval,
              interval_count: 1,
            };
          }

          price = await stripe.prices.create(priceData);
          console.log(`   ✅ Created new price: ${price.id}`);
        }
      } catch (error) {
        console.error(
          `   ❌ Error with price for ${plan.name}:`,
          error.message
        );
        continue;
      }

      results.push({
        name: plan.name,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        price: plan.price,
        interval: plan.interval,
      });

      console.log(`   📋 Product: ${product.id}`);
      console.log(`   💰 Price: ${price.id}`);
      console.log(`   💵 Amount: $${plan.price} USD`);
      if (plan.interval) {
        console.log(`   🔄 Billing: ${plan.interval}ly`);
      }
    }

    console.log("\n🎯 Summary:");
    console.log("===========");
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}`);
      if (result.stripe_product_id) {
        console.log(`   Product ID: ${result.stripe_product_id}`);
        console.log(`   Price ID: ${result.stripe_price_id}`);
        console.log(`   Price: $${result.price} USD`);
        if (result.interval) {
          console.log(`   Billing: ${result.interval}ly`);
        }
      } else {
        console.log(`   ${result.note}`);
      }
    });

    console.log("\n📝 Next steps:");
    console.log("1. Copy the Product IDs and Price IDs above");
    console.log("2. Update your database seeds with these new IDs");
    console.log("3. Run the seeds to update your database");
    console.log("4. Make sure Railway is using the same Stripe keys");
  } catch (error) {
    console.error("❌ Error setting up Stripe subscriptions:", error.message);
    if (error.type === "StripeAuthenticationError") {
      console.log("🔑 Check your STRIPE_SECRET_KEY");
    } else if (error.type === "StripeInvalidRequestError") {
      console.log("📝 Check your request format");
    }
  }
}

setupLiveStripeSubscriptions();

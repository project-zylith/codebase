const knex = require("knex");

async function quickSubscriptionCheck() {
  console.log("🔍 QUICK SUBSCRIPTION STATUS CHECK...\n");

  try {
    // Simple database connection using environment variables
    const db = knex({
      client: "pg",
      connection: {
        host: process.env.PG_HOST || "localhost",
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "",
        database: process.env.PG_NAME || "renaissance",
      },
    });

    console.log("✅ Database connected successfully\n");

    // 1. Check subscription plans
    console.log("1️⃣ Subscription Plans:");
    const plans = await db("subscription_plans").select("*");
    plans.forEach((plan) => {
      console.log(
        `  - ${plan.plan_name}: $${plan.price} (Apple ID: ${
          plan.apple_product_id || "NOT SET"
        })`
      );
    });
    console.log("");

    // 2. Check recent subscriptions
    console.log("2️⃣ Recent Subscriptions (Last 10):");
    const recentSubs = await db("user_subscriptions")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(10);

    if (recentSubs.length === 0) {
      console.log("  ❌ No subscriptions found in database");
    } else {
      recentSubs.forEach((sub) => {
        const status = sub.status === "active" ? "✅" : "❌";
        console.log(
          `  ${status} User ${sub.user_id}: ${sub.status} (${sub.created_at})`
        );
        if (sub.apple_transaction_id) {
          console.log(`    Apple TX: ${sub.apple_transaction_id}`);
        }
      });
    }
    console.log("");

    // 3. Check for any failed validations
    console.log("3️⃣ Failed Validations:");
    const failedValidations = await db("user_subscriptions")
      .where("apple_validation_status", "failed")
      .select("*");

    if (failedValidations.length > 0) {
      console.log(`  Found ${failedValidations.length} failed validations:`);
      failedValidations.forEach((sub) => {
        console.log(
          `    User ${sub.user_id}: ${sub.apple_validation_status} (${sub.apple_last_validated})`
        );
      });
    } else {
      console.log("  ✅ No failed validations found");
    }
    console.log("");

    // 4. Check environment variables
    console.log("4️⃣ Environment Check:");
    const envVars = [
      "PG_HOST",
      "PG_PORT",
      "PG_USER",
      "PG_NAME",
      "STRIPE_SECRET_KEY",
      "JWT_SECRET",
    ];
    envVars.forEach((varName) => {
      const value = process.env[varName];
      if (value) {
        console.log(
          `  ✅ ${varName}: ${varName.includes("SECRET") ? "***SET***" : value}`
        );
      } else {
        console.log(`  ❌ ${varName}: NOT SET`);
      }
    });
    console.log("");

    console.log("🔍 DIAGNOSTIC COMPLETE");
    console.log("\n🚨 IMMEDIATE ACTIONS NEEDED:");
    console.log(
      '1. If you see "No subscriptions found" - the user\'s payment failed to process'
    );
    console.log(
      "2. If you see failed validations - Apple receipt validation is failing"
    );
    console.log("3. Check your backend logs for Apple IAP errors");
    console.log(
      "4. Verify the /api/subscriptions/validate-apple-receipt endpoint is working"
    );
  } catch (error) {
    console.error("❌ Quick check failed:", error.message);
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check if your backend server is running");
    console.log("2. Verify database connection details");
    console.log("3. Look for error logs in your backend console");
  } finally {
    if (typeof db !== "undefined") {
      await db.destroy();
    }
  }
}

// Run the quick check
quickSubscriptionCheck();

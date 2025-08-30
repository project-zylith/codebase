require("dotenv").config();
const knex = require("knex");

async function comprehensiveIAPDiagnostic() {
  console.log("🔍 COMPREHENSIVE APPLE IAP DIAGNOSTIC...\n");
  console.log(
    "This will test the entire subscription flow to identify where it's failing\n"
  );

  let db;

  try {
    // 1. Test database connection
    console.log("1️⃣ Testing Database Connection...");

    // Use Supabase connection string for production
    const connectionConfig = {
      client: "pg",
      connection: process.env.PG_CONNECTION_STRING,
      ssl:
        process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

    db = knex(connectionConfig);
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful\n");

    // 2. Check subscription plans configuration
    console.log("2️⃣ Checking Subscription Plans Configuration...");
    const plans = await db("subscription_plans").select("*");

    if (plans.length === 0) {
      console.log("❌ No subscription plans found in database");
      return;
    }

    console.log(`Found ${plans.length} subscription plans:`);
    plans.forEach((plan) => {
      const appleId = plan.apple_product_id || "NOT SET";
      const stripeId = plan.stripe_price_id || "NOT SET";
      console.log(`  - ${plan.plan_name}: $${plan.price}`);
      console.log(`    Apple Product ID: ${appleId}`);
      console.log(`    Stripe Price ID: ${stripeId}`);
      console.log(`    Note Limit: ${plan.note_limit || "NOT SET"}`);
      console.log(`    Task Limit: ${plan.task_limit || "NOT SET"}`);
      console.log(`    Galaxy Limit: ${plan.galaxy_limit || "NOT SET"}`);
      console.log(`    AI Insights: ${plan.ai_insights_per_day || "NOT SET"}`);
      console.log("");
    });

    // 3. Check recent subscription attempts
    console.log("3️⃣ Checking Recent Subscription Activity...");
    const recentSubs = await db("user_subscriptions")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(20);

    if (recentSubs.length === 0) {
      console.log("❌ No subscription records found in database");
    } else {
      console.log(`Found ${recentSubs.length} recent subscription records:`);
      recentSubs.forEach((sub) => {
        const status = sub.status === "active" ? "✅" : "❌";
        const appleStatus = sub.apple_validation_status || "UNKNOWN";
        console.log(`  ${status} User ${sub.user_id}: ${sub.status}`);
        console.log(`    Plan ID: ${sub.plan_id}`);
        console.log(`    Created: ${sub.created_at}`);
        console.log(`    Apple TX: ${sub.apple_transaction_id || "NONE"}`);
        console.log(`    Apple Validation: ${appleStatus}`);
        console.log(
          `    Last Validated: ${sub.apple_last_validated || "NEVER"}`
        );
        console.log("");
      });
    }

    // 4. Check for failed validations
    console.log("4️⃣ Checking for Failed Validations...");
    const failedValidations = await db("user_subscriptions")
      .where("apple_validation_status", "failed")
      .select("*");

    if (failedValidations.length > 0) {
      console.log(`❌ Found ${failedValidations.length} failed validations:`);
      failedValidations.forEach((sub) => {
        console.log(`  User ${sub.user_id}: ${sub.apple_validation_status}`);
        console.log(`    Last Validated: ${sub.apple_last_validated}`);
        console.log(`    Apple TX: ${sub.apple_transaction_id || "NONE"}`);
        console.log(
          `    Receipt Data Length: ${
            sub.apple_receipt_data ? sub.apple_receipt_data.length : 0
          }`
        );
      });
      console.log("");
    } else {
      console.log("✅ No failed validations found");
    }

    // 5. Check for pending validations
    console.log("5️⃣ Checking for Pending Validations...");
    const pendingValidations = await db("user_subscriptions")
      .where("apple_validation_status", "pending")
      .select("*");

    if (pendingValidations.length > 0) {
      console.log(`⚠️ Found ${pendingValidations.length} pending validations:`);
      pendingValidations.forEach((sub) => {
        console.log(`  User ${sub.user_id}: ${sub.apple_validation_status}`);
        console.log(`    Created: ${sub.created_at}`);
        console.log(`    Apple TX: ${sub.apple_transaction_id || "NONE"}`);
      });
      console.log("");
    } else {
      console.log("✅ No pending validations found");
    }

    // 6. Check environment variables
    console.log("6️⃣ Environment Variables Check...");
    const requiredEnvVars = [
      "DATABASE_URL",
      "PG_HOST",
      "PG_PORT",
      "PG_USER",
      "PG_NAME",
      "STRIPE_SECRET_KEY",
      "JWT_SECRET",
      "APPLE_SHARED_SECRET",
    ];

    requiredEnvVars.forEach((varName) => {
      const value = process.env[varName];
      if (value) {
        if (varName.includes("SECRET") || varName.includes("KEY")) {
          console.log(`  ✅ ${varName}: ***SET*** (${value.length} chars)`);
        } else {
          console.log(`  ✅ ${varName}: ${value}`);
        }
      } else {
        console.log(`  ❌ ${varName}: NOT SET`);
      }
    });
    console.log("");

    // 7. Check for users without active subscriptions
    console.log("7️⃣ Checking Users Without Active Subscriptions...");
    const usersWithoutSubs = await db.raw(`
      SELECT u.id, u.username, u.email, u.created_at
      FROM users u 
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      WHERE us.id IS NULL
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    if (usersWithoutSubs.rows && usersWithoutSubs.rows.length > 0) {
      console.log(
        `⚠️ Found ${usersWithoutSubs.rows.length} users without active subscriptions:`
      );
      usersWithoutSubs.rows.forEach((user) => {
        console.log(`  - User ${user.id}: ${user.username} (${user.email})`);
        console.log(`    Created: ${user.created_at}`);
      });
      console.log("");
    } else {
      console.log("✅ All users have active subscriptions");
    }

    // 8. Check subscription limits enforcement
    console.log("8️⃣ Checking Subscription Limits Configuration...");
    const plansWithLimits = await db("subscription_plans")
      .whereNotNull("note_limit")
      .select("*");

    if (plansWithLimits.length > 0) {
      console.log("✅ Subscription plans have limits configured:");
      plansWithLimits.forEach((plan) => {
        console.log(
          `  - ${plan.plan_name}: Notes(${plan.note_limit}), Tasks(${plan.task_limit}), Galaxies(${plan.galaxy_limit}), AI(${plan.ai_insights_per_day})`
        );
      });
    } else {
      console.log("❌ No subscription plans have limits configured");
    }
    console.log("");

    // 9. Summary and recommendations
    console.log("🔍 DIAGNOSTIC COMPLETE");
    console.log("\n🚨 LIKELY ISSUES IDENTIFIED:");

    if (failedValidations.length > 0) {
      console.log(
        "1. ❌ Apple receipt validation is failing - check Apple shared secret and validation logic"
      );
    }

    if (pendingValidations.length > 0) {
      console.log(
        "2. ⚠️ Some validations are pending - check if validation process is completing"
      );
    }

    if (recentSubs.length === 0) {
      console.log(
        "3. ❌ No subscription records found - check if the validation endpoint is being called"
      );
    }

    if (!process.env.APPLE_SHARED_SECRET) {
      console.log(
        "4. ❌ APPLE_SHARED_SECRET not set - this will cause validation failures"
      );
    }

    console.log("\n📋 IMMEDIATE ACTIONS:");
    console.log("1. Check backend logs for Apple IAP validation errors");
    console.log("2. Verify APPLE_SHARED_SECRET is set correctly");
    console.log(
      "3. Test the /api/subscriptions/validate-apple-receipt endpoint manually"
    );
    console.log("4. Check if Apple's receipt validation service is responding");
    console.log("5. Verify the frontend is sending receipt data correctly");
  } catch (error) {
    console.error("❌ Comprehensive diagnostic failed:", error.message);
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check if your backend server is running");
    console.log("2. Verify database connection details");
    console.log("3. Look for error logs in your backend console");
    console.log("4. Check if environment variables are set correctly");
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

// Run the comprehensive diagnostic
comprehensiveIAPDiagnostic();

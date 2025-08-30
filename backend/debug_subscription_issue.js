const knex = require("knex");

async function debugSubscriptionIssue() {
  console.log("🔍 DEBUGGING SUBSCRIPTION ISSUE...\n");

  try {
    // 1. Check database connection
    console.log("1️⃣ Testing database connection...");

    // Create a simple database connection
    const db = knex({
      client: "pg",
      connection: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "renaissance_db",
      },
    });

    await db.raw("SELECT 1");
    console.log("✅ Database connection successful\n");

    // 2. Check subscription plans
    console.log("2️⃣ Checking subscription plans...");
    const plans = await db("subscription_plans").select("*");
    console.log(`Found ${plans.length} subscription plans:`);
    plans.forEach((plan) => {
      console.log(
        `  - ${plan.plan_name}: $${plan.price} (Apple ID: ${
          plan.apple_product_id || "NOT SET"
        })`
      );
    });
    console.log("");

    // 3. Check recent user subscriptions
    console.log("3️⃣ Checking recent user subscriptions...");
    const recentSubs = await db("user_subscriptions")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(10);

    console.log(`Found ${recentSubs.length} recent subscriptions:`);
    recentSubs.forEach((sub) => {
      console.log(
        `  - User ${sub.user_id}: ${sub.status} (Apple TX: ${
          sub.apple_transaction_id || "NONE"
        })`
      );
    });
    console.log("");

    // 4. Check for any failed validations
    console.log("4️⃣ Checking for failed validations...");
    const failedValidations = await db("user_subscriptions")
      .where("apple_validation_status", "failed")
      .select("*");

    if (failedValidations.length > 0) {
      console.log(`Found ${failedValidations.length} failed validations:`);
      failedValidations.forEach((sub) => {
        console.log(
          `  - User ${sub.user_id}: ${sub.apple_validation_status} (Last: ${sub.apple_last_validated})`
        );
      });
    } else {
      console.log("✅ No failed validations found");
    }
    console.log("");

    // 5. Check environment variables
    console.log("5️⃣ Checking environment variables...");
    const requiredEnvVars = [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "JWT_SECRET",
      "DATABASE_URL",
    ];

    requiredEnvVars.forEach((varName) => {
      const value = process.env[varName];
      if (value) {
        console.log(
          `  ✅ ${varName}: ${
            varName.includes("SECRET")
              ? "***SET***"
              : value.substring(0, 20) + "..."
          }`
        );
      } else {
        console.log(`  ❌ ${varName}: NOT SET`);
      }
    });
    console.log("");

    // 6. Check for any pending transactions
    console.log("6️⃣ Checking for pending transactions...");
    const pendingSubs = await db("user_subscriptions")
      .where("status", "pending")
      .select("*");

    if (pendingSubs.length > 0) {
      console.log(`Found ${pendingSubs.length} pending subscriptions:`);
      pendingSubs.forEach((sub) => {
        console.log(
          `  - User ${sub.user_id}: ${sub.status} (Created: ${sub.created_at})`
        );
      });
    } else {
      console.log("✅ No pending subscriptions found");
    }
    console.log("");

    // 7. Check for any users without subscriptions
    console.log("7️⃣ Checking for users without active subscriptions...");
    const usersWithoutSubs = await db.raw(`
      SELECT u.id, u.username, u.email 
      FROM users u 
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      WHERE us.id IS NULL
      LIMIT 10
    `);

    if (usersWithoutSubs.rows && usersWithoutSubs.rows.length > 0) {
      console.log(
        `Found ${usersWithoutSubs.rows.length} users without active subscriptions:`
      );
      usersWithoutSubs.rows.forEach((user) => {
        console.log(`  - User ${user.id}: ${user.username} (${user.email})`);
      });
    } else {
      console.log("✅ All users have active subscriptions");
    }
    console.log("");

    console.log("🔍 DIAGNOSTIC COMPLETE");
    console.log("\n📋 NEXT STEPS:");
    console.log("1. Check backend logs for Apple receipt validation errors");
    console.log(
      "2. Verify the user's Apple receipt data is being sent correctly"
    );
    console.log(
      "3. Test the /api/subscriptions/validate-apple-receipt endpoint manually"
    );
    console.log("4. Check if Apple's receipt validation service is responding");
  } catch (error) {
    console.error("❌ Diagnostic failed:", error);
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Check if your database is running");
    console.log(
      "2. Verify database connection details in environment variables"
    );
    console.log("3. Check if the backend server is running");
    console.log("4. Look for any error logs in the backend console");
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

// Run the diagnostic
debugSubscriptionIssue();

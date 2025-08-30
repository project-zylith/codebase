require("dotenv").config();
const knex = require("knex");

async function simpleEmergencyFix() {
  console.log("🚨 SIMPLE EMERGENCY FIX FOR USER 32...\n");

  let db;

  try {
    console.log("🔌 Connecting to database...");

    // Try Supabase connection first
    const connectionConfig = {
      client: "pg",
      connection: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      pool: {
        min: 1,
        max: 1,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    };

    console.log(
      "📡 Connection string:",
      process.env.PG_CONNECTION_STRING ? "SET" : "NOT SET"
    );
    console.log("🔒 SSL enabled:", process.env.PG_SSL === "true");

    db = knex(connectionConfig);

    // Test connection
    console.log("🧪 Testing database connection...");
    const result = await db.raw("SELECT 1 as test");
    console.log("✅ Database connection successful:", result.rows[0]);
    console.log("");

    // Get Basic Monthly plan
    console.log("📋 Getting Basic Monthly plan...");
    const basicMonthlyPlan = await db("subscription_plans")
      .where("apple_product_id", "com.renai.basic_monthly2")
      .select("*")
      .first();

    if (!basicMonthlyPlan) {
      console.log("❌ Basic Monthly plan not found!");
      return;
    }

    console.log(
      `✅ Found plan: ${basicMonthlyPlan.plan_name} ($${basicMonthlyPlan.price})`
    );
    console.log("");

    // Check if User 32 already has subscription
    console.log("👤 Checking User 32...");
    const existingSub = await db("user_subscriptions")
      .where("user_id", 32)
      .first();

    if (existingSub) {
      console.log(`⚠️ User 32 already has subscription ID: ${existingSub.id}`);
      console.log(`   Status: ${existingSub.status}`);
      console.log(`   Plan: ${existingSub.plan_id}`);
      console.log("");
    } else {
      console.log("✅ User 32 has no existing subscriptions");
      console.log("");
    }

    // Create emergency subscription
    console.log("🚨 Creating emergency subscription...");

    const emergencyData = {
      user_id: 32,
      plan_id: basicMonthlyPlan.id,
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      apple_receipt_data: "EMERGENCY_FIX_" + Date.now(),
      apple_transaction_id: "EMERGENCY_TX_" + Date.now(),
      apple_validation_status: "validated",
      apple_last_validated: new Date(),
    };

    console.log("📝 Inserting subscription data...");
    const [newSub] = await db("user_subscriptions")
      .insert(emergencyData)
      .returning("*");

    console.log("✅ Emergency subscription created!");
    console.log(`   ID: ${newSub.id}`);
    console.log(`   Status: ${newSub.status}`);
    console.log(`   Plan: ${newSub.plan_id}`);
    console.log("");

    // Verify
    console.log("🔍 Verifying subscription...");
    const verifySub = await db("user_subscriptions")
      .where("id", newSub.id)
      .first();

    if (verifySub) {
      console.log("✅ Verification successful!");
      console.log("🎉 User 32 now has Basic Monthly subscription!");
      console.log("");
      console.log("📋 Subscription Details:");
      console.log(`   - Notes: Up to ${basicMonthlyPlan.note_limit} per month`);
      console.log(`   - Tasks: Up to ${basicMonthlyPlan.task_limit}`);
      console.log(`   - Galaxies: Up to ${basicMonthlyPlan.galaxy_limit}`);
      console.log(
        `   - AI Insights: Up to ${basicMonthlyPlan.ai_insights_per_day} per day`
      );
      console.log(`   - Expires: ${verifySub.end_date}`);
    } else {
      console.log("❌ Verification failed!");
    }
  } catch (error) {
    console.error("❌ Emergency fix failed:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.detail) {
      console.error("Error detail:", error.detail);
    }
  } finally {
    if (db) {
      try {
        await db.destroy();
        console.log("🔌 Database connection closed");
      } catch (e) {
        console.log("⚠️ Error closing database connection:", e.message);
      }
    }
  }
}

simpleEmergencyFix();

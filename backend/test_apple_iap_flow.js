require("dotenv").config();
const knex = require("knex");

async function testAppleIAPFlow() {
  console.log("🧪 TESTING COMPLETE APPLE IAP FLOW...\n");

  let db;

  try {
    const connectionConfig = {
      client: "pg",
      connection: process.env.PG_CONNECTION_STRING,
      ssl:
        process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

    db = knex(connectionConfig);
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful\n");

    // Check User 32's current state
    console.log("1️⃣ User 32 Current State...");
    const user32 = await db("users").where("id", 32).select("*").first();

    if (user32) {
      console.log(`  User ID: ${user32.id}`);
      console.log(`  Username: ${user32.username}`);
      console.log(`  Email: ${user32.email}`);
      console.log(`  Created: ${user32.created_at}`);
    } else {
      console.log("  ❌ User 32 not found");
      return;
    }
    console.log("");

    // Check if User 32 has any subscription records
    console.log("2️⃣ User 32 Subscription Records...");
    const user32Subs = await db("user_subscriptions")
      .where("user_id", 32)
      .select("*");

    if (user32Subs.length === 0) {
      console.log("  ❌ User 32 has NO subscription records");
    } else {
      console.log(
        `  ✅ User 32 has ${user32Subs.length} subscription record(s):`
      );
      user32Subs.forEach((sub, index) => {
        console.log(
          `    ${index + 1}. ID: ${sub.id}, Status: ${sub.status}, Apple: ${
            sub.apple_validation_status || "NONE"
          }`
        );
      });
    }
    console.log("");

    // Check subscription plans to see what User 32 should have access to
    console.log("3️⃣ Available Subscription Plans...");
    const plans = await db("subscription_plans").select("*").orderBy("id");

    console.log(`Found ${plans.length} subscription plans:`);
    plans.forEach((plan, index) => {
      console.log(`  ${index + 1}. ${plan.plan_name} ($${plan.price})`);
      console.log(
        `     Apple Product ID: ${plan.apple_product_id || "NOT SET"}`
      );
      console.log(`     Note Limit: ${plan.note_limit || "NOT SET"}`);
      console.log(`     Task Limit: ${plan.task_limit || "NOT SET"}`);
      console.log(`     Galaxy Limit: ${plan.galaxy_limit || "NOT SET"}`);
      console.log(`     AI Insights: ${plan.ai_insights_per_day || "NOT SET"}`);
    });
    console.log("");

    // Check recent Apple IAP activity
    console.log("4️⃣ Recent Apple IAP Activity...");
    const recentAppleSubs = await db("user_subscriptions")
      .whereNotNull("apple_transaction_id")
      .orWhereNotNull("apple_receipt_data")
      .select("*")
      .orderBy("id", "desc")
      .limit(5);

    if (recentAppleSubs.length === 0) {
      console.log("  ❌ No Apple IAP subscriptions found");
    } else {
      console.log(`Found ${recentAppleSubs.length} Apple IAP subscriptions:`);
      recentAppleSubs.forEach((sub, index) => {
        const status = sub.status === "active" ? "✅" : "❌";
        const appleStatus = sub.apple_validation_status || "UNKNOWN";
        console.log(
          `  ${index + 1}. ${status} User ${sub.user_id}: ${
            sub.status
          } (Apple: ${appleStatus})`
        );
        if (sub.apple_transaction_id) {
          console.log(`     Apple TX: ${sub.apple_transaction_id}`);
        }
        if (sub.apple_receipt_data) {
          console.log(`     Receipt: ${sub.apple_receipt_data.length} chars`);
        }
      });
    }
    console.log("");

    // Check for any failed or pending Apple validations
    console.log("5️⃣ Failed/Pending Apple Validations...");
    const failedValidations = await db("user_subscriptions")
      .where("apple_validation_status", "failed")
      .orWhere("apple_validation_status", "pending")
      .select("*");

    if (failedValidations.length === 0) {
      console.log("  ✅ No failed or pending validations found");
    } else {
      console.log(
        `Found ${failedValidations.length} failed/pending validations:`
      );
      failedValidations.forEach((sub, index) => {
        console.log(
          `  ${index + 1}. User ${sub.user_id}: ${sub.apple_validation_status}`
        );
        console.log(`     Status: ${sub.status}`);
        console.log(`     Apple TX: ${sub.apple_transaction_id || "NONE"}`);
        console.log(
          `     Receipt: ${
            sub.apple_receipt_data
              ? `${sub.apple_receipt_data.length} chars`
              : "NONE"
          }`
        );
      });
    }
    console.log("");

    // Summary and recommendations
    console.log("🔍 DIAGNOSTIC SUMMARY:");
    if (user32Subs.length === 0) {
      console.log("❌ User 32 has NO subscription records");
      console.log("\n🚨 IMMEDIATE ISSUES:");
      console.log("1. Apple IAP endpoint is not processing User 32's payment");
      console.log("2. No subscription record is being created");
      console.log(
        "3. This suggests the endpoint is failing before database insertion"
      );
      console.log("\n📋 ROOT CAUSE ANALYSIS:");
      console.log("1. Check if your backend server is running");
      console.log("2. Check backend logs for Apple IAP errors");
      console.log(
        "3. Verify the /api/subscriptions/validate-apple-receipt route exists"
      );
      console.log("4. Test the endpoint manually with sample data");
      console.log("5. Check if Apple shared secret is working");
      console.log("\n🛠️ IMMEDIATE ACTIONS:");
      console.log("1. Start your backend server: npm start");
      console.log("2. Check backend console for Apple IAP errors");
      console.log("3. Test the endpoint manually");
      console.log("4. If endpoint works, the issue is in the frontend");
      console.log("5. If endpoint fails, fix the backend issue first");
    } else {
      console.log("✅ User 32 has subscription record(s)");
      console.log("\n🔍 NEXT STEPS:");
      console.log("1. Check why subscription is not active");
      console.log("2. Verify Apple receipt validation completed");
      console.log("3. Test subscription limits enforcement");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

testAppleIAPFlow();

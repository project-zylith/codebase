require("dotenv").config();
const knex = require("knex");

async function checkPendingSubscriptions() {
  console.log("🔍 CHECKING PENDING SUBSCRIPTIONS...\n");

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

    // Check all pending subscriptions
    console.log("1️⃣ Checking Pending Subscriptions...");
    const pendingSubs = await db("user_subscriptions")
      .where("apple_validation_status", "pending")
      .select("*");

    if (pendingSubs.length === 0) {
      console.log("✅ No pending subscriptions found");
    } else {
      console.log(`❌ Found ${pendingSubs.length} pending subscriptions:`);
      pendingSubs.forEach((sub, index) => {
        console.log(`\n  ${index + 1}. Subscription ID: ${sub.id}`);
        console.log(`     User ID: ${sub.user_id}`);
        console.log(`     Plan ID: ${sub.plan_id}`);
        console.log(`     Status: ${sub.status}`);
        console.log(`     Apple Validation: ${sub.apple_validation_status}`);
        console.log(`     Apple TX: ${sub.apple_transaction_id || "NONE"}`);
        console.log(
          `     Receipt Data: ${
            sub.apple_receipt_data
              ? `${sub.apple_receipt_data.length} chars`
              : "NONE"
          }`
        );
        console.log(
          `     Last Validated: ${sub.apple_last_validated || "NEVER"}`
        );
      });
    }
    console.log("");

    // Check subscription plans for these pending subscriptions
    if (pendingSubs.length > 0) {
      console.log("2️⃣ Checking Plans for Pending Subscriptions...");
      for (const sub of pendingSubs) {
        const plan = await db("subscription_plans")
          .where("id", sub.plan_id)
          .select("*")
          .first();

        if (plan) {
          console.log(
            `  Plan ${sub.plan_id}: ${plan.plan_name} ($${plan.price})`
          );
          console.log(
            `    Apple Product ID: ${plan.apple_product_id || "NOT SET"}`
          );
          console.log(`    Note Limit: ${plan.note_limit || "NOT SET"}`);
          console.log(`    Task Limit: ${plan.task_limit || "NOT SET"}`);
        } else {
          console.log(`  ❌ Plan ${sub.plan_id}: NOT FOUND`);
        }
      }
      console.log("");
    }

    // Check for any failed validations
    console.log("3️⃣ Checking Failed Validations...");
    const failedSubs = await db("user_subscriptions")
      .where("apple_validation_status", "failed")
      .select("*");

    if (failedSubs.length > 0) {
      console.log(`❌ Found ${failedSubs.length} failed validations:`);
      failedSubs.forEach((sub, index) => {
        console.log(`\n  ${index + 1}. Subscription ID: ${sub.id}`);
        console.log(`     User ID: ${sub.user_id}`);
        console.log(`     Apple Validation: ${sub.apple_validation_status}`);
        console.log(
          `     Last Validated: ${sub.apple_last_validated || "NEVER"}`
        );
        console.log(
          `     Receipt Data: ${
            sub.apple_receipt_data
              ? `${sub.apple_receipt_data.length} chars`
              : "NONE"
          }`
        );
      });
    } else {
      console.log("✅ No failed validations found");
    }
    console.log("");

    // Summary
    console.log("🔍 DIAGNOSTIC SUMMARY:");
    console.log(`Total Pending: ${pendingSubs.length}`);
    console.log(`Total Failed: ${failedSubs.length}`);

    if (pendingSubs.length > 0) {
      console.log("\n🚨 IMMEDIATE ISSUES:");
      console.log("1. Apple receipt validation is not completing");
      console.log('2. Subscriptions are stuck in "pending" status');
      console.log("3. Users are not getting their subscription benefits");
      console.log("\n📋 NEXT STEPS:");
      console.log("1. Check backend logs for Apple receipt validation errors");
      console.log("2. Verify Apple shared secret is correct");
      console.log("3. Test Apple receipt validation endpoint manually");
      console.log("4. Check if Apple's validation service is responding");
    }
  } catch (error) {
    console.error("❌ Check failed:", error.message);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

checkPendingSubscriptions();

require("dotenv").config();
const knex = require("knex");

async function testUser32Subscription() {
  console.log("🔍 TESTING USER 32 SUBSCRIPTION...\n");

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

    // Check User 32's subscription
    console.log("1️⃣ Checking User 32 Subscription...");
    const user32Sub = await db("user_subscriptions")
      .where("user_id", 32)
      .select("*");

    if (user32Sub.length === 0) {
      console.log("❌ User 32 has NO subscription records");
    } else {
      console.log(`✅ User 32 has ${user32Sub.length} subscription record(s):`);
      user32Sub.forEach((sub, index) => {
        console.log(`\n  ${index + 1}. Subscription ID: ${sub.id}`);
        console.log(`     Plan ID: ${sub.plan_id}`);
        console.log(`     Status: ${sub.status}`);
        console.log(
          `     Apple Validation: ${sub.apple_validation_status || "NONE"}`
        );
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
        console.log(`     Start Date: ${sub.start_date || "NONE"}`);
        console.log(`     End Date: ${sub.end_date || "NONE"}`);
      });
    }
    console.log("");

    // Check User 32's plan details
    if (user32Sub.length > 0) {
      console.log("2️⃣ Checking User 32's Plan Details...");
      for (const sub of user32Sub) {
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
          console.log(`    Galaxy Limit: ${plan.galaxy_limit || "NOT SET"}`);
          console.log(
            `    AI Insights: ${plan.ai_insights_per_day || "NOT SET"}`
          );
        } else {
          console.log(`  ❌ Plan ${sub.plan_id}: NOT FOUND`);
        }
      }
      console.log("");
    }

    // Check if User 32 exists in users table
    console.log("3️⃣ Checking User 32 Details...");
    const user32 = await db("users")
      .where("id", 32)
      .select("id", "username", "email", "created_at")
      .first();

    if (user32) {
      console.log(`  User ID: ${user32.id}`);
      console.log(`  Username: ${user32.username}`);
      console.log(`  Email: ${user32.email}`);
      console.log(`  Created: ${user32.created_at}`);
    } else {
      console.log("  ❌ User 32 not found in users table");
    }
    console.log("");

    // Check recent subscription activity for all users
    console.log("4️⃣ Recent Subscription Activity (Last 10)...");
    const recentSubs = await db("user_subscriptions")
      .select("*")
      .orderBy("id", "desc")
      .limit(10);

    console.log(`Found ${recentSubs.length} recent subscriptions:`);
    recentSubs.forEach((sub, index) => {
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
    });
    console.log("");

    // Summary
    console.log("🔍 DIAGNOSTIC SUMMARY:");
    if (user32Sub.length === 0) {
      console.log(
        "❌ User 32 has NO subscription - this explains why they're not getting benefits"
      );
      console.log("\n🚨 IMMEDIATE ISSUES:");
      console.log("1. User 32 paid but no subscription record was created");
      console.log("2. Apple IAP endpoint is not processing the payment");
      console.log("3. Receipt validation is failing before database insertion");
      console.log("\n📋 NEXT STEPS:");
      console.log("1. Check backend logs for Apple IAP errors");
      console.log(
        "2. Test the /api/subscriptions/validate-apple-receipt endpoint manually"
      );
      console.log("3. Verify Apple receipt data is being sent from frontend");
      console.log("4. Check if Apple shared secret is working");
    } else {
      console.log("✅ User 32 has subscription record(s)");
      console.log("\n🔍 NEXT STEPS:");
      console.log("1. Check why subscription is not active");
      console.log("2. Verify Apple receipt validation completed");
      console.log("3. Test subscription limits enforcement");
    }
  } catch (error) {
    console.error("❌ Check failed:", error.message);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

testUser32Subscription();

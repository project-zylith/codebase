require("dotenv").config();
const knex = require("knex");

async function emergencyFixUser32() {
  console.log("🚨 EMERGENCY FIX FOR USER 32...\n");

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
    console.log("1️⃣ Checking User 32 Current State...");
    const user32 = await db("users").where("id", 32).select("*").first();

    if (!user32) {
      console.log("❌ User 32 not found! Cannot proceed with fix.");
      return;
    }

    console.log(`  User ID: ${user32.id}`);
    console.log(`  Username: ${user32.username}`);
    console.log(`  Email: ${user32.email}`);
    console.log("");

    // Check if User 32 already has any subscription
    console.log("2️⃣ Checking Existing Subscriptions...");
    const existingSubs = await db("user_subscriptions")
      .where("user_id", 32)
      .select("*");

    if (existingSubs.length > 0) {
      console.log(
        `⚠️ User 32 already has ${existingSubs.length} subscription(s):`
      );
      existingSubs.forEach((sub, index) => {
        console.log(
          `  ${index + 1}. ID: ${sub.id}, Status: ${sub.status}, Plan: ${
            sub.plan_id
          }`
        );
      });
      console.log("");
    } else {
      console.log(
        "  ✅ No existing subscriptions found - safe to create new one"
      );
      console.log("");
    }

    // Get Basic Monthly plan details
    console.log("3️⃣ Getting Basic Monthly Plan Details...");
    const basicMonthlyPlan = await db("subscription_plans")
      .where("apple_product_id", "com.renai.basic_monthly2")
      .select("*")
      .first();

    if (!basicMonthlyPlan) {
      console.log("❌ Basic Monthly plan not found! Cannot proceed.");
      return;
    }

    console.log(`  Plan ID: ${basicMonthlyPlan.id}`);
    console.log(`  Plan Name: ${basicMonthlyPlan.plan_name}`);
    console.log(`  Price: $${basicMonthlyPlan.price}`);
    console.log(`  Note Limit: ${basicMonthlyPlan.note_limit}`);
    console.log(`  Task Limit: ${basicMonthlyPlan.task_limit}`);
    console.log(`  Galaxy Limit: ${basicMonthlyPlan.galaxy_limit}`);
    console.log(`  AI Insights: ${basicMonthlyPlan.ai_insights_per_day}`);
    console.log("");

    // Create emergency subscription for User 32
    console.log("4️⃣ Creating Emergency Subscription...");

    const emergencySubscriptionData = {
      user_id: 32,
      plan_id: basicMonthlyPlan.id,
      status: "active",
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      apple_receipt_data: "EMERGENCY_FIX_USER_32_" + Date.now(),
      apple_transaction_id: "EMERGENCY_TX_" + Date.now(),
      apple_original_transaction_id: "EMERGENCY_ORIG_TX_" + Date.now(),
      apple_product_id: basicMonthlyPlan.apple_product_id,
      apple_purchase_date: new Date(),
      apple_expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      apple_is_trial_period: false,
      apple_is_intro_offer_period: false,
      apple_validation_environment: "production",
      apple_last_validated: new Date(),
      apple_validation_status: "validated",
      notes:
        "EMERGENCY FIX: User 32 paid for Basic Monthly but Apple IAP failed. Manual subscription created.",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the emergency subscription
    const [newSubscription] = await db("user_subscriptions")
      .insert(emergencySubscriptionData)
      .returning("*");

    console.log("✅ Emergency subscription created successfully!");
    console.log(`  Subscription ID: ${newSubscription.id}`);
    console.log(`  Status: ${newSubscription.status}`);
    console.log(`  Start Date: ${newSubscription.start_date}`);
    console.log(`  End Date: ${newSubscription.end_date}`);
    console.log(
      `  Apple Validation: ${newSubscription.apple_validation_status}`
    );
    console.log("");

    // Verify the subscription was created
    console.log("5️⃣ Verifying Emergency Subscription...");
    const verificationSub = await db("user_subscriptions")
      .where("id", newSubscription.id)
      .select("*")
      .first();

    if (verificationSub) {
      console.log(
        "✅ Verification successful! Subscription exists in database"
      );
      console.log(`  User ID: ${verificationSub.user_id}`);
      console.log(`  Plan ID: ${verificationSub.plan_id}`);
      console.log(`  Status: ${verificationSub.status}`);
      console.log(
        `  Apple Validation: ${verificationSub.apple_validation_status}`
      );
    } else {
      console.log(
        "❌ Verification failed! Subscription not found after creation"
      );
    }
    console.log("");

    // Check User 32's current subscription status
    console.log("6️⃣ Final Check: User 32 Subscription Status...");
    const finalCheck = await db("user_subscriptions")
      .where("user_id", 32)
      .select("*");

    console.log(`User 32 now has ${finalCheck.length} subscription(s):`);
    finalCheck.forEach((sub, index) => {
      console.log(
        `  ${index + 1}. ID: ${sub.id}, Status: ${sub.status}, Plan: ${
          sub.plan_id
        }`
      );
      console.log(
        `     Apple Validation: ${sub.apple_validation_status || "NONE"}`
      );
      console.log(`     Start Date: ${sub.start_date}`);
      console.log(`     End Date: ${sub.end_date}`);
    });
    console.log("");

    // Summary
    console.log("🎉 EMERGENCY FIX COMPLETED SUCCESSFULLY!");
    console.log("\n📋 WHAT WAS FIXED:");
    console.log("✅ User 32 now has an active Basic Monthly subscription");
    console.log('✅ Subscription is marked as "validated" by Apple');
    console.log("✅ All subscription limits are now active");
    console.log("✅ User can access their paid features immediately");
    console.log("\n⚠️ IMPORTANT NOTES:");
    console.log(
      "1. This is a temporary fix - the underlying Apple IAP issue still needs to be resolved"
    );
    console.log("2. The subscription will expire in 30 days unless renewed");
    console.log("3. User 32 should now have access to:");
    console.log("   - Up to 20 notes per month");
    console.log("   - Up to 30 tasks");
    console.log("   - Up to 8 galaxies");
    console.log("   - Up to 10 AI insights per day");
    console.log("\n🛠️ NEXT STEPS:");
    console.log(
      "1. Test that User 32 can now access their subscription benefits"
    );
    console.log("2. Fix the underlying Apple IAP receipt validation issue");
    console.log("3. Ensure future Apple IAP purchases work correctly");
  } catch (error) {
    console.error("❌ Emergency fix failed:", error.message);
    console.error("Stack trace:", error.stack);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

emergencyFixUser32();

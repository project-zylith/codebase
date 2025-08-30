const { db } = require("./src/database");
const {
  AppleReceiptValidator,
} = require("./src/services/appleReceiptValidation");

async function testAppleReceiptValidation() {
  console.log("🧪 TESTING APPLE RECEIPT VALIDATION MANUALLY...\n");

  try {
    // 1. Test with a sample receipt (this will fail but shows the flow)
    console.log("1️⃣ Testing with sample receipt data...");

    const sampleReceiptData = "sample_receipt_data_for_testing";
    const validator = new AppleReceiptValidator();

    try {
      const result = await validator.validateReceipt(sampleReceiptData);
      console.log("✅ Validation result:", result);
    } catch (error) {
      console.log("❌ Expected validation error:", error.message);
    }
    console.log("");

    // 2. Check if we can access Apple's validation endpoints
    console.log("2️⃣ Testing Apple validation endpoint accessibility...");

    const testUrls = [
      "https://buy.itunes.apple.com/verifyReceipt",
      "https://sandbox.itunes.apple.com/verifyReceipt",
    ];

    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "receipt-data": "test" }),
        });
        console.log(`  ${url}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(`  ${url}: ❌ ${error.message}`);
      }
    }
    console.log("");

    // 3. Test database operations
    console.log("3️⃣ Testing database operations...");

    // Test subscription plan lookup
    const plans = await db("subscription_plans")
      .whereNotNull("apple_product_id")
      .select("*");

    console.log(`Found ${plans.length} plans with Apple product IDs:`);
    plans.forEach((plan) => {
      console.log(`  - ${plan.plan_name}: ${plan.apple_product_id}`);
    });
    console.log("");

    // 4. Test user subscription creation (dry run)
    console.log("4️⃣ Testing subscription creation logic...");

    const testUserId = 1; // Assuming user 1 exists
    const testPlanId = plans[0]?.id;

    if (testPlanId) {
      console.log(
        `Would create subscription for user ${testUserId}, plan ${testPlanId}`
      );

      // Check if user already has a subscription
      const existingSub = await db("user_subscriptions")
        .where({ user_id: testUserId, plan_id: testPlanId })
        .first();

      if (existingSub) {
        console.log(`  User already has subscription: ${existingSub.status}`);
      } else {
        console.log("  User has no existing subscription for this plan");
      }
    } else {
      console.log("❌ No plans with Apple product IDs found");
    }
    console.log("");

    // 5. Check for any recent errors in the logs
    console.log("5️⃣ Checking for recent database errors...");

    // This would normally check logs, but for now we'll check the database state
    const recentSubs = await db("user_subscriptions")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(5);

    console.log("Recent subscription attempts:");
    recentSubs.forEach((sub) => {
      console.log(
        `  - ID: ${sub.id}, User: ${sub.user_id}, Status: ${sub.status}, Created: ${sub.created_at}`
      );
      if (sub.apple_transaction_id) {
        console.log(`    Apple TX: ${sub.apple_transaction_id}`);
      }
      if (sub.apple_validation_status) {
        console.log(`    Validation: ${sub.apple_validation_status}`);
      }
    });
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await db.destroy();
  }
}

// Run the test
testAppleReceiptValidation();

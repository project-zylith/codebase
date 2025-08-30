const { db } = require("./src/database");

async function emergencySubscriptionFix() {
  console.log("🚨 EMERGENCY SUBSCRIPTION FIX...\n");
  console.log(
    "⚠️  WARNING: This script manually creates subscriptions for users who have been charged"
  );
  console.log(
    "⚠️  Only use this for verified payments that failed to process\n"
  );

  try {
    // 1. Get user input
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    const userId = await question("Enter the user ID who was charged: ");
    const productId = await question(
      "Enter the Apple product ID (e.g., com.renai.basic_monthly2): "
    );
    const transactionId = await question(
      "Enter the Apple transaction ID (optional, press Enter to skip): "
    );
    const confirm = await question(
      "Confirm you want to create a subscription for this user? (yes/no): "
    );

    rl.close();

    if (confirm.toLowerCase() !== "yes") {
      console.log("❌ Operation cancelled");
      return;
    }

    console.log("\n🔍 Looking up subscription plan...");

    // 2. Find the subscription plan
    const plan = await db("subscription_plans")
      .where("apple_product_id", productId)
      .first();

    if (!plan) {
      console.log(
        `❌ No subscription plan found for Apple product ID: ${productId}`
      );
      console.log("\nAvailable plans:");
      const allPlans = await db("subscription_plans").select("*");
      allPlans.forEach((p) => {
        console.log(
          `  - ${p.plan_name}: ${p.apple_product_id || "NO APPLE ID"}`
        );
      });
      return;
    }

    console.log(`✅ Found plan: ${plan.plan_name} ($${plan.price})`);

    // 3. Check if user already has a subscription
    const existingSub = await db("user_subscriptions")
      .where({ user_id: userId, plan_id: plan.id })
      .first();

    if (existingSub) {
      console.log(
        `⚠️  User already has a subscription for this plan: ${existingSub.status}`
      );
      const update = await question(
        "Do you want to update it to active? (yes/no): "
      );

      if (update.toLowerCase() === "yes") {
        await db("user_subscriptions")
          .where("id", existingSub.id)
          .update({
            status: "active",
            start_date: new Date(),
            apple_transaction_id: transactionId || null,
            apple_validation_status: "manual_override",
            apple_last_validated: new Date(),
            updated_at: new Date(),
          });
        console.log("✅ Subscription updated to active");
      }
      return;
    }

    // 4. Create the subscription
    console.log("\n🆕 Creating new subscription...");

    const subscriptionData = {
      user_id: parseInt(userId),
      plan_id: plan.id,
      status: "active",
      start_date: new Date(),
      end_date: null, // Will be set based on plan type
      apple_transaction_id: transactionId || null,
      apple_validation_status: "manual_override",
      apple_last_validated: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Set end date based on plan type
    if (plan.plan_name.toLowerCase().includes("monthly")) {
      subscriptionData.end_date = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ); // 30 days
    } else if (plan.plan_name.toLowerCase().includes("annual")) {
      subscriptionData.end_date = new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ); // 365 days
    }

    const [newSubscription] = await db("user_subscriptions")
      .insert(subscriptionData)
      .returning("*");

    console.log("✅ Subscription created successfully!");
    console.log(`   ID: ${newSubscription.id}`);
    console.log(`   User: ${newSubscription.user_id}`);
    console.log(`   Plan: ${plan.plan_name}`);
    console.log(`   Status: ${newSubscription.status}`);
    console.log(`   Start Date: ${newSubscription.start_date}`);
    console.log(`   End Date: ${newSubscription.end_date || "N/A"}`);

    // 5. Verify the subscription was created
    const verification = await db("user_subscriptions")
      .where("id", newSubscription.id)
      .first();

    if (verification) {
      console.log(
        "\n✅ Verification successful - subscription exists in database"
      );
    } else {
      console.log(
        "\n❌ Verification failed - subscription not found in database"
      );
    }
  } catch (error) {
    console.error("❌ Emergency fix failed:", error);
  } finally {
    await db.destroy();
  }
}

// Run the emergency fix
emergencySubscriptionFix();

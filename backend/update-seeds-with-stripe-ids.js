require("dotenv").config();
const fs = require("fs");
const path = require("path");

// This script will help you update your database seeds with Stripe IDs
// Run this after you've executed the setup-stripe-subscriptions.js script

console.log("📝 Database Seed Update Helper");
console.log("==============================\n");

console.log(
  "After running setup-stripe-subscriptions.js, you'll get output like this:"
);
console.log("✅ Created product: Basic Monthly (ID: prod_1234567890)");
console.log("✅ Created price: $9.99/month (ID: price_1234567890)\n");

console.log("📋 Manual Update Required:");
console.log("1. Copy the product and price IDs from the Stripe setup output");
console.log(
  "2. Update the database seed file: backend/database/seeds/006_subscription_plans.ts"
);
console.log(
  "3. Add the stripe_product_id and stripe_price_id fields to each plan\n"
);

console.log("📄 Example of updated seed data:");
console.log(`
{
  plan_name: "Basic Monthly",
  price: 9.99,
  duration_days: 30,
  description: "Monthly subscription with basic features and limited AI insights",
  note_limit: 100,
  task_limit: 50,
  galaxy_limit: 10,
  ai_insights_per_day: 20,
  stripe_product_id: "prod_1234567890", // Add this
  stripe_price_id: "price_1234567890",  // Add this
},
`);

console.log("🔄 After updating the seeds, run:");
console.log("npm run migrate");
console.log("npm run seed");

console.log("\n⚠️  Important Notes:");
console.log(
  "- Free plans (Free Trial, Free Tier) should have null values for Stripe IDs"
);
console.log("- Only paid plans need Stripe product and price IDs");
console.log(
  "- Make sure the plan names match exactly between your database and Stripe"
);

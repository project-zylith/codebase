// @ts-nocheck
/**
 * Template seed file for subscription plans
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("subscription_plans")
    .del()
    .then(function () {
      // Inserts template seed entries
      return knex("subscription_plans").insert([
        {
          name: "Basic",
          description: "Essential features for individual users",
          price: 9.99,
          billing_period: "monthly",
          features: JSON.stringify([
            "Up to 100 notes",
            "Basic organization",
            "Mobile app access"
          ]),
          note_limit: 100,
          task_limit: 50,
          ai_requests_limit: 10,
          stripe_price_id: "price_basic_monthly_template",
          created_at: new Date("2024-01-01T00:00:00Z"),
          updated_at: new Date("2024-01-01T00:00:00Z"),
        },
        {
          name: "Pro",
          description: "Advanced features for power users",
          price: 19.99,
          billing_period: "monthly",
          features: JSON.stringify([
            "Unlimited notes",
            "AI insights",
            "Advanced organization",
            "Priority support"
          ]),
          note_limit: -1, // Unlimited
          task_limit: -1, // Unlimited
          ai_requests_limit: 100,
          stripe_price_id: "price_pro_monthly_template",
          created_at: new Date("2024-01-01T00:00:00Z"),
          updated_at: new Date("2024-01-01T00:00:00Z"),
        }
      ]);
    });
};
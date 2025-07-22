// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("subscription_plans")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("subscription_plans").insert([
        {
          plan_name: "Free Trial",
          price: 0.0,
          duration_days: 14,
          description: "14-day free trial with full access to all features",
          note_limit: 100,
          task_limit: 50,
          galaxy_limit: 10,
          ai_insights_per_day: 20,
        },
        {
          plan_name: "Basic Monthly",
          price: 9.99,
          duration_days: 30,
          description:
            "Monthly subscription with basic features and limited AI insights",
          note_limit: 100,
          task_limit: 50,
          galaxy_limit: 10,
          ai_insights_per_day: 20,
        },
        {
          plan_name: "Pro Monthly",
          price: 19.99,
          duration_days: 30,
          description:
            "Monthly subscription with unlimited AI insights and advanced features",
          note_limit: -1, // Unlimited
          task_limit: -1, // Unlimited
          galaxy_limit: -1, // Unlimited
          ai_insights_per_day: -1, // Unlimited
        },
        {
          plan_name: "Pro Annual",
          price: 199.99,
          duration_days: 365,
          description:
            "Annual subscription with unlimited AI insights and advanced features (save 17%)",
          note_limit: -1, // Unlimited
          task_limit: -1, // Unlimited
          galaxy_limit: -1, // Unlimited
          ai_insights_per_day: -1, // Unlimited
        },
        {
          plan_name: "Enterprise",
          price: 49.99,
          duration_days: 30,
          description:
            "Monthly enterprise plan with team collaboration and priority support",
          note_limit: -1, // Unlimited
          task_limit: -1, // Unlimited
          galaxy_limit: -1, // Unlimited
          ai_insights_per_day: -1, // Unlimited
        },
        {
          plan_name: "Free Tier",
          price: 0.0,
          duration_days: null,
          description:
            "Permanent free tier with limited features and AI insights",
          note_limit: 20,
          task_limit: 10,
          galaxy_limit: 3,
          ai_insights_per_day: 5,
        },
      ]);
    });
};

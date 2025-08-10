// @ts-nocheck
/**
 * Template seed file for user subscriptions
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_subscriptions")
    .del()
    .then(async function () {
      // Get demo user and subscription plan
      const demoUser = await knex("users").where("username", "demo_user").first();
      const basicPlan = await knex("subscription_plans").where("name", "Basic").first();

      if (!demoUser || !basicPlan) {
        console.log("Demo user or basic plan not found, skipping user subscriptions seed");
        return;
      }

      // Inserts template seed entries
      return knex("user_subscriptions").insert([
        {
          user_id: demoUser.id,
          subscription_plan_id: basicPlan.id,
          stripe_subscription_id: "sub_demo_subscription_123",
          status: "active",
          current_period_start: new Date("2024-01-15T00:00:00Z"),
          current_period_end: new Date("2024-02-15T00:00:00Z"),
          created_at: new Date("2024-01-15T00:00:00Z"),
          updated_at: new Date("2024-01-15T00:00:00Z"),
        }
      ]);
    });
};
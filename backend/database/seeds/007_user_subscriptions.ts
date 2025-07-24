// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_subscriptions")
    .del()
    .then(async function () {
      // Get the actual user IDs and plan IDs
      const coolCat = await knex("users").where("username", "cool_cat").first();
      const wowow = await knex("users").where("username", "wowow").first();
      const iaso = await knex("users").where("username", "iaso").first();

      const freeTrialPlan = await knex("subscription_plans")
        .where("plan_name", "Free Trial")
        .first();
      const proMonthlyPlan = await knex("subscription_plans")
        .where("plan_name", "Pro Monthly")
        .first();
      const proAnnualPlan = await knex("subscription_plans")
        .where("plan_name", "Pro Annual")
        .first();

      if (!coolCat || !wowow || !iaso) {
        console.log(
          "Warning: Some users not found, skipping user subscription creation"
        );
        return;
      }

      if (!freeTrialPlan || !proMonthlyPlan || !proAnnualPlan) {
        console.log(
          "Warning: Some subscription plans not found, skipping user subscription creation"
        );
        return;
      }

      // Inserts seed entries with actual IDs
      return knex("user_subscriptions").insert([
        {
          user_id: coolCat.id,
          plan_id: proMonthlyPlan.id,
          status: "active",
          start_date: new Date("2024-01-15T00:00:00Z"),
          end_date: new Date("2024-02-15T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: null, // Will be set when real subscription is created
          stripe_subscription_id: null, // Will be set when real subscription is created
        },
        {
          user_id: wowow.id,
          plan_id: freeTrialPlan.id,
          status: "trialing",
          start_date: new Date("2024-01-20T00:00:00Z"),
          end_date: new Date("2024-02-03T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: null,
          stripe_subscription_id: null,
        },
        {
          user_id: iaso.id,
          plan_id: proAnnualPlan.id,
          status: "active",
          start_date: new Date("2024-02-01T00:00:00Z"),
          end_date: new Date("2025-02-01T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: null, // Will be set when real subscription is created
          stripe_subscription_id: null, // Will be set when real subscription is created
        },
      ]);
    });
};

// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_subscriptions")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_subscriptions").insert([
        {
          user_id: 1, // cool_cat
          plan_id: 3, // Pro Monthly
          status: "active",
          start_date: new Date("2024-01-15T00:00:00Z"),
          end_date: new Date("2024-02-15T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: "cus_stripe_123",
          stripe_subscription_id: "sub_stripe_123",
        },
        {
          user_id: 2, // wowow
          plan_id: 1, // Free Trial
          status: "trialing",
          start_date: new Date("2024-01-20T00:00:00Z"),
          end_date: new Date("2024-02-03T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: "cus_stripe_456",
          stripe_subscription_id: null,
        },
        {
          user_id: 3, // iaso
          plan_id: 4, // Pro Annual
          status: "active",
          start_date: new Date("2024-02-01T00:00:00Z"),
          end_date: new Date("2025-02-01T00:00:00Z"),
          canceled_at: null,
          stripe_customer_id: "cus_stripe_789",
          stripe_subscription_id: "sub_stripe_789",
        },
      ]);
    });
};

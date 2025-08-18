// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Add Apple product IDs to existing subscription plans
  return knex("subscription_plans")
    .where("plan_name", "Basic Monthly")
    .update({
      apple_product_id: "com.renai.basic_monthly2"
    })
    .then(() => {
      return knex("subscription_plans")
        .where("plan_name", "Basic Annual")
        .update({
          apple_product_id: "com.renai.basic_annual"
        });
    })
    .then(() => {
      return knex("subscription_plans")
        .where("plan_name", "Pro Monthly")
        .update({
          apple_product_id: "com.renai.pro_monthly"
        });
    })
    .then(() => {
      return knex("subscription_plans")
        .where("plan_name", "Pro Annual")
        .update({
          apple_product_id: "com.renai.pro_annual"
        });
    })
    .then(() => {
      console.log("✅ Apple product IDs added to subscription plans");
    })
    .catch((error) => {
      console.error("❌ Error adding Apple product IDs:", error);
      throw error;
    });
};

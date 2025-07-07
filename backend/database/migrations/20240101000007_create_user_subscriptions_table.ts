// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_subscriptions", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("plan_id")
      .notNullable()
      .references("id")
      .inTable("subscription_plans")
      .onDelete("CASCADE");
    table.string("status").notNullable();
    table.timestamp("start_date");
    table.timestamp("end_date");
    table.timestamp("canceled_at");
    table.string("stripe_customer_id").unique();
    table.string("stripe_subscription_id").unique();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_subscriptions");
};

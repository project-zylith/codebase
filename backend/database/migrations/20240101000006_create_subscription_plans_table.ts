// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("subscription_plans", (table) => {
    table.increments("id").primary();
    table.string("plan_name").notNullable().unique();
    table.decimal("price", 10, 2).notNullable();
    table.integer("duration_days").nullable();
    table.text("description");
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("subscription_plans");
};

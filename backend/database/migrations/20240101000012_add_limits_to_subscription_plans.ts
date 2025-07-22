// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("subscription_plans", (table) => {
    table.integer("note_limit").defaultTo(20);
    table.integer("task_limit").defaultTo(10);
    table.integer("galaxy_limit").defaultTo(3);
    table.integer("ai_insights_per_day").defaultTo(5);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable("subscription_plans", (table) => {
    table.dropColumn("note_limit");
    table.dropColumn("task_limit");
    table.dropColumn("galaxy_limit");
    table.dropColumn("ai_insights_per_day");
  });
};

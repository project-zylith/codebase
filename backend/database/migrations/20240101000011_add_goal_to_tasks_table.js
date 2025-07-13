// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.table("tasks", (table) => {
    table.text("goal").nullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.table("tasks", (table) => {
    table.dropColumn("goal");
  });
};

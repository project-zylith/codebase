// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("conversations", (table) => {
    table.increments("id").primary();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("conversations");
};

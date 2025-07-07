// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash").nullable();
    table.string("google_id").unique();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

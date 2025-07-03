/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex: any) {
  return knex.schema.createTable("users", (table: any) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.string("email");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex: any) {
  return knex.schema.dropTable("users");
};

// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("content").notNullable();
    table.boolean("is_completed").defaultTo(false).notNullable();
    table.boolean("is_ai_generated").defaultTo(false).notNullable();
    table.boolean("is_favorite").defaultTo(false).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};

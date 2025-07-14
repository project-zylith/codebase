// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("insights", (table) => {
    table.increments("id").primary();
    table
      .integer("note_id")
      .notNullable()
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("insights");
};

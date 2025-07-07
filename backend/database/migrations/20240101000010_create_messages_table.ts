// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table
      .integer("conversation_id")
      .notNullable()
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE");
    table
      .integer("sender_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};

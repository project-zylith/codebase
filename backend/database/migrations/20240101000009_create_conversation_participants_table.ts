// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("conversation_participants", (table) => {
    table
      .integer("conversation_id")
      .notNullable()
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.primary(["conversation_id", "user_id"]);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("conversation_participants");
};

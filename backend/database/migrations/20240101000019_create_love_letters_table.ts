// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("love_letters", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("recipient", 50).notNullable(); // "Honeybee" or "Bibi"
    table.date("written_date").notNullable(); // Date the letter was written
    table.string("occasion", 100).notNullable(); // Birthday, Anniversary, etc.
    table.text("content").notNullable(); // The love letter content
    table.boolean("is_encrypted").defaultTo(false); // Whether the letter is encrypted
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTable("love_letters");
};

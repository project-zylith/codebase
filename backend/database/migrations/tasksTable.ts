/**
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex: any) {
  return knex.schema.createTable("tasks", (table: any) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.boolean("completed").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex: any) {
  return knex.schema.dropTable("tasks");
};

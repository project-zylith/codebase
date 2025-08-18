import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // Add Apple Sign In fields
    table.string("apple_user_id").unique().nullable();
    table.string("apple_given_name").nullable();
    table.string("apple_family_name").nullable();

    // Add indexes for better performance
    table.index("apple_user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    // Remove Apple Sign In fields
    table.dropColumn("apple_user_id");
    table.dropColumn("apple_given_name");
    table.dropColumn("apple_family_name");
  });
}

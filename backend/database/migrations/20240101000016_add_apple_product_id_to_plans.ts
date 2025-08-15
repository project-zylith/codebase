import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subscription_plans", (table) => {
    // Add Apple product ID field to link subscription plans with Apple's product identifiers
    table.string("apple_product_id").nullable();

    // Index for faster lookups
    table.index(["apple_product_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subscription_plans", (table) => {
    // Remove Apple product ID field
    table.dropColumn("apple_product_id");

    // Remove index
    table.dropIndex(["apple_product_id"]);
  });
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subscription_plans", (table) => {
    table.string("stripe_product_id").nullable();
    table.string("stripe_price_id").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subscription_plans", (table) => {
    table.dropColumn("stripe_product_id");
    table.dropColumn("stripe_price_id");
  });
}

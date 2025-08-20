import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Fix field lengths for Apple receipt data
  await knex.schema.alterTable("user_subscriptions", (table) => {
    // Apple receipt data can be very long (thousands of characters)
    table.text("apple_receipt_data").alter();

    // Transaction IDs can be longer than 255 chars
    table.string("apple_transaction_id", 500).alter();
    table.string("apple_original_transaction_id", 500).alter();

    // Product IDs are typically under 100 chars, but let's be safe
    table.string("apple_product_id", 200).alter();

    // Validation status and environment can be longer
    table.string("apple_validation_status", 100).alter();
    table.string("apple_validation_environment", 100).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Revert the changes
  await knex.schema.alterTable("user_subscriptions", (table) => {
    table.string("apple_receipt_data", 255).alter();
    table.string("apple_transaction_id", 255).alter();
    table.string("apple_original_transaction_id", 255).alter();
    table.string("apple_product_id", 255).alter();
    table.string("apple_validation_status", 255).alter();
    table.string("apple_validation_environment", 255).alter();
  });
}

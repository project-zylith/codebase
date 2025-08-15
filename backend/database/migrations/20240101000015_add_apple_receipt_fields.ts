import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("user_subscriptions", (table) => {
    // Apple receipt validation fields
    table.string("apple_receipt_data").nullable(); // Base64 encoded receipt data
    table.string("apple_transaction_id").nullable(); // Apple's transaction ID
    table.string("apple_original_transaction_id").nullable(); // Original transaction ID for renewals
    table.string("apple_product_id").nullable(); // Apple's product ID
    table.timestamp("apple_purchase_date").nullable(); // Purchase date from receipt
    table.timestamp("apple_expiration_date").nullable(); // Expiration date from receipt
    table.boolean("apple_is_trial_period").defaultTo(false); // Whether this was a trial
    table.boolean("apple_is_intro_offer_period").defaultTo(false); // Whether this was an intro offer
    table
      .enum("apple_validation_environment", ["production", "sandbox"])
      .nullable(); // Which environment was validated
    table.timestamp("apple_last_validated").nullable(); // When the receipt was last validated
    table.string("apple_validation_status").defaultTo("pending"); // Status of receipt validation

    // Index for faster lookups
    table.index(["apple_transaction_id"]);
    table.index(["apple_original_transaction_id"]);
    table.index(["apple_product_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("user_subscriptions", (table) => {
    // Remove Apple receipt validation fields
    table.dropColumn("apple_receipt_data");
    table.dropColumn("apple_transaction_id");
    table.dropColumn("apple_original_transaction_id");
    table.dropColumn("apple_product_id");
    table.dropColumn("apple_purchase_date");
    table.dropColumn("apple_expiration_date");
    table.dropColumn("apple_is_trial_period");
    table.dropColumn("apple_is_intro_offer_period");
    table.dropColumn("apple_validation_environment");
    table.dropColumn("apple_last_validated");
    table.dropColumn("apple_validation_status");

    // Remove indexes
    table.dropIndex(["apple_transaction_id"]);
    table.dropIndex(["apple_original_transaction_id"]);
    table.dropIndex(["apple_product_id"]);
  });
}

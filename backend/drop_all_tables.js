require("dotenv").config();

const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PG_HOST || "127.0.0.1",
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "123",
    database: process.env.PG_DB || "renaissance",
  },
});

async function dropAllTables() {
  try {
    console.log("🔄 Dropping all tables...");

    // Drop all tables in the correct order (reverse dependency order)
    const tables = [
      "knex_migrations",
      "knex_migrations_lock",
      "messages",
      "conversation_participants",
      "conversations",
      "user_subscriptions",
      "subscription_plans",
      "tasks",
      "insights",
      "notes",
      "ideas", // Drop the old ideas table
      "galaxies",
      "users",
    ];

    for (const table of tables) {
      try {
        await knex.schema.dropTableIfExists(table);
        console.log(`✅ Dropped ${table} table`);
      } catch (error) {
        console.log(`⚠️  Could not drop ${table}: ${error.message}`);
      }
    }

    console.log("🎉 All tables dropped successfully!");
    console.log("You can now run: npx knex migrate:latest");
  } catch (error) {
    console.error("❌ Error dropping tables:", error);
  } finally {
    await knex.destroy();
    process.exit(0);
  }
}

dropAllTables();

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

async function resetMigrations() {
  try {
    console.log("🔄 Resetting migrations table...");

    // Drop the knex_migrations table to reset migration state
    await knex.schema.dropTableIfExists("knex_migrations");
    console.log("✅ Dropped knex_migrations table");

    // Drop the knex_migrations_lock table as well
    await knex.schema.dropTableIfExists("knex_migrations_lock");
    console.log("✅ Dropped knex_migrations_lock table");

    console.log("🎉 Migration state reset complete!");
    console.log("You can now run: npx knex migrate:latest");
  } catch (error) {
    console.error("❌ Error resetting migrations:", error);
  } finally {
    await knex.destroy();
    process.exit(0);
  }
}

resetMigrations();

require("dotenv").config();
const knex = require("knex");

const config = {
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING || {
    host: process.env.PG_HOST || "127.0.0.1",
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "123",
    database: process.env.PG_DB || "renaissance",
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
};

const db = knex(config);

async function resetMigrations() {
  console.log("🔄 Resetting Knex migration state...");

  try {
    // Drop all tables first
    console.log("🗑️  Dropping all existing tables...");
    const tables = await db.raw(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);

    for (const table of tables.rows) {
      await db.raw(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
      console.log(`✅ Dropped table: ${table.tablename}`);
    }

    // Drop migration tracking tables
    console.log("🔄 Dropping migration tracking tables...");
    await db.raw("DROP TABLE IF EXISTS knex_migrations CASCADE");
    await db.raw("DROP TABLE IF EXISTS knex_migrations_lock CASCADE");
    console.log("✅ Dropped knex_migrations table");
    console.log("✅ Dropped knex_migrations_lock table");

    console.log("🎉 Database completely reset!");
    console.log("You can now run: npm run migrate");
  } catch (error) {
    console.error("❌ Error resetting migrations:", error);
  } finally {
    await db.destroy();
  }
}

resetMigrations();

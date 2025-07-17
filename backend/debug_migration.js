require("dotenv").config();
const knex = require("knex");

// Load the same config that migrations use
const path = require("path");
const migrationsDirectory = path.join(__dirname, "database/migrations");
const seedsDirectory = path.join(__dirname, "database/seeds");

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
  migrations: {
    directory: migrationsDirectory,
  },
  seeds: {
    directory: seedsDirectory,
  },
};

const db = knex(config);

async function debugMigration() {
  console.log("🔍 Debug Migration Configuration...");
  console.log("Environment variables:");
  console.log(
    "  PG_HOST:",
    process.env.PG_HOST || "undefined (default: 127.0.0.1)"
  );
  console.log("  PG_PORT:", process.env.PG_PORT || "undefined (default: 5432)");
  console.log(
    "  PG_USER:",
    process.env.PG_USER || "undefined (default: postgres)"
  );
  console.log(
    "  PG_PASS:",
    process.env.PG_PASS ? "[HIDDEN]" : "undefined (default: 123)"
  );
  console.log(
    "  PG_DB:",
    process.env.PG_DB || "undefined (default: renaissance)"
  );
  console.log(
    "  PG_CONNECTION_STRING:",
    process.env.PG_CONNECTION_STRING || "undefined"
  );

  try {
    // Test connection
    console.log("\n🔗 Testing database connection...");
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful");

    // Check current database name
    const dbName = await db.raw("SELECT current_database()");
    console.log(`📊 Connected to database: ${dbName.rows[0].current_database}`);

    // Check tables
    console.log("\n📋 Current tables:");
    const tables = await db.raw(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);

    if (tables.rows.length === 0) {
      console.log("  No tables found");
    } else {
      tables.rows.forEach((table) => {
        console.log(`  - ${table.tablename}`);
      });
    }

    // Check migration status
    console.log("\n📜 Migration status:");
    try {
      const migrations = await db.migrate.currentVersion();
      console.log(`  Current migration version: ${migrations}`);
    } catch (error) {
      console.log(
        "  No migration table found (this is expected for clean database)"
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await db.destroy();
  }
}

debugMigration();

require("dotenv").config();
const knex = require("knex");
const path = require("path");

// Use the exact same configuration as knexfile.ts
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

console.log("🔍 Testing Knex Configuration...");
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

console.log("\n📋 Final connection config:");
console.log("  Host:", config.connection.host);
console.log("  Port:", config.connection.port);
console.log("  User:", config.connection.user);
console.log("  Database:", config.connection.database);

const db = knex(config);

async function testConnection() {
  try {
    console.log("\n🔗 Testing connection...");
    await db.raw("SELECT 1");
    console.log("✅ Connection successful");

    const dbName = await db.raw("SELECT current_database()");
    console.log(`📊 Connected to database: ${dbName.rows[0].current_database}`);

    console.log("\n📋 Checking tables...");
    const tables = await db.raw(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);

    if (tables.rows.length === 0) {
      console.log("  No tables found");
    } else {
      console.log(`  Tables (${tables.rows.length}):`);
      tables.rows.forEach((table) => {
        console.log(`    - ${table.tablename}`);
      });
    }

    // Try to create a test table to see if we get the same error
    console.log("\n🧪 Testing table creation...");
    try {
      await db.raw("CREATE TABLE test_table (id serial primary key)");
      console.log("✅ Test table created successfully");
      await db.raw("DROP TABLE test_table");
      console.log("✅ Test table dropped successfully");
    } catch (error) {
      console.log("❌ Error creating test table:", error.message);
    }
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  } finally {
    await db.destroy();
  }
}

testConnection();

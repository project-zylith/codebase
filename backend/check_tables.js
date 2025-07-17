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

async function checkTables() {
  console.log("🔍 Checking current tables in database...");

  try {
    const tables = await db.raw(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);

    console.log(`📊 Found ${tables.rows.length} tables:`);
    tables.rows.forEach((table) => {
      console.log(`  - ${table.tablename}`);
    });

    if (tables.rows.length === 0) {
      console.log("✅ Database is clean - no tables found");
    }
  } catch (error) {
    console.error("❌ Error checking tables:", error);
  } finally {
    await db.destroy();
  }
}

checkTables();

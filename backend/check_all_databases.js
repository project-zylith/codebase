require("dotenv").config();
const knex = require("knex");

// Try different database configurations
const configs = [
  {
    name: "Default (renaissance)",
    config: {
      client: "pg",
      connection: {
        host: process.env.PG_HOST || "127.0.0.1",
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASS || "123",
        database: process.env.PG_DB || "renaissance",
        ssl:
          process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
      },
    },
  },
  {
    name: "postgres database",
    config: {
      client: "pg",
      connection: {
        host: process.env.PG_HOST || "127.0.0.1",
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASS || "123",
        database: "postgres",
        ssl:
          process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
      },
    },
  },
  {
    name: "renaissance_db",
    config: {
      client: "pg",
      connection: {
        host: process.env.PG_HOST || "127.0.0.1",
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASS || "123",
        database: "renaissance_db",
        ssl:
          process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
      },
    },
  },
];

async function checkAllDatabases() {
  console.log("🔍 Checking all possible databases...\n");

  for (const { name, config } of configs) {
    console.log(`📊 Checking ${name}:`);
    const db = knex(config);

    try {
      await db.raw("SELECT 1");
      console.log(`  ✅ Connection successful`);

      const dbName = await db.raw("SELECT current_database()");
      console.log(`  📋 Database: ${dbName.rows[0].current_database}`);

      const tables = await db.raw(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%' 
        AND tablename NOT LIKE 'sql_%'
      `);

      if (tables.rows.length === 0) {
        console.log(`  📝 No tables found`);
      } else {
        console.log(`  📝 Tables (${tables.rows.length}):`);
        tables.rows.forEach((table) => {
          console.log(`    - ${table.tablename}`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Connection failed: ${error.message}`);
    } finally {
      await db.destroy();
    }

    console.log("");
  }
}

checkAllDatabases();

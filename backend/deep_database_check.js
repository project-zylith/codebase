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

async function deepDatabaseCheck() {
  console.log("🔍 Deep Database Check...");

  try {
    await db.raw("SELECT 1");
    console.log("✅ Connection successful");

    const dbName = await db.raw("SELECT current_database()");
    console.log(`📊 Connected to database: ${dbName.rows[0].current_database}`);

    // Check all schemas
    console.log("\n📋 Checking all schemas...");
    const schemas = await db.raw(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `);

    for (const schema of schemas.rows) {
      console.log(`\n🔍 Schema: ${schema.schema_name}`);

      const tables = await db.raw(
        `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = ? 
        AND table_type = 'BASE TABLE'
      `,
        [schema.schema_name]
      );

      if (tables.rows.length === 0) {
        console.log("  No tables found");
      } else {
        console.log(`  Tables (${tables.rows.length}):`);
        tables.rows.forEach((table) => {
          console.log(`    - ${table.table_name}`);
          if (table.table_name === "notes") {
            console.log(
              `      ⚠️  FOUND NOTES TABLE IN SCHEMA: ${schema.schema_name}`
            );
          }
        });
      }
    }

    // Check if there are any tables with 'notes' in the name
    console.log('\n🔍 Searching for any table with "notes" in the name...');
    const notesTables = await db.raw(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%notes%'
      AND table_type = 'BASE TABLE'
    `);

    if (notesTables.rows.length === 0) {
      console.log('  No tables with "notes" in the name found');
    } else {
      console.log('  Found tables with "notes" in the name:');
      notesTables.rows.forEach((table) => {
        console.log(`    - ${table.table_schema}.${table.table_name}`);
      });
    }

    // Check migration status
    console.log("\n📜 Migration status:");
    try {
      const migrations = await db.migrate.list();
      console.log("  Available migrations:");
      migrations.forEach((migration) => {
        console.log(`    - ${migration.file}`);
      });
    } catch (error) {
      console.log("  Error getting migration list:", error.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await db.destroy();
  }
}

deepDatabaseCheck();

require("dotenv").config();
const knex = require("knex");

// Configuration for connecting to postgres database (to create/drop renaissance)
const adminConfig = {
  client: "pg",
  connection: {
    host: process.env.PG_HOST || "127.0.0.1",
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "123",
    database: "postgres", // Connect to default postgres database
  },
};

// Configuration for connecting to renaissance database
const appConfig = {
  client: "pg",
  connection: {
    host: process.env.PG_HOST || "127.0.0.1",
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "123",
    database: "renaissance",
  },
};

async function completeReset() {
  console.log("🔄 Starting complete database reset...\n");

  // Step 1: Connect to postgres database and drop renaissance if it exists
  console.log("📋 Step 1: Dropping renaissance database if it exists...");
  const adminDb = knex(adminConfig);

  try {
    // Terminate all connections to renaissance database
    await adminDb.raw(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'renaissance'
        AND pid <> pg_backend_pid()
    `);

    // Drop the database
    await adminDb.raw("DROP DATABASE IF EXISTS renaissance");
    console.log("✅ Renaissance database dropped successfully");
  } catch (error) {
    console.log(`⚠️  Note: ${error.message}`);
  }

  // Step 2: Create fresh renaissance database
  console.log("\n📋 Step 2: Creating fresh renaissance database...");
  try {
    await adminDb.raw("CREATE DATABASE renaissance");
    console.log("✅ Renaissance database created successfully");
  } catch (error) {
    console.error(`❌ Error creating database: ${error.message}`);
    await adminDb.destroy();
    process.exit(1);
  }

  await adminDb.destroy();

  // Step 3: Run migrations
  console.log("\n📋 Step 3: Running migrations...");
  try {
    const { spawn } = require("child_process");

    await new Promise((resolve, reject) => {
      const migrate = spawn("npx", ["knex", "migrate:latest"], {
        stdio: "inherit",
        shell: true,
      });

      migrate.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Migrations completed successfully");
          resolve();
        } else {
          reject(new Error(`Migration failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error(`❌ Error running migrations: ${error.message}`);
    process.exit(1);
  }

  // Step 4: Run seeds
  console.log("\n📋 Step 4: Running seeds...");
  try {
    const { spawn } = require("child_process");

    await new Promise((resolve, reject) => {
      const seed = spawn("npx", ["knex", "seed:run"], {
        stdio: "inherit",
        shell: true,
      });

      seed.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Seeds completed successfully");
          resolve();
        } else {
          reject(new Error(`Seeding failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error(`❌ Error running seeds: ${error.message}`);
    process.exit(1);
  }

  // Step 5: Verify the setup
  console.log("\n📋 Step 5: Verifying database setup...");
  const appDb = knex(appConfig);

  try {
    const tables = await appDb.raw(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
    `);

    console.log(
      `✅ Database setup complete! Found ${tables.rows.length} tables:`
    );
    tables.rows.forEach((table) => {
      console.log(`  - ${table.tablename}`);
    });
  } catch (error) {
    console.error(`❌ Error verifying setup: ${error.message}`);
  } finally {
    await appDb.destroy();
  }

  console.log("\n🎉 Complete database reset finished!");
  console.log("Your database is now ready to use.");
  process.exit(0);
}

completeReset().catch((error) => {
  console.error("❌ Reset failed:", error);
  process.exit(1);
});

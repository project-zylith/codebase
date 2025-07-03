import { db } from "./database";
import { testConnection } from "./database";

async function runMigrations() {
  try {
    console.log("🔄 Running migrations...");

    // Test database connection first
    await testConnection();
    console.log("✅ Database connection successful");

    // Run migrations
    await db.migrate.latest();
    console.log("✅ Migrations completed successfully");

    // Run seeds
    console.log("🌱 Running seeds...");
    await db.seed.run();
    console.log("✅ Seeds completed successfully");

    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error during migration/seed process:", error);
  } finally {
    // Close the database connection
    await db.destroy();
    process.exit(0);
  }
}

// Run the migration process
runMigrations();

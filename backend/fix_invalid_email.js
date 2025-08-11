require("dotenv").config();
const knex = require("knex");

async function fixInvalidEmail() {
  // Direct database connection configuration
  const dbConfig = {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING || {
      host: process.env.PG_HOST || "127.0.0.1",
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "123",
      database: process.env.PG_DB || "renaissance",
      ssl:
        process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  };

  const db = knex(dbConfig);

  try {
    console.log("🔧 Fixing invalid email for user ID 8...");

    // Update the invalid email to a valid one
    const result = await db("users").where("id", 8).update({
      email: "t4@example.com",
    });

    if (result > 0) {
      console.log(
        "✅ Successfully updated user ID 8 email from 't4' to 't4@example.com'"
      );

      // Verify the fix
      const updatedUser = await db("users").where("id", 8).first();
      console.log("🔍 Updated user:", updatedUser);
    } else {
      console.log("❌ No user found with ID 8");
    }
  } catch (error) {
    console.error("❌ Error fixing email:", error);
  } finally {
    await db.destroy();
  }
}

fixInvalidEmail();

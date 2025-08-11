require("dotenv").config();
const knex = require("knex");

async function checkUserEmails() {
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
    console.log("🔍 Checking users table for invalid emails...");
    console.log("📡 Using database:", process.env.PG_DB || "renaissance");

    const users = await db("users").select("id", "username", "email");

    console.log("\n📋 All users in database:");
    users.forEach((user) => {
      const isValid = user.email && user.email.includes("@");
      const status = isValid ? "✅" : "❌";
      console.log(
        `${status} ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`
      );
    });

    const invalidUsers = users.filter(
      (user) => !user.email || !user.email.includes("@")
    );

    if (invalidUsers.length > 0) {
      console.log("\n🚨 Found users with invalid emails:");
      invalidUsers.forEach((user) => {
        console.log(
          `   ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`
        );
      });

      console.log("\n💡 To fix this, you can either:");
      console.log(
        "   1. Delete the invalid user: DELETE FROM users WHERE id = <user_id>"
      );
      console.log(
        '   2. Update the email: UPDATE users SET email = "valid@email.com" WHERE id = <user_id>'
      );
    } else {
      console.log("\n✅ All users have valid email addresses");
    }
  } catch (error) {
    console.error("❌ Error checking users:", error);
  } finally {
    await db.destroy();
  }
}

checkUserEmails();

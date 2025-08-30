require("dotenv").config();
const knex = require("knex");

async function checkTableStructure() {
  console.log("🔍 CHECKING TABLE STRUCTURE...\n");

  let db;

  try {
    const connectionConfig = {
      client: "pg",
      connection: process.env.PG_CONNECTION_STRING,
      ssl:
        process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

    db = knex(connectionConfig);
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful\n");

    // Check user_subscriptions table structure
    console.log("1️⃣ Checking user_subscriptions table structure...");
    const tableInfo = await db.raw(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_subscriptions'
      ORDER BY ordinal_position
    `);

    if (tableInfo.rows && tableInfo.rows.length > 0) {
      console.log("Columns in user_subscriptions table:");
      tableInfo.rows.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
        );
      });
    } else {
      console.log("❌ No columns found in user_subscriptions table");
    }
    console.log("");

    // Check subscription_plans table structure
    console.log("2️⃣ Checking subscription_plans table structure...");
    const plansTableInfo = await db.raw(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'subscription_plans'
      ORDER BY ordinal_position
    `);

    if (plansTableInfo.rows && plansTableInfo.rows.length > 0) {
      console.log("Columns in subscription_plans table:");
      plansTableInfo.rows.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`
        );
      });
    } else {
      console.log("❌ No columns found in subscription_plans table");
    }
    console.log("");

    // Check if user_subscriptions table has any data
    console.log("3️⃣ Checking user_subscriptions data...");
    const subscriptionCount = await db("user_subscriptions")
      .count("* as count")
      .first();
    console.log(`Total subscriptions: ${subscriptionCount.count}`);

    if (subscriptionCount.count > 0) {
      // Get a sample record to see the structure
      const sampleSub = await db("user_subscriptions")
        .select("*")
        .limit(1)
        .first();
      console.log("Sample subscription record:");
      console.log(JSON.stringify(sampleSub, null, 2));
    }
    console.log("");
  } catch (error) {
    console.error("❌ Check failed:", error.message);
  } finally {
    if (db) {
      await db.destroy();
    }
  }
}

checkTableStructure();

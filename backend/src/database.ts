import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

// Import the knex configuration
const knexConfig = require("../knexfile.ts");
const environment = process.env.NODE_ENV || "development";

console.log("🔍 Database.ts Debug:");
console.log("Environment:", environment);
console.log("Using config:", environment);

export const db = knex(knexConfig[environment]);

// Test the connection
export const testConnection = async (): Promise<void> => {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

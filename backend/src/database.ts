import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "todoApp",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/migrations",
  },
  seeds: {
    directory: "./src/seeds",
  },
};

export const db = knex(dbConfig);

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

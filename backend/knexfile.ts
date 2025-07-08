require("dotenv").config();
console.log("Database:", process.env.PG_DB);
console.log("User:", process.env.PG_USER);
console.log("Password:", process.env.PG_PASS);
const path = require("path");

const migrationsDirectory = path.join(__dirname, "database/migrations");
const seedsDirectory = path.join(__dirname, "database/seeds");
const POOL_MIN = parseInt(process.env.PG_POOL_MIN || "2");
const POOL_MAX = parseInt(process.env.PG_POOL_MAX || "5");

/*
We'll use environment variables to set the Postgres username and password
so we don't share that information online.

When we deploy in "production", we'll provide a PG_CONNECTION_STRING
*/

module.exports = {
  development: {
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
    migrations: {
      directory: migrationsDirectory,
    },
    seeds: {
      directory: seedsDirectory,
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: migrationsDirectory,
    },
    pool: {
      min: POOL_MIN,
      max: POOL_MAX,
    },
    seeds: {
      directory: seedsDirectory,
    },
  },
};

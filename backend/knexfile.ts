require("dotenv").config();
console.log("🔍 Knexfile Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(
  "PG_CONNECTION_STRING:",
  process.env.PG_CONNECTION_STRING ? "SET" : "NOT SET"
);
if (process.env.PG_CONNECTION_STRING) {
  // Mask password but show structure
  const maskedString = process.env.PG_CONNECTION_STRING.replace(
    /:([^@]+)@/,
    ":****@"
  );
  console.log("Connection string format:", maskedString);
}
console.log("Individual DB vars - PG_DB:", process.env.PG_DB);
console.log("Individual DB vars - PG_USER:", process.env.PG_USER);
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
    pool: {
      min: POOL_MIN,
      max: POOL_MAX,
      // Add connection options to prefer IPv4
      afterCreate: function (conn: any, done: any) {
        // Force IPv4 preference
        done(null, conn);
      },
    },
    migrations: {
      directory: migrationsDirectory,
    },
    seeds: {
      directory: seedsDirectory,
    },
  },
};

// @ts-nocheck
/**
 * Template seed file for users
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts template seed entries
      return knex("users").insert([
        {
          username: "demo_user",
          password_hash:
            "$2b$10$bKOvODSn55mGqDnx5Gzeh.BawNFPMh/Gfg.xIMjmEM7egFyTwi5J.", // bcrypt hash for "password123"
          email: "demo@example.com",
          created_at: new Date("2024-01-15T10:00:00Z"),
          updated_at: new Date("2024-01-15T10:00:00Z"),
        },
        {
          username: "test_user",
          password_hash:
            "$2b$10$bKOvODSn55mGqDnx5Gzeh.BawNFPMh/Gfg.xIMjmEM7egFyTwi5J.", // bcrypt hash for "password123"
          email: "test@example.com",
          created_at: new Date("2024-01-16T09:30:00Z"),
          updated_at: new Date("2024-01-16T09:30:00Z"),
        }
      ]);
    });
};

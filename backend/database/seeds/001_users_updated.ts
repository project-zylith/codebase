// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "cool_cat",
          password_hash:
            "$2b$10$bKOvODSn55mGqDnx5Gzeh.BawNFPMh/Gfg.xIMjmEM7egFyTwi5J.", // bcrypt hash for "password123"
          email: "cool_cat@example.com",
          google_id: null,
          created_at: new Date("2024-01-15T10:00:00Z"),
          updated_at: new Date("2024-01-15T10:00:00Z"),
        },
        {
          username: "wowow",
          password_hash:
            "$2b$10$buEPjMHj7JSbTtAMW74Sv.GBGmd3DxBdKoUtds/McT0vSvKzLUgeK", // bcrypt hash for "password456"
          email: "wowow@example.com",
          google_id: null,
          created_at: new Date("2024-01-20T14:30:00Z"),
          updated_at: new Date("2024-01-20T14:30:00Z"),
        },
        {
          username: "iaso",
          password_hash:
            "$2b$10$F1Iopgv7dCZcR/LuKsDDtO03qW1iQ6KdiPlDMDa4X4tFEjG3I.XmW", // bcrypt hash for "123Dev"
          email: "iaso@example.com",
          google_id: null,
          created_at: new Date("2024-02-01T09:15:00Z"),
          updated_at: new Date("2024-02-01T09:15:00Z"),
        },
        {
          username: "google_user",
          password_hash: null,
          email: "google_user@gmail.com",
          google_id: "google_oauth_id_123",
          created_at: new Date("2024-02-05T16:45:00Z"),
          updated_at: new Date("2024-02-05T16:45:00Z"),
        },
      ]);
    });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex: any) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "cool_cat",
          password: "hashed_password_123", // In production, this should be properly hashed
          email: "cool_cat@example.com",
          createdAt: new Date("2024-01-15T10:00:00Z"),
        },
        {
          username: "wowow",
          password: "hashed_password_456", // In production, this should be properly hashed
          email: "wowow@example.com",
          createdAt: new Date("2024-01-20T14:30:00Z"),
        },
        {
          username: "iaso",
          password: "123Dev", // In production, this should be properly hashed
          email: "iaso@example.com",
          createdAt: new Date("2024-02-01T09:15:00Z"),
        },
      ]);
    });
};

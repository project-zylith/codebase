// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("conversations")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("conversations").insert([
        {
          created_at: new Date("2024-01-16T08:00:00Z"),
        },
        {
          created_at: new Date("2024-01-22T14:30:00Z"),
        },
        {
          created_at: new Date("2024-02-01T10:15:00Z"),
        },
        {
          created_at: new Date("2024-02-05T16:45:00Z"),
        },
      ]);
    });
};

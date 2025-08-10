// @ts-nocheck
/**
 * Template seed file for conversations
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("conversations")
    .del()
    .then(function () {
      // Inserts template seed entries
      return knex("conversations").insert([
        {
          title: "Project Discussion",
          created_at: new Date("2024-01-15T14:00:00Z"),
          updated_at: new Date("2024-01-15T14:00:00Z"),
        },
        {
          title: "Feature Planning",
          created_at: new Date("2024-01-16T09:00:00Z"),
          updated_at: new Date("2024-01-16T09:00:00Z"),
        }
      ]);
    });
};
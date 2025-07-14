// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("galaxies")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("galaxies").insert([
        {
          user_id: 1, // cool_cat
          name: "Project Phoenix Notes",
          created_at: new Date("2024-01-16T09:00:00Z"),
        },
        {
          user_id: 1, // cool_cat
          name: "Weekend Hobby Projects",
          created_at: new Date("2024-01-18T14:30:00Z"),
        },
        {
          user_id: 2, // wowow
          name: "Business Ventures",
          created_at: new Date("2024-01-22T11:20:00Z"),
        },
        {
          user_id: 3, // iaso
          name: "Research Topics",
          created_at: new Date("2024-02-02T10:15:00Z"),
        },
        {
          user_id: 3, // iaso
          name: "Creative Writing",
          created_at: new Date("2024-02-03T15:45:00Z"),
        },
      ]);
    });
};

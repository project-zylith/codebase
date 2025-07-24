// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("galaxies")
    .del()
    .then(async function () {
      // Get the actual user IDs from the users table
      const coolCat = await knex("users").where("username", "cool_cat").first();
      const wowow = await knex("users").where("username", "wowow").first();
      const iaso = await knex("users").where("username", "iaso").first();

      if (!coolCat || !wowow || !iaso) {
        console.log("Warning: Some users not found, skipping galaxy creation");
        return;
      }

      // Inserts seed entries with actual user IDs
      return knex("galaxies").insert([
        {
          user_id: coolCat.id,
          name: "Project Phoenix Notes",
          created_at: new Date("2024-01-16T09:00:00Z"),
        },
        {
          user_id: coolCat.id,
          name: "Weekend Hobby Projects",
          created_at: new Date("2024-01-18T14:30:00Z"),
        },
        {
          user_id: wowow.id,
          name: "Business Ventures",
          created_at: new Date("2024-01-22T11:20:00Z"),
        },
        {
          user_id: iaso.id,
          name: "Research Topics",
          created_at: new Date("2024-02-02T10:15:00Z"),
        },
        {
          user_id: iaso.id,
          name: "Creative Writing",
          created_at: new Date("2024-02-03T15:45:00Z"),
        },
      ]);
    });
};

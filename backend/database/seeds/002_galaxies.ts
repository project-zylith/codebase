// @ts-nocheck
/**
 * Template seed file for galaxies
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("galaxies")
    .del()
    .then(async function () {
      // Get the demo user IDs from the users table
      const demoUser = await knex("users").where("username", "demo_user").first();
      const testUser = await knex("users").where("username", "test_user").first();

      if (!demoUser || !testUser) {
        console.log("Warning: Demo users not found, skipping galaxy creation");
        return;
      }

      // Inserts template seed entries
      return knex("galaxies").insert([
        {
          user_id: demoUser.id,
          name: "Work Projects",
          description: "Professional work and project-related notes",
          created_at: new Date("2024-01-15T12:00:00Z"),
          updated_at: new Date("2024-01-15T12:00:00Z"),
        },
        {
          user_id: demoUser.id,
          name: "Personal Development",
          description: "Learning resources and personal growth notes",
          created_at: new Date("2024-01-15T13:00:00Z"),
          updated_at: new Date("2024-01-15T13:00:00Z"),
        },
        {
          user_id: testUser.id,
          name: "Ideas & Inspiration",
          description: "Creative ideas and inspiration collection",
          created_at: new Date("2024-01-16T10:00:00Z"),
          updated_at: new Date("2024-01-16T10:00:00Z"),
        }
      ]);
    });
};
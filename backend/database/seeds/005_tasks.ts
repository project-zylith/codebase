// @ts-nocheck
/**
 * Template seed file for tasks
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(async function () {
      // Get the demo user IDs
      const demoUser = await knex("users").where("username", "demo_user").first();
      const testUser = await knex("users").where("username", "test_user").first();

      if (!demoUser || !testUser) {
        console.log("Demo users not found, skipping tasks seed");
        return;
      }

      // Inserts template seed entries
      return knex("tasks").insert([
        {
          title: "Welcome Task",
          description: "Complete app setup and configuration",
          completed: false,
          user_id: demoUser.id,
          goal: "Setup",
          created_at: new Date("2024-01-15T11:30:00Z"),
          updated_at: new Date("2024-01-15T11:30:00Z"),
        },
        {
          title: "Explore Features",
          description: "Test notes, galaxies, and AI insights",
          completed: false,
          user_id: demoUser.id,
          goal: "Learning",
          created_at: new Date("2024-01-15T12:30:00Z"),
          updated_at: new Date("2024-01-15T12:30:00Z"),
        },
        {
          title: "Sample Completed Task",
          description: "This shows what a completed task looks like",
          completed: true,
          user_id: testUser.id,
          goal: "Demo",
          created_at: new Date("2024-01-16T09:00:00Z"),
          updated_at: new Date("2024-01-16T10:30:00Z"),
        }
      ]);
    });
};

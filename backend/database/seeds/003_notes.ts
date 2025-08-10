// @ts-nocheck
/**
 * Template seed file for notes
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("notes")
    .del()
    .then(async function () {
      // Get the demo user IDs
      const demoUser = await knex("users").where("username", "demo_user").first();
      const testUser = await knex("users").where("username", "test_user").first();

      if (!demoUser || !testUser) {
        console.log("Demo users not found, skipping notes seed");
        return;
      }

      // Inserts template seed entries
      return knex("notes").insert([
        {
          title: "Welcome to Your App",
          content: "This is a sample note to demonstrate the note-taking functionality.",
          user_id: demoUser.id,
          created_at: new Date("2024-01-15T11:00:00Z"),
          updated_at: new Date("2024-01-15T11:00:00Z"),
        },
        {
          title: "Getting Started Guide",
          content: "Here are some tips for using this app effectively:\n\n1. Create notes\n2. Organize with galaxies\n3. Use AI insights\n4. Manage tasks",
          user_id: demoUser.id,
          created_at: new Date("2024-01-15T12:00:00Z"),
          updated_at: new Date("2024-01-15T12:00:00Z"),
        },
        {
          title: "Sample Project Note",
          content: "This is an example of how you might structure project-related notes in your app.",
          user_id: testUser.id,
          created_at: new Date("2024-01-16T10:00:00Z"),
          updated_at: new Date("2024-01-16T10:00:00Z"),
        }
      ]);
    });
};

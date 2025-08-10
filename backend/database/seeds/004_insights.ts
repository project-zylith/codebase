// @ts-nocheck
/**
 * Template seed file for insights
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("insights")
    .del()
    .then(async function () {
      // Get demo notes for insights
      const welcomeNote = await knex("notes")
        .where("title", "Welcome to Your App")
        .first();
      const guideNote = await knex("notes")
        .where("title", "Getting Started Guide")
        .first();

      if (!welcomeNote || !guideNote) {
        console.log("Demo notes not found, skipping insights seed");
        return;
      }

      // Get demo user
      const demoUser = await knex("users").where("username", "demo_user").first();
      
      if (!demoUser) {
        console.log("Demo user not found, skipping insights seed");
        return;
      }

      // Inserts template seed entries
      return knex("insights").insert([
        {
          note_id: welcomeNote.id,
          user_id: demoUser.id,
          insight_text: "This welcome note introduces users to the app's core functionality and helps them get started with note-taking.",
          created_at: new Date("2024-01-15T11:30:00Z"),
          updated_at: new Date("2024-01-15T11:30:00Z"),
        },
        {
          note_id: guideNote.id,
          user_id: demoUser.id,
          insight_text: "The getting started guide provides a structured approach to learning the app's features, focusing on practical usage patterns.",
          created_at: new Date("2024-01-15T12:30:00Z"),
          updated_at: new Date("2024-01-15T12:30:00Z"),
        }
      ]);
    });
};
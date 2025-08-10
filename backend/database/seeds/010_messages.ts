// @ts-nocheck
/**
 * Template seed file for messages
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(async function () {
      // Get demo users and conversations
      const demoUser = await knex("users").where("username", "demo_user").first();
      const testUser = await knex("users").where("username", "test_user").first();
      const projectConvo = await knex("conversations").where("title", "Project Discussion").first();

      if (!demoUser || !testUser || !projectConvo) {
        console.log("Demo data not found, skipping messages seed");
        return;
      }

      // Inserts template seed entries
      return knex("messages").insert([
        {
          conversation_id: projectConvo.id,
          user_id: demoUser.id,
          content: "Hey! Let's discuss the new project requirements.",
          created_at: new Date("2024-01-15T14:05:00Z"),
        },
        {
          conversation_id: projectConvo.id,
          user_id: testUser.id,
          content: "Sure! I've been thinking about the user interface design.",
          created_at: new Date("2024-01-15T14:07:00Z"),
        },
        {
          conversation_id: projectConvo.id,
          user_id: demoUser.id,
          content: "Great! What are your initial thoughts?",
          created_at: new Date("2024-01-15T14:10:00Z"),
        }
      ]);
    });
};
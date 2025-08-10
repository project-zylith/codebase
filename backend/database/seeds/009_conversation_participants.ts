// @ts-nocheck
/**
 * Template seed file for conversation participants
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("conversation_participants")
    .del()
    .then(async function () {
      // Get demo users and conversations
      const demoUser = await knex("users").where("username", "demo_user").first();
      const testUser = await knex("users").where("username", "test_user").first();
      const projectConvo = await knex("conversations").where("title", "Project Discussion").first();
      const featureConvo = await knex("conversations").where("title", "Feature Planning").first();

      if (!demoUser || !testUser || !projectConvo || !featureConvo) {
        console.log("Demo data not found, skipping conversation participants seed");
        return;
      }

      // Inserts template seed entries
      return knex("conversation_participants").insert([
        {
          conversation_id: projectConvo.id,
          user_id: demoUser.id,
          joined_at: new Date("2024-01-15T14:00:00Z"),
        },
        {
          conversation_id: projectConvo.id,
          user_id: testUser.id,
          joined_at: new Date("2024-01-15T14:01:00Z"),
        },
        {
          conversation_id: featureConvo.id,
          user_id: demoUser.id,
          joined_at: new Date("2024-01-16T09:00:00Z"),
        }
      ]);
    });
};
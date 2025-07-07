// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("conversation_participants")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("conversation_participants").insert([
        // Conversation 1: cool_cat and wowow
        {
          conversation_id: 1,
          user_id: 1, // cool_cat
        },
        {
          conversation_id: 1,
          user_id: 2, // wowow
        },
        // Conversation 2: wowow and iaso
        {
          conversation_id: 2,
          user_id: 2, // wowow
        },
        {
          conversation_id: 2,
          user_id: 3, // iaso
        },
        // Conversation 3: cool_cat, iaso, and google_user (group chat)
        {
          conversation_id: 3,
          user_id: 1, // cool_cat
        },
        {
          conversation_id: 3,
          user_id: 3, // iaso
        },
        {
          conversation_id: 3,
          user_id: 4, // google_user
        },
        // Conversation 4: cool_cat and google_user
        {
          conversation_id: 4,
          user_id: 1, // cool_cat
        },
        {
          conversation_id: 4,
          user_id: 4, // google_user
        },
      ]);
    });
};

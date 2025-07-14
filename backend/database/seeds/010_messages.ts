// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("messages").insert([
        // Conversation 1: cool_cat and wowow
        {
          conversation_id: 1,
          sender_id: 1, // cool_cat
          content: "Hey! How's your project coming along?",
          created_at: new Date("2024-01-16T08:05:00Z"),
        },
        {
          conversation_id: 1,
          sender_id: 2, // wowow
          content: "Great! Just finished the wireframes. Want to take a look?",
          created_at: new Date("2024-01-16T08:10:00Z"),
        },
        {
          conversation_id: 1,
          sender_id: 1, // cool_cat
          content: "Absolutely! Send them over.",
          created_at: new Date("2024-01-16T08:12:00Z"),
        },
        // Conversation 2: wowow and iaso
        {
          conversation_id: 2,
          sender_id: 2, // wowow
          content:
            "I saw your research topic on remote work. Really interesting!",
          created_at: new Date("2024-01-22T14:35:00Z"),
        },
        {
          conversation_id: 2,
          sender_id: 3, // iaso
          content:
            "Thanks! I'm planning to survey both urban planners and remote workers.",
          created_at: new Date("2024-01-22T14:40:00Z"),
        },
        {
          conversation_id: 2,
          sender_id: 2, // wowow
          content:
            "That's a great approach. Have you considered looking at co-working spaces too?",
          created_at: new Date("2024-01-22T14:45:00Z"),
        },
        // Conversation 3: Group chat
        {
          conversation_id: 3,
          sender_id: 1, // cool_cat
          content: "Welcome to the group chat, everyone!",
          created_at: new Date("2024-02-01T10:20:00Z"),
        },
        {
          conversation_id: 3,
          sender_id: 4, // google_user
          content: "Thanks for adding me! Excited to collaborate.",
          created_at: new Date("2024-02-01T10:25:00Z"),
        },
        {
          conversation_id: 3,
          sender_id: 3, // iaso
          content: "Great to have you here! Let's share some notes.",
          created_at: new Date("2024-02-01T10:30:00Z"),
        },
        // Conversation 4: cool_cat and google_user
        {
          conversation_id: 4,
          sender_id: 4, // google_user
          content:
            "I love your plant monitoring idea! I'm working on something similar.",
          created_at: new Date("2024-02-05T16:50:00Z"),
        },
        {
          conversation_id: 4,
          sender_id: 1, // cool_cat
          content: "Really? Maybe we can collaborate on it!",
          created_at: new Date("2024-02-05T16:55:00Z"),
        },
        {
          conversation_id: 4,
          sender_id: 4, // google_user
          content: "That would be awesome! I'll send you my draft specs.",
          created_at: new Date("2024-02-05T17:00:00Z"),
        },
      ]);
    });
};

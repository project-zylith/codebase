// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("notes")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("notes").insert([
        {
          user_id: 1, // cool_cat
          galaxy_id: 1, // Project Phoenix Notes
          title: "AI-Powered Task Manager Notes",
          content:
            "Working on a smart task management system that uses AI to prioritize tasks and provide insights. Need to integrate with calendar and email for context.",
          created_at: new Date("2024-01-16T09:30:00Z"),
          updated_at: new Date("2024-01-16T09:30:00Z"),
        },
        {
          user_id: 1, // cool_cat
          galaxy_id: 1, // Project Phoenix Notes
          title: "Collaborative Mind Mapping Tool Notes",
          content:
            "Developing a real-time collaborative mind mapping tool with AI suggestions for connections between concepts. Perfect for brainstorming sessions.",
          created_at: new Date("2024-01-17T14:20:00Z"),
          updated_at: new Date("2024-01-17T14:20:00Z"),
        },
        {
          user_id: 1, // cool_cat
          galaxy_id: 2, // Weekend Hobby Projects
          title: "Indoor Garden Monitoring Notes",
          content:
            "Researching IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Planning to send notifications to phone.",
          created_at: new Date("2024-01-19T10:15:00Z"),
          updated_at: new Date("2024-01-19T10:15:00Z"),
        },
        {
          user_id: 2, // wowow
          galaxy_id: 3, // Business Ventures
          title: "Subscription Box for Local Artisans Notes",
          content:
            "Planning a monthly subscription box featuring products from local artisans and craftspeople. Goal is to support local economy while discovering unique items.",
          created_at: new Date("2024-01-23T16:45:00Z"),
          updated_at: new Date("2024-01-23T16:45:00Z"),
        },
        {
          user_id: 3, // iaso
          galaxy_id: 4, // Research Topics
          title: "Impact of Remote Work on Urban Planning Notes",
          content:
            "Researching how the shift to remote work is affecting urban development and city planning. Need to look into commercial real estate trends.",
          created_at: new Date("2024-02-02T11:30:00Z"),
          updated_at: new Date("2024-02-02T11:30:00Z"),
        },
        {
          user_id: 3, // iaso
          galaxy_id: 5, // Creative Writing
          title: "Sci-Fi Novel: The Memory Traders Notes",
          content:
            "Working on a sci-fi novel set in a future where memories can be extracted and traded. A black market dealer discovers memories that shouldn't exist.",
          created_at: new Date("2024-02-04T13:20:00Z"),
          updated_at: new Date("2024-02-04T13:20:00Z"),
        },
        {
          user_id: 4, // google_user
          galaxy_id: null, // Not assigned to any galaxy yet
          title: "Mobile App for Plant Care Notes",
          content:
            "Designing an app that helps users care for their plants by providing watering schedules, care tips, and plant identification features.",
          created_at: new Date("2024-02-06T09:15:00Z"),
          updated_at: new Date("2024-02-06T09:15:00Z"),
        },
      ]);
    });
};

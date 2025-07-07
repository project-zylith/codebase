// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("ideas")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("ideas").insert([
        {
          user_id: 1, // cool_cat
          galaxy_id: 1, // Project Phoenix Ideas
          title: "AI-Powered Task Manager",
          content:
            "A smart task management system that uses AI to prioritize tasks and provide insights. Could integrate with calendar and email for context.",
          created_at: new Date("2024-01-16T09:30:00Z"),
          updated_at: new Date("2024-01-16T09:30:00Z"),
        },
        {
          user_id: 1, // cool_cat
          galaxy_id: 1, // Project Phoenix Ideas
          title: "Collaborative Mind Mapping Tool",
          content:
            "Real-time collaborative mind mapping with AI suggestions for connections between ideas. Perfect for brainstorming sessions.",
          created_at: new Date("2024-01-17T14:20:00Z"),
          updated_at: new Date("2024-01-17T14:20:00Z"),
        },
        {
          user_id: 1, // cool_cat
          galaxy_id: 2, // Weekend Hobby Projects
          title: "Indoor Garden Monitoring",
          content:
            "IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Send notifications to phone.",
          created_at: new Date("2024-01-19T10:15:00Z"),
          updated_at: new Date("2024-01-19T10:15:00Z"),
        },
        {
          user_id: 2, // wowow
          galaxy_id: 3, // Business Ventures
          title: "Subscription Box for Local Artisans",
          content:
            "Monthly subscription box featuring products from local artisans and craftspeople. Support local economy while discovering unique items.",
          created_at: new Date("2024-01-23T16:45:00Z"),
          updated_at: new Date("2024-01-23T16:45:00Z"),
        },
        {
          user_id: 3, // iaso
          galaxy_id: 4, // Research Topics
          title: "Impact of Remote Work on Urban Planning",
          content:
            "Research how the shift to remote work is affecting urban development and city planning. Look into commercial real estate trends.",
          created_at: new Date("2024-02-02T11:30:00Z"),
          updated_at: new Date("2024-02-02T11:30:00Z"),
        },
        {
          user_id: 3, // iaso
          galaxy_id: 5, // Creative Writing
          title: "Sci-Fi Novel: The Memory Traders",
          content:
            "In a future where memories can be extracted and traded, a black market dealer discovers memories that shouldn't exist.",
          created_at: new Date("2024-02-04T13:20:00Z"),
          updated_at: new Date("2024-02-04T13:20:00Z"),
        },
        {
          user_id: 4, // google_user
          galaxy_id: null, // Not assigned to any galaxy yet
          title: "Mobile App for Plant Care",
          content:
            "An app that helps users care for their plants by providing watering schedules, care tips, and plant identification features.",
          created_at: new Date("2024-02-06T09:15:00Z"),
          updated_at: new Date("2024-02-06T09:15:00Z"),
        },
      ]);
    });
};

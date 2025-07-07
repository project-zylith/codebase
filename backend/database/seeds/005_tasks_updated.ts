// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tasks").insert([
        {
          user_id: 1, // cool_cat
          content:
            "Complete project documentation for the Renaissance app including API endpoints and user guides",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: true,
          created_at: new Date("2024-01-15T09:00:00Z"),
          updated_at: new Date("2024-01-15T09:00:00Z"),
        },
        {
          user_id: 1, // cool_cat
          content: "Set up database migrations for users and tasks tables",
          is_completed: true,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-10T14:30:00Z"),
          updated_at: new Date("2024-01-12T16:45:00Z"),
        },
        {
          user_id: 2, // wowow
          content: "Implement user authentication with JWT-based system",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-18T11:20:00Z"),
          updated_at: new Date("2024-01-18T11:20:00Z"),
        },
        {
          user_id: 2, // wowow
          content: "Design mobile app UI wireframes and mockups",
          is_completed: true,
          is_ai_generated: false,
          is_favorite: true,
          created_at: new Date("2024-01-05T10:15:00Z"),
          updated_at: new Date("2024-01-08T13:20:00Z"),
        },
        {
          user_id: 3, // iaso
          content: "Write comprehensive unit tests for backend services",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-20T15:45:00Z"),
          updated_at: new Date("2024-01-20T15:45:00Z"),
        },
        {
          user_id: 1, // cool_cat
          content:
            "Research AI integration possibilities for task prioritization",
          is_completed: false,
          is_ai_generated: true,
          is_favorite: false,
          created_at: new Date("2024-01-25T10:30:00Z"),
          updated_at: new Date("2024-01-25T10:30:00Z"),
        },
        {
          user_id: 3, // iaso
          content: "Set up automated testing pipeline with CI/CD",
          is_completed: false,
          is_ai_generated: true,
          is_favorite: true,
          created_at: new Date("2024-02-01T14:15:00Z"),
          updated_at: new Date("2024-02-01T14:15:00Z"),
        },
      ]);
    });
};

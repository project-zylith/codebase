// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(async function () {
      // Get the actual user IDs
      const coolCat = await knex("users").where("username", "cool_cat").first();
      const wowow = await knex("users").where("username", "wowow").first();
      const iaso = await knex("users").where("username", "iaso").first();

      if (!coolCat || !wowow || !iaso) {
        console.log("Warning: Some users not found, skipping task creation");
        return;
      }

      // Inserts seed entries with actual user IDs
      return knex("tasks").insert([
        {
          user_id: coolCat.id,
          content:
            "Complete project documentation for the Renaissance app including API endpoints and user guides",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: true,
          created_at: new Date("2024-01-15T09:00:00Z"),
          updated_at: new Date("2024-01-15T09:00:00Z"),
        },
        {
          user_id: coolCat.id,
          content: "Set up database migrations for users and tasks tables",
          is_completed: true,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-10T14:30:00Z"),
          updated_at: new Date("2024-01-12T16:45:00Z"),
        },
        {
          user_id: wowow.id,
          content: "Implement user authentication with JWT-based system",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-18T11:20:00Z"),
          updated_at: new Date("2024-01-18T11:20:00Z"),
        },
        {
          user_id: wowow.id,
          content: "Design mobile app UI wireframes and mockups",
          is_completed: true,
          is_ai_generated: false,
          is_favorite: true,
          created_at: new Date("2024-01-05T10:15:00Z"),
          updated_at: new Date("2024-01-08T13:20:00Z"),
        },
        {
          user_id: iaso.id,
          content: "Write comprehensive unit tests for backend services",
          is_completed: false,
          is_ai_generated: false,
          is_favorite: false,
          created_at: new Date("2024-01-20T15:45:00Z"),
          updated_at: new Date("2024-01-20T15:45:00Z"),
        },
        {
          user_id: coolCat.id,
          content:
            "Research AI integration possibilities for task prioritization",
          is_completed: false,
          is_ai_generated: true,
          is_favorite: false,
          created_at: new Date("2024-01-25T10:30:00Z"),
          updated_at: new Date("2024-01-25T10:30:00Z"),
        },
        {
          user_id: iaso.id,
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

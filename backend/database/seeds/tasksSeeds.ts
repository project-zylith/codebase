/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex: any) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tasks").insert([
        {
          title: "Complete project documentation",
          description:
            "Write comprehensive documentation for the Renaissance app including API endpoints and user guides",
          completed: false,
          created_at: new Date("2024-01-15T09:00:00Z"),
          updated_at: new Date("2024-01-15T09:00:00Z"),
        },
        {
          title: "Set up database migrations",
          description:
            "Create and test all database migrations for users and tasks tables",
          completed: true,
          created_at: new Date("2024-01-10T14:30:00Z"),
          updated_at: new Date("2024-01-12T16:45:00Z"),
        },
        {
          title: "Implement user authentication",
          description:
            "Add JWT-based authentication system with login/logout functionality",
          completed: false,
          created_at: new Date("2024-01-18T11:20:00Z"),
          updated_at: new Date("2024-01-18T11:20:00Z"),
        },
        {
          title: "Design mobile app UI",
          description:
            "Create wireframes and mockups for the React Native frontend interface",
          completed: true,
          created_at: new Date("2024-01-05T10:15:00Z"),
          updated_at: new Date("2024-01-08T13:20:00Z"),
        },
        {
          title: "Write unit tests",
          description:
            "Create comprehensive test suite for backend services and API endpoints",
          completed: false,
          created_at: new Date("2024-01-20T15:45:00Z"),
          updated_at: new Date("2024-01-20T15:45:00Z"),
        },
      ]);
    });
};

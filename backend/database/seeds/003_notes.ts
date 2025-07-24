// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("notes")
    .del()
    .then(async function () {
      // Get the actual user IDs and galaxy IDs
      const coolCat = await knex("users").where("username", "cool_cat").first();
      const wowow = await knex("users").where("username", "wowow").first();
      const iaso = await knex("users").where("username", "iaso").first();
      const googleUser = await knex("users")
        .where("username", "google_user")
        .first();

      const projectPhoenixGalaxy = await knex("galaxies")
        .where("name", "Project Phoenix Notes")
        .first();
      const weekendHobbyGalaxy = await knex("galaxies")
        .where("name", "Weekend Hobby Projects")
        .first();
      const businessVenturesGalaxy = await knex("galaxies")
        .where("name", "Business Ventures")
        .first();
      const researchTopicsGalaxy = await knex("galaxies")
        .where("name", "Research Topics")
        .first();
      const creativeWritingGalaxy = await knex("galaxies")
        .where("name", "Creative Writing")
        .first();

      if (!coolCat || !wowow || !iaso || !googleUser) {
        console.log("Warning: Some users not found, skipping note creation");
        return;
      }

      if (
        !projectPhoenixGalaxy ||
        !weekendHobbyGalaxy ||
        !businessVenturesGalaxy ||
        !researchTopicsGalaxy ||
        !creativeWritingGalaxy
      ) {
        console.log("Warning: Some galaxies not found, skipping note creation");
        return;
      }

      // Inserts seed entries with actual IDs
      return knex("notes").insert([
        {
          user_id: coolCat.id,
          galaxy_id: projectPhoenixGalaxy.id,
          title: "AI-Powered Task Manager Notes",
          content:
            "Working on a smart task management system that uses AI to prioritize tasks and provide insights. Need to integrate with calendar and email for context.",
          created_at: new Date("2024-01-16T09:30:00Z"),
          updated_at: new Date("2024-01-16T09:30:00Z"),
        },
        {
          user_id: coolCat.id,
          galaxy_id: projectPhoenixGalaxy.id,
          title: "Collaborative Mind Mapping Tool Notes",
          content:
            "Developing a real-time collaborative mind mapping tool with AI suggestions for connections between concepts. Perfect for brainstorming sessions.",
          created_at: new Date("2024-01-17T14:20:00Z"),
          updated_at: new Date("2024-01-17T14:20:00Z"),
        },
        {
          user_id: coolCat.id,
          galaxy_id: weekendHobbyGalaxy.id,
          title: "Indoor Garden Monitoring Notes",
          content:
            "Researching IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Planning to send notifications to phone.",
          created_at: new Date("2024-01-19T10:15:00Z"),
          updated_at: new Date("2024-01-19T10:15:00Z"),
        },
        {
          user_id: wowow.id,
          galaxy_id: businessVenturesGalaxy.id,
          title: "Subscription Box for Local Artisans Notes",
          content:
            "Planning a monthly subscription box featuring products from local artisans and craftspeople. Goal is to support local economy while discovering unique items.",
          created_at: new Date("2024-01-23T16:45:00Z"),
          updated_at: new Date("2024-01-23T16:45:00Z"),
        },
        {
          user_id: iaso.id,
          galaxy_id: researchTopicsGalaxy.id,
          title: "Impact of Remote Work on Urban Planning Notes",
          content:
            "Researching how the shift to remote work is affecting urban development and city planning. Need to look into commercial real estate trends.",
          created_at: new Date("2024-02-02T11:30:00Z"),
          updated_at: new Date("2024-02-02T11:30:00Z"),
        },
        {
          user_id: iaso.id,
          galaxy_id: creativeWritingGalaxy.id,
          title: "Sci-Fi Novel: The Memory Traders Notes",
          content:
            "Working on a sci-fi novel set in a future where memories can be extracted and traded. A black market dealer discovers memories that shouldn't exist.",
          created_at: new Date("2024-02-04T13:20:00Z"),
          updated_at: new Date("2024-02-04T13:20:00Z"),
        },
        {
          user_id: googleUser.id,
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

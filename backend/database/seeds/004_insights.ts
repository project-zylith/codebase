// @ts-nocheck
/**
 * @param {import('knex').Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("insights")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("insights").insert([
        {
          note_id: 1, // AI-Powered Task Manager Notes
          content:
            "Consider integrating with popular productivity tools like Notion, Todoist, or Trello for seamless workflow integration.",
          created_at: new Date("2024-01-16T10:00:00Z"),
        },
        {
          note_id: 1, // AI-Powered Task Manager Notes
          content:
            "Machine learning could analyze user behavior patterns to suggest optimal work schedules and break times.",
          created_at: new Date("2024-01-16T10:15:00Z"),
        },
        {
          note_id: 1, // AI-Powered Task Manager Notes
          content:
            "Voice integration could allow hands-free task creation and updates, especially useful for mobile users.",
          created_at: new Date("2024-01-16T10:30:00Z"),
        },
        {
          note_id: 2, // Collaborative Mind Mapping Tool Notes
          content:
            "Real-time conflict resolution will be crucial - consider implementing operational transforms or CRDTs.",
          created_at: new Date("2024-01-17T14:45:00Z"),
        },
        {
          note_id: 2, // Collaborative Mind Mapping Tool Notes
          content:
            "AI could suggest relevant research papers, articles, or resources based on the mind map content.",
          created_at: new Date("2024-01-17T15:00:00Z"),
        },
        {
          note_id: 3, // Indoor Garden Monitoring Notes
          content:
            "Consider solar-powered sensors to reduce maintenance and make installation more flexible.",
          created_at: new Date("2024-01-19T10:45:00Z"),
        },
        {
          note_id: 4, // Subscription Box for Local Artisans Notes
          content:
            "Partner with local tourism boards to promote regional artisans and create themed boxes by region.",
          created_at: new Date("2024-01-23T17:15:00Z"),
        },
        {
          note_id: 4, // Subscription Box for Local Artisans Notes
          content:
            "Include QR codes linking to videos of artisans explaining their craft and story behind each piece.",
          created_at: new Date("2024-01-23T17:30:00Z"),
        },
        {
          note_id: 5, // Impact of Remote Work on Urban Planning Notes
          content:
            "Survey both urban planners and remote workers to get perspectives from both sides of the equation.",
          created_at: new Date("2024-02-02T12:00:00Z"),
        },
        {
          note_id: 6, // Sci-Fi Novel: The Memory Traders Notes
          content:
            "Explore themes of identity and authenticity - what makes a memory 'real' if it can be artificially created?",
          created_at: new Date("2024-02-04T13:45:00Z"),
        },
        {
          note_id: 7, // Mobile App for Plant Care Notes
          content:
            "Implement machine learning for plant disease detection using camera photos of leaves and stems.",
          created_at: new Date("2024-02-06T09:45:00Z"),
        },
      ]);
    });
};

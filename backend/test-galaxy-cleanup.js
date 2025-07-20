// DEPRECATED: This test file is no longer needed for production.
// This file can be safely deleted after testing.

/*
const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

async function cleanupGalaxies() {
  try {
    console.log("🧹 Starting galaxy cleanup...");

    // Get all galaxies
    const galaxies = await db("galaxies").select("*");
    console.log(`Found ${galaxies.length} galaxies`);

    // Get all notes
    const notes = await db("notes").select("*");
    console.log(`Found ${notes.length} notes`);

    // Reset note galaxy assignments
    const updatedNotes = await db("notes")
      .whereNotNull("galaxy_id")
      .update({ galaxy_id: null });
    console.log(`Reset galaxy_id for ${updatedNotes} notes`);

    // Delete all galaxies
    const deletedGalaxies = await db("galaxies").del();
    console.log(`Deleted ${deletedGalaxies} galaxies`);

    // Verify cleanup
    const remainingGalaxies = await db("galaxies").select("*");
    const notesWithGalaxies = await db("notes")
      .whereNotNull("galaxy_id")
      .select("*");

    console.log(`Remaining galaxies: ${remainingGalaxies.length}`);
    console.log(`Notes with galaxy assignments: ${notesWithGalaxies.length}`);

    console.log("✅ Galaxy cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error during galaxy cleanup:", error);
  } finally {
    await db.destroy();
  }
}

cleanupGalaxies();
*/

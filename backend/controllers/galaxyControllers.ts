import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
const knex = require("../database/database");
import * as galaxyAi from "../src/aiServices/galaxyAi";
import { SubscriptionLimitService } from "../src/services/subscriptionLimitService";

// Helper function to get user ID from JWT or session
const getUserId = (req: AuthenticatedRequest): number | null => {
  // Try JWT first (from middleware)
  if (req.user?.id) {
    return req.user.id;
  }
  // Fallback to session
  if (req.session?.userId) {
    return userId;
  }
  return null;
};

// Get all galaxies for authenticated user
export const getGalaxies = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const galaxies = await knex("galaxies")
      .select("*")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    console.log("📡 Fetched galaxies:", galaxies);
    res.json(galaxies);
  } catch (error) {
    console.error("❌ Error fetching galaxies:", error);
    res.status(500).json({ error: "Failed to fetch galaxies" });
  }
};

// Get galaxy by ID for authenticated user
export const getGalaxyById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { id } = req.params;
    const galaxy = await knex("galaxies")
      .select("*")
      .where({ id: parseInt(id), user_id: userId })
      .first();

    if (!galaxy) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    console.log("📡 Fetched galaxy:", galaxy);
    res.json(galaxy);
  } catch (error) {
    console.error("❌ Error fetching galaxy:", error);
    res.status(500).json({ error: "Failed to fetch galaxy" });
  }
};

// Generate galaxies using AI and assign notes
export const generateGalaxies = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    console.log(
      "🚀 Starting AI galaxy generation for user:",
      userId
    );

    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      res
        .status(400)
        .json({ error: "Notes array is required and must not be empty" });
      return;
    }

    console.log(`📝 Processing ${notes.length} notes for galaxy generation`);

    // First, clear all existing galaxies for this user and reset note assignments
    console.log("🧹 Clearing existing galaxies and note assignments...");

    // Reset all notes to have no galaxy assignment
    await knex("notes")
      .where({ user_id: userId })
      .update({ galaxy_id: null });

    // Delete all existing galaxies for this user
    const deletedGalaxies = await knex("galaxies")
      .where({ user_id: userId })
      .del();

    console.log(`🗑️ Deleted ${deletedGalaxies} existing galaxies`);

    // Call AI service to generate galaxies
    const aiResponse = await galaxyAi.generateGalaxiesWithAI(notes);

    if (!aiResponse || !Array.isArray(aiResponse)) {
      res
        .status(500)
        .json({ error: "Zylith failed to generate valid galaxy structure" });
      return;
    }

    console.log(`🤖 Zylith generated ${aiResponse.length} galaxies`);

    const results = [];
    const errors = [];

    // Process each galaxy from AI response
    for (const [galaxyIndex, galaxyData] of aiResponse.entries()) {
      try {
        const [galaxyName, galaxyNotes] = galaxyData;

        if (!galaxyName || !Array.isArray(galaxyNotes)) {
          console.warn(
            `⚠️ Invalid galaxy data at index ${galaxyIndex}:`,
            galaxyData
          );
          continue;
        }

        console.log(
          `🌌 Creating galaxy "${galaxyName}" with ${galaxyNotes.length} notes`
        );

        // Create the galaxy in database
        const [newGalaxy] = await knex("galaxies")
          .insert({
            user_id: userId,
            name: galaxyName,
            created_at: new Date(),
          })
          .returning("*");

        console.log(`✨ Created galaxy with ID: ${newGalaxy.id}`);

        // Update notes to assign them to this galaxy
        const noteIds = [];
        const noteTitles = [];
        console.log(
          `🔍 Processing ${galaxyNotes.length} notes for galaxy "${galaxyName}":`
        );

        for (const [noteTitle, noteContent] of galaxyNotes) {
          console.log(`  📝 Looking for note: "${noteTitle}"`);

          // Find the note by title only (content might have formatting differences)
          const [updatedNote] = await knex("notes")
            .where({
              user_id: userId,
              title: noteTitle,
            })
            .update({ galaxy_id: newGalaxy.id })
            .returning("*");

          if (updatedNote) {
            noteIds.push(updatedNote.id);
            noteTitles.push(noteTitle);
            console.log(
              `✅ Successfully assigned note "${noteTitle}" to galaxy "${galaxyName}"`
            );
          } else {
            console.warn(`❌ Could not find note: "${noteTitle}"`);

            // Let's see what notes exist for this user
            const existingNotes = await knex("notes")
              .select("title")
              .where({ user_id: userId });
            console.log(
              `📋 Available notes for user:`,
              existingNotes.map((n: any) => n.title)
            );
          }
        }

        results.push({
          galaxy: newGalaxy,
          assignedNotes: noteIds.length,
          noteTitles: noteTitles,
          galaxyName: galaxyName,
        });
      } catch (error) {
        console.error(`❌ Error processing galaxy ${galaxyIndex}:`, error);
        errors.push({
          galaxyIndex,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.log(
      `✅ Galaxy generation complete: ${results.length} galaxies created, ${errors.length} errors`
    );

    // Get summary of what was cleaned up
    const notesWithoutGalaxy = await knex("notes")
      .where({ user_id: userId, galaxy_id: null })
      .count("* as count")
      .first();

    res.status(200).json({
      success: true,
      galaxiesCreated: results.length,
      totalGalaxies: aiResponse.length,
      previousGalaxiesDeleted: deletedGalaxies,
      notesWithoutGalaxy: notesWithoutGalaxy?.count || 0,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Error in generateGalaxies:", error);
    res.status(500).json({
      error: "Failed to generate galaxies",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

// Create new galaxy for authenticated user (for manual creation)
export const createGalaxy = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Galaxy name is required" });
      return;
    }

    // Check subscription limits before creating galaxy
    const limitCheck = await SubscriptionLimitService.canCreateGalaxy(
      userId
    );

    if (!limitCheck.allowed) {
      const limitText =
        limitCheck.limit === -1 ? "unlimited" : limitCheck.limit;
      res.status(403).json({
        error: `Galaxy limit reached. You have ${limitCheck.current} galaxies and your plan allows ${limitText} galaxies. Please upgrade your subscription to create more galaxies.`,
        current: limitCheck.current,
        limit: limitCheck.limit,
        type: "galaxy_limit",
      });
      return;
    }

    const [newGalaxy] = await knex("galaxies")
      .insert({
        user_id: userId,
        name,
        created_at: new Date(),
      })
      .returning("*");

    console.log("✨ Created manual galaxy:", newGalaxy);
    res.status(201).json(newGalaxy);
  } catch (error) {
    console.error("❌ Error creating galaxy:", error);
    res.status(500).json({ error: "Failed to create galaxy" });
  }
};

// Update galaxy for authenticated user
export const updateGalaxy = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Galaxy name is required" });
      return;
    }

    const [updatedGalaxy] = await knex("galaxies")
      .where({ id: parseInt(id), user_id: userId })
      .update({ name })
      .returning("*");

    if (!updatedGalaxy) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    console.log("🔄 Updated galaxy:", updatedGalaxy);
    res.json(updatedGalaxy);
  } catch (error) {
    console.error("❌ Error updating galaxy:", error);
    res.status(500).json({ error: "Failed to update galaxy" });
  }
};

// Delete galaxy for authenticated user
export const deleteGalaxy = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { id } = req.params;

    // First, update all notes in this galaxy to have null galaxy_id
    await knex("notes")
      .where({ galaxy_id: parseInt(id), user_id: userId })
      .update({ galaxy_id: null });

    const deletedCount = await knex("galaxies")
      .where({ id: parseInt(id), user_id: userId })
      .del();

    if (deletedCount === 0) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    console.log("🗑️ Deleted galaxy:", id);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error deleting galaxy:", error);
    res.status(500).json({ error: "Failed to delete galaxy" });
  }
};

// Get notes within a specific galaxy
export const getGalaxyNotes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { id } = req.params;

    // First verify the galaxy belongs to the user
    const galaxy = await knex("galaxies")
      .select("*")
      .where({ id: parseInt(id), user_id: userId })
      .first();

    if (!galaxy) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    // Get notes in this galaxy
    const notes = await knex("notes")
      .select("*")
      .where({ galaxy_id: parseInt(id), user_id: userId })
      .orderBy("created_at", "desc");

    console.log(`📚 Fetched ${notes.length} notes for galaxy:`, galaxy.name);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching galaxy notes:", error);
    res.status(500).json({ error: "Failed to fetch galaxy notes" });
  }
};

// Assign note to galaxy
export const assignNoteToGalaxy = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { galaxyId, noteId } = req.body;

    // Verify galaxy belongs to user
    const galaxy = await knex("galaxies")
      .select("*")
      .where({ id: galaxyId, user_id: userId })
      .first();

    if (!galaxy) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    // Update note to assign it to the galaxy
    const [updatedNote] = await knex("notes")
      .where({ id: noteId, user_id: userId })
      .update({ galaxy_id: galaxyId })
      .returning("*");

    if (!updatedNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    console.log(`🔗 Assigned note ${noteId} to galaxy ${galaxyId}`);
    res.json(updatedNote);
  } catch (error) {
    console.error("❌ Error assigning note to galaxy:", error);
    res.status(500).json({ error: "Failed to assign note to galaxy" });
  }
};

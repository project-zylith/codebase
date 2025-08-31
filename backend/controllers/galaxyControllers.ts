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
    return req.session.userId;
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
    console.log("🚀 Starting AI galaxy generation for user:", userId);

    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      res
        .status(400)
        .json({ error: "Notes array is required and must not be empty" });
      return;
    }

    // Validate that all notes have valid title and content
    const invalidNotes = notes.filter(([title, content]) => !title || !content);
    if (invalidNotes.length > 0) {
      console.warn(
        `⚠️ Found ${invalidNotes.length} notes with null/empty title or content:`,
        invalidNotes
      );
      // Filter out invalid notes instead of failing
      const validNotes = notes.filter(([title, content]) => title && content);
      if (validNotes.length === 0) {
        res.status(400).json({
          error: "No valid notes found after filtering null/empty content",
        });
        return;
      }
      console.log(`✅ Proceeding with ${validNotes.length} valid notes`);
    }

    // Use validNotes if we filtered, otherwise use original notes
    const notesToProcess =
      invalidNotes.length > 0
        ? notes.filter(([title, content]) => title && content)
        : notes;

    // Additional security: Verify that all notes actually belong to the current user
    // This prevents users from trying to organize notes they don't own
    console.log(`🔒 Verifying note ownership for user ${userId}...`);
    const userNoteTitles = notesToProcess.map(([title]) => title);

    const actualUserNotes = await knex("notes")
      .select("id", "title", "content")
      .where({ user_id: userId })
      .whereIn("title", userNoteTitles);

    if (actualUserNotes.length !== notesToProcess.length) {
      const foundTitles = actualUserNotes.map((n) => n.title);
      const missingTitles = userNoteTitles.filter(
        (title) => !foundTitles.includes(title)
      );
      console.warn(
        `⚠️ Security warning: Some notes don't belong to user ${userId}:`,
        missingTitles
      );

      // Only process notes that actually belong to the user
      const verifiedNotes = notesToProcess.filter(([title]) =>
        actualUserNotes.some((n) => n.title === title)
      );

      if (verifiedNotes.length === 0) {
        res.status(403).json({
          error: "None of the provided notes belong to the current user",
          attemptedNotes: notesToProcess.length,
          verifiedNotes: verifiedNotes.length,
        });
        return;
      }

      console.log(
        `✅ Verified ${verifiedNotes.length} notes belong to user ${userId}`
      );
      notesToProcess = verifiedNotes;
    } else {
      console.log(
        `✅ All ${actualUserNotes.length} notes verified as belonging to user ${userId}`
      );
    }

    console.log(
      `📝 Processing ${notesToProcess.length} notes for galaxy generation`
    );

    // First, clear all existing galaxies for this user and reset note assignments
    console.log("🧹 Clearing existing galaxies and note assignments...");

    // Reset all notes to have no galaxy assignment
    await knex("notes").where({ user_id: userId }).update({ galaxy_id: null });

    // Delete all existing galaxies for this user
    const deletedGalaxies = await knex("galaxies")
      .where({ user_id: userId })
      .del();

    console.log(`🗑️ Deleted ${deletedGalaxies} existing galaxies`);

    // Call AI service to generate galaxies
    const aiResponse = await galaxyAi.generateGalaxiesWithAI(notesToProcess);

    if (!aiResponse || !Array.isArray(aiResponse)) {
      res
        .status(500)
        .json({ error: "Zylith failed to generate valid galaxy structure" });
      return;
    }

    console.log(`🤖 Zylith generated ${aiResponse.length} galaxies`);

    // Validate that all note titles in the AI response actually exist in the user's notes
    const allAiNoteTitles = aiResponse.flatMap(([galaxyName, galaxyNotes]) =>
      galaxyNotes.map(([title]) => title)
    );

    const uniqueAiNoteTitles = [...new Set(allAiNoteTitles)];
    console.log(
      `🔍 AI response contains ${uniqueAiNoteTitles.length} unique note titles:`,
      uniqueAiNoteTitles
    );

    // Check if any AI note titles don't exist in the user's actual notes
    const missingTitles = uniqueAiNoteTitles.filter(
      (title) =>
        !notesToProcess.some(([userNoteTitle]) => userNoteTitle === title)
    );

    if (missingTitles.length > 0) {
      console.warn(
        `⚠️ AI response contains note titles not in user's notes:`,
        missingTitles
      );
      console.warn(`   This might cause note assignment failures`);
    }

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
        console.log(
          `   📝 Notes to be assigned:`,
          galaxyNotes.map(([title]) => title)
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

          // Additional safety check: verify this note title exists in the user's notes
          const noteExists = notesToProcess.some(
            ([userNoteTitle]) => userNoteTitle === noteTitle
          );
          if (!noteExists) {
            console.warn(
              `⚠️ Note title "${noteTitle}" from AI response not found in user's notes - skipping`
            );
            continue;
          }

          // Find the note by title AND ensure it belongs to the current user
          // Also check that it's not already assigned to another galaxy
          const [updatedNote] = await knex("notes")
            .where({
              user_id: userId,
              title: noteTitle,
              galaxy_id: null, // Only assign notes that aren't already in a galaxy
            })
            .update({ galaxy_id: newGalaxy.id })
            .returning("*");

          if (updatedNote) {
            noteIds.push(updatedNote.id);
            noteTitles.push(noteTitle);
            console.log(
              `✅ Successfully assigned note "${noteTitle}" (ID: ${updatedNote.id}) to galaxy "${galaxyName}"`
            );
          } else {
            console.warn(
              `❌ Could not find unassigned note: "${noteTitle}" for user ${userId}`
            );

            // Let's see what notes exist for this user that aren't assigned to galaxies
            const availableNotes = await knex("notes")
              .select("id", "title", "galaxy_id")
              .where({ user_id: userId, galaxy_id: null });
            console.log(
              `📋 Available unassigned notes for user ${userId}:`,
              availableNotes.map((n: any) => ({
                id: n.id,
                title: n.title,
                galaxy_id: n.galaxy_id,
              }))
            );

            // Also check if the note exists but is already assigned
            const existingNote = await knex("notes")
              .select("id", "title", "galaxy_id")
              .where({ user_id: userId, title: noteTitle })
              .first();
            if (existingNote) {
              console.warn(
                `⚠️ Note "${noteTitle}" exists but is already assigned to galaxy ${existingNote.galaxy_id}`
              );
            }
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

    // Additional summary logging for debugging
    console.log(`📊 Final Summary for User ${userId}:`);
    console.log(`   - Total galaxies created: ${results.length}`);
    console.log(
      `   - Total notes assigned: ${results.reduce(
        (sum, r) => sum + r.assignedNotes,
        0
      )}`
    );
    console.log(
      `   - Notes remaining unassigned: ${notesWithoutGalaxy?.count || 0}`
    );
    console.log(`   - Errors encountered: ${errors.length}`);

    if (errors.length > 0) {
      console.log(`   - Error details:`, errors);
    }

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
    const limitCheck = await SubscriptionLimitService.canCreateGalaxy(userId);

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

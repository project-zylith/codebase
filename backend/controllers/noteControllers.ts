import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/checkAuthentication";
import { NoteService } from "../src/services/noteService";
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

export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 getNotes controller hit!");
  console.log("🔍 Session data:", req.session);
  console.log("👤 User ID from session:", req.session?.userId);

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  try {
    const notes = await NoteService.getNotesByUserId(userId);
    console.log(
      "📝 Notes found for user",
      userId,
      ":",
      notes.length
    );
    console.log(
      "📝 Notes data:",
      notes.map((n) => ({
        id: n.id,
        user_id: n.user_id,
        title: n.title,
        content: n.content ? n.content.substring(0, 50) + "..." : "No content",
      }))
    );
    res.send(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).send({ message: "Failed to fetch notes." });
  }
};

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 createNote controller hit!");
  console.log("📨 Request body:", req.body);

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const { title, content, galaxy_id } = req.body;

  if (!title) {
    return res.status(400).send({ message: "Note title is required." });
  }

  try {
    // Check subscription limits before creating note
    const limitCheck = await SubscriptionLimitService.canCreateNote(
      userId
    );

    if (!limitCheck.allowed) {
      const limitText =
        limitCheck.limit === -1 ? "unlimited" : limitCheck.limit;
      return res.status(403).send({
        message: `Note limit reached. You have ${limitCheck.current} notes and your plan allows ${limitText} notes. Please upgrade your subscription to create more notes.`,
        current: limitCheck.current,
        limit: limitCheck.limit,
        type: "note_limit",
      });
    }

    const note = await NoteService.createNote({
      user_id: userId,
      title,
      content: content || null,
      galaxy_id: galaxy_id || null,
    });

    console.log("✅ Note created successfully:", note);
    res.status(201).send(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).send({ message: "Failed to create note." });
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 updateNote controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const noteId = parseInt(req.params.id);
  const { title, content, galaxy_id } = req.body;

  if (!noteId) {
    return res.status(400).send({ message: "Note ID is required." });
  }

  try {
    // Verify note belongs to user
    const existingNote = await NoteService.getNoteById(noteId);
    if (!existingNote || existingNote.user_id !== userId) {
      return res.status(404).send({ message: "Note not found." });
    }

    const updatedNote = await NoteService.updateNote(noteId, {
      title,
      content,
      galaxy_id,
    });

    if (!updatedNote) {
      return res.status(404).send({ message: "Note not found." });
    }

    console.log("✅ Note updated successfully:", updatedNote);
    res.send(updatedNote);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).send({ message: "Failed to update note." });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 deleteNote controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const noteId = parseInt(req.params.id);

  if (!noteId) {
    return res.status(400).send({ message: "Note ID is required." });
  }

  try {
    // Verify note belongs to user
    const existingNote = await NoteService.getNoteById(noteId);
    if (!existingNote || existingNote.user_id !== userId) {
      return res.status(404).send({ message: "Note not found." });
    }

    const deleted = await NoteService.deleteNote(noteId);

    if (!deleted) {
      return res.status(404).send({ message: "Note not found." });
    }

    console.log("✅ Note deleted successfully:", noteId);
    res.send({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).send({ message: "Failed to delete note." });
  }
};

export const getNoteById = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 getNoteById controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const noteId = parseInt(req.params.id);

  if (!noteId) {
    return res.status(400).send({ message: "Note ID is required." });
  }

  try {
    const note = await NoteService.getNoteById(noteId);

    if (!note || note.user_id !== userId) {
      return res.status(404).send({ message: "Note not found." });
    }

    console.log("✅ Note found:", note);
    res.send(note);
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).send({ message: "Failed to fetch note." });
  }
};

import { db } from "../database";
import { Note, CreateNoteRequest, UpdateNoteRequest } from "../types/note";

export class NoteService {
  static async getAllNotes(): Promise<Note[]> {
    return db("notes").select("*").orderBy("created_at", "desc");
  }

  static async getNotesByUserId(userId: number): Promise<Note[]> {
    return db("notes")
      .select("*")
      .where("user_id", userId)
      .orderBy("created_at", "desc");
  }

  static async getNoteById(id: number): Promise<Note | null> {
    const notes = await db("notes").select("*").where("id", id).limit(1);
    return notes.length > 0 ? notes[0] : null;
  }

  static async createNote(noteData: CreateNoteRequest): Promise<Note> {
    const noteToInsert = {
      ...noteData,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [note] = await db("notes").insert(noteToInsert).returning("*");
    return note;
  }

  static async updateNote(
    id: number,
    noteData: UpdateNoteRequest
  ): Promise<Note | null> {
    const noteToUpdate = {
      ...noteData,
      updated_at: db.fn.now(),
    };

    const [updatedNote] = await db("notes")
      .where("id", id)
      .update(noteToUpdate)
      .returning("*");

    return updatedNote || null;
  }

  static async deleteNote(id: number): Promise<boolean> {
    const deletedRows = await db("notes").where("id", id).del();
    return deletedRows > 0;
  }

  static async getNotesByGalaxyId(galaxyId: number): Promise<Note[]> {
    return db("notes")
      .select("*")
      .where("galaxy_id", galaxyId)
      .orderBy("created_at", "desc");
  }
}

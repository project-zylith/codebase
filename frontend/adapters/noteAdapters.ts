import { API_ENDPOINTS } from "../utils/apiConfig";

// Note interface matching the backend
export interface Note {
  id: number;
  user_id: number;
  galaxy_id?: number | null;
  title: string;
  content?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateNoteRequest {
  title: string;
  content?: string | null;
  galaxy_id?: number | null;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string | null;
  galaxy_id?: number | null;
}

export const getNotes = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.LIST}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });
  } catch (error) {
    console.error("Get notes error:", error);
    throw error;
  }
};

export const createNote = async (noteData: CreateNoteRequest) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.CREATE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
      body: JSON.stringify(noteData),
    });
  } catch (error) {
    console.error("Create note error:", error);
    throw error;
  }
};

export const getNoteById = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.GET_BY_ID(id)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });
  } catch (error) {
    console.error("Get note by ID error:", error);
    throw error;
  }
};

export const updateNote = async (id: number, noteData: UpdateNoteRequest) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.UPDATE(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
      body: JSON.stringify(noteData),
    });
  } catch (error) {
    console.error("Update note error:", error);
    throw error;
  }
};

export const deleteNote = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.DELETE(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });
  } catch (error) {
    console.error("Delete note error:", error);
    throw error;
  }
};

import { API_ENDPOINTS } from "../utils/apiConfig";
import { getToken } from "./userAdapters";

export interface Galaxy {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  galaxy_id: number | null;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

// Get authorization headers with JWT token
const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all galaxies for authenticated user
export const getGalaxies = async () => {
  return await fetch(API_ENDPOINTS.GALAXIES.LIST, {
    method: "GET",
    headers: await getAuthHeaders(),
  });
};

// Get galaxy by ID
export const getGalaxyById = async (id: number) => {
  return await fetch(API_ENDPOINTS.GALAXIES.GET_BY_ID(id), {
    method: "GET",
    headers: await getAuthHeaders(),
  });
};

// Create new galaxy
export const createGalaxy = async (data: { name: string }) => {
  return await fetch(API_ENDPOINTS.GALAXIES.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

// Update galaxy
export const updateGalaxy = async (id: number, data: { name: string }) => {
  return await fetch(API_ENDPOINTS.GALAXIES.UPDATE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

// Delete galaxy
export const deleteGalaxy = async (id: number) => {
  return await fetch(API_ENDPOINTS.GALAXIES.DELETE(id), {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
};

// Get notes within a specific galaxy
export const getGalaxyNotes = async (id: number) => {
  return await fetch(API_ENDPOINTS.GALAXIES.GET_NOTES(id), {
    method: "GET",
    headers: await getAuthHeaders(),
  });
};

// Assign note to galaxy
export const assignNoteToGalaxy = async (data: {
  galaxyId: number;
  noteId: number;
}) => {
  return await fetch(API_ENDPOINTS.GALAXIES.ASSIGN_NOTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

// Generate galaxies using AI
export const generateGalaxies = async (notes: Note[]): Promise<any> => {
  try {
    console.log("🚀 Calling generateGalaxies with", notes.length, "notes");

    const response = await fetch(API_ENDPOINTS.GALAXIES.GENERATE_GALAXIES, {
      method: "POST",
          headers: await getAuthHeaders(),
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        notes: notes.map((note) => [note.title, note.content]),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403 && errorData.type === "galaxy_limit") {
        throw new Error(`GALAXY_LIMIT: ${errorData.error}`);
      }
      throw new Error(errorData.error || "Failed to generate galaxies");
    }

    const data = await response.json();
    console.log("✅ Generate galaxies response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error in generateGalaxies:", error);
    throw error;
  }
};

// AI-powered galaxy re-sorting
export const reSortGalaxy = async (notes: Array<[string, string]>) => {
  return await fetch(API_ENDPOINTS.GALAXIES.RESORT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers: await getAuthHeaders(),
    body: JSON.stringify({ notes }),
  });
};

// AI-powered galaxy insight generation
export const generateGalaxyInsight = async (notes: Array<[string, string]>) => {
  return await fetch(API_ENDPOINTS.GALAXIES.GENERATE_INSIGHT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers: await getAuthHeaders(),
    body: JSON.stringify({ notes }),
  });
};

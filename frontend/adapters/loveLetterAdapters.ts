import { API_ENDPOINTS } from "../utils/apiConfig";
import { getAuthHeaders } from "./userAdapters";

export interface LoveLetter {
  id: number;
  user_id: number;
  recipient: string;
  written_date: string;
  occasion: string;
  content: string;
  is_encrypted: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateLoveLetterRequest {
  recipient: string;
  written_date: string;
  occasion: string;
  content: string;
  is_encrypted?: boolean;
}

export interface UpdateLoveLetterRequest {
  recipient?: string;
  written_date?: string;
  occasion?: string;
  content?: string;
  is_encrypted?: boolean;
}

export const createLoveLetter = async (data: CreateLoveLetterRequest) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.LOVE_LETTERS.CREATE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create love letter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating love letter:", error);
    throw error;
  }
};

export const getLoveLetters = async (): Promise<LoveLetter[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.LOVE_LETTERS.GET_ALL}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch love letters");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching love letters:", error);
    throw error;
  }
};

export const getLoveLetterById = async (id: number): Promise<LoveLetter> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_ENDPOINTS.LOVE_LETTERS.GET_BY_ID(id)}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch love letter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching love letter:", error);
    throw error;
  }
};

export const updateLoveLetter = async (
  id: number,
  data: UpdateLoveLetterRequest
): Promise<LoveLetter> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.LOVE_LETTERS.UPDATE(id)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update love letter");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating love letter:", error);
    throw error;
  }
};

export const deleteLoveLetter = async (id: number): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.LOVE_LETTERS.DELETE(id)}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete love letter");
    }
  } catch (error) {
    console.error("Error deleting love letter:", error);
    throw error;
  }
};

export const getOccasions = async (): Promise<string[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_ENDPOINTS.LOVE_LETTERS.GET_OCCASIONS}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch occasions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching occasions:", error);
    throw error;
  }
};

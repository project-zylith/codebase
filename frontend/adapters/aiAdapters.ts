import { API_ENDPOINTS } from "../utils/apiConfig";
import { getToken } from "./userAdapters";

// Get authorization headers with JWT token
const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const insights = async (goal: string) => {
  return await fetch(API_ENDPOINTS.AI.INSIGHTS, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ goal: goal }),
  });
};

export const finalInsight = async (goals: string[]) => {
  return await fetch(API_ENDPOINTS.AI.FINAL_INSIGHT, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ goals: goals }),
  });
};

export const generateNoteInsight = async (
  note: any,
  galaxy?: any,
  relatedNotes?: any[],
  userId?: number
) => {
  return await fetch(API_ENDPOINTS.AI.NOTE_INSIGHT, {
    method: "POST",
    headers: await getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      note,
      galaxy,
      relatedNotes,
      userId,
    }),
  });
};

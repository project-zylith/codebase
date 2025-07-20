import { API_ENDPOINTS } from "../utils/apiConfig";

export const insights = async (goal: string) => {
  return await fetch(API_ENDPOINTS.AI.INSIGHTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal: goal }),
  });
};

export const finalInsight = async (goals: string[]) => {
  return await fetch(API_ENDPOINTS.AI.FINAL_INSIGHT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goals: goals }),
  });
};

export const generateNoteInsight = async (
  note: any,
  galaxy?: any,
  relatedNotes?: any[]
) => {
  return await fetch(API_ENDPOINTS.AI.NOTE_INSIGHT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      note,
      galaxy,
      relatedNotes,
    }),
  });
};

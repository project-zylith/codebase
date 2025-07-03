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

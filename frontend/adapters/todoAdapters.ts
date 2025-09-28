import { API_ENDPOINTS } from "../utils/apiConfig";
import { getAuthHeaders } from "./userAdapters";

// Task interface matching the backend
export interface Task {
  id: number;
  user_id: number;
  content: string;
  goal?: string | null;
  is_completed: boolean;
  is_ai_generated: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateTaskRequest {
  content: string;
  goal?: string | null;
  is_completed?: boolean;
  is_ai_generated?: boolean;
  is_favorite?: boolean;
}

export interface UpdateTaskRequest {
  content?: string;
  goal?: string | null;
  is_completed?: boolean;
  is_ai_generated?: boolean;
  is_favorite?: boolean;
}

export const getTasks = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.LIST}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
};

export const createTask = async (taskData: CreateTaskRequest) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.CREATE}`, {
      method: "POST",
      headers: await getAuthHeaders(),

      body: JSON.stringify(taskData),
    });
  } catch (error) {
    console.error("Create task error:", error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: UpdateTaskRequest) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.UPDATE(id)}`, {
      method: "PUT",
      headers: await getAuthHeaders(),

      body: JSON.stringify(taskData),
    });
  } catch (error) {
    console.error("Update task error:", error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.DELETE(id)}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Delete task error:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.TOGGLE(id)}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Toggle task error:", error);
    throw error;
  }
};

export const toggleTaskFavorite = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.TOGGLE_FAVORITE(id)}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Toggle task favorite error:", error);
    throw error;
  }
};

export const cleanupCompletedTasks = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.CLEANUP}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Cleanup completed tasks error:", error);
    throw error;
  }
};

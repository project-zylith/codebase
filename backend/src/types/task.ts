export interface Task {
  id: number;
  user_id: number;
  content: string;
  is_completed: boolean;
  is_ai_generated: boolean;
  is_favorite: boolean;
  created_at: Date;
  updated_at?: Date | null;
}

export interface CreateTaskRequest {
  user_id: number;
  content: string;
  is_completed?: boolean;
  is_ai_generated?: boolean;
  is_favorite?: boolean;
}

export interface UpdateTaskRequest {
  content?: string;
  is_completed?: boolean;
  is_ai_generated?: boolean;
  is_favorite?: boolean;
}

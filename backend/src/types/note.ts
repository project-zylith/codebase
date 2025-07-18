// Define the Note interface matching the database schema
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
  user_id: number;
  galaxy_id?: number | null;
  title: string;
  content?: string | null;
}

export interface UpdateNoteRequest {
  galaxy_id?: number | null;
  title?: string;
  content?: string | null;
}

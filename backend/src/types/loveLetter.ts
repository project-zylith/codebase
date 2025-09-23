// Define the LoveLetter interface matching the database schema
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

export interface User {
  id: number;
  username: string;
  password_hash?: string | null;
  email: string;
  google_id?: string | null;
  created_at: Date;
  updated_at?: Date | null;
}

export interface CreateUserRequest {
  username: string;
  password_hash?: string | null;
  email: string;
  google_id?: string | null;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password_hash?: string | null;
  google_id?: string | null;
}

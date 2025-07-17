export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  created_at: Date;
  updated_at?: Date | null;
}

export interface CreateUserRequest {
  username: string;
  password_hash: string;
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password_hash?: string;
}

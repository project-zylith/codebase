export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

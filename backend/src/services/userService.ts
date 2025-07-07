import { db } from "../database";
import { User, CreateUserRequest, UpdateUserRequest } from "../types/user";
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

export class UserService {
  // need to define User type and methods inside of the user type file
  static async getAllUsers(): Promise<User[]> {
    return db("users").select("*").orderBy("id");
  }

  static async getUserById(id: number): Promise<User | null> {
    const user = await db("users").select("*").where({ id }).limit(1);
    return user.length > 0 ? user[0] : null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const user = await db("users").select("*").where({ email }).limit(1);
    return user.length > 0 ? user[0] : null;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const user = await db("users").select("*").where({ username }).limit(1);
    return user.length > 0 ? user[0] : null;
  }

  static async getUserByGoogleId(google_id: string): Promise<User | null> {
    const user = await db("users").select("*").where({ google_id }).limit(1);
    return user.length > 0 ? user[0] : null;
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const [user] = await db("users").insert(userData).returning("*");
    return user;
  }

  static async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<User | null> {
    const [user] = await db("users")
      .where({ id })
      .update({ ...userData, updated_at: db.fn.now() })
      .returning("*");

    return user || null;
  }

  static async create(email: string, username: string, password: string) {
    // Validate username length requirement
    if (username.length < 6) {
      return {
        success: false,
        message: "Username must be at least 6 characters long. ",
      };
    }

    try {
      // Check if username already exists
      const existingUsername = await this.getUserByUsername(username);
      if (existingUsername) {
        return {
          success: false,
          message: "Username already exists. Please choose another one",
        };
      }

      // Check if email already exists
      const existingEmail = await this.getUserByEmail(email);
      if (existingEmail) {
        return {
          success: false,
          message: "Email already exists. Please use another email",
        };
      }

      // hash the plain-text password using bcrypt before storing it in the database
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const [user] = await db("users")
        .insert({
          username,
          email,
          password_hash,
          google_id: null,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        })
        .returning("*");

      return {
        success: true,
        user: user,
      };
    } catch (error: any) {
      // unique constraint violation
      if (error.code === "23505") {
        return {
          success: false,
          message:
            "Username or email already exists. Please choose another one",
        };
      }

      // Other DB or system errors
      return {
        success: false,
        message: "An unexpected error occurred.",
        detail: error.message,
      };
    }
  }

  static async createGoogleUser(
    email: string,
    username: string,
    google_id: string
  ) {
    try {
      // Check if google_id already exists
      const existingGoogleUser = await this.getUserByGoogleId(google_id);
      if (existingGoogleUser) {
        return {
          success: true,
          user: existingGoogleUser,
        };
      }

      const [user] = await db("users")
        .insert({
          username,
          email,
          password_hash: null, // Google OAuth users don't have passwords
          google_id,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        })
        .returning("*");

      return {
        success: true,
        user: user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "An unexpected error occurred during Google user creation.",
        detail: error.message,
      };
    }
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password_hash) {
      return false; // Google OAuth users don't have passwords
    }
    return bcrypt.compare(password, user.password_hash);
  }

  static async updatePassword(
    id: number,
    newPassword: string
  ): Promise<boolean> {
    try {
      const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      const result = await db("users").where({ id }).update({
        password_hash,
        updated_at: db.fn.now(),
      });
      return result > 0;
    } catch (error) {
      return false;
    }
  }
}

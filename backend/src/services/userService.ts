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
      // hash the plain-text password using bcrypt before storing it in the database
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const query = `INSERT INTO users (username, password, email)
      VALUES (?, ?, ?) RETURNING *;`;
      const result = await db.raw(query, [email, username, passwordHash]);

      const rawUserData = result.rows[0];
      return {
        success: true,
        user: rawUserData,
      };
    } catch (error: any) {
      // unique constrain violation
      if (error.code === "23505") {
        return {
          success: false,
          message: "Username already exists. Please choose another one",
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
}

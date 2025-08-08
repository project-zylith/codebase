import { Request, Response } from "express";
import { UserService } from "../src/services/userService";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// JWT utility functions
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "24h",
  });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};

export const registerUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 registerUser controller hit!");
  console.log("📨 Request body:", req.body);

  if (!req.body) {
    console.log("❌ No request body found");
    return res
      .status(400)
      .send({ message: "Username, password, and email required" });
  }

  console.log("Register Body:", req.body);

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.log("❌ Missing required fields");
    return res.status(400).send({ message: "All fields are required" });
  }

  console.log("✅ All fields present, calling UserService.create");
  const result = await UserService.create(username, email, password);

  if (!result || result.success === false) {
    console.log("❌ UserService.create failed:", result);
    return res.status(400).send({
      message: result?.message || "Registration failed.",
      ...(result?.detail && { detail: result.detail }),
    });
  }

  console.log("✅ User created successfully:", result.user);

  // Generate JWT token
  const token = generateToken(result.user.id);

  res.status(201).send({
    id: result.user.id,
    username: result.user.username,
    email: result.user.email,
    token: token,
  });
};

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 loginUser controller hit!");
  console.log("📨 Request body:", req.body);

  // Request needs a body
  if (!req.body) {
    return res.status(400).send({ message: "Username and password required" });
  }

  // Body needs a username and password
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Username and password required" });
  }

  try {
    // Find user by username
    const users = await UserService.getAllUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    console.log("👤 Found user:", { id: user.id, username: user.username });

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = generateToken(user.id);
    console.log("✅ User logged in successfully with ID:", user.id);

    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

export const showMe = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 showMe controller hit!");

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log("🔍 Authorization header:", authHeader);
  console.log("🔑 Token:", token ? "Present" : "Missing");

  if (!token) {
    console.log("❌ No token provided, user not authenticated");
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // Verify JWT token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    console.log("❌ Invalid token, user not authenticated");
    return res.status(401).send({ message: "Invalid token." });
  }

  console.log("👤 User ID from token:", decoded.userId);

  // Get user info
  const user = await UserService.getUserById(decoded.userId);
  if (!user) {
    console.log("❌ User not found in database for ID:", decoded.userId);
    return res.status(404).send({ message: "User not found." });
  }

  console.log("✅ User found and authenticated:", {
    id: user.id,
    username: user.username,
  });
  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

export const logoutUser = (req: AuthenticatedRequest, res: Response) => {
  // For JWT, logout is handled client-side by removing the token
  // Server just confirms the logout
  console.log("🎯 logoutUser controller hit!");
  res.status(200).send({ message: "User logged out successfully." });
};

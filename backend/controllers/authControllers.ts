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

// Update user email
export const updateUserEmail = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 updateUserEmail controller hit!");

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // Verify JWT token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(401).send({ message: "Invalid token." });
  }

  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).send({ message: "Valid email is required." });
  }

  try {
    // Check if email is already taken by another user
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser && existingUser.id !== decoded.userId) {
      return res.status(400).send({ message: "Email already in use." });
    }

    // Update user email
    const updatedUser = await UserService.updateUser(decoded.userId, { email });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res.send({
      message: "Email updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

// Update user password
export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 updateUserPassword controller hit!");

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // Verify JWT token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(401).send({ message: "Invalid token." });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .send({ message: "Current and new password are required." });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .send({ message: "New password must be at least 6 characters long." });
  }

  try {
    // Get user to verify current password
    const user = await UserService.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Verify current password
    const isCurrentPasswordValid = await UserService.verifyPassword(
      user,
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res
        .status(401)
        .send({ message: "Current password is incorrect." });
    }

    // Update password
    const success = await UserService.updatePassword(
      decoded.userId,
      newPassword
    );
    if (!success) {
      return res.status(500).send({ message: "Failed to update password." });
    }

    res.send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

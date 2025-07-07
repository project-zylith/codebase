import { Request, Response } from "express";
import { UserService } from "../src/services/userService";
const bcrypt = require("bcryptjs");

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
}

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
  req.session!.userId = result.user.id;
  res.status(201).send({
    id: result.user.id,
    username: result.user.username,
  });
};

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    // Add the user id to the session and send the user data back
    req.session!.userId = user.id;
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};

export const showMe = async (req: AuthenticatedRequest, res: Response) => {
  // no session with an id => Not authenticated.
  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  // session with an id => here's your user info!
  const user = await UserService.getUserById(req.session.userId);
  if (!user) {
    return res.status(404).send({ message: "User not found." });
  }

  res.send({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

export const logoutUser = (req: AuthenticatedRequest, res: Response) => {
  req.session = undefined; // "erase" the session
  res.status(204).send({ message: "User logged out." });
};

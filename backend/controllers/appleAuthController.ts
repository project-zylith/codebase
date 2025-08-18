import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import { db } from "../src/database";

interface AppleAuthRequest {
  identityToken: string;
  authorizationCode: string;
  user: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

interface AppleUser {
  id: number;
  username: string;
  email?: string;
  token: string;
}

export const appleSignIn = async (req: Request, res: Response) => {
  try {
    const {
      identityToken,
      authorizationCode,
      user: appleUserId,
      email,
      fullName,
    }: AppleAuthRequest = req.body;

    console.log("🍎 Apple Sign In request received:", { appleUserId, email });

    // Validate required fields
    if (!identityToken || !authorizationCode || !appleUserId) {
      return res.status(400).json({
        success: false,
        error: "Missing required Apple authentication data",
      });
    }

    // TODO: Validate Apple identity token with Apple's servers
    // For now, we'll trust the data from the client
    // In production, you should validate the identityToken with Apple

    // Check if user already exists with this Apple ID
    let existingUser = await db("users")
      .where("apple_user_id", appleUserId)
      .first();

    if (existingUser) {
      console.log("✅ Existing Apple user found:", existingUser.username);

      // Generate JWT token for existing user
      const token = jwt.sign(
        { userId: existingUser.id, username: existingUser.username },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          token,
        },
      });
    }

    // Create new user
    console.log("🆕 Creating new Apple user...");

    // Generate username if not provided
    let username = email?.split("@")[0] || `user_${Date.now()}`;

    // Ensure username is unique
    let counter = 1;
    let originalUsername = username;
    while (await db("users").where("username", username).first()) {
      username = `${originalUsername}_${counter}`;
      counter++;
    }

    // Create user record
    const [newUser] = await db("users")
      .insert({
        username,
        email: email || null,
        password_hash: await bcrypt.hash(appleUserId, 10), // Use Apple ID as password hash
        apple_user_id: appleUserId,
        apple_given_name: fullName?.givenName || null,
        apple_family_name: fullName?.familyName || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(["id", "username", "email"]);

    console.log("✅ New Apple user created:", newUser.username);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.error("❌ Apple Sign In error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during Apple Sign In",
    });
  }
};

export const validateAppleToken = async (req: Request, res: Response) => {
  try {
    const { identityToken } = req.body;

    if (!identityToken) {
      return res.status(400).json({
        success: false,
        error: "Missing identity token",
      });
    }

    // TODO: Implement actual Apple token validation
    // This would involve calling Apple's validation endpoint
    // For now, we'll return a placeholder response

    res.json({
      success: true,
      message: "Apple token validation endpoint ready for implementation",
    });
  } catch (error) {
    console.error("❌ Apple token validation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during token validation",
    });
  }
};

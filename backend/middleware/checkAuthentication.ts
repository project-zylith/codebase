const express = require("express");
const jwt = require("jsonwebtoken");
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// JWT verification utility
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};

// Is the user logged in?
// Not specific user, just ANY user
export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // First try JWT token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.userId) {
      req.user = { id: decoded.userId, username: "", email: "" }; // Minimal user info
      return next();
    }
  }

  // Fallback to session-based auth for backwards compatibility
  const userId = req.session?.userId;
  if (userId) {
    return next();
  }

  return res.status(401).send({ message: "Authentication required" });
};

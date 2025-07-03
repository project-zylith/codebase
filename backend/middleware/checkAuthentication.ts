const express = require("express");
import type { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
}

// Is the user logged in?
// Not specific user, just ANY user
export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session?.userId;
  if (!userId) return res.sendStatus(401);
  return next();
};

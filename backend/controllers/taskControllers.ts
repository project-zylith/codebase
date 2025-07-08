import { Request, Response } from "express";
import { TaskService } from "../src/services/taskService";

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
}

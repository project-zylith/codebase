import { Request, Response } from "express";
import { TaskService } from "../src/services/taskService";
import { SubscriptionLimitService } from "../src/services/subscriptionLimitService";

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

// Helper function to get user ID from JWT or session
const getUserId = (req: AuthenticatedRequest): number | null => {
  // Try JWT first (from middleware)
  if (req.user?.id) {
    return req.user.id;
  }
  // Fallback to session
  if (req.session?.userId) {
    return userId;
  }
  return null;
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 getTasks controller hit!");
  console.log("🔍 Session data:", req.session);
  console.log("🔑 JWT user data:", req.user);
  
  const userId = getUserId(req);
  console.log("👤 User ID (JWT or session):", userId);

  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  try {
    const tasks = await TaskService.getTasksByUserId(userId);
    console.log(
      "📋 Tasks found for user",
      userId,
      ":",
      tasks.length
    );
    console.log(
      "📋 Tasks data:",
      tasks.map((t) => ({
        id: t.id,
        user_id: t.user_id,
        content: t.content.substring(0, 50) + "...",
      }))
    );
    res.send(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).send({ message: "Failed to fetch tasks." });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 createTask controller hit!");
  console.log("📨 Request body:", req.body);

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const { content, goal, is_completed, is_ai_generated, is_favorite } =
    req.body;

  if (!content) {
    return res.status(400).send({ message: "Task content is required." });
  }

  try {
    // Check subscription limits before creating task
    const limitCheck = await SubscriptionLimitService.canCreateTask(
      userId
    );

    if (!limitCheck.allowed) {
      const limitText =
        limitCheck.limit === -1 ? "unlimited" : limitCheck.limit;
      return res.status(403).send({
        message: `Task limit reached. You have ${limitCheck.current} tasks and your plan allows ${limitText} tasks. Please upgrade your subscription to create more tasks.`,
        current: limitCheck.current,
        limit: limitCheck.limit,
        type: "task_limit",
      });
    }

    const task = await TaskService.createTask({
      user_id: userId,
      content,
      goal,
      is_completed: is_completed || false,
      is_ai_generated: is_ai_generated || false,
      is_favorite: is_favorite || false,
    });

    console.log("✅ Task created successfully:", task);
    res.status(201).send(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).send({ message: "Failed to create task." });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 updateTask controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);
  const { content, goal, is_completed, is_ai_generated, is_favorite } =
    req.body;

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== userId) {
      return res.status(404).send({ message: "Task not found." });
    }

    const updatedTask = await TaskService.updateTask(taskId, {
      content,
      goal,
      is_completed,
      is_ai_generated,
      is_favorite,
    });

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found." });
    }

    console.log("✅ Task updated successfully:", updatedTask);
    res.send(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).send({ message: "Failed to update task." });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 deleteTask controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== userId) {
      return res.status(404).send({ message: "Task not found." });
    }

    const deleted = await TaskService.deleteTask(taskId);

    if (!deleted) {
      return res.status(404).send({ message: "Task not found." });
    }

    console.log("✅ Task deleted successfully");
    res.status(204).send();
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).send({ message: "Failed to delete task." });
  }
};

export const toggleTaskCompletion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 toggleTaskCompletion controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== userId) {
      return res.status(404).send({ message: "Task not found." });
    }

    const updatedTask = await TaskService.toggleTaskCompletion(taskId);

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found." });
    }

    console.log("✅ Task completion toggled successfully:", updatedTask);
    res.send(updatedTask);
  } catch (error) {
    console.error("Toggle task completion error:", error);
    res.status(500).send({ message: "Failed to toggle task completion." });
  }
};

export const toggleTaskFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 toggleTaskFavorite controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== userId) {
      return res.status(404).send({ message: "Task not found." });
    }

    const updatedTask = await TaskService.toggleTaskFavorite(taskId);

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found." });
    }

    console.log("✅ Task favorite toggled successfully:", updatedTask);
    res.send(updatedTask);
  } catch (error) {
    console.error("Toggle task favorite error:", error);
    res.status(500).send({ message: "Failed to toggle task favorite." });
  }
};

export const cleanupCompletedTasks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  console.log("🎯 cleanupCompletedTasks controller hit!");

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  try {
    const { SchedulerService } = await import("../src/scheduler");
    const deletedCount = await SchedulerService.cleanupUserTasks(
      userId
    );

    console.log(
      `✅ Manual cleanup completed for user ${userId}: ${deletedCount} tasks deleted`
    );
    res.send({
      message: "Cleanup completed successfully",
      deletedCount,
      userId: userId,
    });
  } catch (error) {
    console.error("Manual cleanup error:", error);
    res.status(500).send({ message: "Failed to cleanup completed tasks." });
  }
};

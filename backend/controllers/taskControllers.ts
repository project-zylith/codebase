import { Request, Response } from "express";
import { TaskService } from "../src/services/taskService";

interface AuthenticatedRequest extends Request {
  session?: {
    userId?: number;
  };
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 getTasks controller hit!");
  console.log("🔍 Session data:", req.session);
  console.log("👤 User ID from session:", req.session?.userId);

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  try {
    const tasks = await TaskService.getTasksByUserId(req.session.userId);
    console.log(
      "📋 Tasks found for user",
      req.session.userId,
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

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const { content, is_completed, is_ai_generated, is_favorite } = req.body;

  if (!content) {
    return res.status(400).send({ message: "Task content is required." });
  }

  try {
    const task = await TaskService.createTask({
      user_id: req.session.userId,
      content,
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

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);
  const { content, is_completed, is_ai_generated, is_favorite } = req.body;

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== req.session.userId) {
      return res.status(404).send({ message: "Task not found." });
    }

    const updatedTask = await TaskService.updateTask(taskId, {
      content,
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

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== req.session.userId) {
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

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== req.session.userId) {
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

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const taskId = parseInt(req.params.id);

  if (!taskId) {
    return res.status(400).send({ message: "Task ID is required." });
  }

  try {
    // Verify task belongs to user
    const existingTask = await TaskService.getTaskById(taskId);
    if (!existingTask || existingTask.user_id !== req.session.userId) {
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

import { db } from "../database";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    return db("tasks").select("*").orderBy("created_at", "desc");
  }

  static async getTasksByUserId(user_id: number): Promise<Task[]> {
    return db("tasks")
      .select("*")
      .where({ user_id })
      .orderBy("created_at", "desc");
  }

  static async getCompletedTasksByUserId(user_id: number): Promise<Task[]> {
    return db("tasks")
      .select("*")
      .where({ user_id, is_completed: true })
      .orderBy("created_at", "desc");
  }

  static async getPendingTasksByUserId(user_id: number): Promise<Task[]> {
    return db("tasks")
      .select("*")
      .where({ user_id, is_completed: false })
      .orderBy("created_at", "desc");
  }

  static async getFavoriteTasksByUserId(user_id: number): Promise<Task[]> {
    return db("tasks")
      .select("*")
      .where({ user_id, is_favorite: true })
      .orderBy("created_at", "desc");
  }

  static async getAIGeneratedTasksByUserId(user_id: number): Promise<Task[]> {
    return db("tasks")
      .select("*")
      .where({ user_id, is_ai_generated: true })
      .orderBy("created_at", "desc");
  }

  static async getTaskById(id: number): Promise<Task | null> {
    const tasks = await db("tasks").select("*").where({ id }).limit(1);
    return tasks.length > 0 ? tasks[0] : null;
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const taskToInsert = {
      ...taskData,
      is_completed: taskData.is_completed ?? false,
      is_ai_generated: taskData.is_ai_generated ?? false,
      is_favorite: taskData.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [task] = await db("tasks").insert(taskToInsert).returning("*");
    return task;
  }

  // Pass in AI generated data in task format
  static async createTaskWithAI(taskData: CreateTaskRequest): Promise<Task> {
    const taskToInsert = {
      ...taskData,
      is_completed: taskData.is_completed ?? false,
      is_ai_generated: true,
      is_favorite: taskData.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [task] = await db("tasks").insert(taskToInsert).returning("*");
    return task;
  }

  static async updateTask(
    id: number,
    taskData: UpdateTaskRequest
  ): Promise<Task | null> {
    const [task] = await db("tasks")
      .where({ id })
      .update({ ...taskData, updated_at: db.fn.now() })
      .returning("*");
    return task || null;
  }

  static async deleteTask(id: number): Promise<boolean> {
    const deletedCount = await db("tasks").where({ id }).del();
    return deletedCount > 0;
  }

  static async toggleTaskCompletion(id: number): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) return null;

    const [updatedTask] = await db("tasks")
      .where({ id })
      .update({
        is_completed: !task.is_completed,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updatedTask;
  }

  static async toggleTaskFavorite(id: number): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) return null;

    const [updatedTask] = await db("tasks")
      .where({ id })
      .update({
        is_favorite: !task.is_favorite,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updatedTask;
  }

  static async markAsAIGenerated(id: number): Promise<Task | null> {
    const [updatedTask] = await db("tasks")
      .where({ id })
      .update({
        is_ai_generated: true,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updatedTask || null;
  }

  static async bulkCreateTasks(tasks: CreateTaskRequest[]): Promise<Task[]> {
    const tasksToInsert = tasks.map((task) => ({
      ...task,
      is_completed: task.is_completed ?? false,
      is_ai_generated: task.is_ai_generated ?? false,
      is_favorite: task.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    }));

    const createdTasks = await db("tasks").insert(tasksToInsert).returning("*");
    return createdTasks;
  }

  static async deleteAllTasksByUserId(user_id: number): Promise<number> {
    return db("tasks").where({ user_id }).del();
  }

  static async getTaskCountByUserId(user_id: number): Promise<{
    total: number;
    completed: number;
    pending: number;
    favorites: number;
    aiGenerated: number;
  }> {
    const [counts] = await db("tasks")
      .where({ user_id })
      .count("* as total")
      .count(db.raw("CASE WHEN is_completed = true THEN 1 END as completed"))
      .count(db.raw("CASE WHEN is_completed = false THEN 1 END as pending"))
      .count(db.raw("CASE WHEN is_favorite = true THEN 1 END as favorites"))
      .count(
        db.raw("CASE WHEN is_ai_generated = true THEN 1 END as aiGenerated")
      );

    return {
      total: parseInt(counts.total as string),
      completed: parseInt(counts.completed as string) || 0,
      pending: parseInt(counts.pending as string) || 0,
      favorites: parseInt(counts.favorites as string) || 0,
      aiGenerated: parseInt(counts.aiGenerated as string) || 0,
    };
  }
}

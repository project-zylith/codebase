import { db } from "../database";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";

export class TaskService {
  static async getAllTasks(): Promise<Task[]> {
    return db("tasks").select("*").orderBy("created_at", "desc");
  }

  static async getTaskById(id: number): Promise<Task | null> {
    const tasks = await db("tasks").select("*").where({ id }).limit(1);
    return tasks.length > 0 ? tasks[0] : null;
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const [task] = await db("tasks").insert(taskData).returning("*");
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
        completed: !task.completed,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updatedTask;
  }
}

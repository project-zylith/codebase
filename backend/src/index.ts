// backend/src/index.ts
import express, { Request, Response } from "express";
import { testConnection } from "./database";
import { TaskService } from "./services/taskService";
import { CreateTaskRequest, UpdateTaskRequest } from "./types/task";
import * as ai from "./prompts/taskInsights";
import { checkAuthentication } from "../middleware/checkAuthentication";
import * as auth from "../controllers/authControllers";
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req: Request, res: Response, next) => {
  console.log(`🔍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log(`📦 Body:`, req.body);
  next();
});

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Test database connection on startup
testConnection()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => console.error("❌ Database connection failed:", error));

/////////////////////////////////
// Test Routes
/////////////////////////////////

// Test route to verify backend is working
app.get("/test", (req: Request, res: Response) => {
  console.log("🧪 Test route hit!");
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

/////////////////////////////////
// Task Routes
/////////////////////////////////

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

// Task routes
app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req: Request, res: Response) => {
  try {
    const taskData: CreateTaskRequest = req.body;
    const newTask = await TaskService.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const taskData: UpdateTaskRequest = req.body;
    const updatedTask = await TaskService.updateTask(id, taskData);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await TaskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.patch("/api/tasks/:id/toggle", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedTask = await TaskService.toggleTaskCompletion(id);

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error toggling task:", error);
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

/////////////////////////////////
// AI Routes
/////////////////////////////////

app.post("/api/insights", ai.insights);
app.post("/api/finalInsight", ai.finalInsight);

/////////////////////////////////
// User Routes
/////////////////////////////////

app.post("/api/auth/register", auth.registerUser);
app.post("/api/auth/login", auth.loginUser);
app.get("/api/auth/me", checkAuthentication, auth.showMe);
app.delete("/api/auth/logout", auth.logoutUser);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`🚀 Backend server listening at http://0.0.0.0:${port}`);
  console.log(`🌐 Accessible at http://172.26.32.1:${port}`);
});

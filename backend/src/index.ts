// backend/src/index.ts
import express, { Request, Response } from "express";
import { testConnection } from "./database";
import * as ai from "./aiServices/taskInsights";
import { checkAuthentication } from "../middleware/checkAuthentication";
import * as auth from "../controllers/authControllers";
import * as taskControllers from "../controllers/taskControllers";
import * as noteControllers from "../controllers/noteControllers";
import SchedulerService from "./scheduler";
const session = require("express-session");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req: Request, res: Response, next) => {
  console.log(`🔍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log(`📦 Body:`, req.body);
  next();
});

// CORS configuration to allow credentials
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Test database connection on startup
testConnection()
  .then(() => {
    console.log("✅ Database connected successfully");
    // Initialize schedulers after database connection is established
    SchedulerService.initializeSchedulers();
  })
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
// Task Routes (Authenticated)
/////////////////////////////////

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

// Task routes - all require authentication
app.get("/api/tasks", checkAuthentication, taskControllers.getTasks);
app.post("/api/tasks", checkAuthentication, taskControllers.createTask);
app.put("/api/tasks/:id", checkAuthentication, taskControllers.updateTask);
app.delete("/api/tasks/:id", checkAuthentication, taskControllers.deleteTask);
app.patch(
  "/api/tasks/:id/toggle",
  checkAuthentication,
  taskControllers.toggleTaskCompletion
);
app.patch(
  "/api/tasks/:id/toggle-favorite",
  checkAuthentication,
  taskControllers.toggleTaskFavorite
);
app.delete(
  "/api/tasks/cleanup",
  checkAuthentication,
  taskControllers.cleanupCompletedTasks
);

/////////////////////////////////
// Note Routes (Authenticated)
/////////////////////////////////

// Note routes - all require authentication
app.get("/api/notes", checkAuthentication, noteControllers.getNotes);
app.post("/api/notes", checkAuthentication, noteControllers.createNote);
app.get("/api/notes/:id", checkAuthentication, noteControllers.getNoteById);
app.put("/api/notes/:id", checkAuthentication, noteControllers.updateNote);
app.delete("/api/notes/:id", checkAuthentication, noteControllers.deleteNote);

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

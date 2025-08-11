// backend/src/index.ts
import express, { Request, Response } from "express";
import { testConnection } from "./database";
import * as ai from "./aiServices/taskInsights";
import * as noteInsights from "./aiServices/noteInsights";
import { checkAuthentication } from "../middleware/checkAuthentication";
import * as auth from "../controllers/authControllers";
import * as taskControllers from "../controllers/taskControllers";
import * as noteControllers from "../controllers/noteControllers";
import * as galaxyControllers from "../controllers/galaxyControllers";
import * as subscriptionControllers from "../controllers/subscriptionControllers";
import * as galaxyAi from "./aiServices/galaxyAi";
import SchedulerService from "./scheduler";
const session = require("express-session");
const cors = require("cors");

// Load environment variables from .env file
require("dotenv").config();

// Debug environment variables
console.log("🔍 Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(
  "PG_CONNECTION_STRING:",
  process.env.PG_CONNECTION_STRING ? "SET" : "NOT SET"
);
console.log("PORT:", process.env.PORT);

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req: Request, res: Response, next) => {
  console.log(`🔍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log(`📦 Body:`, req.body);
  next();
});

// CORS configuration for JWT authentication
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? function (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void
          ) {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Allow specific origins
            const allowedOrigins = [
              "capacitor://localhost",
              "ionic://localhost",
              "http://localhost",
              "https://localhost",
              // Add any other origins you need
            ];

            if (allowedOrigins.includes(origin)) {
              return callback(null, true);
            }

            // For production, allow all origins for mobile apps
            // Mobile apps don't always send proper Origin headers
            return callback(null, true);
          }
        : true, // Allow all origins in development
    credentials: false, // JWT doesn't need credentials/cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Removed Cookie header
  })
);

// Webhook routes must come BEFORE express.json() middleware
// to preserve raw body for Stripe signature verification
app.post(
  "/api/subscriptions/webhook",
  express.raw({ type: "application/json" }),
  subscriptionControllers.handleWebhook
);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin in production
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
// Galaxy Routes (Authenticated)
/////////////////////////////////

// Galaxy CRUD routes - all require authentication
app.get("/api/galaxies", checkAuthentication, galaxyControllers.getGalaxies);
app.post("/api/galaxies", checkAuthentication, galaxyControllers.createGalaxy);
app.post(
  "/api/galaxies/generate",
  checkAuthentication,
  galaxyControllers.generateGalaxies
);
app.get(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.getGalaxyById
);
app.put(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.updateGalaxy
);
app.delete(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.deleteGalaxy
);
app.get(
  "/api/galaxies/:id/notes",
  checkAuthentication,
  galaxyControllers.getGalaxyNotes
);
app.post(
  "/api/galaxies/assign-note",
  checkAuthentication,
  galaxyControllers.assignNoteToGalaxy
);

/////////////////////////////////
// AI Routes
/////////////////////////////////

app.post("/api/insights", ai.insights);
app.post("/api/finalInsight", ai.finalInsight);
app.post("/api/noteInsight", noteInsights.generateNoteInsight);
// Galaxy Routes these should be used on the home screen, no I need a ai button
console.log("🔧 Registering galaxy AI routes...");
app.post("/api/generateGalaxy", galaxyAi.generateGalaxy);
app.post("/api/reSortGalaxy", galaxyAi.reSortGalaxy);
app.post("/api/generateGalaxyInsight", galaxyAi.generateGalaxyInsight);
app.post("/api/generateGalaxyInsightAll", galaxyAi.generateGalaxyInsightAll);
console.log("✅ Galaxy AI routes registered!");

/////////////////////////////////
// User Routes
/////////////////////////////////

app.post("/api/auth/register", auth.registerUser);
app.post("/api/auth/login", auth.loginUser);
app.get("/api/auth/me", checkAuthentication, auth.showMe);
app.delete("/api/auth/logout", auth.logoutUser);
app.put("/api/auth/email", checkAuthentication, auth.updateUserEmail);
app.put("/api/auth/password", checkAuthentication, auth.updateUserPassword);

/////////////////////////////////
// Subscription Routes
/////////////////////////////////

// Public routes
app.get(
  "/api/subscriptions/plans",
  subscriptionControllers.getSubscriptionPlans
);

// Authenticated routes
app.get(
  "/api/subscriptions/user",
  checkAuthentication,
  subscriptionControllers.getUserSubscription
);
app.post(
  "/api/subscriptions/create",
  checkAuthentication,
  subscriptionControllers.createSubscription
);
app.post(
  "/api/subscriptions/cancel",
  checkAuthentication,
  subscriptionControllers.cancelSubscription
);
app.post(
  "/api/subscriptions/payment-intent",
  checkAuthentication,
  subscriptionControllers.createPaymentIntent
);
app.post(
  "/api/subscriptions/resubscribe",
  checkAuthentication,
  subscriptionControllers.resubscribe
);
app.post(
  "/api/subscriptions/switch-plan",
  checkAuthentication,
  subscriptionControllers.switchPlan
);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`🚀 Backend server listening at http://0.0.0.0:${port}`);
  console.log(`🌐 Accessible at http://172.26.32.1:${port}`);
});

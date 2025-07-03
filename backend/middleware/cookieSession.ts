const cookieSession = require("cookie-session");
import type { RequestHandler } from "express";

const handleCookieSessions: RequestHandler = cookieSession({
  name: "session", // this creates a req.session property holding the cookie
  secret: process.env.SESSION_SECRET || "default-secret", // this secret is used to hash the cookie
});

export default handleCookieSessions;

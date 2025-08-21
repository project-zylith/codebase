import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./checkAuthentication";
import { SubscriptionLimitService } from "../src/services/subscriptionLimitService";

// Helper function to get user ID from JWT or session
const getUserId = (req: AuthenticatedRequest): number | null => {
  // Try JWT first (from middleware)
  if (req.user?.id) {
    return req.user.id;
  }
  // Fallback to session
  if (req.session?.userId) {
    return req.session.userId;
  }
  return null;
};

// Generic subscription limit checker
export const checkSubscriptionLimits = (
  resourceType: "notes" | "tasks" | "galaxies" | "ai_insights"
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log(
        `🔒 Checking subscription limits for ${resourceType} - User: ${userId}`
      );

      // Check if user can perform this action
      let canProceed: { allowed: boolean; current: number; limit: number };

      switch (resourceType) {
        case "notes":
          canProceed = await SubscriptionLimitService.canCreateNote(userId);
          break;
        case "tasks":
          canProceed = await SubscriptionLimitService.canCreateTask(userId);
          break;
        case "galaxies":
          canProceed = await SubscriptionLimitService.canCreateGalaxy(userId);
          break;
        case "ai_insights":
          canProceed = await SubscriptionLimitService.canUseAiInsight(userId);
          break;
        default:
          return res.status(400).json({ error: "Invalid resource type" });
      }

      if (!canProceed.allowed) {
        console.log(
          `❌ Subscription limit reached for ${resourceType} - User: ${userId}, Current: ${canProceed.current}, Limit: ${canProceed.limit}`
        );

        return res.status(403).json({
          error: `Subscription limit reached for ${resourceType}`,
          current: canProceed.current,
          limit: canProceed.limit,
          resourceType,
          upgradeRequired: true,
          message: `You've reached your ${resourceType} limit. Please upgrade your subscription to continue.`,
        });
      }

      console.log(
        `✅ Subscription limit check passed for ${resourceType} - User: ${userId}, Current: ${canProceed.current}, Limit: ${canProceed.limit}`
      );

      // Add limit info to request for potential use in controllers
      req.subscriptionLimits = {
        resourceType,
        current: canProceed.current,
        limit: canProceed.limit,
        remaining: canProceed.limit - canProceed.current,
      };

      next();
    } catch (error) {
      console.error(
        `❌ Error checking subscription limits for ${resourceType}:`,
        error
      );
      return res.status(500).json({
        error: "Failed to check subscription limits",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};

// Specific middleware functions for each resource type
export const checkNoteLimits = checkSubscriptionLimits("notes");
export const checkTaskLimits = checkSubscriptionLimits("tasks");
export const checkGalaxyLimits = checkSubscriptionLimits("galaxies");
export const checkAiInsightLimits = checkSubscriptionLimits("ai_insights");

// Middleware to check if user has any active subscription
export const requireActiveSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    console.log(
      `🔒 Checking if user has active subscription - User: ${userId}`
    );

    // Get user's current subscription
    const { db } = require("../src/database");
    const subscription = await db("user_subscriptions")
      .where("user_id", userId)
      .where("status", "active")
      .first();

    if (!subscription) {
      console.log(`❌ No active subscription found - User: ${userId}`);
      return res.status(403).json({
        error: "Active subscription required",
        message:
          "This feature requires an active subscription. Please upgrade to continue.",
        upgradeRequired: true,
      });
    }

    console.log(
      `✅ Active subscription found - User: ${userId}, Plan: ${subscription.plan_id}`
    );

    // Add subscription info to request
    req.userSubscription = subscription;

    next();
  } catch (error) {
    console.error("❌ Error checking active subscription:", error);
    return res.status(500).json({
      error: "Failed to check subscription status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to check specific subscription plan requirements
export const requireSubscriptionPlan = (requiredPlanName: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      console.log(
        `🔒 Checking subscription plan requirement - User: ${userId}, Required: ${requiredPlanName}`
      );

      // Get user's current subscription with plan details
      const { db } = require("../src/database");
      const subscription = await db("user_subscriptions")
        .join(
          "subscription_plans",
          "user_subscriptions.plan_id",
          "subscription_plans.id"
        )
        .where("user_subscriptions.user_id", userId)
        .where("user_subscriptions.status", "active")
        .select("user_subscriptions.*", "subscription_plans.plan_name")
        .first();

      if (!subscription) {
        console.log(`❌ No active subscription found - User: ${userId}`);
        return res.status(403).json({
          error: "Active subscription required",
          message: `This feature requires a ${requiredPlanName} subscription. Please upgrade to continue.`,
          upgradeRequired: true,
        });
      }

      if (subscription.plan_name !== requiredPlanName) {
        console.log(
          `❌ Wrong subscription plan - User: ${userId}, Current: ${subscription.plan_name}, Required: ${requiredPlanName}`
        );
        return res.status(403).json({
          error: "Insufficient subscription plan",
          message: `This feature requires a ${requiredPlanName} subscription. Your current plan (${subscription.plan_name}) does not include this feature.`,
          upgradeRequired: true,
          currentPlan: subscription.plan_name,
          requiredPlan: requiredPlanName,
        });
      }

      console.log(
        `✅ Subscription plan requirement met - User: ${userId}, Plan: ${subscription.plan_name}`
      );

      // Add subscription info to request
      req.userSubscription = subscription;

      next();
    } catch (error) {
      console.error("❌ Error checking subscription plan requirement:", error);
      return res.status(500).json({
        error: "Failed to check subscription plan",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};

// Extend the AuthenticatedRequest interface to include subscription info
declare global {
  namespace Express {
    interface Request {
      subscriptionLimits?: {
        resourceType: string;
        current: number;
        limit: number;
        remaining: number;
      };
      userSubscription?: any;
    }
  }
}

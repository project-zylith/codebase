import { db } from "../database";

export interface SubscriptionLimits {
  note_limit: number;
  task_limit: number;
  galaxy_limit: number;
  ai_insights_per_day: number;
}

export class SubscriptionLimitService {
  /**
   * Get the current subscription limits for a user
   */
  static async getUserLimits(userId: number): Promise<SubscriptionLimits> {
    try {
      // Get user's current subscription
      const userSubscription = await db("user_subscriptions")
        .join(
          "subscription_plans",
          "user_subscriptions.plan_id",
          "subscription_plans.id"
        )
        .where("user_subscriptions.user_id", userId)
        .where("user_subscriptions.status", "active")
        .select(
          "subscription_plans.note_limit",
          "subscription_plans.task_limit",
          "subscription_plans.galaxy_limit",
          "subscription_plans.ai_insights_per_day"
        )
        .first();

      if (userSubscription) {
        return {
          note_limit: userSubscription.note_limit,
          task_limit: userSubscription.task_limit,
          galaxy_limit: userSubscription.galaxy_limit,
          ai_insights_per_day: userSubscription.ai_insights_per_day,
        };
      }

      // If no active subscription, return free tier limits
      const freeTierPlan = await db("subscription_plans")
        .where("plan_name", "Free Tier")
        .select(
          "note_limit",
          "task_limit",
          "galaxy_limit",
          "ai_insights_per_day"
        )
        .first();

      return {
        note_limit: freeTierPlan?.note_limit || 20,
        task_limit: freeTierPlan?.task_limit || 10,
        galaxy_limit: freeTierPlan?.galaxy_limit || 3,
        ai_insights_per_day: freeTierPlan?.ai_insights_per_day || 5,
      };
    } catch (error) {
      console.error("Error getting user limits:", error);
      // Return default free tier limits on error
      return {
        note_limit: 20,
        task_limit: 10,
        galaxy_limit: 3,
        ai_insights_per_day: 5,
      };
    }
  }

  /**
   * Check if user can create a note
   */
  static async canCreateNote(
    userId: number
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    try {
      const limits = await this.getUserLimits(userId);

      // If unlimited (-1), always allow
      if (limits.note_limit === -1) {
        return { allowed: true, current: 0, limit: -1 };
      }

      // Count current notes
      const noteCount = await db("notes")
        .where("user_id", userId)
        .count("* as count")
        .first();

      const current = parseInt(noteCount?.count as string) || 0;
      const allowed = current < limits.note_limit;

      return { allowed, current, limit: limits.note_limit };
    } catch (error) {
      console.error("Error checking note creation limit:", error);
      return { allowed: false, current: 0, limit: 0 };
    }
  }

  /**
   * Check if user can create a task
   */
  static async canCreateTask(
    userId: number
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    try {
      const limits = await this.getUserLimits(userId);

      // If unlimited (-1), always allow
      if (limits.task_limit === -1) {
        return { allowed: true, current: 0, limit: -1 };
      }

      // Count current tasks
      const taskCount = await db("tasks")
        .where("user_id", userId)
        .count("* as count")
        .first();

      const current = parseInt(taskCount?.count as string) || 0;
      const allowed = current < limits.task_limit;

      return { allowed, current, limit: limits.task_limit };
    } catch (error) {
      console.error("Error checking task creation limit:", error);
      return { allowed: false, current: 0, limit: 0 };
    }
  }

  /**
   * Check if user can create a galaxy
   */
  static async canCreateGalaxy(
    userId: number
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    try {
      const limits = await this.getUserLimits(userId);

      // If unlimited (-1), always allow
      if (limits.galaxy_limit === -1) {
        return { allowed: true, current: 0, limit: -1 };
      }

      // Count current galaxies
      const galaxyCount = await db("galaxies")
        .where("user_id", userId)
        .count("* as count")
        .first();

      const current = parseInt(galaxyCount?.count as string) || 0;
      const allowed = current < limits.galaxy_limit;

      return { allowed, current, limit: limits.galaxy_limit };
    } catch (error) {
      console.error("Error checking galaxy creation limit:", error);
      return { allowed: false, current: 0, limit: 0 };
    }
  }

  /**
   * Check if user can use AI insights today
   */
  static async canUseAIInsight(
    userId: number
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    try {
      const limits = await this.getUserLimits(userId);

      // If unlimited (-1), always allow
      if (limits.ai_insights_per_day === -1) {
        return { allowed: true, current: 0, limit: -1 };
      }

      // Count AI insights used today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const insightCount = await db("insights")
        .where("user_id", userId)
        .where("created_at", ">=", today)
        .count("* as count")
        .first();

      const current = parseInt(insightCount?.count as string) || 0;
      const allowed = current < limits.ai_insights_per_day;

      return { allowed, current, limit: limits.ai_insights_per_day };
    } catch (error) {
      console.error("Error checking AI insight limit:", error);
      return { allowed: false, current: 0, limit: 0 };
    }
  }

  /**
   * Check if user can use AI insights today (alias for consistency)
   */
  static async canUseAiInsight(
    userId: number
  ): Promise<{ allowed: boolean; current: number; limit: number }> {
    return this.canUseAIInsight(userId);
  }
}

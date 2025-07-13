import cron from "node-cron";
import { TaskService } from "./services/taskService";
import { UserService } from "./services/userService";

export class SchedulerService {
  /**
   * Schedule task cleanup to run daily at 2:30 AM
   * This will delete all completed tasks for all users
   */
  static scheduleTaskCleanup() {
    cron.schedule("30 2 * * *", async () => {
      console.log("🧹 Starting daily task cleanup at 2:30 AM...");

      try {
        // Get all users
        const users = await UserService.getAllUsers();
        console.log(`👥 Found ${users.length} users`);

        let totalTasksDeleted = 0;

        // Clean up completed tasks for each user
        for (const user of users) {
          try {
            console.log(
              `🧹 Cleaning up tasks for user: ${user.username} (ID: ${user.id})`
            );

            // Get all completed tasks for this user
            const completedTasks = await TaskService.getCompletedTasksByUserId(
              user.id
            );
            console.log(
              `✅ Found ${completedTasks.length} completed tasks for ${user.username}`
            );

            if (completedTasks.length > 0) {
              console.log(
                `🗑️ Tasks to delete for ${user.username}:`,
                completedTasks.map((task) => ({
                  id: task.id,
                  content: task.content.substring(0, 50) + "...",
                }))
              );

              // Delete each completed task
              for (const task of completedTasks) {
                const deleted = await TaskService.deleteTask(task.id);
                if (deleted) {
                  totalTasksDeleted++;
                  console.log(
                    `✅ Deleted task ${task.id}: "${task.content.substring(
                      0,
                      50
                    )}..."`
                  );
                } else {
                  console.log(`❌ Failed to delete task ${task.id}`);
                }
              }
            }
          } catch (userError) {
            console.error(
              `❌ Error cleaning up tasks for user ${user.username}:`,
              userError
            );
          }
        }

        console.log(
          `🎉 Daily cleanup completed! Deleted ${totalTasksDeleted} completed tasks total.`
        );
      } catch (error) {
        console.error("❌ Error during daily task cleanup:", error);
      }
    });

    console.log(
      "⏰ Task cleanup scheduler initialized - will run daily at 2:30 AM"
    );
  }

  /**
   * Schedule task cleanup for a specific user
   * @param userId - The ID of the user whose completed tasks should be cleaned up
   */
  static async cleanupUserTasks(userId: number): Promise<number> {
    console.log(`🧹 Starting manual cleanup for user ID: ${userId}`);

    try {
      // Get all completed tasks for this user
      const completedTasks = await TaskService.getCompletedTasksByUserId(
        userId
      );
      console.log(
        `✅ Found ${completedTasks.length} completed tasks for user ${userId}`
      );

      if (completedTasks.length === 0) {
        console.log(`✨ No completed tasks to clean up for user ${userId}`);
        return 0;
      }

      console.log(
        `🗑️ Tasks to delete:`,
        completedTasks.map((task) => ({
          id: task.id,
          content: task.content.substring(0, 50) + "...",
        }))
      );

      let deletedCount = 0;

      // Delete each completed task
      for (const task of completedTasks) {
        const deleted = await TaskService.deleteTask(task.id);
        if (deleted) {
          deletedCount++;
          console.log(
            `✅ Deleted task ${task.id}: "${task.content.substring(0, 50)}..."`
          );
        } else {
          console.log(`❌ Failed to delete task ${task.id}`);
        }
      }

      console.log(
        `🎉 Cleanup completed for user ${userId}! Deleted ${deletedCount} tasks.`
      );
      return deletedCount;
    } catch (error) {
      console.error(
        `❌ Error during manual cleanup for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Initialize all scheduled tasks
   */
  static initializeSchedulers() {
    console.log("🚀 Initializing all schedulers...");

    // Schedule the daily task cleanup
    this.scheduleTaskCleanup();

    // Add more schedulers here as needed
    // this.scheduleWeeklyReports();
    // this.scheduleAITaskGeneration();

    console.log("✅ All schedulers initialized successfully!");
  }

  /**
   * Get information about all scheduled tasks
   */
  static getSchedulerInfo() {
    return {
      taskCleanup: {
        schedule: "30 2 * * *",
        description: "Daily cleanup of completed tasks at 2:30 AM",
        nextRun: "Every day at 2:30 AM",
      },
    };
  }
}

// Export the service for use in other parts of the application
export default SchedulerService;

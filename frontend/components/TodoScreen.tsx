import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { NewTaskModal } from "./NewTaskModal";
import { TenTapEditor } from "./TenTapEditor";
import colorPalette from "../assets/colorPalette";
import { useUser } from "../contexts/UserContext";
import {
  getTasks,
  deleteTask,
  toggleTaskCompletion,
  toggleTaskFavorite,
  Task,
} from "../adapters/todoAdapters";

export const TodoScreen = () => {
  const { state: userState } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sort tasks to show AI-generated ones at the top
  const sortedTasks = [...tasks].sort((a, b) => {
    // AI-generated tasks first
    if (a.is_ai_generated && !b.is_ai_generated) return -1;
    if (!a.is_ai_generated && b.is_ai_generated) return 1;

    // Then by favorite status
    if (a.is_favorite && !b.is_favorite) return -1;
    if (!a.is_favorite && b.is_favorite) return 1;

    // Then by created date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const fetchTasks = async () => {
    if (!userState.user) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getTasks();

      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch tasks");
      }

      const data = await response.json();
      console.log("✅ Tasks fetched:", data);
      setTasks(data);
    } catch (error: any) {
      console.error("❌ Error fetching tasks:", error);
      setError(error.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      "Task Options",
      `What would you like to do with: "${task.content}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: task.is_completed ? "Mark Incomplete" : "Mark Complete",
          onPress: () => handleToggleCompletion(task.id),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteTask(task.id),
        },
      ]
    );
  };

  const handleToggleCompletion = async (taskId: number) => {
    try {
      const response = await toggleTaskCompletion(taskId);

      if (!response || !response.ok) {
        throw new Error("Failed to toggle task completion");
      }

      const updatedTask = await response.json();
      console.log("✅ Task completion toggled:", updatedTask);

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error: any) {
      console.error("❌ Error toggling task:", error);
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleToggleFavorite = async (taskId: number) => {
    try {
      const response = await toggleTaskFavorite(taskId);

      if (!response || !response.ok) {
        throw new Error("Failed to toggle task favorite");
      }

      const updatedTask = await response.json();
      console.log("✅ Task favorite toggled:", updatedTask);

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error: any) {
      console.error("❌ Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await deleteTask(taskId);

      if (!response || !response.ok) {
        throw new Error("Failed to delete task");
      }

      console.log("✅ Task deleted");

      // Update local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error: any) {
      console.error("❌ Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    // Add new task to the list
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskRow,
        item.is_completed && styles.completedTaskRow,
        item.is_ai_generated && styles.aiGeneratedTaskRow,
      ]}
    >
      {item.is_ai_generated && (
        <View style={styles.aiGeneratedHeader}>
          <Text style={styles.aiGeneratedLabel}>Zylith Generated</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => handleTaskPress(item)}
      >
        <Text
          style={[
            styles.taskText,
            item.is_completed && styles.completedTaskText,
          ]}
        >
          {item.content}
        </Text>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => handleToggleFavorite(item.id)}
          >
            <Text
              style={[
                styles.starIcon,
                item.is_favorite && styles.starIconFavorited,
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>

          <View style={styles.taskMeta}>
            {item.is_completed && <Text style={styles.completedBadge}>✓</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    if (userState.user) {
      fetchTasks();
    }
  }, [userState.user]);

  if (!userState.user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Please log in to view tasks</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTasks}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>

        <TouchableOpacity
          style={styles.createTaskButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.createTaskButtonText}>Create Task</Text>
        </TouchableOpacity>

        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>
              Tap "Create Task" to get started.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}

        <NewTaskModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onTaskCreated={handleTaskCreated}
        />

        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    color: colorPalette.quaternary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "left",
  },
  createTaskButton: {
    backgroundColor: colorPalette.quaternary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  createTaskButtonText: {
    color: colorPalette.primary,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
  spacer: {
    height: 32,
  },
  list: {
    flex: 1,
  },
  taskRow: {
    backgroundColor: colorPalette.secondary,
    borderRadius: 12,
    marginVertical: 4,
    overflow: "hidden",
  },
  aiGeneratedTaskRow: {
    backgroundColor: colorPalette.secondary,
    borderWidth: 2,
    borderColor: colorPalette.quaternary,
  },
  aiGeneratedHeader: {
    backgroundColor: colorPalette.quaternary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  aiGeneratedLabel: {
    color: colorPalette.primary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  taskContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  completedTaskRow: {
    opacity: 0.6,
  },
  taskText: {
    color: colorPalette.tertiary,
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    padding: 4,
    marginRight: 8,
  },
  starIcon: {
    color: colorPalette.quinary,
    fontSize: 20,
  },
  starIconFavorited: {
    color: "#FFD700",
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedBadge: {
    color: colorPalette.quaternary,
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 8,
  },
  loadingText: {
    color: colorPalette.tertiary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  retryButton: {
    backgroundColor: colorPalette.quaternary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 16,
  },
  retryButtonText: {
    color: colorPalette.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colorPalette.tertiary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    color: colorPalette.quinary,
    fontSize: 16,
  },
});

export default TodoScreen;

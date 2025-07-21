import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Task,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskFavorite,
} from "../adapters/todoAdapters";
import { NewTaskModal } from "./NewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { useTheme } from "../contexts/ThemeContext";

export const TodoScreen = () => {
  const { currentPalette } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenuForTask, setShowMenuForTask] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTasks();
      if (response && response.ok) {
        const fetchedTasks = await response.json();
        setTasks(fetchedTasks);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, is_completed: !task.is_completed };
      await updateTask(task.id, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      Alert.alert("Error", "Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleToggleFavorite = async (task: Task) => {
    try {
      const response = await toggleTaskFavorite(task.id);
      if (response && response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
        );
      } else {
        throw new Error("Failed to toggle favorite");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to toggle favorite");
      console.error("Error toggling favorite:", err);
    }
    setShowMenuForTask(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(taskId);
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.id !== taskId)
            );
          } catch (err) {
            Alert.alert("Error", "Failed to delete task");
            console.error("Error deleting task:", err);
          }
        },
      },
    ]);
    setShowMenuForTask(null);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
    setShowMenuForTask(null);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const sortedTasks = tasks.sort((a, b) => {
    // Completed tasks go to bottom
    if (a.is_completed && !b.is_completed) return 1;
    if (!a.is_completed && b.is_completed) return -1;

    // For non-completed tasks: AI-generated first, then favorites
    if (!a.is_completed && !b.is_completed) {
      // AI-generated tasks first
      if (a.is_ai_generated && !b.is_ai_generated) return -1;
      if (!a.is_ai_generated && b.is_ai_generated) return 1;

      // If both are AI-generated or both are not AI-generated, then sort by favorites
      if (a.is_ai_generated === b.is_ai_generated) {
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
      }
    }

    // Finally, sort by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const renderTaskMenu = (task: Task) => (
    <Modal
      visible={showMenuForTask === task.id}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMenuForTask(null)}
    >
      <TouchableOpacity
        style={styles.menuOverlay}
        activeOpacity={1}
        onPress={() => setShowMenuForTask(null)}
      >
        <View
          style={[
            styles.menuContainer,
            { backgroundColor: currentPalette.secondary },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleToggleFavorite(task)}
          >
            <Ionicons
              name={task.is_favorite ? "star" : "star-outline"}
              size={20}
              color={
                task.is_favorite
                  ? currentPalette.accent
                  : currentPalette.tertiary
              }
            />
            <Text
              style={[styles.menuItemText, { color: currentPalette.tertiary }]}
            >
              {task.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleEditTask(task)}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={currentPalette.tertiary}
            />
            <Text
              style={[styles.menuItemText, { color: currentPalette.tertiary }]}
            >
              Edit Task
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleDeleteTask(task.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            <Text style={[styles.menuItemText, { color: "#ff6b6b" }]}>
              Delete Task
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskRow,
        { backgroundColor: currentPalette.secondary },
        item.is_ai_generated && [
          styles.aiGeneratedTaskRow,
          { borderColor: currentPalette.accent },
        ],
        item.is_completed && styles.completedTaskRow,
      ]}
    >
      {item.is_ai_generated && (
        <View
          style={[
            styles.aiGeneratedHeader,
            { backgroundColor: currentPalette.quaternary },
          ]}
        >
          <Text
            style={[
              styles.aiGeneratedLabel,
              { color: currentPalette.tertiary },
            ]}
          >
            ZYLITH GENERATED
          </Text>
        </View>
      )}
      <View style={styles.taskContent}>
        <TouchableOpacity
          style={styles.taskInfo}
          onPress={() => handleToggleComplete(item)}
          activeOpacity={0.7}
        >
          {item.goal && (
            <Text style={[styles.goalText, { color: currentPalette.quinary }]}>
              Goal: {item.goal}
            </Text>
          )}
          <Text
            style={[
              styles.taskText,
              { color: currentPalette.tertiary },
              item.is_completed && styles.completedTaskText,
            ]}
          >
            {item.content}
          </Text>
          <Text style={[styles.dateText, { color: currentPalette.quinary }]}>
            {formatDate(item.created_at)}
          </Text>
        </TouchableOpacity>
        <View style={styles.taskActions}>
          <View
            style={[
              styles.checkbox,
              { borderColor: currentPalette.quinary },
              item.is_completed && [
                styles.checkedCheckbox,
                {
                  backgroundColor: currentPalette.quaternary,
                  borderColor: currentPalette.quaternary,
                },
              ],
            ]}
          >
            {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setShowMenuForTask(item.id)}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={currentPalette.quinary}
            />
          </TouchableOpacity>
        </View>
      </View>
      {renderTaskMenu(item)}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: currentPalette.primary },
          ]}
        >
          <Text
            style={[styles.loadingText, { color: currentPalette.tertiary }]}
          >
            Loading tasks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: currentPalette.primary },
          ]}
        >
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: currentPalette.quaternary },
            ]}
            onPress={fetchTasks}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        <Text style={[styles.header, { color: currentPalette.quinary }]}>
          Your Tasks
        </Text>

        <TouchableOpacity
          style={[
            styles.createTaskButton,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text
            style={[
              styles.createTaskButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            Create Task
          </Text>
        </TouchableOpacity>

        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyText, { color: currentPalette.tertiary }]}
            >
              No tasks yet!
            </Text>
            <Text
              style={[styles.emptySubtext, { color: currentPalette.quinary }]}
            >
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

        <EditTaskModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />

        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "left",
  },
  createTaskButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  createTaskButtonText: {
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
    borderRadius: 12,
    marginVertical: 4,
    overflow: "hidden",
  },
  aiGeneratedTaskRow: {
    borderWidth: 2,
    borderColor: "transparent", // Will be overridden by inline style
  },
  aiGeneratedHeader: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "stretch", // Make it span full width
    width: "100%", // Ensure full width
  },
  aiGeneratedLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center", // Center the text
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
    fontSize: 16,
  },
  taskInfo: {
    marginRight: 12,
    flex: 1,
  },
  goalText: {
    fontSize: 12,
    marginBottom: 4,
    fontStyle: "italic",
    opacity: 0.8,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent", // This will be overridden by inline style
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: "transparent", // This will be overridden by inline style
    borderColor: "transparent", // This will be overridden by inline style
  },
  checkmark: {
    color: "white",
    fontSize: 12,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
  },
  divider: {
    height: 4,
  },
  loadingText: {
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 16,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    width: "80%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  hamburgerButton: {
    padding: 4,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import {
  Task,
  getTasks,
  updateTask,
  deleteTask,
} from "../adapters/todoAdapters";
import { NewTaskModal } from "./NewTaskModal";
import colorPalette from "../assets/colorPalette";

export const TodoScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      Alert.alert("Error", "Failed to delete task");
      console.error("Error deleting task:", err);
    }
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
    if (a.is_completed && !b.is_completed) return 1;
    if (!a.is_completed && b.is_completed) return -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskRow,
        item.is_ai_generated && styles.aiGeneratedTaskRow,
        item.is_completed && styles.completedTaskRow,
      ]}
    >
      {item.is_ai_generated && (
        <View style={styles.aiGeneratedHeader}>
          <Text style={styles.aiGeneratedLabel}>AI GENERATED</Text>
        </View>
      )}
      <View style={styles.taskContent}>
        <View style={styles.taskInfo}>
          {item.goal && <Text style={styles.goalText}>Goal: {item.goal}</Text>}
          <Text
            style={[
              styles.taskText,
              item.is_completed && styles.completedTaskText,
            ]}
          >
            {item.content}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.is_completed && styles.checkedCheckbox,
            ]}
            onPress={() => handleToggleComplete(item)}
          >
            {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
    color: colorPalette.quinary,
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
    color: colorPalette.tertiary,
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
    borderWidth: 2,
    borderColor: colorPalette.accent,
  },
  aiGeneratedHeader: {
    backgroundColor: colorPalette.quaternary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  aiGeneratedLabel: {
    color: colorPalette.tertiary,
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
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  goalText: {
    color: colorPalette.quinary,
    fontSize: 12,
    marginBottom: 4,
    fontStyle: "italic",
    opacity: 0.8,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
  },
  dateText: {
    color: colorPalette.quinary,
    fontSize: 12,
    marginTop: 4,
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colorPalette.quinary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: colorPalette.quaternary,
    borderColor: colorPalette.quaternary,
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

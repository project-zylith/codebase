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
  ScrollView,
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

// Filter types
type StatusFilter = "all" | "active" | "completed";
type PriorityFilter = "all" | "favorites" | "ai-generated" | "user-created";
type TimeFilter = "all" | "today" | "this-week" | "this-month" | "older";
type GoalFilter = "all" | "with-goals" | "without-goals";

interface FilterState {
  status: StatusFilter;
  priority: PriorityFilter;
  time: TimeFilter;
  goal: GoalFilter;
}

export const TodoScreen = () => {
  const { currentPalette } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenuForTask, setShowMenuForTask] = useState<number | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    time: "all",
    goal: "all",
  });
  const [activeFilterModal, setActiveFilterModal] = useState<
    keyof FilterState | null
  >(null);

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

  // Filter helper functions
  const isTaskInTimeRange = (task: Task, timeFilter: TimeFilter): boolean => {
    const taskDate = new Date(task.created_at);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (timeFilter) {
      case "today":
        return taskDate >= today;
      case "this-week":
        return taskDate >= weekAgo;
      case "this-month":
        return taskDate >= monthAgo;
      case "older":
        return taskDate < monthAgo;
      default:
        return true;
    }
  };

  const applyFilters = (tasks: Task[]): Task[] => {
    return tasks.filter((task) => {
      // Status filter
      if (filters.status === "active" && task.is_completed) return false;
      if (filters.status === "completed" && !task.is_completed) return false;

      // Priority filter
      if (filters.priority === "favorites" && !task.is_favorite) return false;
      if (filters.priority === "ai-generated" && !task.is_ai_generated)
        return false;
      if (filters.priority === "user-created" && task.is_ai_generated)
        return false;

      // Time filter
      if (!isTaskInTimeRange(task, filters.time)) return false;

      // Goal filter
      if (filters.goal === "with-goals" && !task.goal) return false;
      if (filters.goal === "without-goals" && task.goal) return false;

      return true;
    });
  };

  const getFilterDisplayName = (
    filterType: keyof FilterState,
    value: string
  ): string => {
    const displayNames = {
      status: {
        all: "All",
        active: "Active",
        completed: "Completed",
      },
      priority: {
        all: "All",
        favorites: "Favorites",
        "ai-generated": "AI Generated",
        "user-created": "User Created",
      },
      time: {
        all: "All Time",
        today: "Today",
        "this-week": "This Week",
        "this-month": "This Month",
        older: "Older",
      },
      goal: {
        all: "All",
        "with-goals": "With Goals",
        "without-goals": "Without Goals",
      },
    };
    return (
      displayNames[filterType][
        value as keyof (typeof displayNames)[typeof filterType]
      ] || value
    );
  };

  const hasActiveFilters = (): boolean => {
    return (
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.time !== "all" ||
      filters.goal !== "all"
    );
  };

  const clearAllFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      time: "all",
      goal: "all",
    });
  };

  const filteredAndSortedTasks = applyFilters(tasks).sort((a, b) => {
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

  const renderFilterModal = () => {
    if (!activeFilterModal) return null;

    const filterOptions = {
      status: ["all", "active", "completed"] as StatusFilter[],
      priority: [
        "all",
        "favorites",
        "ai-generated",
        "user-created",
      ] as PriorityFilter[],
      time: [
        "all",
        "today",
        "this-week",
        "this-month",
        "older",
      ] as TimeFilter[],
      goal: ["all", "with-goals", "without-goals"] as GoalFilter[],
    };

    const modalTitles = {
      status: "Filter by Status",
      priority: "Filter by Priority",
      time: "Filter by Time",
      goal: "Filter by Goal",
    };

    return (
      <Modal
        visible={!!activeFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveFilterModal(null)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setActiveFilterModal(null)}
        >
          <View
            style={[
              styles.filterModalContainer,
              { backgroundColor: currentPalette.secondary },
            ]}
          >
            <Text
              style={[
                styles.filterModalTitle,
                { color: currentPalette.tertiary },
              ]}
            >
              {modalTitles[activeFilterModal]}
            </Text>
            <ScrollView style={styles.filterOptionsContainer}>
              {filterOptions[activeFilterModal].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.filterOption,
                    filters[activeFilterModal] === option && {
                      backgroundColor: currentPalette.quaternary,
                    },
                  ]}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      [activeFilterModal]: option,
                    }));
                    setActiveFilterModal(null);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      { color: currentPalette.tertiary },
                      filters[activeFilterModal] === option && {
                        color: currentPalette.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {getFilterDisplayName(activeFilterModal, option)}
                  </Text>
                  {filters[activeFilterModal] === option && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={currentPalette.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

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

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setActiveFilterModal("status")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Status: {getFilterDisplayName("status", filters.status)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setActiveFilterModal("priority")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Priority: {getFilterDisplayName("priority", filters.priority)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setActiveFilterModal("time")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Time: {getFilterDisplayName("time", filters.time)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setActiveFilterModal("goal")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Goal: {getFilterDisplayName("goal", filters.goal)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>
          </ScrollView>

          {hasActiveFilters() && (
            <TouchableOpacity
              style={[
                styles.clearFiltersButton,
                { backgroundColor: currentPalette.accent },
              ]}
              onPress={clearAllFilters}
            >
              <Ionicons name="close" size={16} color="white" />
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

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

        {filteredAndSortedTasks.length === 0 ? (
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
            data={filteredAndSortedTasks}
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

        {renderFilterModal()}

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
  // Filter styles
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    minWidth: 80,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  clearFiltersText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  filterModalContainer: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  filterOptionsContainer: {
    maxHeight: 300,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

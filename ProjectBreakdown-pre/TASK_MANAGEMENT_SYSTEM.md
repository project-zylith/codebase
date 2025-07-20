# Task Management System - Renaissance MVP

## ✅ Overview

The Task Management System in Renaissance provides a comprehensive solution for creating, organizing, and tracking tasks with AI-powered generation and intelligent insights. This system seamlessly integrates with the note-taking features to create actionable items from user content.

---

## 🏗️ Architecture Overview

### Task System Flow

```
Task Creation → AI Generation → Organization → Completion Tracking → Insights → Analytics
```

### Key Components

- **Manual Task Creation**: User-defined tasks with goals
- **AI-Generated Tasks**: Tasks created from note insights
- **Task Organization**: Priority, favorites, and completion status
- **Visual Indicators**: Special styling for AI-generated tasks
- **Goal Tracking**: Associate tasks with specific objectives

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── TodoScreen.tsx            # Main task list screen
│   ├── NewTaskModal.tsx          # Task creation modal
│   ├── EditTaskModal.tsx         # Task editing modal
│   └── NewTask.tsx               # Legacy task creation component
├── adapters/
│   └── todoAdapters.ts           # Task API communication
└── types/
    └── types.ts                  # Task type definitions

backend/
├── controllers/
│   └── taskControllers.ts        # Task CRUD operations
├── database/
│   └── migrations/
│       └── 20240101000005_create_tasks_table.ts
└── src/
    └── services/
        └── taskService.ts        # Task business logic
```

---

## 🗄️ Database Schema

### Tasks Table

**Location**: `backend/database/migrations/20240101000005_create_tasks_table.ts`

```typescript
exports.up = function (knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("content").notNullable();
    table.text("goal").nullable();
    table.boolean("is_completed").defaultTo(false).notNullable();
    table.boolean("is_ai_generated").defaultTo(false).notNullable();
    table.boolean("is_favorite").defaultTo(false).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};
```

**Key Features**:

- **User association**: Each task belongs to a user
- **Goal tracking**: Optional goal field for task context
- **AI generation flag**: Distinguish AI-generated tasks
- **Completion status**: Track task completion
- **Favorites**: Allow users to mark important tasks

---

## 🔧 Backend Implementation

### 1. Task Controllers

**Location**: `backend/controllers/taskControllers.ts`

#### Create Task

```typescript
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🎯 createTask controller hit!");
  console.log("📨 Request body:", req.body);

  if (!req.session?.userId) {
    return res.status(401).send({ message: "User must be authenticated." });
  }

  const { content, goal, is_completed, is_ai_generated, is_favorite } =
    req.body;

  if (!content) {
    return res.status(400).send({ message: "Task content is required." });
  }

  try {
    const task = await TaskService.createTask({
      user_id: req.session.userId,
      content,
      goal,
      is_completed: is_completed || false,
      is_ai_generated: is_ai_generated || false,
      is_favorite: is_favorite || false,
    });

    console.log("✅ Task created successfully:", task);
    res.status(201).send(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).send({ message: "Failed to create task." });
  }
};
```

#### Get User Tasks

```typescript
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await TaskService.getTasksByUserId(req.session.userId);
    console.log("📡 Fetched tasks:", tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
```

#### Toggle Task Completion

```typescript
export const toggleTaskCompletion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedTask = await TaskService.toggleTaskCompletion(
      parseInt(id),
      req.session.userId
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    console.log("🔄 Toggled task completion:", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Error toggling task completion:", error);
    res.status(500).json({ error: "Failed to toggle task completion" });
  }
};
```

#### Toggle Task Favorite

```typescript
export const toggleTaskFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedTask = await TaskService.toggleTaskFavorite(
      parseInt(id),
      req.session.userId
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    console.log("⭐ Toggled task favorite:", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Error toggling task favorite:", error);
    res.status(500).json({ error: "Failed to toggle task favorite" });
  }
};
```

### 2. Task Service Layer

**Location**: `backend/src/services/taskService.ts`

```typescript
export class TaskService {
  static async getTasksByUserId(userId: number): Promise<Task[]> {
    return await knex("tasks")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const taskToInsert = {
      ...taskData,
      is_completed: taskData.is_completed ?? false,
      is_ai_generated: taskData.is_ai_generated ?? false,
      is_favorite: taskData.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [task] = await db("tasks").insert(taskToInsert).returning("*");
    return task;
  }

  static async createTaskWithAI(taskData: CreateTaskRequest): Promise<Task> {
    const taskToInsert = {
      ...taskData,
      is_completed: taskData.is_completed ?? false,
      is_ai_generated: true, // Always true for AI-generated tasks
      is_favorite: taskData.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    const [task] = await db("tasks").insert(taskToInsert).returning("*");
    return task;
  }

  static async toggleTaskCompletion(
    id: number,
    userId: number
  ): Promise<Task | null> {
    const [task] = await db("tasks")
      .where({ id, user_id: userId })
      .update({
        is_completed: db.raw("NOT is_completed"),
        updated_at: db.fn.now(),
      })
      .returning("*");

    return task || null;
  }

  static async toggleTaskFavorite(
    id: number,
    userId: number
  ): Promise<Task | null> {
    const [task] = await db("tasks")
      .where({ id, user_id: userId })
      .update({
        is_favorite: db.raw("NOT is_favorite"),
        updated_at: db.fn.now(),
      })
      .returning("*");

    return task || null;
  }

  static async bulkCreateTasks(tasks: CreateTaskRequest[]): Promise<Task[]> {
    const tasksToInsert = tasks.map((task) => ({
      ...task,
      is_completed: task.is_completed ?? false,
      is_ai_generated: task.is_ai_generated ?? false,
      is_favorite: task.is_favorite ?? false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    }));

    const createdTasks = await db("tasks").insert(tasksToInsert).returning("*");
    return createdTasks;
  }
}
```

---

## 📱 Frontend Implementation

### 1. Task Adapters

**Location**: `frontend/adapters/todoAdapters.ts`

```typescript
export interface Task {
  id: number;
  user_id: number;
  content: string;
  goal?: string | null;
  is_completed: boolean;
  is_ai_generated: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface CreateTaskRequest {
  content: string;
  goal?: string | null;
  is_completed?: boolean;
  is_ai_generated?: boolean;
  is_favorite?: boolean;
}

export const getTasks = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.LIST}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    throw error;
  }
};

export const createTask = async (taskData: CreateTaskRequest) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.CREATE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(taskData),
    });
  } catch (error) {
    console.error("Create task error:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.TOGGLE(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Toggle task error:", error);
    throw error;
  }
};

export const toggleTaskFavorite = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.TASKS.TOGGLE_FAVORITE(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw error;
  }
};
```

### 2. Todo Screen

**Location**: `frontend/components/TodoScreen.tsx`

```typescript
export const TodoScreen = () => {
  const { currentPalette } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenuForTask, setShowMenuForTask] = useState<number | null>(null);

  // Sort tasks: AI-generated first, then by creation date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.is_ai_generated && !b.is_ai_generated) return -1;
    if (!a.is_ai_generated && b.is_ai_generated) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      if (response && response.ok) {
        const fetchedTasks = await response.json();
        setTasks(fetchedTasks);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await toggleTaskCompletion(task.id);
      if (response && response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
        );
      }
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
      }
    } catch (err) {
      Alert.alert("Error", "Failed to toggle favorite");
      console.error("Error toggling favorite:", err);
    }
    setShowMenuForTask(null);
  };

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
      {/* AI Generated Header */}
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
          {/* Goal Display */}
          {item.goal && (
            <Text style={[styles.goalText, { color: currentPalette.quinary }]}>
              Goal: {item.goal}
            </Text>
          )}

          {/* Task Content */}
          <Text
            style={[
              styles.taskText,
              { color: currentPalette.tertiary },
              item.is_completed && styles.completedTaskText,
            ]}
          >
            {item.content}
          </Text>

          {/* Date */}
          <Text style={[styles.dateText, { color: currentPalette.quinary }]}>
            {formatDate(item.created_at)}
          </Text>
        </TouchableOpacity>

        {/* Task Actions */}
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

      {/* Task Menu */}
      {renderTaskMenu(item)}
    </View>
  );

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
      </View>
    </SafeAreaView>
  );
};
```

### 3. New Task Modal

**Location**: `frontend/components/NewTaskModal.tsx`

```typescript
export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  visible,
  onClose,
  onTaskCreated,
}) => {
  const { currentPalette } = useTheme();
  const [taskContent, setTaskContent] = useState("");
  const [goalContent, setGoalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state: userState } = useUser();

  const handleSubmit = async () => {
    if (!taskContent.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    if (!userState.user) {
      Alert.alert("Error", "You must be logged in to create tasks");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTask({
        content: taskContent.trim(),
        goal: goalContent.trim() || null,
        is_completed: false,
        is_ai_generated: false,
        is_favorite: false,
      });

      if (response && response.ok) {
        const newTask = await response.json();
        onTaskCreated(newTask);
        setTaskContent("");
        setGoalContent("");
        onClose();
      } else {
        const errorData = response ? await response.json() : null;
        Alert.alert("Error", errorData?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text
              style={[styles.cancelText, { color: currentPalette.tertiary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            New Task
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !taskContent.trim()}
            style={[
              styles.createButton,
              (!taskContent.trim() || isSubmitting) && styles.disabledButton,
            ]}
          >
            <Text
              style={[styles.createText, { color: currentPalette.tertiary }]}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TextInput
            style={[
              styles.taskInput,
              {
                backgroundColor: currentPalette.secondary,
                color: currentPalette.tertiary,
                borderColor: currentPalette.quaternary,
              },
            ]}
            placeholder="What needs to be done?"
            placeholderTextColor={currentPalette.quinary}
            value={taskContent}
            onChangeText={setTaskContent}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TextInput
            style={[
              styles.goalInput,
              {
                backgroundColor: currentPalette.secondary,
                color: currentPalette.tertiary,
                borderColor: currentPalette.quaternary,
              },
            ]}
            placeholder="Goal (optional)"
            placeholderTextColor={currentPalette.quinary}
            value={goalContent}
            onChangeText={setGoalContent}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
```

---

## 🤖 AI Integration

### 1. AI-Generated Task Creation

**Location**: `frontend/components/NoteInsightModal.tsx`

```typescript
const handleAddToTodo = async (action: string, description: string) => {
  try {
    // Create a shorter, more concise task content
    const shortAction =
      action.length > 50 ? action.substring(0, 50) + "..." : action;

    // Determine goal based on note context
    let goal = "Note Action";
    if (note?.title) {
      goal = note.title;
    } else if (galaxy?.name) {
      goal = galaxy.name;
    }

    const response = await createTask({
      content: shortAction,
      goal: goal,
      is_completed: false,
      is_ai_generated: true, // Mark as AI-generated
      is_favorite: false,
    });

    if (response.ok) {
      Alert.alert("Success", "Task added to your todo list!");
    } else {
      Alert.alert("Error", "Failed to add task to todo list");
    }
  } catch (error) {
    console.error("Error adding task to todo:", error);
    Alert.alert("Error", "Failed to add task to todo list");
  }
};
```

### 2. Visual AI Task Indicators

```typescript
// AI-generated task styling
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
    {/* AI Generated Header */}
    {item.is_ai_generated && (
      <View
        style={[
          styles.aiGeneratedHeader,
          { backgroundColor: currentPalette.quaternary },
        ]}
      >
        <Text
          style={[styles.aiGeneratedLabel, { color: currentPalette.tertiary }]}
        >
          ZYLITH GENERATED
        </Text>
      </View>
    )}

    {/* Task content... */}
  </View>
);
```

---

## 🎨 UI/UX Features

### 1. Task Organization

- **AI-generated tasks** appear first with special styling
- **Completion status** with visual checkmarks
- **Favorite system** for important tasks
- **Goal association** for context

### 2. Visual Design

- **Cosmic theme** integration
- **Smooth animations** for state changes
- **Responsive layout** for all screen sizes
- **Accessibility** features

### 3. User Experience

- **One-tap completion** toggle
- **Long press menus** for additional actions
- **Real-time updates** without page refresh
- **Error handling** with user feedback

---

## 🚀 API Endpoints

### Task Routes

```typescript
// backend/src/index.ts
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
```

---

## 🔄 Data Flow

### 1. Manual Task Creation

```
User opens modal → Fills form → Validation → API call → Task creation → UI update
```

### 2. AI Task Generation

```
User requests insight → AI analysis → Task suggestions → User selects → Task creation → UI update
```

### 3. Task Completion

```
User taps task → Toggle completion → API call → State update → Visual feedback
```

### 4. Task Organization

```
Tasks load → Sort by AI-generated first → Sort by date → Display with styling
```

---

## 🐛 Common Issues and Solutions

### 1. Tasks Not Saving

**Problem**: Tasks disappear after app restart
**Solution**: Check API calls and error handling

### 2. AI Tasks Not Styled

**Problem**: AI-generated tasks look like regular tasks
**Solution**: Verify `is_ai_generated` flag and styling logic

### 3. Task Sorting Issues

**Problem**: Tasks not appearing in correct order
**Solution**: Check sorting logic and data types

### 4. Performance Issues

**Problem**: Slow task list loading
**Solution**: Implement pagination and optimize queries

---

## 🚀 Future Enhancements

### Planned Features

1. **Task Categories**: Custom categories and tags
2. **Due Dates**: Task deadlines and reminders
3. **Recurring Tasks**: Daily, weekly, monthly tasks
4. **Task Dependencies**: Task relationships and prerequisites
5. **Time Tracking**: Track time spent on tasks

### Technical Improvements

1. **Offline Support**: Local storage and sync
2. **Bulk Operations**: Select multiple tasks
3. **Advanced Filtering**: Filter by status, date, AI-generated
4. **Task Templates**: Pre-built task structures
5. **Analytics**: Task completion statistics

---

## 📚 Learning Resources

- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [Express.js CRUD Operations](https://expressjs.com/en/guide/routing.html)
- [SQLite with Knex.js](https://knexjs.org/)
- [React Native Modal](https://reactnative.dev/docs/modal)

---

_The Task Management System provides a robust foundation for task organization in Renaissance. Its integration with AI and the note system creates a seamless workflow from ideas to actionable tasks._

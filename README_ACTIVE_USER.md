# Active User Implementation Guide

## Overview

This guide explains how to implement and use the "active user" functionality in your React Native app, allowing you to show user-specific data based on who's currently logged in.

## Architecture

### 1. **UserContext (State Management)**

- `frontend/contexts/UserContext.tsx`
- Manages global user authentication state
- Provides user data to all components
- Handles persistent sessions with AsyncStorage

### 2. **User Adapters (API Layer)**

- `frontend/adapters/userAdapters.ts`
- Functions to communicate with backend auth endpoints
- Includes `loginUser`, `registerUser`, `getCurrentUser`, `logoutUser`

### 3. **Backend Session Management**

- `backend/controllers/authControllers.ts`
- Session-based authentication using cookies
- Endpoints: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`

## Setup Steps

### 1. **Install Dependencies**

```bash
cd frontend
npm install @react-native-async-storage/async-storage
```

### 2. **Wrap Your App with UserProvider**

```tsx
// App.tsx
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <UserProvider>
      {/* Your app content */}
      <AppNavigator />
    </UserProvider>
  );
}
```

### 3. **Use the Hook in Components**

```tsx
import { useUser } from "../contexts/UserContext";

const SomeComponent = () => {
  const { state, login, logout } = useUser();

  // Access user data
  const currentUserId = state.user?.id;
  const isLoggedIn = state.isAuthenticated;

  return (
    <View>
      {isLoggedIn ? (
        <Text>Welcome, {state.user?.username}!</Text>
      ) : (
        <Text>Please login</Text>
      )}
    </View>
  );
};
```

## Common Usage Patterns

### 1. **Filter Data by Current User**

```tsx
const TaskList = () => {
  const { state } = useUser();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (state.user?.id) {
      // Fetch tasks for current user
      fetchTasksByUserId(state.user.id);
    }
  }, [state.user?.id]);

  return (
    <View>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </View>
  );
};
```

### 2. **Conditional Rendering Based on Auth**

```tsx
const MainScreen = () => {
  const { state } = useUser();

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  return <DashboardScreen />;
};
```

### 3. **Create User-Specific Content**

```tsx
const CreateTask = () => {
  const { state } = useUser();

  const handleCreateTask = async (taskData) => {
    const newTask = {
      ...taskData,
      user_id: state.user.id, // Associate with current user
    };

    await TaskService.createTask(newTask);
  };

  return <Form onSubmit={handleCreateTask} />;
};
```

### 4. **Access User Info for API Calls**

```tsx
const UserDashboard = () => {
  const { state } = useUser();
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (state.user?.id) {
        const stats = await TaskService.getTaskCountByUserId(state.user.id);
        setUserStats(stats);
      }
    };

    fetchUserStats();
  }, [state.user?.id]);

  return (
    <View>
      <Text>Total Tasks: {userStats?.total}</Text>
      <Text>Completed: {userStats?.completed}</Text>
    </View>
  );
};
```

## Backend Integration

### 1. **Updated Service Methods**

Your backend services now support user-specific queries:

```typescript
// Get tasks for specific user
const userTasks = await TaskService.getTasksByUserId(userId);

// Get user statistics
const stats = await TaskService.getTaskCountByUserId(userId);

// Create task for specific user
const newTask = await TaskService.createTask({
  user_id: userId,
  content: "Task content",
  is_completed: false,
});
```

### 2. **Session-Based Authentication**

Your backend uses session cookies to maintain user state:

```typescript
// Login sets session
req.session.userId = user.id;

// Protected routes check session
if (!req.session?.userId) {
  return res.status(401).send({ message: "Not authenticated" });
}
```

## Security Considerations

1. **Session Validation**: The app verifies sessions with the backend on startup
2. **Auto-logout**: Invalid sessions are automatically cleared
3. **Secure Storage**: User data is stored securely with AsyncStorage
4. **API Security**: All API calls include credentials for session cookies

## Testing the Implementation

### 1. **Login Flow**

```tsx
const { login } = useUser();

const handleLogin = async () => {
  const response = await loginUser({ username, password });
  const userData = await response.json();
  await login(userData);
};
```

### 2. **User-Specific Data**

```tsx
const { state } = useUser();

// This will automatically filter for current user
const userTasks = await TaskService.getTasksByUserId(state.user.id);
```

### 3. **Logout Flow**

```tsx
const { logout } = useUser();

const handleLogout = async () => {
  await logout(); // Clears session and local storage
};
```

## Benefits

1. **Global State**: User info available throughout the app
2. **Persistent Sessions**: Users stay logged in between app sessions
3. **Automatic Updates**: User data syncs with backend on app start
4. **Type Safety**: Full TypeScript support for user data
5. **Easy Filtering**: Simple user-specific data queries

## Next Steps

1. Implement user-specific screens (profile, settings, etc.)
2. Add user-specific data filtering to existing components
3. Create user-specific API endpoints for your domain-specific data
4. Add user preferences and settings management
5. Implement user-specific notifications and alerts

This architecture provides a solid foundation for building user-centric features in your app!

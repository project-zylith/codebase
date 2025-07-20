# Navigation System - Renaissance MVP

## 🧭 Overview

Renaissance uses **React Navigation** to provide a seamless, intuitive navigation experience across the application. This guide covers the navigation architecture, screen management, authentication flow, and advanced navigation features.

---

## 🏗️ Architecture Overview

### Navigation Flow

```
App Launch → Authentication Check → Main Navigator → Screen Navigation → Deep Linking
```

### Key Components

- **App Navigator**: Root navigation container
- **Auth Navigator**: Authentication flow management
- **Main Navigator**: Primary app navigation
- **Screen Components**: Individual screen implementations
- **Navigation Guards**: Authentication and access control

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── AppNavigator.tsx           # Root navigation container
│   ├── AuthNavigator.tsx          # Authentication navigation
│   ├── MainNavigator.tsx          # Main app navigation
│   ├── HomeScreen.tsx             # Home screen with galaxy view
│   ├── TodoScreen.tsx             # Task management screen
│   ├── EditorScreen.tsx           # Note editor screen
│   ├── UserProfileScreen.tsx      # User profile screen
│   ├── AuthLogin.tsx              # Login screen
│   └── AuthSignUp.tsx             # Registration screen
├── contexts/
│   └── UserContext.tsx            # User state for navigation guards
└── types/
    └── types.ts                   # Navigation type definitions
```

---

## 🔧 Navigation Setup

### 1. Root Navigator

**Location**: `frontend/components/AppNavigator.tsx`

```typescript
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUser } from "../contexts/UserContext";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { state: userState } = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {userState.user ? (
          // Authenticated user - show main app
          <Stack.Screen name="MainApp" component={MainNavigator} />
        ) : (
          // Unauthenticated user - show auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### 2. Authentication Navigator

**Location**: `frontend/components/AuthNavigator.tsx`

```typescript
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthLogin } from "./AuthLogin";
import { AuthSignUp } from "./AuthSignUp";
import { InitialScreen } from "./InitialScreen";
import { InitialScreenTwo } from "./InitialScreenTwo";

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Initial"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="Initial" component={InitialScreen} />
      <AuthStack.Screen name="InitialTwo" component={InitialScreenTwo} />
      <AuthStack.Screen name="Login" component={AuthLogin} />
      <AuthStack.Screen name="SignUp" component={AuthSignUp} />
    </AuthStack.Navigator>
  );
};
```

### 3. Main App Navigator

**Location**: `frontend/components/MainNavigator.tsx`

```typescript
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { HomeScreen } from "./HomeScreen";
import { TodoScreen } from "./TodoScreen";
import { UserProfileScreen } from "./UserProfileScreen";

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  const { currentPalette } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tasks") {
            iconName = focused
              ? "checkmark-circle"
              : "checkmark-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentPalette.quaternary,
        tabBarInactiveTintColor: currentPalette.quinary,
        tabBarStyle: {
          backgroundColor: currentPalette.primary,
          borderTopColor: currentPalette.secondary,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Galaxies" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TodoScreen}
        options={{ title: "Tasks" }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};
```

---

## 🎯 Screen Navigation

### 1. Navigation Types

```typescript
// Navigation type definitions
export type RootStackParamList = {
  MainApp: undefined;
  Auth: undefined;
};

export type AuthStackParamList = {
  Initial: undefined;
  InitialTwo: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  NoteEditor: { noteId?: number; isNewNote?: boolean };
  GalaxyView: { galaxyId: number };
};

// Navigation hook types
export type NavigationProps = NativeStackNavigationProp<HomeStackParamList>;
export type RouteProps = RouteProp<HomeStackParamList>;
```

### 2. Screen Navigation Examples

```typescript
// Navigate to note editor
const handleNewNote = () => {
  navigation.navigate("NoteEditor", { isNewNote: true });
};

// Navigate to existing note
const handleNotePress = (note: NoteWithPosition) => {
  navigation.navigate("NoteEditor", { noteId: note.id });
};

// Navigate to galaxy view
const handleGalaxyPress = (galaxyId: number) => {
  navigation.navigate("GalaxyView", { galaxyId });
};

// Go back
const handleBack = () => {
  navigation.goBack();
};

// Navigate to specific screen
const handleProfile = () => {
  navigation.navigate("Profile");
};
```

### 3. Navigation with Parameters

```typescript
// Passing data to screens
const handleNotePress = (note: NoteWithPosition) => {
  navigation.navigate("NoteEditor", {
    noteId: note.id,
    noteData: note, // Pass additional data
  });
};

// Receiving parameters in screen
export const EditorScreen = () => {
  const route = useRoute<RouteProp<HomeStackParamList, "NoteEditor">>();
  const navigation = useNavigation<NavigationProps>();

  const noteId = route.params?.noteId;
  const isNewNote = route.params?.isNewNote;
  const noteData = route.params?.noteData;

  // Use parameters to load data
  useEffect(() => {
    if (noteId && !isNewNote) {
      loadNote(noteId);
    }
  }, [noteId, isNewNote]);
};
```

---

## 🔐 Authentication Flow

### 1. Authentication State Management

```typescript
// User context with navigation integration
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UserState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const checkAuth = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await getCurrentUser();
      if (response.ok) {
        const user = await response.json();
        setState({
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: "Authentication check failed",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await loginUser({ email, password });
      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          error: null,
        });
      } else {
        const errorData = await response.json();
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorData.error,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login failed",
      }));
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check authentication on app start
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ state, login, register, logout, checkAuth }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 2. Protected Routes

```typescript
// Navigation guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state: userState } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (!userState.isLoading && !userState.user) {
      // Redirect to login if not authenticated
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    }
  }, [userState.user, userState.isLoading]);

  if (userState.isLoading) {
    return <LoadingScreen />;
  }

  if (!userState.user) {
    return null; // Will redirect to auth
  }

  return <>{children}</>;
};
```

---

## 🎨 Navigation Styling

### 1. Theme Integration

```typescript
// Theme-aware navigation styling
export const MainNavigator = () => {
  const { currentPalette } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentPalette.primary,
          borderTopColor: currentPalette.secondary,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: currentPalette.quaternary,
        tabBarInactiveTintColor: currentPalette.quinary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      {/* Tab screens */}
    </Tab.Navigator>
  );
};
```

### 2. Custom Headers

```typescript
// Custom header component
const CustomHeader: React.FC<{ title: string; onBack?: () => void }> = ({
  title,
  onBack,
}) => {
  const { currentPalette } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: currentPalette.primary }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentPalette.tertiary}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: currentPalette.tertiary }]}>
        {title}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};
```

---

## 🔄 Navigation Lifecycle

### 1. Screen Focus Management

```typescript
// Handle screen focus events
export const HomeScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsFocused(true);
      // Refresh data when screen comes into focus
      fetchNotes();
      fetchGalaxies();
    });

    const blurUnsubscribe = navigation.addListener("blur", () => {
      setIsFocused(false);
      // Clean up when screen loses focus
      cleanupAnimations();
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);

  // Only render content when focused
  if (!isFocused) {
    return <View style={styles.container} />;
  }

  return (
    // Screen content
  );
};
```

### 2. Navigation State Persistence

```typescript
// Persist navigation state
const navigationRef = useRef<NavigationContainerRef>(null);

const onStateChange = (state: NavigationState | undefined) => {
  if (state) {
    // Save navigation state to AsyncStorage
    AsyncStorage.setItem("navigationState", JSON.stringify(state));
  }
};

const onReady = () => {
  // Restore navigation state on app restart
  AsyncStorage.getItem("navigationState").then((savedState) => {
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      navigationRef.current?.reset(parsedState);
    }
  });
};

return (
  <NavigationContainer
    ref={navigationRef}
    onStateChange={onStateChange}
    onReady={onReady}
  >
    {/* Navigation stack */}
  </NavigationContainer>
);
```

---

## 🚀 Advanced Navigation Features

### 1. Deep Linking

```typescript
// Deep link configuration
const linking = {
  prefixes: ["renaissance://", "https://renaissance.app"],
  config: {
    screens: {
      MainApp: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
              NoteEditor: "note/:id",
            },
          },
          Tasks: "tasks",
          Profile: "profile",
        },
      },
      Auth: {
        screens: {
          Login: "login",
          SignUp: "signup",
        },
      },
    },
  },
};

// Handle deep links
const handleDeepLink = (url: string) => {
  // Parse URL and navigate accordingly
  const route = parseDeepLink(url);
  if (route) {
    navigation.navigate(route.screen, route.params);
  }
};
```

### 2. Navigation Analytics

```typescript
// Track navigation events
const trackScreenView = (screenName: string, params?: any) => {
  analytics.track("Screen View", {
    screen_name: screenName,
    screen_params: params,
    timestamp: new Date().toISOString(),
  });
};

// Navigation listener for analytics
useEffect(() => {
  const unsubscribe = navigation.addListener("state", (e) => {
    const currentRoute = e.data.state.routes[e.data.state.index];
    trackScreenView(currentRoute.name, currentRoute.params);
  });

  return unsubscribe;
}, [navigation]);
```

### 3. Navigation Guards

```typescript
// Route-level authentication guard
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: userState } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (!userState.isLoading && !userState.user) {
      navigation.replace("Auth");
    }
  }, [userState.user, userState.isLoading]);

  if (userState.isLoading) {
    return <LoadingScreen />;
  }

  return userState.user ? <>{children}</> : null;
};

// Usage in navigator
<Stack.Screen
  name="NoteEditor"
  component={(props) => (
    <AuthGuard>
      <EditorScreen {...props} />
    </AuthGuard>
  )}
/>;
```

---

## 🐛 Common Issues and Solutions

### 1. Navigation State Issues

**Problem**: Navigation state not persisting
**Solution**: Implement proper state management and persistence

### 2. Authentication Flow Problems

**Problem**: Users stuck in auth loop
**Solution**: Check authentication state and navigation guards

### 3. Performance Issues

**Problem**: Slow navigation transitions
**Solution**: Optimize screen rendering and use React.memo

### 4. Deep Link Failures

**Problem**: Deep links not working
**Solution**: Verify linking configuration and URL parsing

---

## 🚀 Future Enhancements

### Planned Features

1. **Gesture Navigation**: Swipe-based navigation
2. **Custom Transitions**: Animated screen transitions
3. **Navigation History**: Breadcrumb navigation
4. **Search Navigation**: Global search with navigation
5. **Offline Navigation**: Navigation without internet

### Technical Improvements

1. **Performance Optimization**: Lazy loading of screens
2. **Memory Management**: Better screen cleanup
3. **Accessibility**: Voice navigation support
4. **Analytics**: Enhanced navigation tracking
5. **Testing**: Navigation testing framework

---

## 📚 Learning Resources

- [React Navigation Documentation](https://reactnavigation.org/)
- [Navigation Patterns](https://material.io/design/navigation/understanding-navigation.html)
- [Mobile Navigation Best Practices](https://www.nngroup.com/articles/mobile-navigation-patterns/)
- [Deep Linking Guide](https://reactnavigation.org/docs/deep-linking/)

---

_The Navigation System provides a robust, user-friendly navigation experience in Renaissance. Its integration with authentication, theming, and analytics creates a seamless user journey throughout the application._

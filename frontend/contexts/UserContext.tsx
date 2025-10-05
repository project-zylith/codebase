import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCurrentUser,
  logoutUser as logoutUserAPI,
} from "../adapters/userAdapters";

// Types
interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at?: Date | null;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRainyDayMode: boolean;
}

interface UserAction {
  type: "SET_USER" | "SET_LOADING" | "LOGOUT" | "SET_RAINY_DAY_MODE";
  payload?: any;
}

// Initial state
const initialState: UserState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isRainyDayMode: false,
};

// Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        isRainyDayMode: action.payload?.username === "Rainy Day",
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isRainyDayMode: false,
      };
    case "SET_RAINY_DAY_MODE":
      return {
        ...state,
        isRainyDayMode: action.payload,
      };
    default:
      return state;
  }
};

// Context
const UserContext = createContext<{
  state: UserState;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
} | null>(null);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check for stored session on app start
  useEffect(() => {
    checkStoredSession();
  }, []);

  const checkStoredSession = async () => {
    try {
      console.log("🔍 Checking stored session...");

      // Reduced timeout for faster app startup
      const sessionCheckTimeout = setTimeout(() => {
        console.log("⏰ Session check timeout - forcing login screen");
        dispatch({ type: "SET_LOADING", payload: false });
      }, 5000); // 5 second timeout for faster startup

      // First check if we have a stored user
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        console.log("📱 Found stored user, verifying with backend...");
        try {
          // Verify the session with the backend with a shorter timeout
          const response = (await Promise.race([
            getCurrentUser(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timeout")), 3000)
            ),
          ])) as Response;

          console.log("🌐 Backend response:", response?.status);

          if (response && response.ok) {
            const currentUser = await response.json();
            console.log("✅ Session valid, user authenticated");
            // Update stored user with latest data from backend
            await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            clearTimeout(sessionCheckTimeout);
            dispatch({ type: "SET_USER", payload: currentUser });
          } else {
            console.log(
              "❌ Session invalid, clearing stored data. Status:",
              response?.status
            );
            // Session is invalid, clear stored data
            await AsyncStorage.removeItem("user");
            clearTimeout(sessionCheckTimeout);
            dispatch({ type: "SET_LOADING", payload: false });
          }
        } catch (networkError) {
          console.log("🌐 Network error, using stored user for faster startup");
          // If network fails, use stored user for faster startup
          const parsedUser = JSON.parse(storedUser);
          clearTimeout(sessionCheckTimeout);
          dispatch({ type: "SET_USER", payload: parsedUser });
        }
      } else {
        console.log("📱 No stored user, checking for valid session...");
        try {
          // No stored user, check if there's a valid session anyway
          const response = (await Promise.race([
            getCurrentUser(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timeout")), 3000)
            ),
          ])) as Response;

          console.log("🌐 Backend response:", response?.status);

          if (response && response.ok) {
            const currentUser = await response.json();
            console.log("✅ Found valid session, storing user");
            await AsyncStorage.setItem("user", JSON.stringify(currentUser));
            clearTimeout(sessionCheckTimeout);
            dispatch({ type: "SET_USER", payload: currentUser });
          } else {
            console.log(
              "❌ No valid session, showing login. Status:",
              response?.status
            );
            clearTimeout(sessionCheckTimeout);
            dispatch({ type: "SET_LOADING", payload: false });
          }
        } catch (networkError) {
          console.log("🌐 Network error, showing login screen");
          clearTimeout(sessionCheckTimeout);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    } catch (error) {
      console.error("💥 Error checking stored session:", error);
      await AsyncStorage.removeItem("user");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (user: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
    } catch (error) {
      console.error("Error storing session:", error);
    }
  };

  const logout = async () => {
    try {
      // Make API call to logout from backend
      await logoutUserAPI();

      // Clear local storage
      await AsyncStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if API call fails, clear local storage
      await AsyncStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  return (
    <UserContext.Provider value={{ state, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export type { User, UserState };

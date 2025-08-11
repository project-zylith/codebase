import { CreateUserRequest } from "../types/user";
import { API_ENDPOINTS } from "../utils/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LoginRequest {
  username: string;
  password: string;
}

// JWT Token utility functions
const TOKEN_KEY = "jwt_token";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// Get authorization headers with JWT token
const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const registerUser = async (userData: CreateUserRequest) => {
  try {
    console.log("frontend adapter (register) hit");
    const response = await fetch(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // Clone the response to avoid "Already read" error
    const responseClone = response.clone();

    // If registration successful, store the token
    if (response.ok) {
      try {
        const data = await response.json();
        if (data.token) {
          await storeToken(data.token);
          console.log("✅ Token stored after registration");
        }
      } catch (jsonError) {
        console.error("Error parsing registration response JSON:", jsonError);
      }
    }

    // Return the cloned response so it can be read again
    return responseClone;
  } catch (error) {
    console.error("Network error in registerUser:", error);
    console.warn(error);
    return null;
  }
};

export const loginUser = async (userData: LoginRequest) => {
  try {
    console.log("frontend adapter (login) hit");
    console.log("Attempting login to:", API_ENDPOINTS.AUTH.LOGIN);

    const response = await fetch(`${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      // Removed credentials: "include" - no longer needed for JWT
    });

    console.log("Login response status:", response.status);

    // Clone the response to avoid "Already read" error
    const responseClone = response.clone();

    // If login successful, store the token
    if (response.ok) {
      try {
        const data = await response.json();
        if (data.token) {
          await storeToken(data.token);
          console.log("✅ Token stored after login");
        }
      } catch (jsonError) {
        console.error("Error parsing login response JSON:", jsonError);
      }
    }

    // Return the cloned response so it can be read again
    return responseClone;
  } catch (error) {
    console.error("Network error in loginUser:", error);
    console.warn(error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("🔍 frontend adapter (getCurrentUser) hit");
    console.log("🔍 Attempting getCurrentUser from:", API_ENDPOINTS.AUTH.ME);

    const headers = await getAuthHeaders();
    console.log("🔍 Using headers:", headers);

    // Add timeout to prevent infinite hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ getCurrentUser request timeout after 10 seconds");
      controller.abort();
    }, 10000); // 10 second timeout

    const response = await fetch(`${API_ENDPOINTS.AUTH.ME}`, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      // Removed credentials: "include" - using JWT in Authorization header
    });

    clearTimeout(timeoutId);
    console.log("✅ getCurrentUser response status:", response.status);

    return response;
  } catch (error) {
    console.error("❌ Network error in getCurrentUser:", error);
    console.error("❌ Error type:", error.name);
    console.error("❌ Error message:", error.message);

    // Return null to indicate network error
    return null;
  }
};

export const logoutUser = async () => {
  try {
    console.log("frontend adapter (logout) hit");

    // Remove token from local storage
    await removeToken();
    console.log("✅ Token removed from storage");

    // Optional: Call backend logout endpoint
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: "POST",
      headers: headers,
      // Removed credentials: "include" - using JWT in Authorization header
    });

    return response;
  } catch (error) {
    console.error("Network error in logoutUser:", error);
    console.warn(error);
    return null;
  }
};

// Update user email
export const updateUserEmail = async (email: string) => {
  try {
    console.log("frontend adapter (updateUserEmail) hit");

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.AUTH.UPDATE_EMAIL}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ email }),
    });

    return response;
  } catch (error) {
    console.error("Network error in updateUserEmail:", error);
    return null;
  }
};

// Update user password
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    console.log("frontend adapter (updateUserPassword) hit");

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_ENDPOINTS.AUTH.UPDATE_PASSWORD}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return response;
  } catch (error) {
    console.error("Network error in updateUserPassword:", error);
    return null;
  }
};

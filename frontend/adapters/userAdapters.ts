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

    // If registration successful, store the token
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        await storeToken(data.token);
        console.log("✅ Token stored after registration");
      }
    }

    return response;
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

    // If login successful, store the token
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        await storeToken(data.token);
        console.log("✅ Token stored after login");
      }
    }

    return response;
  } catch (error) {
    console.error("Network error in loginUser:", error);
    console.warn(error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("frontend adapter (getCurrentUser) hit");
    console.log("Attempting getCurrentUser from:", API_ENDPOINTS.AUTH.ME);

    const headers = await getAuthHeaders();
    console.log("Using headers:", headers);

    const response = await fetch(`${API_ENDPOINTS.AUTH.ME}`, {
      method: "GET",
      headers: headers,
      // Removed credentials: "include" - using JWT in Authorization header
    });

    console.log("getCurrentUser response status:", response.status);

    return response;
  } catch (error) {
    console.error("Network error in getCurrentUser:", error);
    console.warn(error);
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

import { CreateUserRequest } from "../types/user";
import { API_ENDPOINTS } from "../utils/apiConfig";

export interface LoginRequest {
  username: string;
  password: string;
}

export const registerUser = async (userData: CreateUserRequest) => {
  try {
    console.log("frontend adapter (register) hit");
    return await fetch(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
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
      credentials: "include", // Important for session cookies
    });
    
    console.log("Login response status:", response.status);
    console.log("Login response headers:", response.headers);
    
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
    
    const response = await fetch(`${API_ENDPOINTS.AUTH.ME}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important for session cookies
    });
    
    console.log("getCurrentUser response status:", response.status);
    console.log("getCurrentUser response headers:", response.headers);
    
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
    return await fetch(`${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important for session cookies
    });
  } catch (error) {
    console.error("Network error in logoutUser:", error);
    console.warn(error);
    return null;
  }
};

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
    console.error(error);
    console.warn(error);
  }
};

export const loginUser = async (userData: LoginRequest) => {
  try {
    console.log("frontend adapter (login) hit");
    return await fetch(`${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include", // Important for session cookies
    });
  } catch (error) {
    console.error(error);
    console.warn(error);
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("frontend adapter (getCurrentUser) hit");
    return await fetch(`${API_ENDPOINTS.AUTH.ME}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important for session cookies
    });
  } catch (error) {
    console.error(error);
    console.warn(error);
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
    console.error(error);
    console.warn(error);
  }
};

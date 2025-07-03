import { CreateUserRequest } from "../types/user";
import { API_ENDPOINTS } from "../utils/apiConfig";

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

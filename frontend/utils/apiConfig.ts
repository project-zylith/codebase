// API Configuration
export const API_BASE_URL = "http://10.0.13.161:3000";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  TASKS: {
    LIST: `${API_BASE_URL}/api/tasks`,
    CREATE: `${API_BASE_URL}/api/tasks`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/tasks/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/tasks/${id}`,
    TOGGLE: (id: number) => `${API_BASE_URL}/api/tasks/${id}/toggle`,
  },
  AI: {
    INSIGHTS: `${API_BASE_URL}/api/insights`,
    FINAL_INSIGHT: `${API_BASE_URL}/api/finalInsight`,
  },
};

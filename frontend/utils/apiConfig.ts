// API Configuration
// must change this to the ip of the machine running the backend
export const API_BASE_URL_HOME = "http://192.168.1.189:3000";
export const API_BASE_URL_MARCY = "http://10.0.13.161:3000";
export const API_BASE_URL_WORKING = "http://192.168.56.1:3000"; // This IP works based on connection test
export const API_URL_TEMP = "http://192.168.86.44:3000";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL_MARCY}/api/auth/register`,
    LOGIN: `${API_BASE_URL_MARCY}/api/auth/login`,
    LOGOUT: `${API_BASE_URL_MARCY}/api/auth/logout`,
    ME: `${API_BASE_URL_MARCY}/api/auth/me`,
  },
  TASKS: {
    LIST: `${API_BASE_URL_MARCY}/api/tasks`,
    CREATE: `${API_BASE_URL_MARCY}/api/tasks`,
    UPDATE: (id: number) => `${API_BASE_URL_MARCY}/api/tasks/${id}`,
    DELETE: (id: number) => `${API_BASE_URL_MARCY}/api/tasks/${id}`,
    TOGGLE: (id: number) => `${API_BASE_URL_MARCY}/api/tasks/${id}/toggle`,
    TOGGLE_FAVORITE: (id: number) =>
      `${API_BASE_URL_MARCY}/api/tasks/${id}/toggle-favorite`,
    CLEANUP: `${API_BASE_URL_MARCY}/api/tasks/cleanup`,
  },
  AI: {
    INSIGHTS: `${API_BASE_URL_MARCY}/api/insights`,
    FINAL_INSIGHT: `${API_BASE_URL_MARCY}/api/finalInsight`,
  },
};

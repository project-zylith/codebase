// API Configuration
// must change this to the ip of the machine running the backend
export const API_BASE_URL_HOME = "http://192.168.1.189:3000";
export const API_BASE_URL_MARCY = "http://10.0.13.161:3000";
export const API_BASE_URL_WORKING = "http://192.168.56.1:3000"; // This IP works based on connection test
export const API_URL_TEMP = "http://192.168.86.44:3000";

// Use localhost for development, or the working URL if needed
export const API_BASE_URL = "http://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL_HOME}/api/auth/register`,
    LOGIN: `${API_BASE_URL_HOME}/api/auth/login`,
    LOGOUT: `${API_BASE_URL_HOME}/api/auth/logout`,
    ME: `${API_BASE_URL_HOME}/api/auth/me`,
  },
  TASKS: {
    LIST: `${API_BASE_URL_HOME}/api/tasks`,
    CREATE: `${API_BASE_URL_HOME}/api/tasks`,
    UPDATE: (id: number) => `${API_BASE_URL_HOME}/api/tasks/${id}`,
    DELETE: (id: number) => `${API_BASE_URL_HOME}/api/tasks/${id}`,
    TOGGLE: (id: number) => `${API_BASE_URL_HOME}/api/tasks/${id}/toggle`,
    TOGGLE_FAVORITE: (id: number) =>
      `${API_BASE_URL_HOME}/api/tasks/${id}/toggle-favorite`,
    CLEANUP: `${API_BASE_URL_HOME}/api/tasks/cleanup`,
  },
  NOTES: {
    LIST: `${API_BASE_URL_HOME}/api/notes`,
    CREATE: `${API_BASE_URL_HOME}/api/notes`,
    GET_BY_ID: (id: number) => `${API_BASE_URL_HOME}/api/notes/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL_HOME}/api/notes/${id}`,
    DELETE: (id: number) => `${API_BASE_URL_HOME}/api/notes/${id}`,
  },
  AI: {
    INSIGHTS: `${API_BASE_URL_HOME}/api/insights`,
    FINAL_INSIGHT: `${API_BASE_URL_HOME}/api/finalInsight`,
    NOTE_INSIGHT: `${API_BASE_URL_HOME}/api/noteInsight`,
  },
  GALAXIES: {
    LIST: `${API_BASE_URL_HOME}/api/galaxies`,
    CREATE: `${API_BASE_URL_HOME}/api/galaxies`,
    GET_BY_ID: (id: number) => `${API_BASE_URL_HOME}/api/galaxies/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL_HOME}/api/galaxies/${id}`,
    DELETE: (id: number) => `${API_BASE_URL_HOME}/api/galaxies/${id}`,
    GET_NOTES: (id: number) => `${API_BASE_URL_HOME}/api/galaxies/${id}/notes`,
    ASSIGN_NOTE: `${API_BASE_URL_HOME}/api/galaxies/assign-note`,
    GENERATE: `${API_BASE_URL_HOME}/api/generateGalaxy`,
    GENERATE_GALAXIES: `${API_BASE_URL_HOME}/api/galaxies/generate`,
    RESORT: `${API_BASE_URL_HOME}/api/reSortGalaxy`,
    GENERATE_INSIGHT: `${API_BASE_URL_HOME}/api/generateGalaxyInsight`,
  },
  SUBSCRIPTIONS: {
    PLANS: `${API_BASE_URL_HOME}/api/subscriptions/plans`,
    USER: `${API_BASE_URL_HOME}/api/subscriptions/user`,
    CREATE: `${API_BASE_URL_HOME}/api/subscriptions/create`,
    CANCEL: `${API_BASE_URL_HOME}/api/subscriptions/cancel`,
    PAYMENT_INTENT: `${API_BASE_URL_HOME}/api/subscriptions/payment-intent`,
    WEBHOOK: `${API_BASE_URL_HOME}/api/subscriptions/webhook`,
  },
};

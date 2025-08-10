// API Configuration Template
// Replace these URLs with your actual backend URLs

// Production backend URL (e.g., Railway, Heroku, etc.)
export const API_BASE_URL_PRODUCTION = "https://your-backend-domain.com";

// Development URLs (for local testing)
export const API_BASE_URL_LOCAL = "http://localhost:3000";
export const API_BASE_URL_DEV = "http://192.168.1.100:3000"; // Replace with your local IP

// Use production URL for builds, local for development
export const API_BASE_URL = API_BASE_URL_PRODUCTION;

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
    TOGGLE_FAVORITE: (id: number) =>
      `${API_BASE_URL}/api/tasks/${id}/toggle-favorite`,
    CLEANUP: `${API_BASE_URL}/api/tasks/cleanup`,
  },
  NOTES: {
    LIST: `${API_BASE_URL}/api/notes`,
    CREATE: `${API_BASE_URL}/api/notes`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/notes/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/notes/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/notes/${id}`,
  },
  AI: {
    INSIGHTS: `${API_BASE_URL}/api/insights`,
    FINAL_INSIGHT: `${API_BASE_URL}/api/finalInsight`,
    NOTE_INSIGHT: `${API_BASE_URL}/api/noteInsight`,
  },
  GALAXIES: {
    LIST: `${API_BASE_URL}/api/galaxies`,
    CREATE: `${API_BASE_URL}/api/galaxies`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/galaxies/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/galaxies/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/galaxies/${id}`,
    GET_NOTES: (id: number) => `${API_BASE_URL}/api/galaxies/${id}/notes`,
    ASSIGN_NOTE: `${API_BASE_URL}/api/galaxies/assign-note`,
    GENERATE: `${API_BASE_URL}/api/generateGalaxy`,
    GENERATE_GALAXIES: `${API_BASE_URL}/api/galaxies/generate`,
    RESORT: `${API_BASE_URL}/api/reSortGalaxy`,
    GENERATE_INSIGHT: `${API_BASE_URL}/api/generateGalaxyInsight`,
  },
  SUBSCRIPTIONS: {
    PLANS: `${API_BASE_URL}/api/subscriptions/plans`,
    USER: `${API_BASE_URL}/api/subscriptions/user`,
    CREATE: `${API_BASE_URL}/api/subscriptions/create`,
    CANCEL: `${API_BASE_URL}/api/subscriptions/cancel`,
    RESUBSCRIBE: `${API_BASE_URL}/api/subscriptions/resubscribe`,
    SWITCH_PLAN: `${API_BASE_URL}/api/subscriptions/switch-plan`,
    PAYMENT_INTENT: `${API_BASE_URL}/api/subscriptions/payment-intent`,
    WEBHOOK: `${API_BASE_URL}/api/subscriptions/webhook`,
  },
};

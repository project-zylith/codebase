// API Configuration
// Production backend URL
export const API_BASE_URL_PRODUCTION =
  "https://codebase-production-e8f2.up.railway.app";

// Development URLs (for local testing)
export const API_BASE_URL_HOME = "http://192.168.1.189:3000";
export const API_BASE_URL_MARCY = "http://10.0.13.161:3000";
export const API_BASE_URL_WORKING = "http://192.168.56.1:3000";
export const API_URL_TEMP = "http://192.168.86.44:3000";
export const API_BASE_URL_SPOTIFY = "http://10.21.127.117:3000";

// Temporarily use localhost for development debugging
export const API_BASE_URL = API_BASE_URL_PRODUCTION;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    UPDATE_EMAIL: `${API_BASE_URL}/api/auth/email`,
    UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/account`,
    APPLE_SIGN_IN: `${API_BASE_URL}/api/auth/apple-signin`,
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
    USER_USAGE: `${API_BASE_URL}/api/subscriptions/user/usage`,
    CREATE: `${API_BASE_URL}/api/subscriptions/create`,
    CANCEL: `${API_BASE_URL}/api/subscriptions/cancel`,
    RESUBSCRIBE: `${API_BASE_URL}/api/subscriptions/resubscribe`,
    SWITCH_PLAN: `${API_BASE_URL}/api/subscriptions/switch-plan`,
    PAYMENT_INTENT: `${API_BASE_URL}/api/subscriptions/payment-intent`,
    WEBHOOK: `${API_BASE_URL}/api/subscriptions/webhook`,
    // Apple IAP Receipt Validation Endpoints
    VALIDATE_APPLE_RECEIPT: `${API_BASE_URL}/api/subscriptions/validate-apple-receipt`,
    REFRESH_APPLE_RECEIPT: (id: number) =>
      `${API_BASE_URL}/api/subscriptions/${id}/refresh-apple-receipt`,
    APPLE_RECEIPT_STATUS: (id: number) =>
      `${API_BASE_URL}/api/subscriptions/${id}/apple-receipt-status`,
  },
  LOVE_LETTERS: {
    GET_ALL: `${API_BASE_URL}/api/love-letters`,
    CREATE: `${API_BASE_URL}/api/love-letters`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/love-letters/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/love-letters/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/love-letters/${id}`,
    GET_OCCASIONS: `${API_BASE_URL}/api/love-letters/occasions`,
  },
};

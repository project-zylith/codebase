import { API_ENDPOINTS } from "../utils/apiConfig";
import { getToken } from "./userAdapters";

export interface SubscriptionPlan {
  id: number;
  plan_name: string;
  price: number;
  duration_days: number | null;
  description: string;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date: string;
  canceled_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_name: string;
  price: number;
  description: string;
}

// Get authorization headers with JWT token
const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all available subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.PLANS, {
      method: "GET",
      headers: await getAuthHeaders(),
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

// Get current user's subscription
export const getUserSubscription = async (): Promise<{
  subscription: UserSubscription | null;
}> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.USER, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    throw error;
  }
};

// Get current user's usage counts
export const getUserUsage = async (): Promise<{
  success: boolean;
  usage: {
    notes: { current: number; limit: number; remaining: number };
    tasks: { current: number; limit: number; remaining: number };
    galaxies: { current: number; limit: number; remaining: number };
    ai_insights: { current: number; limit: number; remaining: number };
  };
  limits: {
    note_limit: number;
    task_limit: number;
    galaxy_limit: number;
    ai_insights_per_day: number;
  };
}> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.USER_USAGE, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user usage:", error);
    throw error;
  }
};

// Create a new subscription
export const createSubscription = async (
  planId: number,
  paymentMethodId: string
): Promise<{
  subscription: {
    id: string;
    status: string;
    customerId: string;
    plan: SubscriptionPlan;
  };
  clientSecret: string;
}> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        planId,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // If response is not JSON (e.g., "Unauthorized"), use the text
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

// Cancel current subscription
export const cancelSubscription = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL, {
      method: "POST",
      headers: await getAuthHeaders(),
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // If response is not JSON (e.g., "Unauthorized"), use the text
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

// Resubscribe to canceled subscription
export const resubscribe = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.RESUBSCRIBE, {
      method: "POST",
      headers: await getAuthHeaders(),
      headers: {
        ...(await getAuthHeaders()),
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error resubscribing:", error);
    throw error;
  }
};

// Switch subscription plan
export const switchPlan = async (
  planId: number
): Promise<{
  message: string;
  newPlan: string;
  effectiveDate: string;
}> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.SWITCH_PLAN, {
      method: "POST",
      headers: await getAuthHeaders(),
      headers: {
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error switching plan:", error);
    throw error;
  }
};

// Create payment intent for client-side confirmation
export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
): Promise<{ clientSecret: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENT_INTENT, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // If response is not JSON (e.g., "Unauthorized"), use the text
        const textError = await response.text();
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

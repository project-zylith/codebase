import { API_ENDPOINTS } from "../utils/apiConfig";

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

// Get all available subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.PLANS, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

// Create payment intent for client-side confirmation
export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
): Promise<{ clientSecret: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENT_INTENT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

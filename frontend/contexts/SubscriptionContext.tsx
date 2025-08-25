import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getUserSubscription } from "../adapters/subscriptionAdapters";
import { useUser } from "./UserContext";

interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  plan_name: string;
  price: number;
  description: string;
  apple_receipt_data?: string;
  apple_transaction_id?: string;
  apple_validation_status?: string;
}

interface SubscriptionState {
  subscription: UserSubscription | null;
  isLoading: boolean;
  error: string | null;
}

interface SubscriptionContextType {
  state: SubscriptionState;
  refreshSubscription: () => Promise<void>;
  clearError: () => void;
  openSubscriptionModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { state: userState } = useUser();
  const [state, setState] = useState<SubscriptionState>({
    subscription: null,
    isLoading: false,
    error: null,
  });

  // This will be set by the parent component that has the subscription modal
  const [modalHandler, setModalHandler] = useState<(() => void) | null>(null);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setOpenSubscriptionModalHandler = useCallback((handler: () => void) => {
    setModalHandler(() => handler);
  }, []);

  const openSubscriptionModal = useCallback(() => {
    if (modalHandler) {
      modalHandler();
    } else {
      console.warn("Subscription modal handler not set");
    }
  }, [modalHandler]);

  const refreshSubscription = useCallback(async () => {
    if (!userState.user) {
      console.log("🔄 No user, clearing subscription state");
      setState({ subscription: null, isLoading: false, error: null });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      console.log(
        "🔄 Refreshing subscription state for user:",
        userState.user.id
      );
      const result = await getUserSubscription();

      console.log("📋 Subscription API result:", result);

      setState({
        subscription: result.subscription,
        isLoading: false,
        error: null,
      });

      console.log("✅ Subscription state refreshed:", result.subscription);
    } catch (error) {
      console.error("❌ Failed to refresh subscription:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to refresh subscription",
      }));
    }
  }, [userState.user]);

  // Refresh subscription when user changes
  useEffect(() => {
    if (userState.user) {
      refreshSubscription();
    } else {
      setState({ subscription: null, isLoading: false, error: null });
    }
  }, [userState.user, refreshSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        state,
        refreshSubscription,
        clearError,
        openSubscriptionModal,
        setOpenSubscriptionModalHandler,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

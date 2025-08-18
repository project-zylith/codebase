import { useState, useCallback } from "react";
import {
  iapService,
  ProductId,
  AppleReceiptValidationResponse,
  AppleReceiptStatusResponse,
} from "../services/iapService";

export interface UseAppleIAPReturn {
  // State
  isLoading: boolean;
  error: string | null;
  currentSubscription: AppleReceiptValidationResponse["subscription"] | null;

  // Actions
  purchaseProduct: (
    productId: ProductId,
    userToken: string,
    userId?: number
  ) => Promise<void>;
  validateReceipt: (
    receiptData: string,
    userToken: string,
    userId?: number
  ) => Promise<void>;
  refreshReceipt: (subscriptionId: number, userToken: string) => Promise<void>;
  checkReceiptStatus: (
    subscriptionId: number,
    userToken: string
  ) => Promise<void>;
  checkSubscriptionActive: (
    subscriptionId: number,
    userToken: string
  ) => Promise<boolean>;

  // Utilities
  clearError: () => void;
  resetState: () => void;
}

export const useAppleIAP = (): UseAppleIAPReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<
    AppleReceiptValidationResponse["subscription"] | null
  >(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setCurrentSubscription(null);
  }, []);

  const purchaseProduct = useCallback(
    async (productId: ProductId, userToken: string, userId?: number) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🛒 Starting purchase flow for:", productId);

        const result = await iapService.completePurchaseWithValidation(
          productId,
          userToken,
          userId
        );

        if (result.success && result.subscription) {
          setCurrentSubscription(result.subscription);
          console.log(
            "✅ Purchase completed successfully:",
            result.subscription
          );
        } else {
          throw new Error(result.error || "Purchase validation failed");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Purchase failed";
        setError(errorMessage);
        console.error("❌ Purchase failed:", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const validateReceipt = useCallback(
    async (receiptData: string, userToken: string, userId?: number) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🔍 Validating receipt...");

        const result = await iapService.validateAppleReceipt(
          receiptData,
          userToken,
          userId
        );

        if (result.success && result.subscription) {
          setCurrentSubscription(result.subscription);
          console.log("✅ Receipt validation successful:", result.subscription);
        } else {
          throw new Error(result.error || "Receipt validation failed");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Receipt validation failed";
        setError(errorMessage);
        console.error("❌ Receipt validation failed:", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshReceipt = useCallback(
    async (subscriptionId: number, userToken: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🔄 Refreshing receipt for subscription:", subscriptionId);

        const result = await iapService.refreshAppleReceipt(
          subscriptionId,
          userToken
        );

        if (result.success && result.subscription) {
          setCurrentSubscription(result.subscription);
          console.log("✅ Receipt refresh successful:", result.subscription);
        } else {
          throw new Error(result.error || "Receipt refresh failed");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Receipt refresh failed";
        setError(errorMessage);
        console.error("❌ Receipt refresh failed:", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const checkReceiptStatus = useCallback(
    async (subscriptionId: number, userToken: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "📋 Checking receipt status for subscription:",
          subscriptionId
        );

        const result = await iapService.getAppleReceiptStatus(
          subscriptionId,
          userToken
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to get receipt status");
        }

        console.log("✅ Receipt status retrieved:", result.status);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to check receipt status";
        setError(errorMessage);
        console.error("❌ Failed to check receipt status:", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const checkSubscriptionActive = useCallback(
    async (subscriptionId: number, userToken: string): Promise<boolean> => {
      try {
        console.log("🔍 Checking if subscription is active:", subscriptionId);

        const isActive = await iapService.isSubscriptionActive(
          subscriptionId,
          userToken
        );

        console.log("📋 Subscription active status:", isActive);
        return isActive;
      } catch (err: any) {
        console.error("❌ Failed to check subscription status:", err);
        return false;
      }
    },
    []
  );

  return {
    // State
    isLoading,
    error,
    currentSubscription,

    // Actions
    purchaseProduct,
    validateReceipt,
    refreshReceipt,
    checkReceiptStatus,
    checkSubscriptionActive,

    // Utilities
    clearError,
    resetState,
  };
};

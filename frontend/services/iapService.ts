import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
  Product,
  ProductPurchase,
  PurchaseError,
} from "react-native-iap";
import { API_ENDPOINTS } from "../utils/apiConfig";

// Apple IAP Product IDs - these must match what you configure in App Store Connect
export const PRODUCT_IDS = {
  BASIC_MONTHLY: "com.renai.basic_monthly2",
  BASIC_ANNUAL: "com.renai.basic_annual",
  PRO_MONTHLY: "com.renai.pro_monthly",
  PRO_ANNUAL: "com.renai.pro_annual",
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

export interface IAPProduct {
  id: string;
  name: string;
  price: string;
  period: string;
  productId: ProductId;
  features: string[];
}

// Apple IAP Backend Integration Types
export interface AppleReceiptValidationRequest {
  receiptData: string;
  userId?: number;
}

export interface AppleReceiptValidationResponse {
  success: boolean;
  subscription?: {
    id: number;
    userId: number;
    planId: number;
    status: string;
    appleProductId: string;
    appleTransactionId: string;
    appleOriginalTransactionId: string;
    applePurchaseDate: string;
    appleExpirationDate?: string;
    appleIsTrialPeriod: boolean;
    appleIsIntroOfferPeriod: boolean;
    appleValidationEnvironment: string;
    appleLastValidated: string;
    appleValidationStatus: string;
  };
  error?: string;
  message?: string;
}

export interface AppleReceiptRefreshRequest {
  subscriptionId: number;
}

export interface AppleReceiptStatusResponse {
  success: boolean;
  status?: {
    isValid: boolean;
    environment: string;
    lastValidated: string;
    validationStatus: string;
    expirationDate?: string;
    isTrialPeriod: boolean;
    isIntroOfferPeriod: boolean;
  };
  error?: string;
}

export const SUBSCRIPTION_PLANS: IAPProduct[] = [
  {
    id: "basic_monthly",
    name: "Basic Monthly",
    price: "$10",
    period: "/month",
    productId: PRODUCT_IDS.BASIC_MONTHLY,
    features: [
      "Access to essential features",
      "Billed monthly",
      "Cancel anytime",
    ],
  },
  {
    id: "basic_annual",
    name: "Basic Annual",
    price: "$100",
    period: "/year",
    productId: PRODUCT_IDS.BASIC_ANNUAL,
    features: [
      "Access to essential features",
      "Billed annually",
      "Save 17% vs monthly",
      "Cancel anytime",
    ],
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    price: "$20",
    period: "/month",
    productId: PRODUCT_IDS.PRO_MONTHLY,
    features: ["Advanced features", "Billed monthly", "Cancel anytime"],
  },
  {
    id: "pro_annual",
    name: "Pro Annual",
    price: "$200",
    period: "/year",
    productId: PRODUCT_IDS.PRO_ANNUAL,
    features: [
      "Advanced features",
      "Billed annually",
      "Save 17% vs monthly",
      "Cancel anytime",
    ],
  },
];

class IAPService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await initConnection();
      this.isInitialized = true;
      console.log("✅ IAP initialized successfully");
    } catch (error: any) {
      console.error("❌ Failed to initialize IAP:", error);

      // Handle specific IAP errors
      if (error.code === "E_IAP_NOT_AVAILABLE") {
        throw new Error(
          "IAP not available. Please test on a real device with TestFlight."
        );
      }

      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    await this.initialize();

    try {
      const productIds = Object.values(PRODUCT_IDS);
      const products = await getProducts({ skus: productIds });
      console.log("✅ Products fetched:", products.length);
      return products;
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      throw error;
    }
  }

  async purchaseProduct(productId: ProductId): Promise<ProductPurchase> {
    await this.initialize();

    try {
      console.log("🛒 Requesting purchase for:", productId);
      console.log(
        "📱 About to call requestPurchase() - this should show Apple's modal"
      );

      const purchase = await requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      console.log("🔄 requestPurchase() completed, response:", purchase);

      if (
        purchase &&
        typeof purchase === "object" &&
        "transactionId" in purchase
      ) {
        console.log("✅ Purchase successful:", purchase.transactionId);

        // Finish the transaction
        await finishTransaction({ purchase, isConsumable: false });

        return purchase;
      } else {
        throw new Error("Invalid purchase response");
      }
    } catch (error) {
      console.error("❌ Purchase failed:", error);
      throw error;
    }
  }

  async getAvailablePurchases(): Promise<ProductPurchase[]> {
    await this.initialize();

    try {
      const purchases = await getAvailablePurchases();
      console.log("✅ Available purchases:", purchases.length);
      return purchases;
    } catch (error) {
      console.error("❌ Failed to get available purchases:", error);
      throw error;
    }
  }

  async restorePurchases(): Promise<ProductPurchase[]> {
    await this.initialize();

    try {
      const purchases = await getAvailablePurchases();
      console.log("✅ Restored purchases:", purchases.length);
      return purchases;
    } catch (error) {
      console.error("❌ Failed to restore purchases:", error);
      throw error;
    }
  }

  getPlanById(id: string): IAPProduct | undefined {
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
  }

  getPlanByProductId(productId: ProductId): IAPProduct | undefined {
    return SUBSCRIPTION_PLANS.find((plan) => plan.productId === productId);
  }

  isProductIdValid(productId: string): productId is ProductId {
    return Object.values(PRODUCT_IDS).includes(productId as ProductId);
  }

  // ===== Apple IAP Backend Integration =====

  /**
   * Validate Apple receipt with backend server
   * This should be called after a successful purchase to verify the receipt
   */
  async validateAppleReceipt(
    receiptData: string,
    userToken: string,
    userId?: number,
    productId?: ProductId
  ): Promise<AppleReceiptValidationResponse> {
    try {
      console.log("🔍 Validating Apple receipt with backend...");
      console.log("📄 Receipt data length:", receiptData.length);
      console.log(
        "📄 Receipt data (first 100 chars):",
        receiptData.substring(0, 100)
      );
      console.log("🔑 User token present:", !!userToken);
      console.log(
        "🔑 User token (first 20 chars):",
        userToken ? userToken.substring(0, 20) + "..." : "undefined"
      );
      console.log("👤 User ID:", userId);
      console.log("📱 Product ID:", productId);

      const requestBody = {
        receiptData,
        userId,
        productId: productId || "unknown",
      };
      console.log("📦 Request body:", JSON.stringify(requestBody, null, 2));
      console.log(
        "📦 Request body stringified length:",
        JSON.stringify(requestBody).length
      );

      const response = await fetch(
        API_ENDPOINTS.SUBSCRIPTIONS.VALIDATE_APPLE_RECEIPT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Apple receipt validation successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Apple receipt validation failed:", error);
      throw error;
    }
  }

  /**
   * Refresh/Re-validate an existing Apple receipt
   * Useful for checking subscription status or refreshing expired receipts
   */
  async refreshAppleReceipt(
    subscriptionId: number,
    userToken: string
  ): Promise<AppleReceiptValidationResponse> {
    try {
      console.log(
        "🔄 Refreshing Apple receipt for subscription:",
        subscriptionId
      );

      const response = await fetch(
        API_ENDPOINTS.SUBSCRIPTIONS.REFRESH_APPLE_RECEIPT(subscriptionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            subscriptionId,
          } as AppleReceiptRefreshRequest),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Apple receipt refresh successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Apple receipt refresh failed:", error);
      throw error;
    }
  }

  /**
   * Get the current Apple receipt validation status
   * Useful for checking if a subscription is still valid
   */
  async getAppleReceiptStatus(
    subscriptionId: number,
    userToken: string
  ): Promise<AppleReceiptStatusResponse> {
    try {
      console.log(
        "📋 Getting Apple receipt status for subscription:",
        subscriptionId
      );

      const response = await fetch(
        API_ENDPOINTS.SUBSCRIPTIONS.APPLE_RECEIPT_STATUS(subscriptionId),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Apple receipt status retrieved:", result);
      return result;
    } catch (error) {
      console.error("❌ Failed to get Apple receipt status:", error);
      throw error;
    }
  }

  /**
   * Complete purchase flow with backend validation
   * This is the main method that should be used for purchases
   */
  async completePurchaseWithValidation(
    productId: ProductId,
    userToken: string,
    userId?: number
  ): Promise<AppleReceiptValidationResponse> {
    try {
      console.log("🛒 Starting complete purchase flow for:", productId);

      // Step 1: Request the purchase from Apple
      const purchase = await this.purchaseProduct(productId);
      console.log("✅ Apple purchase successful:", purchase.transactionId);

      // Step 2: Get the completed purchase with receipt data
      // We need to wait a moment and then get available purchases to get the receipt
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

      const availablePurchases = await this.getAvailablePurchases();
      const completedPurchase = availablePurchases.find(
        (p) => p.transactionId === purchase.transactionId
      );

      if (!completedPurchase) {
        throw new Error("Could not find completed purchase with receipt data");
      }

      console.log(
        "✅ Found completed purchase:",
        completedPurchase.transactionId
      );

      // Debug: Log all available properties
      console.log("🔍 Completed purchase object properties:", {
        transactionId: completedPurchase.transactionId,
        transactionReceipt: completedPurchase.transactionReceipt
          ? "Present"
          : "Missing",
        purchaseToken: completedPurchase.purchaseToken ? "Present" : "Missing",
        originalTransactionIdentifierIOS:
          completedPurchase.originalTransactionIdentifierIOS
            ? "Present"
            : "Missing",
        productId: completedPurchase.productId,
      });

      // Step 3: Extract receipt data from completed purchase
      // On iOS, receipt data is typically in the transactionReceipt property
      let receiptData: string = "";

      console.log("🔍 Starting receipt data extraction...");
      console.log(
        "🔍 transactionReceipt:",
        completedPurchase.transactionReceipt ? "Present" : "Missing"
      );
      console.log(
        "🔍 purchaseToken:",
        completedPurchase.purchaseToken ? "Present" : "Missing"
      );
      console.log(
        "🔍 originalTransactionIdentifierIOS:",
        completedPurchase.originalTransactionIdentifierIOS
          ? "Present"
          : "Missing"
      );

      if (completedPurchase.transactionReceipt) {
        receiptData = completedPurchase.transactionReceipt;
        console.log("✅ Using transactionReceipt for receipt data");
      } else if (completedPurchase.purchaseToken) {
        receiptData = completedPurchase.purchaseToken;
        console.log("✅ Using purchaseToken for receipt data");
      } else if (completedPurchase.originalTransactionIdentifierIOS) {
        receiptData = completedPurchase.originalTransactionIdentifierIOS;
        console.log(
          "✅ Using originalTransactionIdentifierIOS for receipt data"
        );
      } else {
        // For iOS, we might need to get the receipt from the app bundle
        console.log(
          "⚠️ No receipt data found in purchase object, attempting to get app receipt"
        );
        try {
          // Try to get the app receipt from the bundle
          const appReceipt = await this.getAppReceipt();
          if (appReceipt) {
            receiptData = appReceipt;
            console.log("✅ Using app receipt for receipt data");
          } else {
            // Last resort: use transaction ID
            receiptData = completedPurchase.transactionId || "";
            console.warn(
              "⚠️ No receipt data found, using transaction ID as fallback"
            );
          }
        } catch (receiptError) {
          console.warn("⚠️ Failed to get app receipt:", receiptError);
          receiptData = completedPurchase.transactionId || "";
          console.warn("⚠️ Using transaction ID as fallback");
        }
      }

      console.log("🔍 Final receipt data length:", receiptData.length);
      console.log(
        "🔍 Final receipt data (first 100 chars):",
        receiptData.substring(0, 100)
      );
      console.log("🔍 Receipt data is empty:", receiptData.length === 0);

      // Step 4: Validate receipt with backend
      const validationResult = await this.validateAppleReceipt(
        receiptData,
        userToken,
        userId,
        productId
      );

      if (validationResult.success) {
        console.log("🎉 Complete purchase flow successful!");
        return validationResult;
      } else {
        throw new Error(validationResult.error || "Receipt validation failed");
      }
    } catch (error) {
      console.error("❌ Complete purchase flow failed:", error);
      throw error;
    }
  }

  /**
   * Get the app receipt from the iOS bundle
   * This is useful when individual purchase receipts are not available
   */
  private async getAppReceipt(): Promise<string | null> {
    try {
      // For now, we'll return null since react-native-iap doesn't have a direct method
      // In a real implementation, you might need to use a native module or different approach
      console.log("📱 App receipt method called (not implemented yet)");
      return null;
    } catch (error) {
      console.error("❌ Failed to get app receipt:", error);
      return null;
    }
  }

  /**
   * Check if a subscription is active based on Apple receipt status
   */
  async isSubscriptionActive(
    subscriptionId: number,
    userToken: string
  ): Promise<boolean> {
    try {
      const status = await this.getAppleReceiptStatus(
        subscriptionId,
        userToken
      );
      return status.success && status.status?.isValid === true;
    } catch (error) {
      console.error("❌ Failed to check subscription status:", error);
      return false;
    }
  }
}

export const iapService = new IAPService();
export default iapService;

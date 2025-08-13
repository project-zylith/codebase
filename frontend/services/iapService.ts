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

// Apple IAP Product IDs - these must match what you configure in App Store Connect
export const PRODUCT_IDS = {
  BASIC_MONTHLY: "com.renai.basic_monthly",
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

      const purchase = await requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

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
}

export const iapService = new IAPService();
export default iapService;

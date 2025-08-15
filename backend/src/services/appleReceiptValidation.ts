import fetch from "node-fetch";

export interface AppleReceiptValidationResponse {
  status: number;
  environment: string;
  receipt: {
    in_app: Array<{
      product_id: string;
      transaction_id: string;
      original_transaction_id: string;
      purchase_date_ms: string;
      expires_date_ms?: string;
      cancellation_date_ms?: string;
      is_trial_period?: string;
      is_in_intro_offer_period?: string;
    }>;
    bundle_id: string;
    application_version: string;
    original_application_version: string;
    creation_date_ms: string;
    expiration_date_ms?: string;
  };
  latest_receipt_info?: Array<{
    product_id: string;
    transaction_id: string;
    original_transaction_id: string;
    purchase_date_ms: string;
    expires_date_ms?: string;
    cancellation_date_ms?: string;
    is_trial_period?: string;
    is_in_intro_offer_period?: string;
  }>;
  pending_renewal_info?: Array<{
    auto_renew_product_id: string;
    auto_renew_status: string;
    expiration_intent: string;
    original_transaction_id: string;
    is_in_billing_retry_period: string;
    product_id: string;
    price_increase_status: string;
  }>;
}

export interface ReceiptValidationResult {
  isValid: boolean;
  environment: "production" | "sandbox";
  productId?: string;
  transactionId?: string;
  originalTransactionId?: string;
  purchaseDate?: Date;
  expirationDate?: Date;
  isTrialPeriod?: boolean;
  isIntroOfferPeriod?: boolean;
  error?: string;
}

export class AppleReceiptValidator {
  private readonly productionUrl = "https://buy.itunes.apple.com/verifyReceipt";
  private readonly sandboxUrl =
    "https://sandbox.itunes.apple.com/verifyReceipt";

  /**
   * Validates an Apple receipt against both production and sandbox environments
   * @param receiptData Base64 encoded receipt data
   * @returns ReceiptValidationResult with validation details
   */
  async validateReceipt(receiptData: string): Promise<ReceiptValidationResult> {
    try {
      // First, try production environment
      const productionResult = await this.validateWithEnvironment(
        receiptData,
        "production"
      );

      if (productionResult.isValid) {
        return productionResult;
      }

      // If production fails with sandbox receipt error, try sandbox
      if (
        productionResult.error?.includes("Sandbox receipt used in production")
      ) {
        console.log(
          "🔄 Production validation failed, trying sandbox environment..."
        );
        const sandboxResult = await this.validateWithEnvironment(
          receiptData,
          "sandbox"
        );
        return sandboxResult;
      }

      return productionResult;
    } catch (error) {
      console.error("❌ Receipt validation error:", error);
      return {
        isValid: false,
        environment: "production",
        error:
          error instanceof Error ? error.message : "Unknown validation error",
      };
    }
  }

  /**
   * Validates receipt against a specific environment
   * @param receiptData Base64 encoded receipt data
   * @param environment 'production' or 'sandbox'
   * @returns ReceiptValidationResult
   */
  private async validateWithEnvironment(
    receiptData: string,
    environment: "production" | "sandbox"
  ): Promise<ReceiptValidationResult> {
    const url =
      environment === "production" ? this.productionUrl : this.sandboxUrl;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "receipt-data": receiptData,
          password: process.env.APPLE_SHARED_SECRET, // Your app-specific shared secret
          "exclude-old-transactions": false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AppleReceiptValidationResponse = await response.json();

      return this.processValidationResponse(result, environment);
    } catch (error) {
      console.error(`❌ ${environment} validation error:`, error);
      return {
        isValid: false,
        environment,
        error:
          error instanceof Error
            ? error.message
            : `Failed to validate with ${environment}`,
      };
    }
  }

  /**
   * Processes the Apple validation response and extracts relevant information
   * @param response Apple's validation response
   * @param environment The environment that was validated against
   * @returns Processed ReceiptValidationResult
   */
  private processValidationResponse(
    response: AppleReceiptValidationResponse,
    environment: "production" | "sandbox"
  ): ReceiptValidationResult {
    // Check if the response indicates success
    if (response.status === 0) {
      // Success - receipt is valid
      const latestReceipt =
        response.latest_receipt_info?.[0] || response.receipt.in_app?.[0];

      if (!latestReceipt) {
        return {
          isValid: false,
          environment,
          error: "No valid purchase found in receipt",
        };
      }

      return {
        isValid: true,
        environment,
        productId: latestReceipt.product_id,
        transactionId: latestReceipt.transaction_id,
        originalTransactionId: latestReceipt.original_transaction_id,
        purchaseDate: new Date(parseInt(latestReceipt.purchase_date_ms)),
        expirationDate: latestReceipt.expires_date_ms
          ? new Date(parseInt(latestReceipt.expires_date_ms))
          : undefined,
        isTrialPeriod: latestReceipt.is_trial_period === "true",
        isIntroOfferPeriod: latestReceipt.is_in_intro_offer_period === "true",
      };
    }

    // Handle specific error status codes
    const errorMessage = this.getErrorMessage(response.status);

    return {
      isValid: false,
      environment,
      error: errorMessage,
    };
  }

  /**
   * Maps Apple status codes to human-readable error messages
   * @param status Apple status code
   * @returns Error message
   */
  private getErrorMessage(status: number): string {
    const errorMessages: { [key: number]: string } = {
      0: "Valid receipt",
      21000: "The App Store could not read the JSON object you provided",
      21002: "The data in the receipt-data property was malformed",
      21003: "The receipt could not be authenticated",
      21004:
        "The shared secret you provided does not match the shared secret on file for your account",
      21005: "The receipt server is not currently available",
      21006: "This receipt is valid but the subscription has expired",
      21007:
        "This receipt is from the test environment, but it was sent to the production environment for verification",
      21008:
        "This receipt is from the production environment, but it was sent to the test environment for verification",
      21010: "This receipt could not be authorized",
      21099: "Internal data access error",
    };

    return errorMessages[status] || `Unknown error with status code: ${status}`;
  }

  /**
   * Checks if a subscription is active based on expiration date
   * @param expirationDate The expiration date from the receipt
   * @returns boolean indicating if subscription is active
   */
  isSubscriptionActive(expirationDate?: Date): boolean {
    if (!expirationDate) {
      return false;
    }

    const now = new Date();
    return expirationDate > now;
  }

  /**
   * Extracts all in-app purchases from a receipt
   * @param response Apple's validation response
   * @returns Array of purchase information
   */
  extractAllPurchases(response: AppleReceiptValidationResponse): Array<{
    productId: string;
    transactionId: string;
    originalTransactionId: string;
    purchaseDate: Date;
    expirationDate?: Date;
    isTrialPeriod: boolean;
    isIntroOfferPeriod: boolean;
  }> {
    const purchases: Array<{
      productId: string;
      transactionId: string;
      originalTransactionId: string;
      purchaseDate: Date;
      expirationDate?: Date;
      isTrialPeriod: boolean;
      isIntroOfferPeriod: boolean;
    }> = [];

    // Use latest_receipt_info if available (for auto-renewable subscriptions)
    const purchaseData =
      response.latest_receipt_info || response.receipt.in_app;

    if (purchaseData) {
      purchaseData.forEach((purchase) => {
        purchases.push({
          productId: purchase.product_id,
          transactionId: purchase.transaction_id,
          originalTransactionId: purchase.original_transaction_id,
          purchaseDate: new Date(parseInt(purchase.purchase_date_ms)),
          expirationDate: purchase.expires_date_ms
            ? new Date(parseInt(purchase.expires_date_ms))
            : undefined,
          isTrialPeriod: purchase.is_trial_period === "true",
          isIntroOfferPeriod: purchase.is_in_intro_offer_period === "true",
        });
      });
    }

    return purchases;
  }
}

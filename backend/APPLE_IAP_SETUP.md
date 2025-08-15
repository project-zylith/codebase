# 🍎 Apple In-App Purchase Receipt Validation Setup

This guide will help you set up server-side receipt validation for your REN|AI app's iOS in-app purchases.

## 📋 Prerequisites

1. **Apple Developer Account** with active membership
2. **App Store Connect** access for your app
3. **App-specific shared secret** from App Store Connect
4. **In-app purchase products** configured in App Store Connect

## 🔧 Setup Steps

### 1. Get Your Apple Shared Secret

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access** → **Keys** → **In-App Purchase**
3. Generate a new key or use an existing one
4. Copy the **Shared Secret** (this is what you'll use as `APPLE_SHARED_SECRET`)

### 2. Configure Your Environment

Add the following to your `.env` file:

```bash
# Apple In-App Purchase Configuration
APPLE_SHARED_SECRET=your_actual_shared_secret_here
```

### 3. Run Database Migrations

```bash
cd backend
npm run migrate
```

This will create the necessary database fields for storing Apple receipt data.

### 4. Update Your Subscription Plans

You need to link your subscription plans with Apple's product IDs. Update your subscription plans in the database:

```sql
-- Example: Update your subscription plans with Apple product IDs
UPDATE subscription_plans
SET apple_product_id = 'com.renai.basic_monthly2'
WHERE plan_name = 'Basic Monthly';

UPDATE subscription_plans
SET apple_product_id = 'com.renai.basic_annual'
WHERE plan_name = 'Basic Annual';

UPDATE subscription_plans
SET apple_product_id = 'com.renai.pro_monthly'
WHERE plan_name = 'Pro Monthly';

UPDATE subscription_plans
SET apple_product_id = 'com.renai.pro_annual'
WHERE plan_name = 'Pro Annual';
```

## 🚀 API Endpoints

### Validate Apple Receipt

**POST** `/api/subscriptions/validate-apple-receipt`

Validates an Apple receipt and creates/updates a subscription.

**Request Body:**

```json
{
  "receiptData": "base64_encoded_receipt_data",
  "productId": "com.renai.basic_monthly2"
}
```

**Response:**

```json
{
  "success": true,
  "subscription": {
    "id": 1,
    "user_id": 123,
    "plan_id": 1,
    "status": "active",
    "apple_transaction_id": "1000000123456789",
    "apple_product_id": "com.renai.basic_monthly2",
    "apple_purchase_date": "2025-01-15T10:30:00.000Z",
    "apple_expiration_date": "2025-02-15T10:30:00.000Z"
  },
  "validation": {
    "environment": "production",
    "transactionId": "1000000123456789",
    "productId": "com.renai.basic_monthly2",
    "purchaseDate": "2025-01-15T10:30:00.000Z",
    "expirationDate": "2025-02-15T10:30:00.000Z",
    "isTrialPeriod": false,
    "isIntroOfferPeriod": false
  }
}
```

### Refresh Receipt Validation

**POST** `/api/subscriptions/:subscriptionId/refresh-apple-receipt`

Refreshes the validation of an existing Apple receipt.

### Get Receipt Status

**GET** `/api/subscriptions/:subscriptionId/apple-receipt-status`

Gets the current Apple receipt validation status for a subscription.

## 📱 Frontend Integration

### 1. Install react-native-iap

```bash
cd frontend
npm install react-native-iap
```

### 2. Update Your IAP Service

```typescript
// frontend/services/iapService.ts
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from "react-native-iap";

export const validateAppleReceipt = async (
  receiptData: string,
  productId: string
) => {
  try {
    const response = await fetch("/api/subscriptions/validate-apple-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${yourAuthToken}`, // Your auth token
      },
      body: JSON.stringify({
        receiptData,
        productId,
      }),
    });

    if (!response.ok) {
      throw new Error("Receipt validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Receipt validation error:", error);
    throw error;
  }
};

// Set up purchase listeners
export const setupPurchaseListeners = () => {
  const purchaseUpdateSubscription = purchaseUpdatedListener(
    async (purchase: ProductPurchase) => {
      try {
        // Validate the receipt with your server
        const validationResult = await validateAppleReceipt(
          purchase.transactionReceipt!,
          purchase.productId
        );

        if (validationResult.success) {
          console.log("✅ Receipt validated successfully");
          // Handle successful validation (e.g., unlock features)
        }
      } catch (error) {
        console.error("❌ Receipt validation failed:", error);
      }
    }
  );

  const purchaseErrorSubscription = purchaseErrorListener(
    (error: PurchaseError) => {
      console.error("❌ Purchase error:", error);
    }
  );

  return () => {
    purchaseUpdateSubscription?.remove();
    purchaseErrorSubscription?.remove();
  };
};
```

## 🧪 Testing

### 1. Sandbox Testing

- Use TestFlight builds for testing
- Create sandbox test accounts in App Store Connect
- Test the full purchase flow in sandbox environment

### 2. Production Testing

- Submit your app for review
- Ensure in-app purchases are approved
- Test with real purchases (small amounts recommended)

## 🔒 Security Considerations

1. **Never expose your shared secret** in client-side code
2. **Always validate receipts server-side** before granting access
3. **Store receipt data securely** in your database
4. **Implement proper authentication** for all receipt validation endpoints
5. **Handle receipt refresh** for subscription renewals

## 📊 Monitoring & Debugging

### Logs to Watch

- Receipt validation attempts
- Environment switching (production → sandbox)
- Transaction processing
- Validation failures

### Common Issues

1. **"Sandbox receipt used in production"** - Normal during testing
2. **"Invalid shared secret"** - Check your APPLE_SHARED_SECRET
3. **"Receipt not found"** - Verify receipt data format
4. **"Product ID mismatch"** - Ensure apple_product_id is set correctly

## 🔄 Receipt Refresh Strategy

For auto-renewable subscriptions, implement a receipt refresh strategy:

1. **On app launch** - Refresh receipt validation
2. **Before granting access** - Verify current receipt status
3. **On subscription changes** - Update local state
4. **Periodic refresh** - Every 24 hours for active subscriptions

## 📚 Additional Resources

- [Apple In-App Purchase Programming Guide](https://developer.apple.com/documentation/storekit/in-app_purchase)
- [Receipt Validation Programming Guide](https://developer.apple.com/documentation/appstorereceipts)
- [App Store Server API](https://developer.apple.com/documentation/appstoreserverapi)

## 🎯 Next Steps

1. ✅ Set up your Apple shared secret
2. ✅ Run database migrations
3. ✅ Update subscription plans with Apple product IDs
4. ✅ Test receipt validation in sandbox
5. ✅ Integrate with your frontend IAP flow
6. ✅ Deploy and test in production

Your server-side receipt validation is now ready to handle iOS in-app purchases securely! 🚀

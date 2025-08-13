# Apple IAP Setup Guide for REN|AI

This guide will help you set up Apple In-App Purchases (IAP) in App Store Connect to match the subscription plans in your REN|AI app.

## 📱 App Store Connect Configuration

### 1. Create Subscription Groups

1. **Go to App Store Connect** → Your App → Features → In-App Purchases
2. **Create a new Subscription Group** called "REN|AI Premium Features"

### 2. Create Subscription Products

Create **4 subscription products** with the exact IDs and pricing:

#### Basic Monthly Subscription

- **Product ID**: `com.renai.basic_monthly`
- **Reference Name**: Basic Monthly
- **Subscription Group**: REN|AI Premium Features
- **Subscription Duration**: 1 Month
- **Price**: $10.00 USD
- **Localization**:
  - **Display Name**: Basic Monthly
  - **Description**: Access to essential features, billed monthly

#### Basic Annual Subscription

- **Product ID**: `com.renai.basic_annual`
- **Reference Name**: Basic Annual
- **Subscription Group**: REN|AI Premium Features
- **Subscription Duration**: 1 Year
- **Price**: $100.00 USD
- **Localization**:
  - **Display Name**: Basic Annual
  - **Description**: Access to essential features, billed annually

#### Pro Monthly Subscription

- **Product ID**: `com.renai.pro_monthly`
- **Reference Name**: Pro Monthly
- **Subscription Group**: REN|AI Premium Features
- **Subscription Duration**: 1 Month
- **Price**: $20.00 USD
- **Localization**:
  - **Display Name**: Pro Monthly
  - **Description**: Advanced features, billed monthly

#### Pro Annual Subscription

- **Product ID**: `com.renai.pro_annual`
- **Reference Name**: Pro Annual
- **Subscription Group**: REN|AI Premium Features
- **Subscription Duration**: 1 Year
- **Price**: $200.00 USD
- **Localization**:
  - **Display Name**: Pro Annual
  - **Description**: Advanced features, billed annually

### 3. Subscription Group Settings

- **Auto-Renewable**: ✅ Enabled
- **Free Trial**: Optional (you can add if desired)
- **Introductory Pricing**: Optional (you can add if desired)

## 🔧 App Configuration

### 1. Bundle Identifier

Ensure your app's bundle identifier in Xcode matches what you set in App Store Connect.

### 2. Capabilities

In Xcode, enable:

- **In-App Purchase** capability
- **StoreKit** framework

### 3. Product IDs

The app is already configured with these product IDs in `frontend/services/iapService.ts`:

```typescript
export const PRODUCT_IDS = {
  BASIC_MONTHLY: "com.renai.basic_monthly",
  BASIC_ANNUAL: "com.renai.basic_annual",
  PRO_MONTHLY: "com.renai.pro_monthly",
  PRO_ANNUAL: "com.renai.pro_annual",
};
```

## 📸 App Store Review Screenshots

### Required Screenshot Content

Apple requires your subscription screen to show:

✅ **Basic Monthly – $10/month**  
✅ **Basic Annual – $100/year**  
✅ **Pro Monthly – $20/month**  
✅ **Pro Annual – $200/year**  
✅ **Subscribe button** for each plan  
✅ **No placeholder text**  
✅ **Real app UI** (not mockups)  
✅ **Prices matching App Store Connect**

### What Apple Will Reject

❌ Blank areas or missing pricing  
❌ Mockups or wireframes  
❌ Prices that don't match App Store Connect  
❌ Missing "Subscribe" buttons

## 🧪 Testing

### 1. Sandbox Testing

1. **Create Sandbox Testers** in App Store Connect
2. **Use TestFlight** for testing IAP
3. **Test all subscription flows**:
   - Purchase
   - Restore
   - Cancel
   - Renew

### 2. Testing Checklist

- [ ] All 4 subscription plans display correctly
- [ ] Prices match exactly ($10, $100, $20, $200)
- [ ] Subscribe buttons work
- [ ] Purchase flow completes successfully
- [ ] Receipt validation works
- [ ] Subscription status updates correctly

## 🚀 Deployment

### 1. Submit for Review

1. **Ensure all IAP products are approved** in App Store Connect
2. **Test thoroughly** with TestFlight
3. **Submit app** with IAP enabled
4. **Provide clear screenshots** of subscription screen

### 2. Post-Launch

1. **Monitor IAP performance** in App Store Connect
2. **Track subscription metrics**
3. **Handle customer support** for billing issues
4. **Monitor App Store review feedback**

## 📋 Compliance Checklist

- [ ] Product IDs match exactly between app and App Store Connect
- [ ] Prices match exactly between app and App Store Connect
- [ ] All subscription plans have "Subscribe" buttons
- [ ] No placeholder text in subscription screen
- [ ] Real app UI (not mockups)
- [ ] Subscription terms clearly displayed
- [ ] Auto-renewal information provided
- [ ] Cancellation instructions included

## 🆘 Troubleshooting

### Common Issues

1. **"Product not found" error**

   - Check product ID spelling
   - Ensure product is approved in App Store Connect

2. **Purchase fails**

   - Verify sandbox tester account
   - Check device is signed into correct Apple ID

3. **Receipt validation fails**
   - Ensure backend can handle Apple receipts
   - Test with sandbox receipts first

### Support Resources

- [Apple Developer Documentation](https://developer.apple.com/in-app-purchase/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [StoreKit Framework](https://developer.apple.com/documentation/storekit)

## 📞 Need Help?

If you encounter issues:

1. **Check Apple Developer Forums**
2. **Review App Store Connect documentation**
3. **Contact Apple Developer Support** (if you have a paid developer account)
4. **Test with different sandbox accounts**

---

**Remember**: Apple is very strict about IAP compliance. Ensure your subscription screen exactly matches what you've configured in App Store Connect, and test thoroughly before submission.

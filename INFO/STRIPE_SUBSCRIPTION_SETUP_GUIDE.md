# Stripe Subscription Setup Guide

This guide will help you set up all subscription plans in both your database and Stripe.

## 🚀 Step-by-Step Setup

### 1. **Run the Database Migration**

First, add the Stripe ID columns to your subscription_plans table:

```bash
cd backend
npm run migrate
```

This will add `stripe_product_id` and `stripe_price_id` columns to your subscription_plans table.

### 2. **Set Up Stripe Products and Prices**

Run the Stripe setup script to create all products and prices:

```bash
cd backend
node setup-stripe-subscriptions.js
```

This script will:

- Create Stripe products for all paid plans
- Create Stripe prices for each product
- Skip free plans (Free Trial, Free Tier)
- Output the product and price IDs

### 3. **Update Database Seeds**

After running the Stripe setup, you'll see output like:

```
✅ Created product: Basic Monthly (ID: prod_1234567890)
✅ Created price: $9.99/month (ID: price_1234567890)
```

Copy these IDs and update your database seed file: `backend/database/seeds/006_subscription_plans.ts`

**Example of updated seed data:**

```typescript
{
  plan_name: "Basic Monthly",
  price: 9.99,
  duration_days: 30,
  description: "Monthly subscription with basic features and limited AI insights",
  note_limit: 100,
  task_limit: 50,
  galaxy_limit: 10,
  ai_insights_per_day: 20,
  stripe_product_id: "prod_1234567890", // Add this
  stripe_price_id: "price_1234567890",  // Add this
},
```

**Important Notes:**

- Free plans (Free Trial, Free Tier) should have `null` values for Stripe IDs
- Only paid plans need Stripe product and price IDs
- Make sure plan names match exactly between database and Stripe

### 4. **Apply Database Changes**

After updating the seeds, apply the changes:

```bash
npm run seed
```

### 5. **Test the Setup**

Start your backend server and test the subscription flow:

```bash
npm run dev
```

## 📋 Subscription Plans Overview

| Plan Name     | Price   | Duration  | Stripe Required | Features                                                           |
| ------------- | ------- | --------- | --------------- | ------------------------------------------------------------------ |
| Free Trial    | $0      | 14 days   | ❌ No           | 100 notes, 50 tasks, 10 galaxies, 20 AI insights/day               |
| Basic Monthly | $9.99   | 30 days   | ✅ Yes          | 100 notes, 50 tasks, 10 galaxies, 20 AI insights/day               |
| Basic Annual  | $99.99  | 365 days  | ✅ Yes          | 100 notes, 50 tasks, 10 galaxies, 20 AI insights/day (17% savings) |
| Pro Monthly   | $19.99  | 30 days   | ✅ Yes          | Unlimited notes, tasks, galaxies, AI insights                      |
| Pro Annual    | $199.99 | 365 days  | ✅ Yes          | Unlimited notes, tasks, galaxies, AI insights (17% savings)        |
| Enterprise    | $49.99  | 30 days   | ✅ Yes          | Unlimited + team collaboration, priority support                   |
| Free Tier     | $0      | Permanent | ❌ No           | 20 notes, 10 tasks, 3 galaxies, 5 AI insights/day                  |

## 🔧 Technical Details

### Database Schema

The `subscription_plans` table now includes:

- `stripe_product_id` (string, nullable)
- `stripe_price_id` (string, nullable)

### Stripe Integration

- Products are created with metadata containing plan limits
- Prices are created with recurring billing (monthly/yearly)
- All amounts are in USD cents
- Free plans don't require Stripe products/prices

### Backend Changes

- Updated `createSubscription` to use pre-created Stripe price IDs
- Updated `switchPlan` to use pre-created Stripe price IDs
- Added validation to ensure plans have Stripe IDs before processing

## 🧪 Testing

### Test Subscription Creation

1. Start your backend server
2. Use the frontend to select a paid plan
3. Enter test card details (use Stripe test cards)
4. Verify subscription is created in both database and Stripe

### Test Plan Switching

1. Create an active subscription
2. Switch to a different plan
3. Verify the change is reflected in both database and Stripe

### Test Free Plans

1. Verify free plans work without Stripe integration
2. Check that limits are properly enforced

## 🚨 Troubleshooting

### Common Issues

**"Plan not configured with Stripe" error:**

- Ensure the plan has `stripe_price_id` in the database
- Check that the Stripe setup script ran successfully

**"Product not found" error:**

- Verify the `stripe_product_id` is correct in the database
- Check that the product exists in your Stripe dashboard

**"Price not found" error:**

- Verify the `stripe_price_id` is correct in the database
- Check that the price exists in your Stripe dashboard

### Verification Steps

1. Check Stripe Dashboard → Products
2. Check Stripe Dashboard → Prices
3. Verify database has correct Stripe IDs
4. Test with Stripe test cards

## 📞 Support

If you encounter issues:

1. Check the Stripe Dashboard for product/price status
2. Verify database seed data is correct
3. Check backend logs for detailed error messages
4. Ensure your Stripe API keys are correct

## 🎯 Next Steps

After setup:

1. Test all subscription flows
2. Set up webhook endpoints for production
3. Configure Stripe Dashboard settings
4. Test with real payment methods (in production)

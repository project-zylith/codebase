# Stripe Integration Setup Guide

## Overview

This guide will help you complete the Stripe integration for your Renaissance app. The backend and frontend code has been implemented, but you need to configure Stripe and set up your environment variables.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Your app running locally
3. Environment variables configured

## Step 1: Set Up Stripe Account

### 1.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

### 1.2 Get API Keys

1. In the Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Keep these keys secure and never commit them to version control

### 1.3 Set Up Webhooks (Optional but Recommended)

1. In the Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/subscriptions/webhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 2: Configure Environment Variables

### 2.1 Backend Environment (.env)

Create or update your `backend/.env` file:

```env
# Database Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_NAME=renaissance

# Google AI API Key
API_KEY=your_google_ai_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
```

### 2.2 Frontend Environment

For Expo, you can set environment variables in your `app.json` or create a `.env` file:

```json
{
  "expo": {
    "extra": {
      "stripePublishableKey": "pk_test_your_stripe_publishable_key_here"
    }
  }
}
```

Or create a `.env` file in the frontend directory:

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Step 3: Test the Integration

### 3.1 Test Card Numbers

Use these test card numbers for testing:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

### 3.2 Test the Flow

1. Start your backend server: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm start`
3. Log in to your app
4. Go to Account screen
5. Click "Upgrade" to open the subscription modal
6. Select a plan and enter test card details
7. Complete the payment

## Step 4: Production Setup

### 4.1 Switch to Live Mode

1. In your Stripe Dashboard, switch from **Test mode** to **Live mode**
2. Get your live API keys
3. Update your environment variables with live keys
4. Set up production webhooks

### 4.2 Security Considerations

1. Never expose your secret key in frontend code
2. Always use HTTPS in production
3. Implement proper error handling
4. Set up monitoring and alerts in Stripe Dashboard

## Step 5: Troubleshooting

### Common Issues

#### 1. "Invalid API key" error

- Check that your Stripe secret key is correct
- Ensure you're using the right mode (test vs live)

#### 2. Webhook signature verification failed

- Verify your webhook secret is correct
- Ensure the webhook URL is accessible
- Check that the request body is being passed correctly

#### 3. Payment fails with test cards

- Make sure you're using the correct test card numbers
- Check that the card details are complete
- Verify the payment amount is valid

#### 4. Frontend can't connect to backend

- Check that your backend is running
- Verify the API_BASE_URL in frontend config
- Ensure CORS is properly configured

### Debug Steps

1. Check browser/device console for errors
2. Check backend server logs
3. Verify Stripe Dashboard for payment attempts
4. Test API endpoints directly with tools like Postman

## Step 6: Additional Features

### 6.1 Subscription Management

The implementation includes:

- ✅ Creating subscriptions
- ✅ Canceling subscriptions
- ✅ Webhook handling for subscription updates
- ✅ Payment failure handling

### 6.2 Future Enhancements

Consider adding:

- Subscription upgrade/downgrade
- Prorated billing
- Usage-based billing
- Team/enterprise features
- Invoice management
- Payment method management

## Step 7: Monitoring and Analytics

### 7.1 Stripe Dashboard

Monitor your payments and subscriptions in the Stripe Dashboard:

- **Payments**: Track successful and failed payments
- **Subscriptions**: Monitor active and canceled subscriptions
- **Customers**: View customer information and payment methods
- **Webhooks**: Check webhook delivery status

### 7.2 Custom Analytics

Consider implementing:

- Subscription conversion rates
- Churn analysis
- Revenue tracking
- Feature usage by subscription tier

## Support

If you encounter issues:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Review the [Stripe React Native SDK docs](https://stripe.com/docs/stripe-react-native)
3. Check your server logs for detailed error messages
4. Verify your environment variables are correctly set

## Security Checklist

- [ ] Secret keys are not exposed in frontend code
- [ ] Environment variables are properly configured
- [ ] HTTPS is enabled in production
- [ ] Webhook signatures are verified
- [ ] Error handling is implemented
- [ ] Test mode is used during development
- [ ] Live mode is properly configured for production

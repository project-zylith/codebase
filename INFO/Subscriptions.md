# Subscriptions Feature

## Overview

The Subscriptions feature in RenAI provides a flexible freemium model with multiple subscription tiers, supporting both Stripe and Apple In-App Purchases (IAP). The system enables users to access advanced features while supporting sustainable development and growth.

## Features

### 1. Subscription Plans

**Free Tier:**

- Basic note-taking capabilities
- Limited task management
- Basic galaxy organization
- Limited AI insights
- Core features access

**Basic Plans:**

- Enhanced note and task limits
- More galaxy organizations
- Increased AI insights per day
- Monthly and annual options
- Cost-effective pricing

**Pro Plans:**

- Unlimited notes and tasks
- Unlimited galaxy organizations
- Unlimited AI insights
- Advanced features access
- Priority support (future)

### 2. Payment Methods

**Stripe Integration:**

- Credit card payments
- Secure payment processing
- Recurring billing
- Subscription management
- Invoice generation

**Apple In-App Purchases:**

- Native iOS payments
- Seamless Apple Pay integration
- App Store billing
- Subscription management
- Receipt validation

### 3. Subscription Management

**User Controls:**

- View current subscription
- Upgrade/downgrade plans
- Cancel subscription
- Renew subscription
- View billing history (future)

**Administrative:**

- Subscription status tracking
- Payment processing
- Renewal handling
- Cancellation handling
- Refund processing (future)

### 4. Feature Limits

**Usage Tracking:**

- Note creation limits
- Task creation limits
- Galaxy organization limits
- AI insights per day limits
- Feature access controls

**Enforcement:**

- Real-time limit checking
- Graceful limit enforcement
- Upgrade prompts
- Usage statistics
- Limit notifications

## Subscription Tiers

### Free Tier

**Features:**

- Up to 20 notes per month
- Up to 10 tasks per month
- Up to 3 galaxy organizations
- Up to 5 AI insights per day
- Basic features access

**Limitations:**

- Limited note storage
- Limited task management
- Basic organization
- Limited AI features
- No premium features

### Basic Monthly

**Price:** $10/month

**Features:**

- Up to 20 notes per month
- Up to 30 tasks per month
- Up to 8 galaxy organizations
- Up to 10 AI insights per day
- Dark mode for notes
- Monthly billing
- Cancel anytime

### Basic Annual

**Price:** $100/year (Save 17%)

**Features:**

- Up to 20 notes per month
- Up to 30 tasks per month
- Up to 8 galaxy organizations
- Up to 10 AI insights per day
- Dark mode for notes
- Annual billing
- Cancel anytime
- 17% savings vs monthly

### Pro Monthly

**Price:** $20/month

**Features:**

- Unlimited notes
- Unlimited tasks
- Up to 10 galaxy organizations
- Up to 15 AI insights per day
- Dark mode for notes
- Pro-only features access
- Monthly billing
- Cancel anytime

### Pro Annual

**Price:** $200/year (Save 17%)

**Features:**

- Unlimited notes
- Unlimited tasks
- Up to 10 galaxy organizations
- Up to 15 AI insights per day
- Dark mode for notes
- Pro-only features access
- Annual billing
- Cancel anytime
- 17% savings vs monthly

## Technical Implementation

### Backend Architecture

**Controllers:**

- `subscriptionControllers.ts`: Handles subscription operations
- Create subscriptions
- Update subscriptions
- Cancel subscriptions
- Check subscription status
- Handle webhooks

**Services:**

- `subscriptionService.ts`: Subscription business logic
- Plan management
- Limit enforcement
- Status tracking
- Payment processing

**Middleware:**

- `checkSubscriptionLimits.ts`: Enforce subscription limits
- Feature access control
- Usage tracking
- Limit validation

**Database:**

- `subscriptions` table
- `subscription_plans` table
- `user_subscriptions` table
- Payment records
- Usage tracking

### Frontend Implementation

**Components:**

- `SubscriptionStatusDisplay.tsx`: Display subscription status
- `AppleIAPSubscriptionModal.tsx`: Apple IAP subscription interface
- Subscription selection components
- Payment processing components
- Limit notification components

**Context:**

- `SubscriptionContext.tsx`: Global subscription state
- Subscription status tracking
- Feature access management
- Limit enforcement
- Upgrade prompts

**Services:**

- `iapService.ts`: Apple IAP integration
- Product retrieval
- Purchase processing
- Receipt validation
- Subscription management

**Adapters:**

- `subscriptionAdapters.ts`: API communication
- Subscription operations
- Payment processing
- Status checks
- Error handling

## Database Schema

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  apple_subscription_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Subscription Plans Table

```sql
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  note_limit INTEGER,
  task_limit INTEGER,
  galaxy_limit INTEGER,
  ai_insights_per_day INTEGER,
  stripe_product_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  apple_product_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Subscription Routes

```
GET /api/subscriptions/plans
  - Get all subscription plans
  - Requires: Authentication (optional)
  - Returns: Array of subscription plans

GET /api/subscriptions/status
  - Get user subscription status
  - Requires: Authentication
  - Returns: Subscription status and limits

POST /api/subscriptions/create
  - Create a new subscription
  - Requires: Authentication
  - Body: { planId, paymentMethod }
  - Returns: Subscription object

POST /api/subscriptions/upgrade
  - Upgrade subscription plan
  - Requires: Authentication
  - Body: { newPlanId }
  - Returns: Updated subscription

POST /api/subscriptions/downgrade
  - Downgrade subscription plan
  - Requires: Authentication
  - Body: { newPlanId }
  - Returns: Updated subscription

POST /api/subscriptions/cancel
  - Cancel subscription
  - Requires: Authentication
  - Returns: Cancellation confirmation

POST /api/subscriptions/renew
  - Renew subscription
  - Requires: Authentication
  - Returns: Renewal confirmation

GET /api/subscriptions/usage
  - Get usage statistics
  - Requires: Authentication
  - Returns: Usage data and limits
```

### Apple IAP Routes

```
POST /api/subscriptions/apple/purchase
  - Process Apple IAP purchase
  - Requires: Authentication
  - Body: { productId, receipt }
  - Returns: Subscription confirmation

POST /api/subscriptions/apple/validate-receipt
  - Validate Apple receipt
  - Requires: Authentication
  - Body: { receipt }
  - Returns: Receipt validation result

GET /api/subscriptions/apple/products
  - Get Apple IAP products
  - Requires: Authentication
  - Returns: Available products
```

### Stripe Routes

```
POST /api/subscriptions/stripe/create
  - Create Stripe subscription
  - Requires: Authentication
  - Body: { planId, paymentMethodId }
  - Returns: Subscription confirmation

POST /api/subscriptions/stripe/webhook
  - Handle Stripe webhooks
  - Requires: Stripe signature
  - Body: Stripe webhook event
  - Returns: Webhook acknowledgment
```

## User Experience

### Subscription Selection Flow

1. User views subscription plans
2. User selects a plan
3. User chooses payment method (Stripe/Apple)
4. Payment processing begins
5. Payment is processed
6. Subscription is created
7. User gains access to features
8. Confirmation displays

### Subscription Upgrade Flow

1. User views current subscription
2. User selects upgrade option
3. User chooses new plan
4. Payment difference is calculated
5. Payment is processed
6. Subscription is upgraded
7. New features are unlocked
8. Confirmation displays

### Subscription Cancellation Flow

1. User views subscription settings
2. User selects cancel option
3. Cancellation confirmation displays
4. User confirms cancellation
5. Subscription is cancelled
6. Access continues until period end
7. Cancellation confirmation displays

### Limit Enforcement Flow

1. User attempts to use feature
2. System checks subscription limits
3. If within limits, action proceeds
4. If limit reached, upgrade prompt displays
5. User can upgrade or cancel action
6. Usage statistics update

## Payment Processing

### Stripe Integration

**Setup:**

- Stripe account configuration
- Product and price creation
- Webhook endpoint setup
- Payment method handling
- Subscription management

**Process:**

1. User selects plan
2. Payment method is collected
3. Stripe subscription is created
4. Payment is processed
5. Webhook confirms payment
6. Subscription is activated
7. User gains access

### Apple IAP Integration

**Setup:**

- App Store Connect configuration
- Product ID setup
- Receipt validation
- Subscription management
- Restore purchases

**Process:**

1. User selects plan
2. Apple purchase flow initiates
3. User authenticates with Apple
4. Purchase is processed
5. Receipt is validated
6. Subscription is activated
7. User gains access

## Limit Enforcement

### Usage Tracking

**Tracking:**

- Note creation count
- Task creation count
- Galaxy organization count
- AI insights per day count
- Feature access tracking

**Storage:**

- Database records
- Real-time counters
- Daily resets for AI insights
- Monthly resets for notes/tasks
- Persistent storage

### Enforcement Logic

**Checking:**

- Before feature access
- Real-time validation
- Limit comparison
- Graceful handling
- User notification

**Responses:**

- Allow if within limits
- Block if limit reached
- Show upgrade prompt
- Display usage statistics
- Provide upgrade path

## Error Handling

### Common Errors

- **Payment Failures**: Card declined, insufficient funds
- **Subscription Errors**: Creation failures, updates failures
- **Limit Errors**: Limit reached, invalid access
- **Network Errors**: Connection issues, timeouts
- **Validation Errors**: Invalid data, missing information

### Error Handling Strategies

- **Graceful Degradation**: Fallback to free tier
- **User Feedback**: Clear error messages
- **Retry Mechanisms**: Automatic retries for transient errors
- **Support Access**: Contact support options
- **Recovery Options**: Alternative payment methods

## Security and Privacy

### Payment Security

- **PCI Compliance**: Secure payment processing
- **Tokenization**: Secure payment method storage
- **Encryption**: Encrypted payment data
- **Validation**: Payment method validation
- **Fraud Prevention**: Fraud detection and prevention

### Data Privacy

- **Minimal Data**: Collect only necessary data
- **Secure Storage**: Encrypted data storage
- **Access Control**: User-specific access
- **Data Retention**: Minimal data retention
- **User Control**: User data management

## Future Enhancements

### Planned Features

- **Trial Periods**: Free trial for paid plans
- **Family Plans**: Shared family subscriptions
- **Enterprise Plans**: Team and enterprise subscriptions
- **Gift Subscriptions**: Gift subscriptions to others
- **Referral Program**: Referral rewards and discounts
- **Loyalty Rewards**: Loyalty program and rewards
- **Usage Analytics**: Detailed usage analytics
- **Billing History**: Complete billing history
- **Invoice Generation**: Automated invoice generation
- **Payment Methods**: Multiple payment methods
- **Currency Support**: Multiple currency support
- **Regional Pricing**: Region-specific pricing

### Technical Improvements

- **Caching**: Cache subscription status
- **Performance**: Optimize subscription checks
- **Scalability**: Handle high subscription volume
- **Monitoring**: Subscription health monitoring
- **Analytics**: Subscription analytics and insights
- **Automation**: Automated subscription management
- **Notifications**: Subscription notifications
- **Reminders**: Renewal reminders

## Testing

### Test Cases

- Subscription creation
- Subscription upgrade
- Subscription downgrade
- Subscription cancellation
- Payment processing
- Limit enforcement
- Usage tracking
- Error handling
- Webhook processing
- Receipt validation

## Conclusion

The Subscriptions feature provides a flexible, sustainable monetization model for RenAI while offering users clear value propositions at each tier. With support for both Stripe and Apple IAP, comprehensive limit enforcement, and user-friendly management, the system enables sustainable growth while maintaining user satisfaction.

The feature is designed to be secure, scalable, and user-friendly, with comprehensive error handling and support for future enhancements. The freemium model ensures accessibility while the paid tiers provide value for users who need advanced features.

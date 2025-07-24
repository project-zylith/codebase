# Technology Stack

This document provides a comprehensive overview of all libraries and frameworks used in the Renaissance project.

## 🏗️ Architecture Overview

**Type**: Full-stack React Native + Express.js application  
**Database**: PostgreSQL with Knex.js ORM  
**Authentication**: Session-based with bcryptjs  
**Payments**: Stripe integration  
**AI**: Google Generative AI (Gemini)  
**Styling**: Tailwind CSS  
**Development**: TypeScript throughout  
**Platform**: Expo-managed React Native

---

## 📱 Frontend (React Native + Expo)

### Core Framework

- **React Native** (v0.79.3) - Mobile app development framework
- **Expo** (v53.0.10) - React Native development platform and toolchain
- **React** (v19.0.0) - JavaScript library for building user interfaces
- **TypeScript** (v5.8.3) - Type-safe JavaScript

### Navigation

- **@react-navigation/native** (v7.1.14) - Navigation library for React Native
- **@react-navigation/native-stack** (v7.3.21) - Stack navigator component
- **@react-navigation/bottom-tabs** (v7.4.2) - Bottom tab navigator
- **react-native-screens** (v4.11.1) - Native screen components for better performance
- **react-native-safe-area-context** (v5.4.0) - Safe area handling for different devices

### Payment Processing

- **@stripe/stripe-react-native** (v0.50.0) - Official Stripe SDK for React Native

### Rich Text Editing

- **@10play/tentap-editor** (v0.7.4) - Rich text editor component for note creation

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework (configured via tailwind.config.js)
- **react-native-linear-gradient** (v2.8.3) - Gradient components for enhanced UI
- **@expo/vector-icons** (v14.1.0) - Comprehensive icon library

### Storage & File System

- **@react-native-async-storage/async-storage** (v2.2.0) - Local storage for app data
- **expo-file-system** (v18.1.11) - File system access and manipulation
- **expo-asset** (v11.1.7) - Asset management and loading

### Web Integration

- **react-native-webview** (v13.13.5) - Web view component for embedded web content
- **react-native-base64** (v0.2.1) - Base64 encoding/decoding utilities

### Status & UI

- **expo-status-bar** (v2.2.3) - Status bar management and customization

### Development Dependencies

- **@babel/core** (v7.25.2) - JavaScript compiler
- **@types/react** (v19.0.10) - TypeScript definitions for React
- **@types/react-native-base64** (v0.2.2) - TypeScript definitions for base64

---

## 🔧 Backend (Node.js + Express)

### Core Framework

- **Express.js** (v4.19.2) - Web application framework for Node.js
- **TypeScript** (v5.4.5) - Type-safe JavaScript

### Database & ORM

- **Knex.js** (v3.1.0) - SQL query builder and migration tool
- **PostgreSQL (pg)** (v8.16.2) - Database driver for PostgreSQL

### Authentication & Security

- **bcryptjs** (v3.0.2) - Password hashing and verification
- **cookie-session** (v2.1.0) - Session management with cookies
- **express-session** (v1.18.0) - Session middleware for Express

### Payment Processing

- **Stripe** - Payment processing and subscription management
  - Backend SDK for server-side operations
  - Webhook handling for payment events

### AI Services

- **@google/generative-ai** (v0.24.1) - Google's Generative AI (Gemini) integration
  - Used for note insights generation
  - Galaxy content generation
  - Task insights and AI task creation

### Utilities

- **cors** (v2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (v16.4.5) - Environment variable management
- **node-cron** (v4.2.1) - Task scheduling and automation

### Development Dependencies

- **@types/bcryptjs** (v2.4.6) - TypeScript definitions for bcryptjs
- **@types/cors** (v2.8.19) - TypeScript definitions for cors
- **@types/cookie-session** (v2.0.0) - TypeScript definitions for cookie-session
- **@types/express** (v4.17.21) - TypeScript definitions for Express
- **@types/express-session** (v1.18.0) - TypeScript definitions for express-session
- **@types/node** (v20.19.4) - TypeScript definitions for Node.js
- **@types/node-cron** (v3.0.11) - TypeScript definitions for node-cron
- **@types/pg** (v8.11.10) - TypeScript definitions for PostgreSQL

---

## 🗄️ Database

### Database System

- **PostgreSQL** - Primary database system
  - User management and authentication
  - Notes and task storage
  - Galaxy organization system
  - Subscription and payment tracking
  - AI insights storage

### Database Tools

- **Knex.js Migrations** - Database schema versioning
- **Knex.js Seeds** - Initial data population
- **Connection pooling** - Optimized database connections

---

## 🔐 Authentication & Security

### Authentication Method

- **Session-based authentication** using cookies
- **bcryptjs** for password hashing
- **Express session middleware** for session management

### Security Features

- **CORS** configuration for cross-origin requests
- **Environment variable** management for sensitive data
- **Input validation** and sanitization

---

## 💳 Payment System

### Payment Provider

- **Stripe** - Complete payment processing solution
  - Subscription management
  - Payment processing
  - Webhook handling
  - Customer management

### Features

- **Subscription plans** (Free, Basic, Pro, Enterprise)
- **Plan switching** and upgrades
- **Subscription cancellation** and reactivation
- **Payment method management**
- **Usage-based limits** enforcement

---

## 🤖 AI Integration

### AI Provider

- **Google Generative AI (Gemini 1.5 Flash)** - Advanced AI capabilities

### AI Features

- **Note insights generation** - AI-powered analysis of notes
- **Galaxy content generation** - Automated galaxy creation
- **Task insights** - AI analysis of task patterns
- **AI task creation** - Intelligent task suggestions

---

## 🎨 Styling & UI

### CSS Framework

- **Tailwind CSS** - Utility-first CSS framework
  - Custom color palettes for light/dark modes
  - Responsive design utilities
  - Custom spacing and typography

### UI Components

- **React Native components** - Native mobile UI
- **Linear gradients** - Enhanced visual appeal
- **Vector icons** - Consistent iconography
- **Safe area handling** - Device-specific layouts

---

## 🚀 Development Tools

### Build Tools

- **TypeScript** - Type safety and better development experience
- **Babel** - JavaScript compilation
- **Expo CLI** - React Native development tools

### Development Scripts

- **npm scripts** for common tasks
- **Database migrations** and seeding
- **Hot reloading** for development
- **Type checking** and compilation

---

## 📦 Package Management

### Package Managers

- **npm** - Node.js package manager
- **Package-lock.json** - Dependency locking for consistency

### Dependency Categories

- **Production dependencies** - Runtime requirements
- **Development dependencies** - Build and development tools
- **Type definitions** - TypeScript support

---

## 🔄 Version Control & Deployment

### Version Control

- **Git** - Source code version control
- **GitHub** - Repository hosting

### Environment Management

- **Environment variables** (.env files)
- **Configuration files** (knexfile.ts, tailwind.config.js)
- **Development vs Production** configurations

---

## 📊 Project Structure

```
codebase/
├── frontend/          # React Native application
├── backend/           # Express.js server
├── database/          # Database migrations and seeds
├── assets/            # Static assets
└── docs/             # Documentation
```

---

## 🛠️ Getting Started

1. **Install dependencies**: `npm run install:all`
2. **Set up environment variables**: Copy `env.example` to `.env`
3. **Run database migrations**: `npm run migrate --prefix backend`
4. **Seed the database**: `npm run seed --prefix backend`
5. **Start the backend**: `npm run devb`
6. **Start the frontend**: `npm run devf`

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Knex.js Documentation](https://knexjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Google Generative AI Documentation](https://ai.google.dev/)

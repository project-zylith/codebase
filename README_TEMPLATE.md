# 📱 React Native Full-Stack App Template

A complete, production-ready template for building modern React Native applications with a robust backend.

## 🌟 Features

### **Frontend (React Native + Expo)**
- ✅ **JWT Authentication** with secure token storage
- ✅ **Rich Text Editor** (Quill.js in WebView)
- ✅ **Modern UI** with custom theming system
- ✅ **Navigation** (Tab + Stack navigation)
- ✅ **TypeScript** for type safety
- ✅ **iOS & Android** builds ready

### **Backend (Express.js + TypeScript)**
- ✅ **RESTful API** with proper error handling
- ✅ **JWT Authentication** middleware
- ✅ **PostgreSQL** database with Knex.js ORM
- ✅ **Database Migrations** and seeding
- ✅ **CORS** configured for mobile apps
- ✅ **AI Integration** (Google Gemini)
- ✅ **Stripe Subscriptions** (optional)

### **DevOps & Deployment**
- ✅ **Railway** backend deployment
- ✅ **EAS Build & Submit** for app stores
- ✅ **Environment** configuration templates
- ✅ **TypeScript** compilation
- ✅ **Git** workflow ready

## 🚀 Quick Start

```bash
# 1. Clone template
git clone <your-repo> my-new-app
cd my-new-app
git checkout app-template

# 2. Run setup script
node setup-new-project.js

# 3. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 4. Configure environment
# Edit backend/.env with your database URL and API keys
# Edit frontend/app.json with your app details

# 5. Setup database
cd backend
npm run migrate
npm run seed

# 6. Start development
npm run dev  # Backend
cd ../frontend && npm start  # Frontend
```

## 📖 Documentation

- **[Complete Setup Guide](./TEMPLATE_SETUP_GUIDE.md)** - Detailed configuration instructions
- **[Technology Stack](./TECHNOLOGY_STACK.md)** - Overview of all technologies used
- **[Deployment Guide](./STRIPE_SETUP_GUIDE.md)** - Production deployment steps

## 🏗️ Architecture

```
📱 React Native Frontend (Expo)
    ↓ JWT Authentication
🌐 Express.js Backend (TypeScript)
    ↓ Knex.js ORM
🗄️ PostgreSQL Database
    ↓ Railway Deployment
☁️ Production (iOS/Android + Railway)
```

## 🔧 Key Components

- **Authentication:** JWT-based with AsyncStorage
- **Rich Text:** Quill.js editor in WebView
- **AI Features:** Google Gemini integration
- **Database:** PostgreSQL with migrations
- **Payments:** Stripe subscriptions
- **Mobile:** iOS/Android builds via EAS

## 📱 Template Apps Built With This

- **Renaissance/Zylith** - AI-powered note-taking app
- *Your next app here!*

## 🤝 Contributing

This template is designed to be:
- **Modular** - Easy to add/remove features
- **Configurable** - Environment-based settings
- **Scalable** - Production-ready architecture
- **Modern** - Latest React Native and Node.js practices

## 📄 License

MIT License - Use this template for any project!

---

**Built with ❤️ for the React Native community**

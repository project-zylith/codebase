# 🏗️ App Template Setup Guide

This template provides a complete **React Native + Express.js** foundation with:
- **JWT Authentication** 
- **Rich Text Editor** (Quill.js in WebView)
- **AI Integration** (Google Gemini)
- **Task Management**
- **Note Organization** (Galaxy system)
- **Stripe Subscriptions**
- **Database** (PostgreSQL with Knex.js)
- **Deployment Ready** (Railway + Expo/EAS)

## 🚀 Quick Start

### 1. **Clone and Setup**
```bash
git clone <your-repo-url>
cd your-app-name
git checkout app-template
```

### 2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment template
cp env.template .env
# Edit .env with your actual values (see Environment Variables section)

# Setup database
npm run migrate
npm run seed
npm run dev
```

### 3. **Frontend Setup**
```bash
cd frontend
npm install

# Copy configuration templates
cp app.template.json app.json
cp eas.template.json eas.json
cp utils/apiConfig.template.ts utils/apiConfig.ts

# Edit these files with your app details (see Configuration section)

# Start development
npm start
```

## ⚙️ Configuration

### **Frontend Configuration**

#### **1. Update `app.json`:**
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug", 
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSExceptionDomains": {
            "your-backend-domain.com": {
              // Your backend domain
            }
          }
        }
      }
    }
  }
}
```

#### **2. Update `eas.json`:**
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id", 
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

#### **3. Update `utils/apiConfig.ts`:**
```typescript
export const API_BASE_URL_PRODUCTION = "https://your-backend-domain.com";
```

### **Backend Configuration**

#### **1. Environment Variables (`.env`):**
```bash
# Database
PG_CONNECTION_STRING=postgresql://user:pass@host:port/dbname

# Authentication  
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# AI (Optional)
GOOGLE_AI_API_KEY=your-google-ai-key

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🗄️ Database Setup

### **1. Create Database:**
```bash
# Local PostgreSQL
createdb your_app_name

# Or use cloud provider (Railway, Supabase, etc.)
```

### **2. Run Migrations:**
```bash
cd backend
npm run migrate
```

### **3. Seed Database:**
```bash
# Use template seeds for demo data
npm run seed
```

## 🚀 Deployment

### **Backend Deployment (Railway)**

1. **Connect to Railway:**
```bash
npm install -g @railway/cli
railway login
railway init
```

2. **Set Environment Variables:**
```bash
railway variables set PG_CONNECTION_STRING="your-db-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set GOOGLE_AI_API_KEY="your-ai-key"
```

3. **Deploy:**
```bash
railway up
```

### **Frontend Deployment (Expo/EAS)**

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

2. **Configure Project:**
```bash
cd frontend
eas init --id YOUR_EAS_PROJECT_ID
```

3. **Build and Submit:**
```bash
# iOS
eas build --platform ios
eas submit --platform ios

# Android  
eas build --platform android
eas submit --platform android
```

## 🎨 Customization

### **Theme System**
- Edit `frontend/assets/colorPalette.ts` for colors
- Modify `frontend/contexts/ThemeContext.tsx` for theme logic

### **App Features**
- **Notes:** Rich text editing with Quill.js
- **Tasks:** Todo management with goals
- **Galaxies:** AI-powered note organization
- **AI Insights:** Google Gemini integration
- **Subscriptions:** Stripe payment integration

### **Adding New Features**
1. **Database:** Add migration in `backend/database/migrations/`
2. **Backend:** Add controller in `backend/controllers/`
3. **Frontend:** Add adapter in `frontend/adapters/`
4. **UI:** Add component in `frontend/components/`

## 🔧 Development Scripts

### **Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm run migrate:down # Rollback migrations
```

### **Frontend:**
```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
eas build           # Build for production
eas submit          # Submit to app stores
```

## 📚 Key Technologies

- **Frontend:** React Native, Expo, TypeScript
- **Backend:** Express.js, TypeScript, Knex.js
- **Database:** PostgreSQL
- **Authentication:** JWT tokens
- **AI:** Google Gemini API
- **Payments:** Stripe
- **Deployment:** Railway (backend), EAS (mobile)
- **Rich Text:** Quill.js in WebView

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Loading..." screen:** Check backend URL and CORS configuration
2. **Build failures:** Verify all template placeholders are replaced
3. **Database errors:** Ensure PostgreSQL connection string is correct
4. **iOS submission:** Update bundle identifier and Apple credentials

### **Debug Logs:**
- **Frontend:** Check React Native debugger console
- **Backend:** Check Railway deployment logs
- **Database:** Use `npm run migrate:status` to check migrations

## 📞 Support

For issues with this template:
1. Check the troubleshooting section above
2. Review the original project documentation
3. Ensure all placeholder values are replaced with actual values

---

**Happy coding! 🎉**

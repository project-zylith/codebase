# Renaissance MVP - Complete Technical Documentation

## 🚀 Welcome to Renaissance

**Renaissance** is a cosmic-inspired note-taking and task management application that transforms how users capture, organize, and develop their ideas through an intuitive, visually stunning interface powered by AI.

This documentation is designed for full-stack developers building their first app. We'll walk through every feature, explaining the technical decisions, code architecture, and implementation details that make Renaissance work.

---

## 📋 Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Architecture](#project-architecture)
3. [Feature Documentation](#feature-documentation)
4. [AI Integration Guide](#ai-integration-guide)
5. [Development Setup](#development-setup)
6. [Key Technical Decisions](#key-technical-decisions)

---

## 🛠️ Tech Stack Overview

### Frontend

- **React Native** with TypeScript
- **Expo** for cross-platform development
- **React Navigation** for app navigation
- **TenTap Editor** for rich text editing
- **NativeWind** (Tailwind CSS) for styling
- **React Context** for state management

### Backend

- **Node.js** with TypeScript
- **Express.js** for API server
- **Knex.js** for database queries and migrations
- **SQLite** for development database
- **Express Session** for authentication
- **CORS** for cross-origin requests

### AI Integration

- **Google Generative AI** (Gemini 1.5 Flash)
- Custom prompt engineering for different use cases
- Structured JSON responses for consistent data handling

### Database

- **SQLite** for development
- **PostgreSQL** ready for production
- **Knex.js** migrations for schema management

### Authentication

- **Session-based authentication** with Express Session
- **Password hashing** with bcrypt
- **Cookie-based sessions** for security

---

## 🏗️ Project Architecture

### Directory Structure

```
codebase/
├── frontend/                 # React Native app
│   ├── components/          # Reusable UI components
│   ├── adapters/           # API communication layer
│   ├── contexts/           # React Context providers
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── backend/                 # Express.js API server
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Express middleware
│   ├── src/               # Core server logic
│   │   ├── aiServices/    # AI integration services
│   │   └── services/      # Business logic services
│   └── database/          # Database migrations and seeds
└── ProjectBreakdown-pre/   # Documentation and planning
```

### Key Architectural Patterns

1. **Adapter Pattern**: Frontend adapters abstract API communication
2. **Service Layer**: Backend business logic separated from controllers
3. **Context Pattern**: React Context for global state management
4. **Component Composition**: Reusable, composable UI components

---

## 🎯 Feature Documentation

Each feature has its own detailed README:

- [User Authentication System](./USER_AUTHENTICATION_SYSTEM.md)
- [Note Management System](./NOTE_MANAGEMENT_SYSTEM.md)
- [Task Management System](./TASK_MANAGEMENT_SYSTEM.md)
- [AI Integration Guide](./AI_INTEGRATION_GUIDE.md)
- [Galaxy Organization System](./GALAXY_ORGANIZATION_SYSTEM.md)
- [Rich Text Editor Integration](./RICH_TEXT_EDITOR_GUIDE.md)
- [Theme System](./THEME_SYSTEM_GUIDE.md)
- [Navigation System](./NAVIGATION_SYSTEM.md)

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- SQLite (for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd codebase

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp backend/env.example backend/.env
# Edit .env with your API keys and configuration
```

### Running the Application

```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend (in a new terminal)
cd frontend
npx expo start
```

---

## 🎨 Key Technical Decisions

### 1. Why React Native + Expo?

- **Cross-platform development** with native performance
- **Rapid prototyping** with Expo's development tools
- **Rich ecosystem** of libraries and components
- **TypeScript support** for better code quality

### 2. Why Session-based Authentication?

- **Simplicity** for MVP development
- **Security** with proper session management
- **Scalability** ready for JWT tokens later
- **User experience** with persistent login

### 3. Why TenTap Editor?

- **Rich text capabilities** with mobile optimization
- **Real-time collaboration** ready
- **Customizable** toolbar and formatting options
- **Performance** optimized for mobile devices

### 4. Why AI Integration?

- **User value** through intelligent insights
- **Competitive advantage** in the note-taking space
- **Scalability** with cloud-based AI services
- **Future-proofing** for advanced features

---

## 🚀 Next Steps

This MVP demonstrates the core functionality of Renaissance. Future iterations will include:

- Real-time collaboration features
- Advanced AI capabilities
- Premium subscription features
- Third-party integrations
- Advanced analytics and insights

---

## 📚 Learning Resources

For developers new to this stack:

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Knex.js Documentation](https://knexjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

_This documentation is a living document. As Renaissance evolves, so will this guide. Happy coding! 🎉_

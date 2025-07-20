# Renaissance App

A full-stack productivity and insights app with a Node.js/Express backend and a React Native (Expo) frontend.

---

## 🚀 Getting Started

This guide will help you set up and run both the **backend** and **frontend** of the app from scratch.

---

## 🌌 AI Galaxy Generation

Renaissance includes an intelligent AI-powered feature that automatically organizes your notes into themed collections called "galaxies."

### How It Works

1. **Create Notes**: Add multiple notes to your app with titles and content
2. **Generate Galaxies**: Click the bulb icon (🤖) in the HomeScreen header
3. **AI Analysis**: The AI analyzes your notes and suggests logical groupings
4. **Review & Apply**: Preview the suggested galaxies and apply them to organize your notes

### Features

- **Smart Grouping**: AI identifies related notes based on content and themes
- **Descriptive Names**: Galaxies are named clearly (e.g., "Programming Projects", "Health & Fitness")
- **Preview Mode**: See suggested groupings before applying them
- **Automatic Organization**: Notes are automatically assigned to appropriate galaxies
- **Error Handling**: Graceful fallbacks and helpful error messages

### Requirements

- **Google AI API Key**: Set `API_KEY` in your backend `.env` file
- **Multiple Notes**: Works best with 2+ notes (minimum 1 note required)
- **Backend Running**: Ensure the backend server is running on port 3000

### Setup

1. **Get Google AI API Key**:

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your backend `.env` file: `API_KEY=your_api_key_here`

2. **Test the Feature**:

   ```bash
   # Test the API directly
   cd backend
   node test-galaxy-api.mjs
   ```

3. **Use in App**:
   - Create several notes with different themes
   - Click the bulb icon in the header
   - Follow the prompts to generate and apply galaxies

### Example Galaxy Groupings

The AI might group your notes like this:

- **Software Development**: Programming notes, app development ideas, coding tutorials
- **Health & Fitness**: Workout plans, nutrition notes, wellness goals
- **Travel Planning**: Trip itineraries, budget planning, destination research
- **Learning & Education**: Study notes, course materials, skill development

---

## 1. Clone the Repository

```sh
git clone https://github.com/your-username/renaissance.git
cd renaissance
```

---

## 2. Key Directories

- `backend/` — Node.js/Express API, database, and business logic
- `frontend/` — React Native (Expo) mobile app

---

## 3. Backend Setup

### a. Install Node.js (LTS)

- [Download Node.js](https://nodejs.org/) (LTS version recommended)
- Verify installation:
  ```sh
  node --version
  npm --version
  ```

### b. Install Dependencies

```sh
cd backend
npm install
```

### c. Environment Variables

- Copy the example env file and fill in your values:
  ```sh
  cp env.example .env
  ```
- Edit `.env` to set your database credentials and any API keys.

### d. Database Setup

- **PostgreSQL** is required. Install it if you don't have it.
- Create a database matching your `.env` settings (e.g., `renaissance_db`).
- Run migrations and seeds:
  ```sh
  npm run migrate
  npm run seed
  ```

### e. Build and Start the Backend

```sh
npm run build
npm start
```

- The backend will run on the port specified in your `.env` (default: `3000`).

---

## 4. Frontend Setup

### a. Install Node.js (if not already done)

- See backend instructions.

### b. Install Expo CLI (if not already installed)

```sh
npm install -g expo-cli
```

### c. Install Frontend Dependencies

```sh
cd ../frontend
npm install
```

### d. Install Required Modules

Your app uses:

- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `@expo/vector-icons`

If you see missing module errors, run:

```sh
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
expo install @expo/vector-icons
```

### e. Start the Frontend (Expo)

```sh
expo start
```

- Use the QR code to open the app on your device (Expo Go app) or run on an emulator.

---

## 5. Key Files & Directories

- **backend/**

  - `src/` — Main server code
  - `controllers/` — Route handlers (e.g., authentication)
  - `database/` — Migrations, seeds, and DB config
  - `middleware/` — Express middleware
  - `package.json` — Backend dependencies and scripts

- **frontend/**
  - `components/` — All React Native UI components (HomeScreen, AccountScreen, etc.)
  - `adapters/` — API adapters for backend communication
  - `utils/` — Utility functions (e.g., API config)
  - `App.tsx` — App entry point
  - `package.json` — Frontend dependencies and scripts

---

## 5a. File Breakdown

### backend/

- **package.json** — Lists backend dependencies and scripts.
- **env.example / .env** — Environment variable templates and secrets.
- **src/**
  - **index.ts** — Main Express server entry point.
  - **database.ts** — Database connection logic.
  - **migrate.ts** — Script for running migrations.
  - **services/**
    - **taskService.ts** — Business logic for tasks.
    - **userService.ts** — Business logic for users.
  - **types/**
    - **task.ts, user.ts** — TypeScript types for tasks and users.
  - **prompts/**
    - **taskInsights.ts** — AI/insight-related logic.
- **controllers/**
  - **authControllers.ts** — Handles authentication routes.
- **middleware/**
  - **checkAuthentication.ts** — Auth middleware.
  - **cookieSession.ts, handleCookieSessions.ts** — Session management.
- **database/**
  - **migrations/** — Knex migration files for DB schema.
  - **seeds/** — Knex seed files for initial data.
  - **database.ts** — DB connection config.
- **knexfile.ts** — Knex configuration.
- **README.md** — Backend-specific documentation (if any).

### frontend/

- **package.json** — Lists frontend dependencies and scripts.
- **App.tsx** — Main entry point for the React Native app.
- **components/**
  - **AppNavigator.tsx** — Navigation setup (tab bar, etc).
  - **HomeScreen.tsx** — Home page UI and logic.
  - **AccountScreen.tsx** — Account/signup page UI and logic.
  - **EditorScreen.tsx** — Editor page UI.
  - **NewTask.tsx** — Task input form.
  - **AuthSignUp.tsx** — Signup form.
- **adapters/**
  - **userAdapters.ts** — API calls for user/auth.
  - **aiAdapters.ts** — API calls for AI/insights.
- **utils/**
  - **apiConfig.ts** — API base URL and endpoints.
  - **fetchUtils.ts** — Helper functions for fetch requests.
- **types/**
  - **user.ts** — TypeScript types for users.
- **assets/** — App icons and images.
- **app.json** — Expo/React Native app configuration.
- **.expo/** — Expo project files (auto-generated).

---

## 6. Common Issues & Tips

- **Backend not connecting?**  
  Make sure your `.env` DB credentials are correct and PostgreSQL is running.

- **Frontend can't reach backend?**

  - If running on a device, set the API base URL in `frontend/utils/apiConfig.ts` to your computer's IP address (not `localhost`).
  - If using an emulator, use the appropriate loopback address (e.g., `10.0.2.2` for Android).

- **Missing modules?**  
  Run `npm install` in both `backend` and `frontend`.

- **Database errors?**  
  Make sure you've run migrations and seeds.

---

## 7. Development Workflow

- **Backend:**  
  Make changes in `backend/src/`, then rebuild (`npm run build`) and restart (`npm start`).

- **Frontend:**  
  Hot reloads with Expo. Edit files in `frontend/components/` and see changes instantly.

---

## 8. Contributing

- Fork the repo, create a feature branch, and submit a pull request.
- Follow the code style and structure in both backend and frontend.

---

## 9. Support

- For issues, open a GitHub issue or contact the maintainer.

---

**Enjoy building and using your app!**

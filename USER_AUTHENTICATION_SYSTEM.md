# User Authentication & State Management System

## Overview

The Project Zylith application implements a comprehensive user authentication system using session-based authentication with React Context for state management on the frontend and Express sessions on the backend.

## Architecture

### Frontend Authentication (React Native)

#### UserContext (`frontend/contexts/UserContext.tsx`)

The application uses React Context with `useReducer` for centralized user state management.

**State Structure:**

```typescript
interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

**User Interface:**

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string | null;
  google_id?: string | null;
  created_at: Date;
  updated_at?: Date | null;
}
```

**Key Features:**

- **Persistent Sessions**: Uses `AsyncStorage` to persist user data across app restarts
- **Session Validation**: Automatically validates stored sessions with backend on app startup
- **State Management**: Provides login, logout, and updateUser functions
- **Loading States**: Manages loading states during authentication operations

#### Authentication Flow

1. **App Startup**: `checkStoredSession()` validates existing sessions
2. **Login**: Stores user data in AsyncStorage and updates context
3. **Logout**: Clears AsyncStorage and resets context state
4. **Session Validation**: Periodically validates session with backend

#### User Adapters (`frontend/adapters/userAdapters.ts`)

Handles API communication for user operations:

- `getCurrentUser()`: Validates current session
- `logoutUser()`: Handles logout API call
- Uses `credentials: "include"` for session cookies

### Backend Authentication (Express.js)

#### Session Management (`backend/src/index.ts`)

Uses `express-session` with the following configuration:

```typescript
session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});
```

#### CORS Configuration

Configured to allow credentials and cookies:

```typescript
cors({
  origin: true, // Allow all origins in development
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
});
```

#### Authentication Controllers (`backend/controllers/authControllers.ts`)

**Register User (`POST /api/auth/register`)**

- Validates required fields (username, email, password)
- Creates user via UserService
- Sets session userId
- Returns user data

**Login User (`POST /api/auth/login`)**

- Validates credentials
- Compares password with bcrypt
- Sets session userId
- Returns user data

**Show Me (`GET /api/auth/me`)**

- Validates session userId
- Returns current user data
- Protected by authentication middleware

**Logout User (`DELETE /api/auth/logout`)**

- Destroys session
- Returns 204 status

#### Authentication Middleware (`backend/middleware/checkAuthentication.ts`)

Protects routes by validating session:

```typescript
export const checkAuthentication = (req, res, next) => {
  const userId = req.session?.userId;
  if (!userId) return res.sendStatus(401);
  return next();
};
```

### Security Features

#### Password Security

- Uses `bcrypt` for password hashing
- Salted hashes prevent rainbow table attacks
- Passwords never stored in plain text

#### Session Security

- HttpOnly cookies prevent XSS attacks
- Session-based authentication prevents CSRF
- Automatic session expiration (24 hours)
- Secure cookie flag for production HTTPS

#### Data Validation

- Input validation on both frontend and backend
- Required field validation
- Email format validation
- Password strength requirements

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `DELETE /api/auth/logout` - User logout

### Route Protection

All task-related routes are protected by the `checkAuthentication` middleware:

- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `PATCH /api/tasks/:id/toggle-favorite` - Toggle task favorite

## Database Integration

### User Service (`backend/src/services/userService.ts`)

Handles all user database operations:

- `create()` - Create new user
- `getAllUsers()` - Get all users (for login validation)
- `getUserById()` - Get user by ID
- Password hashing with bcrypt
- Duplicate username/email validation

### Database Schema

Users table includes:

- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash` (Bcrypt hashed)
- `google_id` (For OAuth integration)
- `created_at` / `updated_at` (Timestamps)

## Usage Examples

### Frontend Usage

```typescript
// In a component
const { state, login, logout } = useUser();

// Check if user is authenticated
if (!state.isAuthenticated) {
  return <LoginScreen />;
}

// Access current user
const currentUser = state.user;
```

### Backend Usage

```typescript
// In a protected route
export const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.session?.userId; // Guaranteed to exist due to middleware
  // ... route logic
};
```

## Error Handling

### Frontend Error Handling

- Network errors during authentication
- Invalid credentials handling
- Session expiration handling
- Loading state management

### Backend Error Handling

- Invalid credentials (401)
- Missing required fields (400)
- User not found (404)
- Internal server errors (500)

## Testing Users

The application includes seeded test users:

- **Username:** `cool_cat`, **Password:** `password123` (ID: 1)
- **Username:** `wowow`, **Password:** `password456` (ID: 2)
- **Username:** `iaso`, **Password:** `123Dev` (ID: 3)
- **Username:** `google_user` (OAuth user, ID: 4)

## Future Enhancements

### Planned Features

- OAuth integration (Google, GitHub)
- Password reset functionality
- Email verification
- Two-factor authentication
- Role-based access control
- Session management dashboard

### Security Improvements

- Rate limiting for authentication endpoints
- Account lockout after failed attempts
- Stronger password requirements
- Session token rotation
- HTTPS enforcement in production

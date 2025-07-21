# User Authentication System - Renaissance MVP

## 🔐 Overview

Renaissance uses a **session-based authentication system** built with Express.js and React Native. This guide explains how user registration, login, session management, and security are implemented throughout the application.

---

## 🏗️ Architecture Overview

### Authentication Flow

```
User Action → Frontend → Backend API → Database → Session Storage → Response
```

### Key Components

- **Frontend**: React Native with Context for user state
- **Backend**: Express.js with session middleware
- **Database**: User table with hashed passwords
- **Security**: bcrypt for password hashing, CORS for cross-origin requests

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── AuthLogin.tsx          # Login screen
│   ├── AuthSignUp.tsx         # Registration screen
│   └── AuthNavigator.tsx      # Authentication navigation
├── contexts/
│   └── UserContext.tsx        # Global user state management
├── adapters/
│   └── userAdapters.ts        # API communication for auth
└── utils/
    └── apiConfig.ts           # API endpoint configuration

backend/
├── controllers/
│   └── authControllers.ts     # Authentication route handlers
├── middleware/
│   ├── checkAuthentication.ts # Route protection middleware
│   └── cookieSession.ts       # Session configuration
├── database/
│   └── migrations/
│       └── 20240101000001_create_users_table.ts
└── src/
    └── services/
        └── userService.ts     # User business logic
```

---

## 🔧 Backend Implementation

### 1. User Database Schema

**Location**: `backend/database/migrations/20240101000001_create_users_table.ts`

```typescript
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash").nullable();
    table.string("google_id").nullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};
```

**Key Features**:

- Unique constraints on username and email
- Support for both password and Google OAuth
- Timestamps for user tracking

### 2. Authentication Controllers

**Location**: `backend/controllers/authControllers.ts`

#### User Registration

```typescript
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await knex("users")
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [newUser] = await knex("users")
      .insert({
        username,
        email,
        password_hash: passwordHash,
        created_at: new Date(),
      })
      .returning(["id", "username", "email", "created_at"]);

    // Set session
    req.session.userId = newUser.id;

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};
```

#### User Login

```typescript
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Set session
    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
```

#### Session Management

```typescript
export const showMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await knex("users")
      .where({ id: req.session.userId })
      .select(["id", "username", "email", "created_at"])
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Show me error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};
```

### 3. Authentication Middleware

**Location**: `backend/middleware/checkAuthentication.ts`

```typescript
export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }
  next();
};
```

### 4. Session Configuration

**Location**: `backend/src/index.ts`

```typescript
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

---

## 📱 Frontend Implementation

### 1. User Context

**Location**: `frontend/contexts/UserContext.tsx`

```typescript
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserContextType {
  state: UserState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UserState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await loginUser({ email, password });

      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          error: null,
        });
      } else {
        const errorData = await response.json();
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorData.error,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Login failed",
      }));
    }
  };

  // Similar implementations for register, logout, checkAuth...

  return (
    <UserContext.Provider value={{ state, login, register, logout, checkAuth }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 2. Authentication Adapters

**Location**: `frontend/adapters/userAdapters.ts`

```typescript
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    return await fetch(`${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData: RegisterData) => {
  try {
    return await fetch(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.AUTH.ME}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};
```

### 3. Login Screen

**Location**: `frontend/components/AuthLogin.tsx`

```typescript
export const AuthLogin: React.FC = () => {
  const { login, state } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentPalette } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentPalette.primary }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: currentPalette.tertiary }]}>
          Welcome Back
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quaternary,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={currentPalette.quinary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quaternary,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={currentPalette.quinary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={handleLogin}
          disabled={state.isLoading}
        >
          <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
            {state.isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
```

---

## 🔒 Security Features

### 1. Password Security

- **bcrypt hashing** with salt rounds
- **Never store plain text passwords**
- **Secure password validation**

### 2. Session Security

- **HttpOnly cookies** prevent XSS attacks
- **Session expiration** after 24 hours
- **Secure flag** for HTTPS in production

### 3. Input Validation

- **Server-side validation** for all inputs
- **Email format validation**
- **Username uniqueness checks**

### 4. CORS Configuration

```typescript
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
```

---

## 🚀 API Endpoints

### Authentication Routes

```typescript
// backend/src/index.ts
app.post("/api/auth/register", auth.registerUser);
app.post("/api/auth/login", auth.loginUser);
app.get("/api/auth/me", checkAuthentication, auth.showMe);
app.delete("/api/auth/logout", auth.logoutUser);
```

### Protected Routes

All routes that require authentication use the `checkAuthentication` middleware:

```typescript
app.get("/api/notes", checkAuthentication, noteControllers.getNotes);
app.post("/api/tasks", checkAuthentication, taskControllers.createTask);
app.get("/api/galaxies", checkAuthentication, galaxyControllers.getGalaxies);
```

---

## 🔄 Authentication Flow

### 1. User Registration

```
User fills form → Frontend validation → API call → Password hashing → User creation → Session creation → Redirect to app
```

### 2. User Login

```
User enters credentials → API call → Password verification → Session creation → User state update → Redirect to app
```

### 3. Session Persistence

```
App loads → Check existing session → API call to /auth/me → Update user state → Show authenticated content
```

### 4. Route Protection

```
User navigates → Check user state → Redirect to login if not authenticated → Show protected content if authenticated
```

---

## 🎨 UI/UX Features

### 1. Loading States

- **Spinner indicators** during authentication
- **Disabled buttons** to prevent multiple submissions
- **Error messages** for failed attempts

### 2. Form Validation

- **Real-time validation** on input fields
- **Visual feedback** for errors
- **Accessible error messages**

### 3. Responsive Design

- **Mobile-first approach** with React Native
- **Theme integration** with cosmic design
- **Keyboard handling** for form inputs

---

## 🐛 Common Issues and Solutions

### 1. Session Not Persisting

**Problem**: User logged out after app restart
**Solution**: Check cookie configuration and CORS settings

### 2. CORS Errors

**Problem**: Frontend can't connect to backend
**Solution**: Ensure CORS is configured for credentials

### 3. Password Validation

**Problem**: Weak passwords accepted
**Solution**: Implement password strength requirements

### 4. Session Expiration

**Problem**: Users unexpectedly logged out
**Solution**: Adjust session timeout and implement refresh tokens

---

## 🚀 Future Enhancements

### Planned Features

1. **JWT Tokens**: Replace sessions with JWT for scalability
2. **OAuth Integration**: Google, GitHub, Apple Sign-In
3. **Two-Factor Authentication**: SMS or authenticator app
4. **Password Reset**: Email-based password recovery
5. **Account Deletion**: User data cleanup

### Security Improvements

1. **Rate Limiting**: Prevent brute force attacks
2. **Account Lockout**: Temporary lockout after failed attempts
3. **Audit Logging**: Track authentication events
4. **Session Management**: Multiple device support

---

## 📚 Learning Resources

- [Express Session Documentation](https://github.com/expressjs/session)
- [bcrypt Documentation](https://github.com/dcodeIO/bcrypt.js)
- [React Context Guide](https://reactjs.org/docs/context.html)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

_This authentication system provides a solid foundation for Renaissance MVP. As the application scales, consider migrating to JWT tokens for better performance and scalability._

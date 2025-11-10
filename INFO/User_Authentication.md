# User Authentication Feature

## Overview

RenAI implements a comprehensive user authentication system that supports multiple authentication methods, secure session management, and user profile management. The authentication system ensures secure access to user data while providing a smooth user experience.

## Features

### 1. Email/Password Authentication

**Registration:**

- Email validation and password strength requirements
- Secure password hashing using industry-standard algorithms
- Duplicate email prevention
- User profile creation upon registration

**Login:**

- Secure credential verification
- Session-based authentication
- Cookie-based session management
- Automatic session validation

### 2. Apple Sign-In Integration

**Features:**

- Native Apple Sign-In support for iOS devices
- OAuth-based authentication flow
- Secure token handling
- Seamless integration with Apple ecosystem

**Benefits:**

- One-tap authentication on Apple devices
- Enhanced privacy with Apple's authentication
- No password management required
- Trusted authentication provider

### 3. Session Management

**Implementation:**

- Cookie-based sessions for secure authentication
- Session expiration and renewal
- Automatic session validation on API requests
- Secure session storage

**Security Features:**

- HTTP-only cookies to prevent XSS attacks
- Secure flag for HTTPS connections
- Session timeout handling
- Automatic logout on session expiration

### 4. User Profile Management

**Profile Features:**

- User information storage (username, email)
- Profile update functionality
- Avatar/image support (future)
- Preferences storage

**Account Management:**

- Password reset functionality (future)
- Email verification (future)
- Account deletion (future)
- Privacy settings

## Technical Implementation

### Backend Architecture

**Controllers:**

- `authControllers.ts`: Handles authentication routes
- `appleAuthController.ts`: Manages Apple Sign-In flow

**Middleware:**

- `checkAuthentication.ts`: Validates user sessions
- `cookieSession.ts`: Manages cookie-based sessions
- `handleCookieSessions.ts`: Session handling utilities

**Services:**

- `userService.ts`: User business logic
- Password hashing and verification
- Session creation and validation

### Frontend Implementation

**Components:**

- `AuthSignUp.tsx`: Registration form
- `AuthLogin.tsx`: Login form
- `AccountScreen.tsx`: Account management
- `UserProfileScreen.tsx`: Profile display and editing
- `UserProfileUpdateModal.tsx`: Profile update modal

**Context:**

- `UserContext.tsx`: Global user state management
- Authentication state tracking
- User data management
- Logout functionality

**Adapters:**

- `userAdapters.ts`: API communication for authentication
- Login and registration requests
- Profile update requests
- Session management

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

**Key Fields:**

- `id`: Unique user identifier
- `email`: User email address (unique)
- `username`: Display name
- `password_hash`: Securely hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## API Endpoints

### Authentication Routes

```
POST /api/auth/register
  - Register a new user
  - Body: { email, username, password }
  - Returns: User object and session cookie

POST /api/auth/login
  - Authenticate existing user
  - Body: { email, password }
  - Returns: User object and session cookie

POST /api/auth/logout
  - End user session
  - Returns: Success message

GET /api/auth/me
  - Get current user information
  - Requires: Authentication
  - Returns: User object

POST /api/auth/apple
  - Apple Sign-In authentication
  - Body: { identityToken, userIdentifier }
  - Returns: User object and session cookie
```

### User Profile Routes

```
GET /api/users/profile
  - Get user profile
  - Requires: Authentication
  - Returns: User profile data

PUT /api/users/profile
  - Update user profile
  - Requires: Authentication
  - Body: { username, email, ... }
  - Returns: Updated user profile
```

## Security Features

### Password Security

- **Hashing**: Passwords are hashed using secure algorithms (bcrypt)
- **Salt**: Unique salt per password
- **Strength Requirements**: Minimum password complexity
- **Never Stored Plaintext**: Passwords are never stored in plain text

### Session Security

- **HTTP-Only Cookies**: Prevents JavaScript access to cookies
- **Secure Flag**: Ensures cookies only sent over HTTPS
- **Session Expiration**: Automatic session timeout
- **CSRF Protection**: Cross-site request forgery protection

### Data Protection

- **Input Validation**: All user inputs are validated
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Protection against brute force attacks

## User Experience

### Registration Flow

1. User enters email, username, and password
2. System validates inputs
3. Password is hashed
4. User account is created
5. Session is established
6. User is redirected to home screen

### Login Flow

1. User enters email and password
2. Credentials are verified
3. Session is created
4. User is authenticated
5. User is redirected to home screen

### Apple Sign-In Flow

1. User taps "Sign in with Apple"
2. Apple authentication modal appears
3. User authenticates with Apple
4. Apple returns identity token
5. Backend verifies token
6. User account is created/retrieved
7. Session is established
8. User is authenticated

## Error Handling

### Common Errors

- **Invalid Credentials**: Wrong email or password
- **Email Already Exists**: Duplicate email during registration
- **Session Expired**: Session timeout
- **Validation Errors**: Invalid input format
- **Network Errors**: Connection issues

### User Feedback

- Clear error messages
- Validation feedback on forms
- Loading states during authentication
- Success confirmations
- Helpful guidance for errors

## Future Enhancements

### Planned Features

- **Email Verification**: Verify email addresses
- **Password Reset**: Forgot password functionality
- **Two-Factor Authentication**: Enhanced security
- **Social Login**: Google, Facebook authentication
- **Account Deletion**: User data deletion
- **Privacy Settings**: Granular privacy controls
- **Activity Log**: Authentication history
- **Device Management**: Manage active sessions

### Technical Improvements

- **OAuth 2.0**: Standardized authentication flow
- **JWT Tokens**: Token-based authentication option
- **Refresh Tokens**: Long-lived sessions
- **Biometric Authentication**: Face ID, Touch ID
- **Passwordless Login**: Magic link authentication
- **Account Recovery**: Multiple recovery options

## Testing

### Test Cases

- User registration with valid data
- User registration with duplicate email
- User login with correct credentials
- User login with incorrect credentials
- Session persistence across app restarts
- Session expiration handling
- Apple Sign-In flow
- Profile update functionality
- Logout functionality

### Security Testing

- Password hashing verification
- Session security testing
- CSRF protection testing
- XSS prevention testing
- SQL injection prevention
- Rate limiting verification

## Conclusion

The User Authentication feature provides a secure, user-friendly foundation for RenAI. With support for multiple authentication methods, robust session management, and comprehensive security measures, users can trust that their data is protected while enjoying a smooth authentication experience.

The system is designed to be extensible, allowing for future enhancements like two-factor authentication, social login, and advanced privacy controls while maintaining the security and usability that users expect.

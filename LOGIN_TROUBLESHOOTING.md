# Login Troubleshooting Guide

## 🔍 Issues Found and Fixed

### 1. **API Configuration Issue (FIXED)**

**Problem**: Frontend was trying to connect to wrong IP address

- Old: `http://10.0.13.161:3000` (incorrect IP)
- New: `http://localhost:3000` (correct for local development)

**Solution**: Updated `frontend/utils/apiConfig.ts` to use correct localhost URL

### 2. **Missing Logout Route (FIXED)**

**Problem**: Backend was missing logout route
**Solution**: Added `app.post("/api/auth/logout", auth.logoutUser);` to backend routes

## 🚀 Steps to Test Login

### Step 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output**: `🚀 Backend server listening at http://0.0.0.0:3000`

### Step 2: Test Backend Connectivity

```bash
cd backend
node test-login.js
```

### Step 3: Check Database Connection

```bash
cd backend
node -e "
const { testConnection } = require('./src/database');
testConnection().then(() => console.log('✅ DB OK')).catch(e => console.log('❌ DB Error:', e));
"
```

### Step 4: Test Login with Seeded Users

The seeded users have dummy password hashes. Create a new user instead:

**Using curl:**

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login with the new user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## 🔧 Common Issues and Solutions

### Issue 1: "Cannot connect to backend"

**Symptoms**: Network errors, connection refused
**Solutions**:

1. Ensure backend is running: `npm run dev` in backend folder
2. Check if port 3000 is available: `netstat -an | grep 3000`
3. Update API_BASE_URL in `frontend/utils/apiConfig.ts` to match your IP

### Issue 2: "User not found" during login

**Symptoms**: 404 error when trying to login
**Solutions**:

1. Register a new user first
2. Check database connection
3. Verify user exists: `SELECT * FROM users;` in database

### Issue 3: "Invalid credentials"

**Symptoms**: 401 error with correct username
**Solutions**:

1. Use newly registered user (seeded users have dummy hashes)
2. Check password is being hashed correctly
3. Verify bcrypt comparison in backend

### Issue 4: Session not persisting

**Symptoms**: Login works but user gets logged out immediately
**Solutions**:

1. Ensure `credentials: "include"` in frontend fetch requests
2. Check CORS configuration allows credentials
3. Verify session middleware is properly configured

## 📱 Frontend Testing

### For React Native/Expo:

1. If using physical device, update API_BASE_URL to your computer's IP:

   ```typescript
   export const API_BASE_URL = "http://YOUR_COMPUTER_IP:3000";
   ```

2. If using emulator:
   - Android: `http://10.0.2.2:3000`
   - iOS Simulator: `http://localhost:3000`

### Test Steps:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Try registering a new user
4. Try logging in with the new user

## 🔍 Debug Logs

Enable debug logging by checking:

1. Backend console for request logs
2. Frontend console for API call logs
3. Network tab in browser/debugger for HTTP requests

## 📋 Environment Checklist

- [ ] Backend server running on port 3000
- [ ] Database connected and migrations run
- [ ] Frontend API config points to correct backend URL
- [ ] CORS configured to allow credentials
- [ ] Session middleware properly configured
- [ ] bcrypt working for password hashing/comparison

## 🆘 If Still Not Working

1. **Check backend logs** for detailed error messages
2. **Run the test script**: `node backend/test-login.js`
3. **Verify database** has users table with proper schema
4. **Check network connectivity** between frontend and backend
5. **Test with curl** to isolate frontend vs backend issues

The most common issue is the API configuration pointing to the wrong URL. Make sure your frontend is pointing to where your backend is actually running!

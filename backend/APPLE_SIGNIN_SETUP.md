# 🍎 Apple Sign In Setup Guide for REN|AI

This guide will walk you through setting up Apple Sign In for your REN|AI app, both in App Store Connect and in your codebase.

## 📋 **Prerequisites**

- Apple Developer Account
- App Store Connect access
- Xcode (for iOS configuration)
- React Native development environment

## 🚀 **Step 1: App Store Connect Configuration**

### **A. Enable Sign In with Apple**

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your **REN|AI** app
3. Go to **App Information** → **App Store** tab
4. Scroll down to **Sign In with Apple**
5. Check the box to **Enable Sign In with Apple**
6. Click **Save**

### **B. Configure App Capabilities**

1. In App Store Connect, go to **App Information** → **General** tab
2. Under **App Capabilities**, ensure **Sign In with Apple** is listed
3. If not, you'll need to add it in Xcode

## 📱 **Step 2: Xcode Configuration**

### **A. Add Sign In with Apple Capability**

1. Open your project in Xcode
2. Select your project in the navigator
3. Select your target (REN|AI)
4. Go to **Signing & Capabilities** tab
5. Click **+ Capability**
6. Add **Sign In with Apple**

### **B. Update Info.plist**

1. Open `Info.plist` in Xcode
2. Add the following key:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
       <dict>
           <key>CFBundleURLName</key>
           <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
           <key>CFBundleURLSchemes</key>
           <array>
               <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
           </array>
       </dict>
   </array>
   ```

## 🔧 **Step 3: Backend Configuration**

### **A. Environment Variables**

Add these to your `.env` file:

```env
JWT_SECRET=your_jwt_secret_here
APPLE_TEAM_ID=your_apple_team_id
APPLE_SERVICE_ID=your_app_bundle_id
```

### **B. Apple Team ID**

1. Go to [Apple Developer](https://developer.apple.com)
2. Sign in with your Apple Developer account
3. Go to **Certificates, Identifiers & Profiles**
4. Note your **Team ID** (10-character string)

### **C. Service ID**

1. In Apple Developer, go to **Identifiers**
2. Click **+** to add new identifier
3. Select **Services IDs**
4. Enter description: "REN|AI Sign In with Apple"
5. Enter identifier: `com.renai.zylith` (your app's bundle ID)
6. Check **Sign In with Apple**
7. Click **Continue** and **Register**

## 🎯 **Step 4: Frontend Configuration**

### **A. Install Dependencies**

```bash
cd frontend
npm install @invertase/react-native-apple-authentication
```

### **B. iOS Pod Installation**

```bash
cd ios
pod install
```

### **C. Update iOS Deployment Target**

Ensure your iOS deployment target is **13.0** or higher in Xcode.

## 🔐 **Step 5: Security Considerations**

### **A. Token Validation (Production)**

In production, you should validate Apple's identity token:

1. Decode the JWT token
2. Verify the signature using Apple's public keys
3. Check the token expiration
4. Validate the audience and issuer

### **B. User Privacy**

- Apple may not provide email on subsequent sign-ins
- Store user data securely
- Handle email changes gracefully
- Respect user's privacy choices

## 🧪 **Step 6: Testing**

### **A. Sandbox Testing**

1. Use TestFlight for testing
2. Create sandbox testers in App Store Connect
3. Test both new user creation and existing user sign-in
4. Test with and without email sharing

### **B. Test Scenarios**

- First-time Apple Sign In
- Returning Apple Sign In
- User cancels sign-in
- Network errors
- Invalid tokens

## 📊 **Step 7: Monitoring & Analytics**

### **A. Track Sign-In Methods**

Monitor which authentication methods users prefer:

- Traditional username/password
- Apple Sign In
- Success/failure rates

### **B. User Experience Metrics**

- Sign-in completion rate
- Time to complete sign-in
- Error rates and types

## 🚨 **Common Issues & Solutions**

### **Issue: "Sign In with Apple not available"**

- **Solution**: Ensure iOS 13.0+ deployment target
- **Solution**: Verify capability is added in Xcode
- **Solution**: Check App Store Connect configuration

### **Issue: "Invalid client" error**

- **Solution**: Verify bundle ID matches exactly
- **Solution**: Check Apple Developer service ID configuration
- **Solution**: Ensure app is properly signed

### **Issue: Email not received on subsequent sign-ins**

- **Solution**: This is expected behavior
- **Solution**: Store email securely on first sign-in
- **Solution**: Provide alternative ways to contact users

## 🔄 **Integration with Existing Auth**

### **A. User Linking**

- Link Apple accounts to existing email accounts
- Handle multiple sign-in methods per user
- Prevent duplicate accounts

### **B. Account Recovery**

- Provide alternative recovery methods
- Handle Apple account deletion scenarios
- Maintain user data integrity

## 📱 **User Experience Best Practices**

### **A. Button Design**

- Use Apple's official button design guidelines
- Ensure proper contrast and accessibility
- Place button prominently but not intrusively

### **B. Error Handling**

- Provide clear, helpful error messages
- Offer alternative sign-in methods
- Guide users through resolution steps

### **C. Loading States**

- Show appropriate loading indicators
- Provide feedback during authentication
- Handle timeouts gracefully

## 🎉 **Success Checklist**

- [ ] App Store Connect: Sign In with Apple enabled
- [ ] Xcode: Capability added and configured
- [ ] Backend: Apple Sign In endpoint implemented
- [ ] Frontend: Apple Sign In button integrated
- [ ] Database: Apple user fields added
- [ ] Testing: Sandbox testing completed
- [ ] Production: Token validation implemented
- [ ] Monitoring: Analytics and error tracking set up

## 🔗 **Additional Resources**

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [React Native Apple Authentication](https://github.com/invertase/react-native-apple-authentication)
- [Apple Developer Guidelines](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple)

## 🆘 **Support**

If you encounter issues:

1. Check Apple Developer documentation
2. Verify all configuration steps
3. Test in sandbox environment first
4. Review error logs and console output
5. Ensure all dependencies are properly installed

---

**Note**: Apple Sign In is required for apps that offer third-party sign-in methods. Make sure to implement this before submitting your app for review.

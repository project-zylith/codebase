# NativeWind Conversion Guide

## 🎨 Your New Dark Mode Color Palette

Based on #202C31, here's your comprehensive color system:

### Dark Mode Colors

- **Primary**: `#202C31` (Main dark background)
- **Secondary**: `#2A3A40` (Cards, sections)
- **Tertiary**: `#354049` (Elevated elements)
- **Surface**: `#1A252A` (Deep backgrounds)
- **Elevated**: `#3A4A51` (Dropdowns, modals)

### Text Colors

- **Primary**: `#E8F0F5` (Main text)
- **Secondary**: `#B8C8D3` (Secondary text)
- **Muted**: `#8A9BA6` (Muted text)
- **Disabled**: `#5A6B76` (Disabled text)

### Accent Colors

- **Blue**: `#4A9EFF` (Dark mode adjusted blue)
- **Green**: `#52C878` (Success)
- **Yellow**: `#FFD93D` (Warning)
- **Red**: `#FF6B6B` (Error)

## ⚙️ Required Setup for NativeWind

### 1. TypeScript Configuration

Create or update your `nativewind-env.d.ts` file in the root of your frontend directory:

```typescript
/// <reference types="nativewind/types" />
```

### 2. Metro Configuration

Create or update your `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### 3. Global CSS File

Create a `global.css` file in your frontend root:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. App.tsx Configuration

Update your `App.tsx` to import the global CSS:

```typescript
import "./global.css";
import { StatusBar } from "expo-status-bar";
// ... rest of your imports
```

### 5. Babel Configuration

Update your `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

## 🔄 Converting Your TenTapEditorNew Component

### Before (StyleSheet) vs After (NativeWind)

#### Container Styles

```typescript
// Before (StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});

// After (NativeWind)
// Remove StyleSheet and use className
<SafeAreaView className="flex-1 bg-dark-primary">
```

#### Header Styles

```typescript
// Before (StyleSheet)
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: "#ffffff",
  borderBottomWidth: 0.5,
  borderBottomColor: "#e0e0e0",
},

// After (NativeWind)
<View className="flex-row justify-between items-center px-5 py-4 bg-dark-primary border-b border-dark-border-primary">
```

#### Title Styles

```typescript
// Before (StyleSheet)
title: {
  fontSize: 20,
  fontWeight: "600",
  color: "#333333",
  flex: 1,
  textAlign: "center",
},

// After (NativeWind)
<Text className="text-xl font-semibold text-dark-text-primary flex-1 text-center">
```

#### Button Styles

```typescript
// Before (StyleSheet)
headerButton: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  minWidth: 50,
},
headerButtonText: {
  fontSize: 16,
  fontWeight: "500",
  color: "#007AFF",
},

// After (NativeWind)
<TouchableOpacity className="px-2 py-1 min-w-[50px]">
  <Text className="text-base font-medium text-dark-accent-blue">
```

#### Tools Dropdown

```typescript
// Before (StyleSheet)
toolsDropdown: {
  position: "absolute",
  top: 70,
  left: 20,
  backgroundColor: "#ffffff",
  borderRadius: 12,
  paddingVertical: 8,
  minWidth: 160,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
  zIndex: 1000,
  borderWidth: 0.5,
  borderColor: "#e0e0e0",
},

// After (NativeWind)
<View className="absolute top-[70px] left-5 bg-dark-elevated rounded-xl py-2 min-w-[160px] shadow-medium z-[1000] border border-dark-border-primary">
```

#### Tool Options

```typescript
// Before (StyleSheet)
toolOption: {
  paddingHorizontal: 16,
  paddingVertical: 12,
},
toolOptionText: {
  fontSize: 16,
  color: "#333333",
  fontWeight: "500",
},
activeToolText: {
  color: "#007AFF",
},

// After (NativeWind)
<TouchableOpacity className="px-4 py-3">
  <Text className={`text-base font-medium ${
    lastUsedTool === "bold"
      ? "text-dark-accent-blue"
      : "text-dark-text-primary"
  }`}>
```

#### Editor Container

```typescript
// Before (StyleSheet)
editorContainer: {
  flex: 1,
  backgroundColor: "#ffffff",
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 20,
  minHeight: 500,
},

// After (NativeWind)
<View className="flex-1 bg-dark-primary px-5 py-5 min-h-[500px]">
```

#### Keyboard Accessory

```typescript
// Before (StyleSheet)
keyboardAccessory: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
  borderTopWidth: 0.5,
  borderTopColor: "#e0e0e0",
  paddingVertical: 12,
  paddingHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
},

// After (NativeWind)
<View className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center bg-dark-secondary border-t border-dark-border-primary py-3 px-4 shadow-medium">
```

#### Done Button

```typescript
// Before (StyleSheet)
doneButton: {
  backgroundColor: "#007AFF",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
},
doneButtonText: {
  color: "#ffffff",
  fontWeight: "600",
  fontSize: 16,
},

// After (NativeWind)
<TouchableOpacity className="bg-dark-accent-blue px-4 py-2 rounded-lg">
  <Text className="text-white font-semibold text-base">
```

## 📝 Step-by-Step Conversion Process

### 1. Set up NativeWind TypeScript support

```bash
# Create the type definition file
touch nativewind-env.d.ts
```

### 2. Remove StyleSheet imports and styles

```typescript
// Remove these lines
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({...});
```

### 3. Replace style props with className

```typescript
// Instead of: style={styles.container}
// Use: className="flex-1 bg-dark-primary"
```

### 4. Convert common style patterns

#### Flexbox

```typescript
// flex: 1 → className="flex-1"
// flexDirection: "row" → className="flex-row"
// justifyContent: "center" → className="justify-center"
// alignItems: "center" → className="items-center"
```

#### Spacing

```typescript
// padding: 16 → className="p-4"
// paddingHorizontal: 20 → className="px-5"
// paddingVertical: 12 → className="py-3"
// margin: 8 → className="m-2"
```

#### Colors

```typescript
// backgroundColor: "#ffffff" → className="bg-dark-primary"
// color: "#333333" → className="text-dark-text-primary"
// borderColor: "#e0e0e0" → className="border-dark-border-primary"
```

#### Typography

```typescript
// fontSize: 16 → className="text-base"
// fontSize: 20 → className="text-xl"
// fontWeight: "600" → className="font-semibold"
// textAlign: "center" → className="text-center"
```

#### Borders

```typescript
// borderWidth: 1 → className="border"
// borderRadius: 8 → className="rounded-lg"
// borderRadius: 12 → className="rounded-xl"
```

#### Positioning

```typescript
// position: "absolute" → className="absolute"
// top: 70 → className="top-[70px]"
// left: 20 → className="left-5"
// zIndex: 1000 → className="z-[1000]"
```

## 🌙 Dark Mode Implementation

### Method 1: Using Conditional Classes

```typescript
const isDarkMode = true; // You can get this from context/state

<View className={`flex-1 ${isDarkMode ? 'bg-dark-primary' : 'bg-light-primary'}`}>
```

### Method 2: Using Color Variants

```typescript
// In your tailwind config, you can set up dark mode variants
// Then use: className="bg-light-primary dark:bg-dark-primary"
```

### Method 3: Context-Based Approach

```typescript
// Create a theme context
const ThemeContext = createContext({ isDark: false });

// Use in components
const { isDark } = useContext(ThemeContext);
<View className={`flex-1 ${isDark ? 'bg-dark-primary' : 'bg-light-primary'}`}>
```

## 🎯 Common NativeWind Classes for Your Component

### Background Colors

```typescript
// Dark mode backgrounds
bg - dark - primary; // #202C31
bg - dark - secondary; // #2A3A40
bg - dark - tertiary; // #354049
bg - dark - surface; // #1A252A
bg - dark - elevated; // #3A4A51

// Light mode backgrounds
bg - light - primary; // #ffffff
bg - light - secondary; // #f8f9fa
bg - light - tertiary; // #e9ecef
```

### Text Colors

```typescript
// Dark mode text
text - dark - text - primary; // #E8F0F5
text - dark - text - secondary; // #B8C8D3
text - dark - text - muted; // #8A9BA6

// Accent colors
text - dark - accent - blue; // #4A9EFF
text - dark - accent - green; // #52C878
text - dark - accent - red; // #FF6B6B
```

### Border Colors

```typescript
border - dark - border - primary; // #3A4A51
border - dark - border - secondary; // #2A3A40
border - dark - border - accent; // #4A5A61
```

### Shadows

```typescript
shadow - soft; // Subtle shadow
shadow - medium; // Medium shadow
shadow - strong; // Strong shadow
```

## 🛠️ Utility Classes for Your Editor

### Common Combinations

```typescript
// Header button
"px-2 py-1 min-w-[50px]";

// Tool dropdown
"absolute top-[70px] left-5 bg-dark-elevated rounded-xl py-2 min-w-[160px] shadow-medium z-[1000] border border-dark-border-primary";

// Tool option
"px-4 py-3 text-base font-medium text-dark-text-primary";

// Active tool
"text-dark-accent-blue";

// Main container
"flex-1 bg-dark-primary";

// Editor area
"flex-1 bg-dark-primary px-5 py-5 min-h-[500px]";

// Keyboard accessory
"absolute bottom-0 left-0 right-0 flex-row justify-between items-center bg-dark-secondary border-t border-dark-border-primary py-3 px-4 shadow-medium";

// Done button
"bg-dark-accent-blue px-4 py-2 rounded-lg";
```

## 📱 Responsive Design

### Screen Size Responsive

```typescript
// Different styles for different screen sizes
"text-base md:text-lg lg:text-xl";
"px-4 md:px-6 lg:px-8";
```

### Platform Specific

```typescript
// Platform-specific styles (if needed)
"android:elevation-8 ios:shadow-lg";
```

## 🔄 Migration Checklist

- [ ] Set up NativeWind TypeScript configuration
- [ ] Create global.css file
- [ ] Update metro.config.js
- [ ] Update babel.config.js
- [ ] Update tailwind.config.js with dark mode colors
- [ ] Remove StyleSheet imports
- [ ] Convert style objects to className strings
- [ ] Update all background colors to dark mode variants
- [ ] Update all text colors to dark mode variants
- [ ] Update all border colors to dark mode variants
- [ ] Test all components with new styling
- [ ] Implement theme switching mechanism
- [ ] Add proper TypeScript types for theme context
- [ ] Test on both iOS and Android

## 🎨 Final Implementation Example

Here's how your component header would look with NativeWind:

```typescript
// Before
<View style={styles.header}>
  <TouchableOpacity style={styles.headerButton} onPress={handleTools}>
    <Text style={styles.headerButtonText}>Tools</Text>
  </TouchableOpacity>

  <Text style={styles.title}>Notes</Text>

  <TouchableOpacity style={styles.headerButton} onPress={handleDone}>
    <Text style={styles.headerButtonText}>Done</Text>
  </TouchableOpacity>
</View>

// After
<View className="flex-row justify-between items-center px-5 py-4 bg-dark-primary border-b border-dark-border-primary">
  <TouchableOpacity className="px-2 py-1 min-w-[50px]" onPress={handleTools}>
    <Text className="text-base font-medium text-dark-accent-blue">Tools</Text>
  </TouchableOpacity>

  <Text className="text-xl font-semibold text-dark-text-primary flex-1 text-center">Notes</Text>

  <TouchableOpacity className="px-2 py-1 min-w-[50px]" onPress={handleDone}>
    <Text className="text-base font-medium text-dark-accent-blue">Done</Text>
  </TouchableOpacity>
</View>
```

This gives you a beautiful dark mode interface while maintaining all the functionality and improving code readability!

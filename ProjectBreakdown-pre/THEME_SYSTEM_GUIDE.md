# Theme System - Renaissance MVP

## 🎨 Overview

Renaissance features a sophisticated **cosmic-themed design system** that provides a beautiful, immersive user experience. This guide covers the theme architecture, color palettes, component styling, and how to extend the design system.

---

## 🏗️ Architecture Overview

### Theme System Flow

```
Theme Context → Color Palettes → Component Styles → Dynamic Updates → User Experience
```

### Key Components

- **Theme Context**: Global theme state management
- **Color Palettes**: Predefined cosmic color schemes
- **Component Styling**: Consistent design patterns
- **Dynamic Switching**: Real-time theme changes
- **Accessibility**: High contrast and readability

---

## 📁 File Structure

```
frontend/
├── contexts/
│   └── ThemeContext.tsx           # Global theme management
├── assets/
│   └── colorPalette.ts            # Color palette definitions
├── components/
│   ├── HomeScreen.tsx             # Theme-aware components
│   ├── TodoScreen.tsx             # Consistent styling
│   └── EditorScreen.tsx           # Dynamic theming
└── types/
    └── types.ts                   # Theme type definitions
```

---

## 🎨 Color Palette System

### 1. Color Palette Definition

**Location**: `frontend/assets/colorPalette.ts`

```typescript
export interface ColorPalette {
  primary: string; // Main background color
  secondary: string; // Secondary background
  tertiary: string; // Primary text color
  quaternary: string; // Accent color
  quinary: string; // Secondary text color
  accent: string; // Highlight color
  error: string; // Error states
  success: string; // Success states
  warning: string; // Warning states
}

export const cosmicPalette: ColorPalette = {
  primary: "#202C31", // Deep space background
  secondary: "#2A3A41", // Lighter space background
  tertiary: "#E8F4F8", // Bright star text
  quaternary: "#4A90E2", // Cosmic blue accent
  quinary: "#B8C5CC", // Muted star text
  accent: "#FFD700", // Golden highlight
  error: "#FF6B6B", // Red nova
  success: "#4CAF50", // Green nebula
  warning: "#FF9800", // Orange comet
};

export const nebulaPalette: ColorPalette = {
  primary: "#1A1A2E", // Deep nebula background
  secondary: "#16213E", // Nebula cloud background
  tertiary: "#F0F8FF", // Bright nebula text
  quaternary: "#8B5CF6", // Purple nebula accent
  quinary: "#CBD5E1", // Muted nebula text
  accent: "#F59E0B", // Golden nebula highlight
  error: "#EF4444", // Red nebula
  success: "#10B981", // Green nebula
  warning: "#F97316", // Orange nebula
};

export const auroraPalette: ColorPalette = {
  primary: "#0F172A", // Deep aurora background
  secondary: "#1E293B", // Aurora wave background
  tertiary: "#F1F5F9", // Bright aurora text
  quaternary: "#06B6D4", // Cyan aurora accent
  quinary: "#94A3B8", // Muted aurora text
  accent: "#EC4899", // Pink aurora highlight
  error: "#DC2626", // Red aurora
  success: "#059669", // Green aurora
  warning: "#D97706", // Orange aurora
};

export const stardustPalette: ColorPalette = {
  primary: "#1F2937", // Deep stardust background
  secondary: "#374151", // Stardust cloud background
  tertiary: "#F9FAFB", // Bright stardust text
  quaternary: "#6366F1", // Indigo stardust accent
  quinary: "#9CA3AF", // Muted stardust text
  accent: "#FBBF24", // Golden stardust highlight
  error: "#B91C1C", // Red stardust
  success: "#047857", // Green stardust
  warning: "#B45309", // Orange stardust
};

export const availablePalettes: { [key: string]: ColorPalette } = {
  cosmic: cosmicPalette,
  nebula: nebulaPalette,
  aurora: auroraPalette,
  stardust: stardustPalette,
};
```

### 2. Theme Context

**Location**: `frontend/contexts/ThemeContext.tsx`

```typescript
interface ThemeContextType {
  currentPalette: ColorPalette;
  currentTheme: string;
  setTheme: (theme: string) => void;
  availableThemes: string[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>("cosmic");

  const currentPalette = availablePalettes[currentTheme] || cosmicPalette;
  const availableThemes = Object.keys(availablePalettes);

  const setTheme = (theme: string) => {
    if (availablePalettes[theme]) {
      setCurrentTheme(theme);
      // Store theme preference
      AsyncStorage.setItem("selectedTheme", theme);
    }
  };

  // Load saved theme on app start
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("selectedTheme");
        if (savedTheme && availablePalettes[savedTheme]) {
          setCurrentTheme(savedTheme);
        }
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    };

    loadSavedTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{ currentPalette, currentTheme, setTheme, availableThemes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
```

---

## 🎯 Component Styling Patterns

### 1. Dynamic Styling

```typescript
// Example: Button component with theme integration
const ThemedButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
}) => {
  const { currentPalette } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: currentPalette.quaternary,
          borderColor: currentPalette.quaternary,
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderColor: currentPalette.quaternary,
        };
      case "danger":
        return {
          backgroundColor: currentPalette.error,
          borderColor: currentPalette.error,
        };
      default:
        return {
          backgroundColor: currentPalette.quaternary,
          borderColor: currentPalette.quaternary,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

### 2. Consistent Spacing

```typescript
// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius system
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Typography system
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
};
```

### 3. Component Style Examples

```typescript
// HomeScreen styling
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subheader: {
    ...typography.body,
    opacity: 0.8,
  },
  headerButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cosmicSpace: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  centralButtonContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centralButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...typography.body,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  cosmicRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    opacity: 0.3,
  },
});
```

---

## 🌟 Special Effects and Animations

### 1. Star Animation System

```typescript
// Star animation with theme colors
const renderNoteStar = (note: NoteWithPosition, index: number) => {
  const { currentPalette } = useTheme();
  const animatedValues = starAnimations[index] || {
    opacity: new Animated.Value(0.7),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    scale: new Animated.Value(1),
  };

  // Pulsing animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  return (
    <Animated.View
      key={note.id}
      style={[
        styles.noteStar,
        {
          left: note.position.x,
          top: note.position.y,
          opacity: animatedValues.opacity,
          transform: [
            { translateX: animatedValues.translateX },
            { translateY: animatedValues.translateY },
            { scale: animatedValues.scale },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.starButton}
        onPress={() => handleNotePress(note)}
        onLongPress={() => handleNoteLongPress(note)}
        activeOpacity={0.8}
      >
        <Ionicons name="star" size={24} color={currentPalette.quaternary} />
        <Text style={[styles.starLabel, { color: currentPalette.quinary }]}>
          {note.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### 2. Gradient Effects

```typescript
// Gradient background component
const GradientBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentPalette } = useTheme();

  return (
    <LinearGradient
      colors={[
        currentPalette.primary,
        currentPalette.secondary,
        currentPalette.primary,
      ]}
      style={styles.gradientContainer}
    >
      {children}
    </LinearGradient>
  );
};

// Glass morphism effect
const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPalette } = useTheme();

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: `${currentPalette.secondary}80`,
          borderColor: `${currentPalette.quaternary}40`,
        },
      ]}
    >
      {children}
    </View>
  );
};
```

---

## 🎨 Theme Switching

### 1. Theme Selector Component

```typescript
const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes, currentPalette } =
    useTheme();
  const [showSelector, setShowSelector] = useState(false);

  return (
    <View style={styles.themeSelector}>
      <TouchableOpacity
        style={[
          styles.currentThemeButton,
          { backgroundColor: currentPalette.secondary },
        ]}
        onPress={() => setShowSelector(!showSelector)}
      >
        <Ionicons
          name="color-palette"
          size={20}
          color={currentPalette.tertiary}
        />
        <Text
          style={[styles.themeButtonText, { color: currentPalette.tertiary }]}
        >
          {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
        </Text>
        <Ionicons
          name={showSelector ? "chevron-up" : "chevron-down"}
          size={16}
          color={currentPalette.tertiary}
        />
      </TouchableOpacity>

      {showSelector && (
        <View
          style={[
            styles.themeOptions,
            { backgroundColor: currentPalette.secondary },
          ]}
        >
          {availableThemes.map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeOption,
                theme === currentTheme && {
                  backgroundColor: currentPalette.quaternary,
                },
              ]}
              onPress={() => {
                setTheme(theme);
                setShowSelector(false);
              }}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: availablePalettes[theme].quaternary },
                ]}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  { color: currentPalette.tertiary },
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
```

### 2. Smooth Theme Transitions

```typescript
// Animated theme transition
const AnimatedThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentPalette } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const transitionTheme = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};
```

---

## ♿ Accessibility Features

### 1. High Contrast Mode

```typescript
// High contrast color adjustments
const getAccessibleColors = (
  palette: ColorPalette,
  isHighContrast: boolean
) => {
  if (!isHighContrast) return palette;

  return {
    ...palette,
    tertiary: "#FFFFFF", // Pure white for maximum contrast
    quinary: "#CCCCCC", // Light gray for secondary text
    quaternary: "#00BFFF", // Bright blue for better visibility
  };
};
```

### 2. Color Blindness Support

```typescript
// Color blind friendly adjustments
const getColorBlindFriendlyColors = (palette: ColorPalette) => {
  return {
    ...palette,
    success: "#2E8B57", // Sea green instead of pure green
    error: "#DC143C", // Crimson instead of pure red
    warning: "#FF8C00", // Dark orange instead of pure orange
  };
};
```

---

## 🚀 Advanced Theming Features

### 1. Custom Theme Creation

```typescript
// User-defined theme system
interface CustomTheme extends ColorPalette {
  name: string;
  description: string;
  isCustom: boolean;
}

const createCustomTheme = (
  name: string,
  colors: Partial<ColorPalette>
): CustomTheme => {
  return {
    name,
    description: `Custom theme: ${name}`,
    isCustom: true,
    ...cosmicPalette, // Default fallback
    ...colors, // Override with custom colors
  };
};
```

### 2. Dynamic Theme Generation

```typescript
// AI-generated themes based on user preferences
const generateThemeFromPreferences = (
  preferences: ThemePreferences
): ColorPalette => {
  // Algorithm to generate harmonious color palette
  const baseHue = preferences.favoriteColor || 210; // Default to blue

  return {
    primary: `hsl(${baseHue}, 30%, 15%)`,
    secondary: `hsl(${baseHue}, 25%, 20%)`,
    tertiary: `hsl(${baseHue}, 10%, 95%)`,
    quaternary: `hsl(${baseHue}, 70%, 60%)`,
    quinary: `hsl(${baseHue}, 15%, 75%)`,
    accent: `hsl(${(baseHue + 60) % 360}, 80%, 60%)`,
    error: `hsl(0, 70%, 60%)`,
    success: `hsl(120, 70%, 60%)`,
    warning: `hsl(30, 80%, 60%)`,
  };
};
```

---

## 🐛 Common Issues and Solutions

### 1. Theme Not Updating

**Problem**: Component doesn't reflect theme changes
**Solution**: Ensure component uses `useTheme` hook and re-renders

### 2. Color Contrast Issues

**Problem**: Text not readable on background
**Solution**: Implement contrast checking and automatic adjustments

### 3. Performance Issues

**Problem**: Theme switching causes lag
**Solution**: Optimize re-renders and use React.memo for components

### 4. Animation Conflicts

**Problem**: Theme transitions conflict with other animations
**Solution**: Coordinate animation timing and use proper cleanup

---

## 🚀 Future Enhancements

### Planned Features

1. **Dark/Light Mode**: Automatic system theme detection
2. **Custom Themes**: User-created color palettes
3. **Seasonal Themes**: Time-based theme changes
4. **Mood-based Themes**: AI-suggested themes based on usage
5. **Animation Themes**: Different animation styles per theme

### Technical Improvements

1. **Theme Persistence**: Cloud sync of theme preferences
2. **Performance Optimization**: Lazy loading of theme assets
3. **Advanced Accessibility**: Voice-guided theme selection
4. **Theme Analytics**: Usage tracking and optimization
5. **Export/Import**: Share custom themes between users

---

## 📚 Learning Resources

- [React Native Animated API](https://reactnative.dev/docs/animated)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design Systems](https://www.designsystems.com/)

---

_The Theme System provides a beautiful, consistent, and accessible user experience in Renaissance. Its cosmic design language creates an immersive environment that enhances the note-taking and task management experience._

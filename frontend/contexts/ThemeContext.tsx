import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colorPalette2,
  colorPalette3,
  colorPalette5,
  colorPalette8,
  colorPalette10,
} from "../assets/colorPalette";
import { useUser } from "./UserContext";
import { useSubscription } from "./SubscriptionContext";

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  quinary: string;
  accent: string;
  background: string;
  card: string;
  border: string;
  button: string;
  buttonText: string;
  // Additional contrast variables
  darkBackground: string;
  lightText: string;
  darkText: string;
}

export interface PaletteOption {
  id: string;
  name: string;
  palette: ColorPalette;
}

const paletteOptions: PaletteOption[] = [
  // { id: "default", name: "Cosmic Ocean", palette: cosmicOcean },
  // { id: "nebula", name: "Nebula", palette: nebula }, // Doesn't fit the overall theme but is production ready
  { id: "palette2", name: "Night Sky", palette: colorPalette3 },
  // { id: "palette3", name: "Watercolor", palette: colorPalette2 },
  // { id: "palette4", name: "Monochrome", palette: colorPalette5 }, // Needs work but is not a bad design
  { id: "default", name: "Navy & Cyan", palette: colorPalette8 },
  // { id: "palette6", name: "Orange Fruit", palette: colorPalette7 },
  // { id: "palette7", name: "Coffee & Cream", palette: colorPalette9 },
  { id: "palette8", name: "Cosmic Violet", palette: colorPalette10 },
];

interface ThemeContextType {
  currentPalette: ColorPalette;
  currentPaletteId: string;
  paletteOptions: PaletteOption[];
  switchPalette: (paletteId: string) => Promise<void>;
  isDarkModeNotes: boolean;
  toggleDarkModeNotes: () => Promise<boolean>;
  canUseDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state: userState } = useUser();
  const { state: subscriptionState } = useSubscription();
  const [currentPaletteId, setCurrentPaletteId] = useState<string>("default");
  const [currentPalette, setCurrentPalette] =
    useState<ColorPalette>(colorPalette8);
  const [isDarkModeNotes, setIsDarkModeNotes] = useState<boolean>(false);

  // Check if user can use dark mode (Basic or Pro subscribers)
  const canUseDarkMode = Boolean(
    subscriptionState.subscription &&
      subscriptionState.subscription.status === "active" &&
      (subscriptionState.subscription.plan_name === "Basic Monthly" ||
        subscriptionState.subscription.plan_name === "Basic Annual" ||
        subscriptionState.subscription.plan_name === "Pro Monthly" ||
        subscriptionState.subscription.plan_name === "Pro Annual")
  );

  // Debug logging for subscription data
  console.log("🔍 Dark Mode Debug Info:");
  console.log("- Subscription exists:", !!subscriptionState.subscription);
  console.log("- Subscription status:", subscriptionState.subscription?.status);
  console.log("- Plan name:", subscriptionState.subscription?.plan_name);
  console.log("- Can use dark mode:", canUseDarkMode);

  // Get user-specific storage keys
  const getStorageKey = (userId: number) => `selectedPalette_user_${userId}`;
  const getDarkModeStorageKey = (userId: number) =>
    `darkModeNotes_user_${userId}`;

  useEffect(() => {
    if (userState.user?.id) {
      loadSavedPalette(userState.user.id);
      loadSavedDarkMode(userState.user.id);
    } else {
      // Reset to default when no user is logged in
      setCurrentPaletteId("default");
      setCurrentPalette(colorPalette8);
      setIsDarkModeNotes(false);
    }
  }, [userState.user?.id]);

  // Disable dark mode if user loses subscription access
  useEffect(() => {
    if (!canUseDarkMode && isDarkModeNotes) {
      setIsDarkModeNotes(false);
    }
  }, [canUseDarkMode, isDarkModeNotes]);

  const loadSavedPalette = async (userId: number) => {
    try {
      const storageKey = getStorageKey(userId);
      const savedPaletteId = await AsyncStorage.getItem(storageKey);
      if (savedPaletteId) {
        const palette = paletteOptions.find((p) => p.id === savedPaletteId);
        if (palette) {
          setCurrentPaletteId(savedPaletteId);
          setCurrentPalette(palette.palette);
        }
      } else {
        // No saved palette for this user, use default
        setCurrentPaletteId("default");
        setCurrentPalette(colorPalette8);
      }
    } catch (error) {
      console.error("Error loading saved palette:", error);
      // Fallback to default on error
      setCurrentPaletteId("default");
      setCurrentPalette(colorPalette8);
    }
  };

  const switchPalette = async (paletteId: string) => {
    try {
      const palette = paletteOptions.find((p) => p.id === paletteId);
      if (palette && userState.user?.id) {
        setCurrentPaletteId(paletteId);
        setCurrentPalette(palette.palette);
        const storageKey = getStorageKey(userState.user.id);
        await AsyncStorage.setItem(storageKey, paletteId);
      }
    } catch (error) {
      console.error("Error saving palette:", error);
    }
  };

  const loadSavedDarkMode = async (userId: number) => {
    try {
      const storageKey = getDarkModeStorageKey(userId);
      const savedDarkMode = await AsyncStorage.getItem(storageKey);
      if (savedDarkMode !== null) {
        setIsDarkModeNotes(savedDarkMode === "true");
      } else {
        // Default to light mode
        setIsDarkModeNotes(false);
      }
    } catch (error) {
      console.error("Error loading saved dark mode:", error);
      setIsDarkModeNotes(false);
    }
  };

  const toggleDarkModeNotes = async (): Promise<boolean> => {
    try {
      // Check if user has access to dark mode
      if (!canUseDarkMode && !isDarkModeNotes) {
        // User trying to enable dark mode without subscription
        return false;
      }

      const newDarkMode = !isDarkModeNotes;
      setIsDarkModeNotes(newDarkMode);

      if (userState.user?.id) {
        const storageKey = getDarkModeStorageKey(userState.user.id);
        await AsyncStorage.setItem(storageKey, newDarkMode.toString());
      }
      return true;
    } catch (error) {
      console.error("Error saving dark mode:", error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentPalette,
        currentPaletteId,
        paletteOptions,
        switchPalette,
        isDarkModeNotes,
        toggleDarkModeNotes,
        canUseDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

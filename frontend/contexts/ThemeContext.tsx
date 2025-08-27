import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colorPalette2,
  colorPalette3,
  colorPalette5,
  colorPalette7,
  colorPalette8,
  colorPalette9,
  colorPalette10,
  nebula,
  cosmicOcean,
} from "../assets/colorPalette";
import { useUser } from "./UserContext";

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
}

export interface PaletteOption {
  id: string;
  name: string;
  palette: ColorPalette;
}

const paletteOptions: PaletteOption[] = [
  { id: "default", name: "Cosmic Ocean", palette: cosmicOcean },
  { id: "nebula", name: "Nebula", palette: nebula },
  { id: "palette2", name: "Night Sky", palette: colorPalette3 },
  { id: "palette3", name: "Watercolor", palette: colorPalette2 },
  { id: "palette4", name: "Monochrome", palette: colorPalette5 },
  { id: "palette5", name: "Navy & Cyan", palette: colorPalette8 },
  { id: "palette6", name: "Orange Fruit", palette: colorPalette7 },
  { id: "palette7", name: "Coffee & Cream", palette: colorPalette9 },
  { id: "palette8", name: "Cosmic Violet", palette: colorPalette10 },
];

interface ThemeContextType {
  currentPalette: ColorPalette;
  currentPaletteId: string;
  paletteOptions: PaletteOption[];
  switchPalette: (paletteId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state: userState } = useUser();
  const [currentPaletteId, setCurrentPaletteId] = useState<string>("default");
  const [currentPalette, setCurrentPalette] =
    useState<ColorPalette>(cosmicOcean);

  // Get user-specific storage key
  const getStorageKey = (userId: number) => `selectedPalette_user_${userId}`;

  useEffect(() => {
    if (userState.user?.id) {
      loadSavedPalette(userState.user.id);
    } else {
      // Reset to default when no user is logged in
      setCurrentPaletteId("default");
      setCurrentPalette(cosmicOcean);
    }
  }, [userState.user?.id]);

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
        setCurrentPalette(cosmicOcean);
      }
    } catch (error) {
      console.error("Error loading saved palette:", error);
      // Fallback to default on error
      setCurrentPaletteId("default");
      setCurrentPalette(cosmicOcean);
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

  return (
    <ThemeContext.Provider
      value={{
        currentPalette,
        currentPaletteId,
        paletteOptions,
        switchPalette,
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

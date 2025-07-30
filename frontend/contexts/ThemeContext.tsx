import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colorPalette, {
  colorPalette2,
  colorPalette3,
  colorPalette4,
  colorPalette5,
  colorPalette6,
  colorPalette7,
  colorPalette8,
  colorPalette9,
  colorPalette10,
  nebula,
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
  { id: "default", name: "Navy & Cyan", palette: colorPalette8 },
  { id: "nebula", name: "Nebula", palette: nebula },
  { id: "palette2", name: "Night Sky", palette: colorPalette3 },
  { id: "palette3", name: "Dark Purple", palette: colorPalette },
  { id: "palette4", name: "Watercolor", palette: colorPalette2 },
  { id: "palette5", name: "Mint Green", palette: colorPalette4 },
  { id: "palette6", name: "Monochrome", palette: colorPalette5 },
  { id: "palette7", name: "Amber & Slate", palette: colorPalette6 },
  { id: "palette8", name: "Royal Purple & Pink", palette: colorPalette7 },
  { id: "palette9", name: "Terracotta & Red", palette: colorPalette9 },
  { id: "palette10", name: "Emerald & Green", palette: colorPalette10 },
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
    useState<ColorPalette>(colorPalette8);

  // Get user-specific storage key
  const getStorageKey = (userId: number) => `selectedPalette_user_${userId}`;

  useEffect(() => {
    if (userState.user?.id) {
      loadSavedPalette(userState.user.id);
    } else {
      // Reset to default when no user is logged in
      setCurrentPaletteId("default");
      setCurrentPalette(colorPalette8);
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

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "./HomeScreen";
import { TodoScreen } from "./TodoScreen";
import { EditorScreen } from "./EditorScreen";
import { AccountScreen } from "./AccountScreen";
import RainyDayScreen from "./RainyDayScreen";

import { Ionicons } from "@expo/vector-icons";
import { RootTabParamList, RootStackParamList } from "../types/types";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView as ExpoBlurView } from "expo-blur";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom Glass Tab Bar Component
const GlassTabBar = ({ state, descriptors, navigation }: any) => {
  const { currentPalette, currentPaletteId } = useTheme();

  // Check if we should use dark mode for the nav bar
  const isDarkNavMode =
    currentPaletteId === "watercolor" || currentPaletteId === "monochrome";

  return (
    <View style={styles.glassTabBarContainer}>
      <ExpoBlurView
        intensity={isDarkNavMode ? 60 : 20}
        tint={isDarkNavMode ? "dark" : "light"}
        style={[
          styles.glassTabBar,
          {
            backgroundColor: isDarkNavMode
              ? "rgba(0, 0, 0, 0.25)"
              : "rgba(255, 255, 255, 0.05)",
            borderColor: isDarkNavMode
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(255, 255, 255, 0.15)",
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          let iconName = "";
          if (route.name === "Home")
            iconName = isFocused ? "home" : "home-outline";
          if (route.name === "Todo")
            iconName = isFocused ? "list" : "list-outline";
          if (route.name === "Account")
            iconName = isFocused ? "person" : "person-outline";

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    backgroundColor: isDarkNavMode
                      ? "rgba(255, 255, 255, 0.4)"
                      : "rgba(0, 0, 0, 0.3)",
                    borderWidth: 1,
                    borderColor: isDarkNavMode
                      ? "rgba(255, 255, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.2)",
                  },
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={isFocused ? 24 : 22}
                  color={isDarkNavMode ? "#000000" : "#FFFFFF"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ExpoBlurView>
    </View>
  );
};

// Tab Navigator Component
const TabNavigator = () => {
  const { currentPalette } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Todo" component={TodoScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useUser();
  const { currentPalette } = useTheme();

  // Direct authentication logic - no intro screens
  // Show only Account screen when not authenticated
  if (!state.isAuthenticated) {
    return (
      <NavigationContainer>
        <AccountScreen />
      </NavigationContainer>
    );
  }

  // Show Rainy Day mode if special credentials are used
  if (state.isRainyDayMode) {
    return (
      <NavigationContainer>
        <RainyDayScreen />
      </NavigationContainer>
    );
  }

  // Show full navigation when authenticated
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="NoteEditor"
          component={EditorScreen}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  glassTabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  glassTabBar: {
    flexDirection: "row",
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 20,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default AppNavigator;

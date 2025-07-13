import React, { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "./HomeScreen";
import { TodoScreen } from "./TodoScreen";
import { EditorScreen } from "./EditorScreen";
import { AccountScreen } from "./AccountScreen";
import { Ionicons } from "@expo/vector-icons";
import { RootTabParamList } from "../types/types";
import { useUser } from "../contexts/UserContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import colorPalette from "../assets/colorPalette";

const Tab = createBottomTabNavigator<RootTabParamList>();

// First intro screen component
const IntroScreen1 = ({
  onPress,
  fadeAnim,
}: {
  onPress: () => void;
  fadeAnim: Animated.Value;
}) => (
  <TouchableOpacity style={styles.fullScreenTouchable} onPress={onPress}>
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <Text style={styles.screenTitle}>Welcome to Renaissance</Text>
    </Animated.View>
  </TouchableOpacity>
);

// Second intro screen component
const IntroScreen2 = ({
  onPress,
  fadeAnim,
}: {
  onPress: () => void;
  fadeAnim: Animated.Value;
}) => (
  <TouchableOpacity style={styles.fullScreenTouchable} onPress={onPress}>
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <Text style={styles.screenTitle}>Initializing Zylith...</Text>
    </Animated.View>
  </TouchableOpacity>
);

const AppNavigator = () => {
  const { state } = useUser();
  const [currentScreen, setCurrentScreen] = useState<
    "intro1" | "intro2" | "main"
  >("intro1");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-transition function
  const autoTransition = () => {
    if (currentScreen === "intro1") {
      transitionToScreen("intro2");
    } else if (currentScreen === "intro2") {
      transitionToScreen("main");
    }
  };

  // Transition with fade effect
  const transitionToScreen = (nextScreen: "intro1" | "intro2" | "main") => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change screen
      setCurrentScreen(nextScreen);

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Manual skip function
  const skipToNext = () => {
    if (currentScreen === "intro1") {
      transitionToScreen("intro2");
    } else if (currentScreen === "intro2") {
      transitionToScreen("main");
    }
  };

  // Set up auto-transition timer
  useEffect(() => {
    // Fade in current screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Set up auto-transition timer (3 seconds)
    if (currentScreen === "intro1" || currentScreen === "intro2") {
      timeoutRef.current = setTimeout(() => {
        autoTransition();
      }, 3000);
    }

    // Cleanup timeout on unmount or screen change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentScreen]);

  // First level: Intro screen flow
  if (currentScreen === "intro1") {
    return <IntroScreen1 onPress={skipToNext} fadeAnim={fadeAnim} />;
  }

  if (currentScreen === "intro2") {
    return <IntroScreen2 onPress={skipToNext} fadeAnim={fadeAnim} />;
  }

  // Second level: Your existing auth logic (only runs after intro)
  if (currentScreen === "main") {
    // Show loading screen while checking authentication
    if (state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    // Show only Account screen when not authenticated
    if (!state.isAuthenticated) {
      return (
        <NavigationContainer>
          <AccountScreen />
        </NavigationContainer>
      );
    }

    // Show full navigation when authenticated
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colorPalette.primary,
              borderTopColor: colorPalette.secondary,
              height: 64,
            },
            tabBarActiveTintColor: colorPalette.quaternary,
            tabBarInactiveTintColor: colorPalette.tertiary,
            tabBarIcon: ({ color, size }) => {
              let iconName = "";
              if (route.name === "Home") iconName = "home-outline";
              if (route.name === "Todo") iconName = "list-outline";
              if (route.name === "Insight") iconName = "bulb-outline";
              if (route.name === "Account") iconName = "person-outline";
              return (
                <Ionicons name={iconName as any} size={size} color={color} />
              );
            },
            tabBarLabelStyle: {
              fontWeight: "700",
              fontSize: 13,
              marginBottom: 6,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Todo" component={TodoScreen} />
          <Tab.Screen name="Insight" component={EditorScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  return null; // Should never reach here
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPalette.primary,
  },
  loadingText: {
    color: colorPalette.tertiary,
    fontSize: 18,
    fontWeight: "600",
  },
  fullScreenTouchable: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPalette.primary,
    padding: 20,
  },
  screenTitle: {
    color: colorPalette.quaternary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  screenSubtitle: {
    color: colorPalette.tertiary,
    fontSize: 18,
    textAlign: "center",
    opacity: 0.8,
  },
});

export default AppNavigator;

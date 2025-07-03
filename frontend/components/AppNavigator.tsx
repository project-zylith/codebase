import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "./HomeScreen";
import { InsightScreen } from "./InsightScreen";
import { AccountScreen } from "./AccountScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#222",
          height: 64,
        },
        tabBarActiveTintColor: "#A259F7",
        tabBarInactiveTintColor: "#fff",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Home") iconName = "home-outline";
          if (route.name === "Insight") iconName = "bulb-outline";
          if (route.name === "Account") iconName = "person-outline";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 13,
          marginBottom: 6,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Insight" component={InsightScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import { useTheme } from "../contexts/ThemeContext";

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => {
  const { currentPalette } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: currentPalette.primary,
        },
        headerTintColor: currentPalette.tertiary,
        headerTitleStyle: {
          fontWeight: "bold",
          color: currentPalette.tertiary,
        },
      }}
    >
      <Stack.Screen
        name="AuthLogin"
        component={AuthLogin}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="AuthSignup"
        component={AuthSignUp}
        options={{ title: "Sign Up" }}
      />
    </Stack.Navigator>
  );
};

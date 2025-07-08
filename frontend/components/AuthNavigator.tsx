import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthLogin } from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
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

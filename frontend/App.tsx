import React from "react";
import AppNavigator from "./components/AppNavigator";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StripeProvider } from "@stripe/stripe-react-native";

// This app is built to teach me a React Native. In this case this is a todo app.
// The app below will allow users to create a todo list and complete tasks
export default function App() {
  return (
    <StripeProvider
      publishableKey={
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        "pk_test_your_publishable_key_here"
      }
    >
      <UserProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </UserProvider>
    </StripeProvider>
  );
}

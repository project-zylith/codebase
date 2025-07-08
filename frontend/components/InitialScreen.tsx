import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InitialScreen as InitialScreenOne } from "./InitialScreen";
import { InitialScreenTwo } from "./InitialScreenTwo";
import { useUser } from "../contexts/UserContext";
import { AccountScreen } from "./AccountScreen";
import { LoadingScreen } from "./LoadingScreen";
import { AppNavigator } from "./AppNavigator";

export const InitialScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const { state } = useUser();

  if (currentScreen === 1) {
    return (
      <TouchableOpacity onPress={() => setCurrentScreen(2)}>
        <InitialScreenOne />;
      </TouchableOpacity>
    );
  }

  if (currentScreen === 2) {
    return (
      <TouchableOpacity onPress={() => setCurrentScreen(2)}>
        <InitialScreenTwo />;
      </TouchableOpacity>
    );
  }

  if (currentScreen === 3) {
    if (state.isLoading) {
      return <LoadingScreen />;
    }

    if (!state.isAuthenticated) {
      return <AccountScreen />;
    }

    return <AppNavigator />;
  }

  return (
    <SafeAreaView>
      <Text>Renaissance</Text>
    </SafeAreaView>
  );
};

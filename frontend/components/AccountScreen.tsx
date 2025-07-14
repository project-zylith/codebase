import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import colorPalette from "../assets/colorPalette";

export const AccountScreen = () => {
  const { state: userState, logout } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    console.log("AccountScreen: userState changed", userState);
  }, [userState]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const renderUserInfo = () => {
    if (!userState.user) return null;

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Account</Text>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{userState.user.username}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userState.user.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (userState.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {userState.user ? (
          renderUserInfo()
        ) : (
          <View style={styles.authContainer}>
            {showSignUp ? <AuthSignUp /> : <AuthLogin />}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setShowSignUp(!showSignUp)}
            >
              <Text style={styles.switchText}>
                {showSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colorPalette.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.quinary,
    marginBottom: 30,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    color: colorPalette.quinary,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: colorPalette.tertiary,
    fontWeight: "400",
  },
  loadingText: {
    fontSize: 18,
    color: colorPalette.tertiary,
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 50,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "600",
  },
  authContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  switchButton: {
    marginTop: 8,
    paddingVertical: 10,
  },
  switchText: {
    color: colorPalette.quaternary,
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
  },
});

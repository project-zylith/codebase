import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { AuthLogin } from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import colorPalette from "../assets/colorPalette";

export const AccountScreen: React.FC = () => {
  const { state, logout } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
      },
    ]);
  };

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {showSignUp ? (
            <View style={styles.authContainer}>
              <Text style={styles.title}>Create Account</Text>
              <AuthSignUp />
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setShowSignUp(false)}
              >
                <Text style={styles.switchText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <AuthLogin />
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setShowSignUp(true)}
              >
                <Text style={styles.switchText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back, {state.user.username}!</Text>

          <View style={styles.userInfo}>
            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{state.user.id}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{state.user.email}</Text>
          </View>

          {/* <View style={styles.userInfo}>
            <Text style={styles.label}>Account Created:</Text>
            <Text style={styles.value}>
              {new Date(state.user.created_at).toLocaleDateString()}
            </Text>
          </View> */}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    color: colorPalette.tertiary,
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

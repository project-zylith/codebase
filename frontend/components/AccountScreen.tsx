import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";

export const AccountScreen = () => {
  const { state: userState, logout } = useUser();
  const { currentPalette, currentPaletteId, paletteOptions, switchPalette } =
    useTheme();
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

  const handlePaletteChange = async (paletteId: string) => {
    try {
      await switchPalette(paletteId);
    } catch (error) {
      console.error("Error switching palette:", error);
      Alert.alert("Error", "Failed to switch color palette");
    }
  };

  const renderPaletteSelector = () => (
    <View
      style={[styles.paletteSection, { backgroundColor: currentPalette.card }]}
    >
      <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
        Color Theme
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.paletteContainer}
      >
        {paletteOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.paletteButton,
              { backgroundColor: option.palette.primary },
              currentPaletteId === option.id && [
                styles.selectedPalette,
                { borderColor: currentPalette.accent },
              ],
            ]}
            onPress={() => handlePaletteChange(option.id)}
          >
            <View
              style={[
                styles.palettePreview,
                { backgroundColor: option.palette.primary },
              ]}
            >
              <View
                style={[
                  styles.paletteAccent,
                  { backgroundColor: option.palette.quaternary },
                ]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={[styles.paletteLabel, { color: currentPalette.quinary }]}>
        {paletteOptions.find((p) => p.id === currentPaletteId)?.name}
      </Text>
    </View>
  );

  const renderUserInfo = () => {
    if (!userState.user) return null;

    return (
      <View
        style={[styles.content, { backgroundColor: currentPalette.background }]}
      >
        <View style={styles.mainContent}>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Account
          </Text>

          <View style={styles.profileSection}>
            <View style={styles.userInfoContainer}>
              <Text
                style={[styles.username, { color: currentPalette.tertiary }]}
              >
                {userState.user.username}
              </Text>
              <Text style={[styles.email, { color: currentPalette.quinary }]}>
                {userState.user.email}
              </Text>
            </View>
          </View>

          {renderPaletteSelector()}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: currentPalette.button },
            ]}
            onPress={handleLogout}
          >
            <Text
              style={[
                styles.logoutButtonText,
                { color: currentPalette.buttonText },
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (userState.isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: currentPalette.primary },
          ]}
        >
          <Text
            style={[styles.loadingText, { color: currentPalette.tertiary }]}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {userState.user ? (
          renderUserInfo()
        ) : (
          <View style={styles.authContainer}>
            {showSignUp ? <AuthSignUp /> : <AuthLogin />}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setShowSignUp(!showSignUp)}
            >
              <Text
                style={[
                  styles.switchText,
                  { color: currentPalette.quaternary },
                ]}
              >
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
    paddingTop: 36,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
  },
  bottomSection: {
    alignItems: "center",
    marginTop: 40,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  userInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  paletteSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  paletteContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  paletteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPalette: {
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  palettePreview: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  paletteAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paletteLabel: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    marginBottom: 40,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 50,
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
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
  },
});

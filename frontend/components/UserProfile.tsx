// DEPRECATED: This component is not being used. Renaissance uses UserProfileScreen instead.
// This file can be safely deleted after testing.

/*
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";

export const UserProfile: React.FC = () => {
  const { currentPalette } = useTheme();
  const { state: userState, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentPalette.primary }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={currentPalette.quaternary} />
          <Text style={[styles.username, { color: currentPalette.tertiary }]}>
            {userState.user?.username || "User"}
          </Text>
          <Text style={[styles.email, { color: currentPalette.quinary }]}>
            {userState.user?.email || "user@example.com"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
            Account Settings
          </Text>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="person" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="lock-closed" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="notifications" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              Notifications
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
            App Settings
          </Text>
          
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="color-palette" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              Theme
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="help-circle" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: currentPalette.secondary }]}>
            <Ionicons name="information-circle" size={24} color={currentPalette.quaternary} />
            <Text style={[styles.menuItemText, { color: currentPalette.tertiary }]}>
              About
            </Text>
            <Ionicons name="chevron-forward" size={20} color={currentPalette.quinary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: currentPalette.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
*/

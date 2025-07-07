import React from "react";
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
export const UserProfile: React.FC = () => {
  const { state, logout } = useUser();

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
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view your profile</Text>
        <AuthLogin />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back, {state.user.username}!</Text>

        <View style={styles.userInfo}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{state.user.id}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{state.user.email}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.label}>Account Created:</Text>
          <Text style={styles.value}>
            {new Date(state.user.created_at).toLocaleDateString()}
          </Text>
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
    backgroundColor: "#111",
    paddingTop: 36,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#aaa",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "400",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
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
    paddingVertical: 15,
    marginTop: 30,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

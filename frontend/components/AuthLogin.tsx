// AuthLogin.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { loginUser } from "../adapters/userAdapters";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

const AuthLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const { currentPalette } = useTheme();

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await loginUser({ username, password });

      if (response && response.ok) {
        const userData = await response.json();
        await login(userData);
        Alert.alert("Success", "Logged in successfully!");
      } else if (response) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to login");
      } else {
        Alert.alert("Error", "No response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentPalette.secondary,
            color: currentPalette.tertiary,
          },
        ]}
        placeholder="Enter username"
        placeholderTextColor={currentPalette.quinary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={[styles.label, { color: currentPalette.tertiary }]}>
        Password
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: currentPalette.secondary,
            color: currentPalette.tertiary,
          },
        ]}
        placeholder="Enter password"
        placeholderTextColor={currentPalette.quinary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: currentPalette.quaternary }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 4,
    borderWidth: 0,
    width: "100%",
    minHeight: 50,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
});

export default AuthLogin;

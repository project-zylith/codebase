// AuthLogin.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { loginUser, LoginRequest } from "../adapters/userAdapters";
import { useUser } from "../contexts/UserContext";
import colorPalette from "../assets/colorPalette";

export const AuthLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await loginUser({ username, password });

      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const userData = await response.json();

      // Use the UserContext login function
      await login(userData);

      Alert.alert("Success", `Welcome back, ${userData.username}!`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Login failed");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor={colorPalette.quinary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor={colorPalette.quinary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
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
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colorPalette.secondary,
    color: colorPalette.tertiary,
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
    backgroundColor: colorPalette.quaternary,
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  buttonText: {
    color: colorPalette.primary,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
});

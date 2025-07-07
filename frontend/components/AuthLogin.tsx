// AuthLogin.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { loginUser, LoginRequest } from "../adapters/userAdapters";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

export const AuthLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigation = useNavigation();

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
      navigation.navigate("AccountScreen" as never);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Login failed");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
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
    width: "100%",
    marginBottom: 24,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 4,
    borderWidth: 0,
  },
  button: {
    backgroundColor: "#A259F7",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
});

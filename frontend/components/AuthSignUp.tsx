// AuthForm.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { registerUser } from "../adapters/userAdapters";
import { useUser } from "../contexts/UserContext";

const AuthSignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { login } = useUser();

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Error",
        `Password must be at least 6 characters long, current length: ${password.length}`
      );
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await registerUser({
        username,
        email,
        password, // Backend controller expects 'password' field
      });

      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const userData = await response.json();

      // Use the UserContext login function to log in the newly registered user
      await login(userData);

      Alert.alert(
        "Success",
        `Welcome, ${username}, you're successfully registered!`
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Registration failed");
      console.error(error);
    }
  };

  return (
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
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
      <Text style={styles.label}>Password Confirmation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password confirmation"
        placeholderTextColor="#aaa"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default AuthSignUp;

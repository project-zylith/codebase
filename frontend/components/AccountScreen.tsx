import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import AuthSignUp from "./AuthSignUp";

export const AccountScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <AuthSignUp />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 36,
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
  },
});

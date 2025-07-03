import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const InsightScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Insight Page</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#A259F7",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});

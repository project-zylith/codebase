import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TenTapEditor } from "./TenTapEditor";
import colorPalette from "../assets/colorPalette";

export const InsightScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Insight Page</Text>
    <View>
      <TenTapEditor />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colorPalette.quaternary,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});

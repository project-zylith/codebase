import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { NewTask } from "./NewTask";
import { TenTapEditor } from "./TenTapEditor";
import colorPalette from "../assets/colorPalette";

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Home Screen</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    color: colorPalette.quaternary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "left",
  },
  spacer: {
    height: 32,
  },
  button: {
    backgroundColor: colorPalette.quaternary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: colorPalette.primary,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
  list: {
    marginTop: 24,
  },
  taskRow: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  taskText: {
    color: colorPalette.tertiary,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colorPalette.secondary,
    marginHorizontal: 8,
  },
});

export default HomeScreen;

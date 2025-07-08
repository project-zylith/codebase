import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { NewTask } from "./NewTask";
import { TenTapEditor } from "./TenTapEditor";

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
    backgroundColor: "#111",
    paddingTop: 36,
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  header: {
    color: "#A259F7",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "left",
  },
  spacer: {
    height: 32,
  },
  button: {
    backgroundColor: "#A259F7",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
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
    color: "#fff",
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
    marginHorizontal: 8,
  },
});

export default HomeScreen;

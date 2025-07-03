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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState("");

  const handleTaskPress = (item: string) => {
    Alert.alert(
      "Complete Task",
      `Would you like to complete (remove) the task: "${item}"?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => setTasks(tasks.filter((t) => t !== item)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>
        <NewTask setTask={setTask} tasks={tasks} setTasks={setTasks} />
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTaskPress(item)}>
              <View style={styles.taskRow}>
                <Text style={styles.taskText}>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
        <View style={styles.spacer} />
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

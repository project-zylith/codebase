// DEPRECATED: This component has been replaced by NewTaskModal.
// This file can be safely deleted after testing.

/*
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { createTask } from "../adapters/todoAdapters";
import { Task } from "../types/types";

interface NewTaskProps {
  onTaskCreated: (task: Task) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const NewTask = ({ onTaskCreated, tasks, setTasks }: NewTaskProps) => {
  const { currentPalette } = useTheme();
  const [taskContent, setTaskContent] = useState("");
  const [goalContent, setGoalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!taskContent.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTask({
        content: taskContent.trim(),
        goal: goalContent.trim() || null,
        is_completed: false,
        is_ai_generated: false,
        is_favorite: false,
      });

      if (response && response.ok) {
        const newTask: Task = await response.json();
        onTaskCreated(newTask);
        setTasks([newTask, ...tasks]);
        setTaskContent("");
        setGoalContent("");
        setIsModalVisible(false);
        Alert.alert("Success", "Task created successfully!");
      } else {
        const errorData = response ? await response.json() : null;
        Alert.alert("Error", errorData?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: currentPalette.quaternary }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color={currentPalette.tertiary} />
        <Text style={[styles.createButtonText, { color: currentPalette.tertiary }]}>
          Create Task
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: currentPalette.primary }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
              <Text style={[styles.cancelText, { color: currentPalette.tertiary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: currentPalette.tertiary }]}>
              New Task
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !taskContent.trim()}
              style={[
                styles.createButton,
                (!taskContent.trim() || isSubmitting) && styles.disabledButton,
              ]}
            >
              <Text style={[styles.createText, { color: currentPalette.tertiary }]}>
                {isSubmitting ? "Creating..." : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
              <TextInput
                style={[
                  styles.taskInput,
                  {
                    backgroundColor: currentPalette.secondary,
                    color: currentPalette.tertiary,
                    borderColor: currentPalette.quaternary,
                  },
                ]}
                placeholder="What needs to be done?"
                placeholderTextColor={currentPalette.quinary}
                value={taskContent}
                onChangeText={setTaskContent}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TextInput
                style={[
                  styles.goalInput,
                  {
                    backgroundColor: currentPalette.secondary,
                    color: currentPalette.tertiary,
                    borderColor: currentPalette.quaternary,
                  },
                ]}
                placeholder="Goal (optional)"
                placeholderTextColor={currentPalette.quinary}
                value={goalContent}
                onChangeText={setGoalContent}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  createText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  goalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
});
*/

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { createTask } from "../adapters/todoAdapters";
import { useUser } from "../contexts/UserContext";
import type { Task } from "../adapters/todoAdapters";
import colorPalette from "../assets/colorPalette";

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  visible,
  onClose,
  onTaskCreated,
}) => {
  const [taskText, setTaskText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state: userState } = useUser();

  const handleClose = () => {
    if (!isSubmitting) {
      setTaskText("");
      setGoalText("");
      onClose();
    }
  };

  const handleCreateTask = async () => {
    if (!taskText.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    if (!userState.user) {
      Alert.alert("Error", "You must be logged in to create tasks");
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        content: taskText.trim(),
        goal: goalText.trim() || null,
        is_completed: false,
        is_ai_generated: false,
        is_favorite: false,
      };

      const response = await createTask(taskData);
      if (response && response.ok) {
        const newTask = await response.json();
        onTaskCreated(newTask);
        handleClose();
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Create New Task</Text>

            <Text style={styles.goalLabel}>Goal (Optional)</Text>
            <TextInput
              style={styles.goalInput}
              placeholder="What do you want to achieve?"
              placeholderTextColor={colorPalette.quinary}
              value={goalText}
              onChangeText={setGoalText}
              multiline
              numberOfLines={3}
              maxLength={300}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Task Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your task..."
              placeholderTextColor={colorPalette.quinary}
              value={taskText}
              onChangeText={setTaskText}
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!isSubmitting}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreateTask}
                disabled={isSubmitting}
              >
                <Text style={styles.createButtonText}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colorPalette.secondary,
    borderRadius: 20,
    padding: 24,
    alignItems: "stretch",
  },
  title: {
    color: colorPalette.quinary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  goalLabel: {
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colorPalette.primary,
    color: colorPalette.tertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 100,
    textAlignVertical: "top",
  },
  goalInput: {
    backgroundColor: colorPalette.primary,
    color: colorPalette.tertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colorPalette.primary,
  },
  createButton: {
    backgroundColor: colorPalette.quaternary,
  },
  cancelButtonText: {
    color: colorPalette.quinary,
    fontSize: 16,
    fontWeight: "600",
  },
  createButtonText: {
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "700",
  },
});

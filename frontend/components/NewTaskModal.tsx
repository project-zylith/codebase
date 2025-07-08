import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colorPalette from "../assets/colorPalette";
import { createTask, Task } from "../adapters/todoAdapters";

interface NewTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export const NewTaskModal = ({
  visible,
  onClose,
  onTaskCreated,
}: NewTaskModalProps) => {
  const [taskText, setTaskText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (taskText.trim() !== "" && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await createTask({
          content: taskText.trim(),
          is_completed: false,
          is_ai_generated: false,
          is_favorite: false,
        });

        if (response.ok) {
          const newTask: Task = await response.json();
          onTaskCreated(newTask);
          setTaskText("");
          onClose();
        } else {
          console.error("Failed to create task");
        }
      } catch (error) {
        console.error("Error creating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setTaskText("");
    onClose();
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
                onPress={handleSubmit}
                disabled={isSubmitting || taskText.trim() === ""}
              >
                <Text style={styles.createButtonText}>
                  {isSubmitting ? "Creating..." : "Create Task"}
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
    color: colorPalette.quaternary,
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
    color: colorPalette.tertiary,
    fontSize: 16,
    fontWeight: "600",
  },
  createButtonText: {
    color: colorPalette.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});

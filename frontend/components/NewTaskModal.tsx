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
import { useTheme } from "../contexts/ThemeContext";
import type { Task } from "../adapters/todoAdapters";

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
  const { currentPalette } = useTheme();
  const [taskContent, setTaskContent] = useState("");
  const [goalContent, setGoalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state: userState } = useUser();

  const handleSubmit = async () => {
    if (!taskContent.trim()) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    if (!userState.user) {
      Alert.alert("Error", "You must be logged in to create tasks");
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
        const newTask = await response.json();
        onTaskCreated(newTask);
        setTaskContent("");
        setGoalContent("");
        onClose();
      } else {
        const errorData = response ? await response.json() : null;
        if (response?.status === 403 && errorData?.type === "task_limit") {
          Alert.alert("Task Limit Reached", errorData.message, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Upgrade",
              onPress: () => {
                // Navigate to subscription modal or account screen
                // You might need to pass a navigation prop or use a different approach
                onClose();
              },
            },
          ]);
        } else {
          Alert.alert("Error", errorData?.message || "Failed to create task");
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[styles.header, { backgroundColor: currentPalette.primary }]}
        >
          <TouchableOpacity onPress={onClose}>
            <Text
              style={[
                styles.cancelButton,
                { color: currentPalette.quaternary },
              ]}
            >
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
              { backgroundColor: currentPalette.quaternary },
              (isSubmitting || !taskContent.trim()) &&
                styles.createButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.createButtonText,
                { color: currentPalette.tertiary },
              ]}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Goal (Optional)
            </Text>
            <TextInput
              style={[
                styles.goalInput,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.border,
                },
              ]}
              placeholder="What do you want to achieve?"
              placeholderTextColor={currentPalette.quinary}
              value={goalContent}
              onChangeText={setGoalContent}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Task
            </Text>
            <TextInput
              style={[
                styles.taskInput,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.border,
                },
              ]}
              placeholder="Enter your task..."
              placeholderTextColor={currentPalette.quinary}
              value={taskContent}
              onChangeText={setTaskContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "transparent", // Placeholder for border color
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  goalInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "transparent", // Placeholder for border color
  },
  taskInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "transparent", // Placeholder for border color
  },
});

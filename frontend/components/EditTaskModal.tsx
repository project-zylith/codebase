import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Task, updateTask } from "../adapters/todoAdapters";
import { useTheme } from "../contexts/ThemeContext";

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: (updatedTask: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  onClose,
  task,
  onTaskUpdated,
}) => {
  const { currentPalette } = useTheme();
  const [taskContent, setTaskContent] = useState("");
  const [taskGoal, setTaskGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskContent(task.content);
      setTaskGoal(task.goal || "");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!task || !taskContent.trim()) {
      Alert.alert("Error", "Task content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateTask(task.id, {
        content: taskContent.trim(),
        goal: taskGoal.trim() || null,
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onTaskUpdated(updatedTask);
        onClose();
      } else {
        Alert.alert("Error", "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (task) {
      setTaskContent(task.content);
      setTaskGoal(task.goal || "");
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[styles.header, { backgroundColor: currentPalette.primary }]}
        >
          <TouchableOpacity onPress={handleCancel}>
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
            Edit Task
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !taskContent.trim()}
            style={[
              styles.saveButton,
              { backgroundColor: currentPalette.quaternary },
              (isSubmitting || !taskContent.trim()) &&
                styles.saveButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: currentPalette.tertiary },
              ]}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Task Content
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.border,
                },
              ]}
              value={taskContent}
              onChangeText={setTaskContent}
              placeholder="Enter task content..."
              placeholderTextColor={currentPalette.quinary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Goal (Optional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.border,
                },
              ]}
              value={taskGoal}
              onChangeText={setTaskGoal}
              placeholder="Enter goal for this task..."
              placeholderTextColor={currentPalette.quinary}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 80,
  },
});

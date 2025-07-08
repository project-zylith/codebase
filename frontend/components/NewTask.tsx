import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import colorPalette from "../assets/colorPalette";
import { createTask, Task } from "../adapters/todoAdapters";

// Updated interface to work with Task objects
interface NewTaskProps {
  onTaskCreated: (task: Task) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

// This line is declaring our component and setting its type decleration to newTaskProps
export const NewTask = ({ onTaskCreated, tasks, setTasks }: NewTaskProps) => {
  // Below we declare a useState to track the state of the user inputed form. So as the user types the value will change more on that later.
  const [taskText, setTaskText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated onSubmit function to work with the backend API
  const onSubmit = async () => {
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
          setTasks([newTask, ...tasks]);
          setTaskText(""); // Clear input after submission
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add a New Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a new task"
        placeholderTextColor={colorPalette.quinary}
        value={taskText}
        onChangeText={setTaskText}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!isSubmitting}
      />
      {/* <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    color: colorPalette.tertiary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colorPalette.secondary,
    color: colorPalette.tertiary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  button: {
    backgroundColor: colorPalette.quaternary,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: colorPalette.primary,
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1,
  },
});

{
  /* <View style={styles.container}>
      <Text>Hello World!</Text>
      <View style={{backgroundColor: 'purple', width: 400, height: 100, justifyContent: 'center', alignItems: 'center', padding: 20}} >
        <View style={{backgroundColor: 'white', padding: 15}}>
        <Text>Insert your name: </Text>
        <View style={{backgroundColor: 'green', padding: 10}}>
          <TextInput placeholder='First & Last Name'>

          </TextInput>
        </View>

        </View>
      </View>
      <StatusBar style="auto" />
    </View> */
}

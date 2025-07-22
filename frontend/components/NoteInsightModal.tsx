import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { generateNoteInsight } from "../adapters/aiAdapters";
import { createTask } from "../adapters/todoAdapters";

interface NoteInsightModalProps {
  visible: boolean;
  onClose: () => void;
  note: {
    id: number;
    title: string;
    content: string;
    galaxy_id?: number;
  } | null;
  galaxy?: {
    id: number;
    name: string;
  } | null;
  relatedNotes?: Array<{
    id: number;
    title: string;
    content: string;
  }> | null;
}

interface InsightData {
  contentBreakdown: string;
  keyThemes: string[];
  nextSteps: Array<{
    action: string;
    description: string;
  }>;
  learningsAndResources: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  connections: string;
  overallInsight: string;
}

export const NoteInsightModal: React.FC<NoteInsightModalProps> = ({
  visible,
  onClose,
  note,
  galaxy,
  relatedNotes,
}) => {
  const { currentPalette } = useTheme();
  const { state: userState } = useUser();
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && note) {
      generateInsight();
    }
  }, [visible, note]);

  const generateInsight = async () => {
    if (!note) return;

    setLoading(true);
    try {
      const response = await generateNoteInsight(
        note,
        galaxy,
        relatedNotes || [],
        userState.user?.id
      );

      if (response.ok) {
        const data = await response.json();
        setInsightData(data.result);
      } else {
        const errorData = await response.json();
        if (response.status === 403 && errorData.type === "ai_insight_limit") {
          Alert.alert("AI Insight Limit Reached", errorData.error, [
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
          console.error("Failed to generate insight:", errorData);
          Alert.alert(
            "Error",
            errorData.error || "Failed to generate insight. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error generating insight:", error);
      Alert.alert("Error", "Failed to generate insight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "resource":
        return "library-outline";
      case "tip":
        return "bulb-outline";
      case "learning":
        return "school-outline";
      default:
        return "information-circle-outline";
    }
  };

  const getColorForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "resource":
        return "#4CAF50";
      case "tip":
        return "#FF9800";
      case "learning":
        return "#2196F3";
      default:
        return currentPalette.tertiary;
    }
  };

  const handleAddToTodo = async (action: string, description: string) => {
    try {
      // Create a shorter, more concise task content
      const shortAction =
        action.length > 50 ? action.substring(0, 50) + "..." : action;

      // Determine goal based on note context
      let goal = "Note Action";
      if (note?.title) {
        goal = note.title;
      } else if (galaxy?.name) {
        goal = galaxy.name;
      }

      const response = await createTask({
        content: shortAction,
        goal: goal,
        is_completed: false,
        is_ai_generated: true,
        is_favorite: false,
      });

      if (response.ok) {
        Alert.alert("Success", "Task added to your todo list!");
      } else {
        Alert.alert("Error", "Failed to add task to todo list");
      }
    } catch (error) {
      console.error("Error adding task to todo:", error);
      Alert.alert("Error", "Failed to add task to todo list");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Note Insight
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={currentPalette.tertiary} />
              <Text
                style={[styles.loadingText, { color: currentPalette.tertiary }]}
              >
                Analyzing your note...
              </Text>
            </View>
          ) : insightData ? (
            <View style={styles.insightContainer}>
              {/* Content Breakdown */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Content Breakdown
                </Text>
                <Text
                  style={[
                    styles.sectionText,
                    { color: currentPalette.quaternary },
                  ]}
                >
                  {insightData.contentBreakdown}
                </Text>
              </View>

              {/* Key Themes */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Key Themes
                </Text>
                <View style={styles.themesContainer}>
                  {insightData.keyThemes.map((theme, index) => (
                    <View
                      key={index}
                      style={[
                        styles.themeChip,
                        { backgroundColor: currentPalette.secondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.themeText,
                          { color: currentPalette.tertiary },
                        ]}
                      >
                        {theme}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Next Steps */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Next Steps
                </Text>
                {insightData.nextSteps.map((step, index) => (
                  <View key={index} style={styles.stepContainer}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: currentPalette.tertiary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumberText,
                          { color: currentPalette.primary },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text
                        style={[
                          styles.stepAction,
                          { color: currentPalette.tertiary },
                        ]}
                      >
                        {step.action}
                      </Text>
                      <Text
                        style={[
                          styles.stepDescription,
                          { color: currentPalette.quaternary },
                        ]}
                      >
                        {step.description}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addToTodoButton,
                          { backgroundColor: currentPalette.quaternary },
                        ]}
                        onPress={() =>
                          handleAddToTodo(step.action, step.description)
                        }
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={16}
                          color={currentPalette.tertiary}
                        />
                        <Text
                          style={[
                            styles.addToTodoText,
                            { color: currentPalette.tertiary },
                          ]}
                        >
                          Add to Todo
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Learnings & Resources */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Learnings & Resources
                </Text>
                {insightData.learningsAndResources.map((item, index) => (
                  <View key={index} style={styles.resourceContainer}>
                    <Ionicons
                      name={getIconForType(item.type) as any}
                      size={20}
                      color={getColorForType(item.type)}
                    />
                    <View style={styles.resourceContent}>
                      <Text
                        style={[
                          styles.resourceTitle,
                          { color: currentPalette.tertiary },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.resourceDescription,
                          { color: currentPalette.quaternary },
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Connections */}
              {insightData.connections && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Connections
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      { color: currentPalette.quaternary },
                    ]}
                  >
                    {insightData.connections}
                  </Text>
                </View>
              )}

              {/* Overall Insight */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Overall Insight
                </Text>
                <Text
                  style={[
                    styles.sectionText,
                    { color: currentPalette.quaternary },
                  ]}
                >
                  {insightData.overallInsight}
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
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
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  insightContainer: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  themesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  themeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepContent: {
    flex: 1,
  },
  stepAction: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  addToTodoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  addToTodoText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  resourceContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

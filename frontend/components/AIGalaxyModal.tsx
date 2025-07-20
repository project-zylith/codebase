import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { generateGalaxies } from "../adapters/galaxyAdapters";
import { getNotes, Note } from "../adapters/noteAdapters";
import { useTheme } from "../contexts/ThemeContext";

interface ZylithGalaxyModalProps {
  visible: boolean;
  onClose: () => void;
  onGalaxiesGenerated: () => void;
}

interface GalaxyPreview {
  name: string;
  notes: string[];
}

const ZylithGalaxyModal: React.FC<ZylithGalaxyModalProps> = ({
  visible,
  onClose,
  onGalaxiesGenerated,
}) => {
  const { currentPalette } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [galaxies, setGalaxies] = useState<GalaxyPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateGalaxies = async () => {
    try {
      setLoading(true);
      setLoadingStep("Fetching your notes...");

      // Step 1: Fetch all user notes
      const notesResponse = await getNotes();
      if (!notesResponse.ok) {
        throw new Error("Failed to fetch notes");
      }

      const notesData = await notesResponse.json();
      const notes: Note[] = notesData || [];
      console.log("📝 Fetched notes count:", notes.length);

      if (notes.length < 2) {
        Alert.alert(
          "Not Enough Notes",
          "You need at least 2 notes to generate galaxies. Create some notes first!"
        );
        return;
      }

      setLoadingStep("Analyzing notes with Zylith...");

      // Step 2: Generate galaxies using AI (this now handles everything)
      // Cast notes to the expected type for generateGalaxies
      const result = await generateGalaxies(notes as any);

      if (!result.success) {
        throw new Error("Zylith failed to generate galaxies");
      }

      console.log("✅ Galaxy generation successful:", result);

      // Step 3: Show preview of generated galaxies
      const previewGalaxies: GalaxyPreview[] = result.results.map(
        (galaxyResult: any) => ({
          name: galaxyResult.galaxyName,
          notes: galaxyResult.noteTitles || [],
        })
      );

      setGalaxies(previewGalaxies);
      setShowPreview(true);
      setLoadingStep("");
    } catch (error) {
      console.error("❌ Error generating galaxies:", error);
      Alert.alert(
        "Generation Failed",
        `Failed to generate galaxies: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyGalaxies = () => {
    Alert.alert(
      "Galaxies Created!",
      `Successfully created ${galaxies.length} galaxies and organized your notes.`,
      [
        {
          text: "OK",
          onPress: () => {
            setShowPreview(false);
            setGalaxies([]);
            onGalaxiesGenerated();
            onClose();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setShowPreview(false);
    setGalaxies([]);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Zylith Galaxy Generator
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {!showPreview ? (
            // Generation View
            <View style={styles.introSection}>
              <Ionicons
                name="bulb"
                size={80}
                color={currentPalette.quaternary}
                style={styles.bulbIcon}
              />
              <Text
                style={[styles.introText, { color: currentPalette.tertiary }]}
              >
                Let Zylith organize your notes into themed galaxies!
              </Text>
              <Text
                style={[styles.description, { color: currentPalette.quinary }]}
              >
                Zylith will analyze your notes and group them into meaningful
                collections based on their content and themes.
              </Text>

              {loading ? (
                <View style={styles.loadingSection}>
                  <ActivityIndicator
                    size="large"
                    color={currentPalette.quaternary}
                    style={styles.spinner}
                  />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {loadingStep || "Generating galaxies..."}
                  </Text>
                  <Text
                    style={[
                      styles.loadingSubtext,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Zylith is analyzing your notes and creating themed
                    collections
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    { backgroundColor: currentPalette.quaternary },
                  ]}
                  onPress={handleGenerateGalaxies}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={currentPalette.tertiary}
                  />
                  <Text
                    style={[
                      styles.generateButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Generate Galaxies
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Preview View
            <View style={styles.resultsSection}>
              <Text
                style={[
                  styles.resultsTitle,
                  { color: currentPalette.tertiary },
                ]}
              >
                Generated {galaxies.length} Galaxies
              </Text>

              {galaxies.map((galaxy, index) => (
                <View
                  key={index}
                  style={[
                    styles.galaxyCard,
                    { backgroundColor: currentPalette.card },
                  ]}
                >
                  <Text
                    style={[
                      styles.galaxyName,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {galaxy.name}
                  </Text>
                  <Text
                    style={[
                      styles.noteCount,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    {galaxy.notes.length} notes
                  </Text>
                  <View style={styles.notesList}>
                    {galaxy.notes.slice(0, 3).map((noteTitle, noteIndex) => (
                      <Text
                        key={noteIndex}
                        style={[
                          styles.noteTitle,
                          { color: currentPalette.quinary },
                        ]}
                        numberOfLines={1}
                      >
                        • {noteTitle}
                      </Text>
                    ))}
                    {galaxy.notes.length > 3 && (
                      <Text
                        style={[
                          styles.moreNotes,
                          { color: currentPalette.quinary },
                        ]}
                      >
                        +{galaxy.notes.length - 3} more notes...
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    { backgroundColor: currentPalette.quaternary },
                  ]}
                  onPress={handleApplyGalaxies}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={currentPalette.tertiary}
                  />
                  <Text
                    style={[
                      styles.applyButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Apply Galaxies
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.regenerateButton,
                    { borderColor: currentPalette.quaternary },
                  ]}
                  onPress={handleGenerateGalaxies}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={currentPalette.quaternary}
                  />
                  <Text
                    style={[
                      styles.regenerateButtonText,
                      { color: currentPalette.quaternary },
                    ]}
                  >
                    Regenerate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  bulbIcon: {
    marginBottom: 20,
  },
  introText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSection: {
    alignItems: "center",
    paddingVertical: 80,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  resultsSection: {
    paddingVertical: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  galaxyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  galaxyName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  noteCount: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.8,
  },
  notesList: {
    gap: 2,
  },
  noteTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  moreNotes: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  regenerateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ZylithGalaxyModal;

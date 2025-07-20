import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { Note, getNotes, createNote } from "../adapters/noteAdapters";
import AIGalaxyModal from "./AIGalaxyModal";
import GalaxyView from "./GalaxyView";

interface NoteWithPosition extends Note {
  position: { x: number; y: number };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const centerX = screenWidth / 2;
const centerY = screenHeight / 2;

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentPalette } = useTheme();
  const { state: userState } = useUser();
  const [notes, setNotes] = useState<NoteWithPosition[]>([]);
  const [starAnimations] = useState(() =>
    Array.from({ length: 20 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showGalaxyModal, setShowGalaxyModal] = useState(false);
  const [galaxyRefreshTrigger, setGalaxyRefreshTrigger] = useState(0);

  // Generate random positions for stars around the center, avoiding restricted areas
  const generateStarPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 80 + Math.random() * 120; // Random radius between 80-200
    const offsetAngle = (Math.random() - 0.5) * 0.8; // Random angle offset

    let x = centerX + Math.cos(angle + offsetAngle) * radius - 60; // -60 to center the star
    let y = centerY + Math.sin(angle + offsetAngle) * radius - 100; // -100 to account for header

    // Define safe zones and restricted areas
    const starSize = 60; // Approximate size of star + label
    const buttonSize = 160; // Size of the New Note button area
    const buttonX = centerX - 60; // Button center X
    const buttonY = centerY - 250; // Button center Y
    const buttonRadius = buttonSize / 2; // Button radius

    // Check if star is too close to the New Note button
    const distanceFromButton = Math.sqrt(
      Math.pow(x - buttonX, 2) + Math.pow(y - buttonY, 2)
    );
    const minDistanceFromButton = buttonRadius + starSize / 2 + 20; // Extra padding

    // If star is too close to button, reposition it
    if (distanceFromButton < minDistanceFromButton) {
      // Move star away from button
      const angleFromButton = Math.atan2(y - buttonY, x - buttonX);
      x = buttonX + Math.cos(angleFromButton) * minDistanceFromButton;
      y = buttonY + Math.sin(angleFromButton) * minDistanceFromButton;
    }

    // Ensure star doesn't go off screen
    const padding = 20;
    const maxX = screenWidth - starSize - padding;
    const maxY = screenHeight - starSize - padding;
    const minX = padding;
    const minY = padding + 100; // Extra padding for header

    // Clamp X position
    if (x < minX) x = minX;
    if (x > maxX) x = maxX;

    // Clamp Y position
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    return { x, y };
  };

  // Load notes from API
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await getNotes();
        if (response.ok) {
          const apiNotes: Note[] = await response.json();
          // Add position to each note for display
          const notesWithPosition: NoteWithPosition[] = apiNotes.map(
            (note, index) => ({
              ...note,
              position: generateStarPosition(
                index,
                Math.max(apiNotes.length, 8)
              ),
            })
          );
          setNotes(notesWithPosition);
        } else {
          console.error("Failed to load notes");
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    if (userState.user) {
      loadNotes();
    }
  }, [userState.user]);

  // Start twinkling and drifting animation for stars
  useEffect(() => {
    starAnimations.forEach((anim, index) => {
      const startTwinkling = () => {
        Animated.sequence([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0.3,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => startTwinkling());
      };

      const startDrifting = () => {
        const driftX = (Math.random() - 0.5) * 40; // Drift up to 20px in each direction
        const driftY = (Math.random() - 0.5) * 40;

        Animated.parallel([
          Animated.timing(anim.translateX, {
            toValue: driftX,
            duration: 3000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: driftY,
            duration: 3000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Return to original position
          Animated.parallel([
            Animated.timing(anim.translateX, {
              toValue: 0,
              duration: 3000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: 0,
              duration: 3000 + Math.random() * 4000,
              useNativeDriver: true,
            }),
          ]).start(() => startDrifting());
        });
      };

      setTimeout(() => startTwinkling(), Math.random() * 3000);
      setTimeout(() => startDrifting(), Math.random() * 2000);
    });
  }, []);

  const handleNewNote = async () => {
    // First, prompt user for note title
    Alert.prompt(
      "New Note",
      "Enter a title for your note:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async (title) => {
            if (title && title.trim()) {
              try {
                // Create note in database first
                const response = await createNote({ title: title.trim() });
                if (response.ok) {
                  const newNote = await response.json();
                  console.log("Note created:", newNote);
                  // Navigate to editor with the new note
                  (navigation.navigate as any)("NoteEditor", {
                    noteId: newNote.id,
                    isNewNote: true,
                  });
                  // Reload notes to show the new one
                  const notesResponse = await getNotes();
                  if (notesResponse.ok) {
                    const apiNotes: Note[] = await notesResponse.json();
                    const notesWithPosition: NoteWithPosition[] = apiNotes.map(
                      (note, index) => ({
                        ...note,
                        position: generateStarPosition(
                          index,
                          Math.max(apiNotes.length, 8)
                        ),
                      })
                    );
                    setNotes(notesWithPosition);
                  }
                } else {
                  Alert.alert(
                    "Error",
                    "Failed to create note. Please try again."
                  );
                }
              } catch (error) {
                console.error("Error creating note:", error);
                Alert.alert(
                  "Error",
                  "Failed to create note. Please try again."
                );
              }
            } else {
              Alert.alert("Error", "Please enter a valid title.");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleNotePress = (note: NoteWithPosition) => {
    // Navigate to editor with existing note
    console.log("Clicking note with ID:", note.id);
    (navigation.navigate as any)("NoteEditor", { noteId: note.id });
  };

  const handleGalaxiesGenerated = () => {
    // Reload notes to show updated galaxy assignments
    const loadNotes = async () => {
      try {
        const response = await getNotes();
        if (response.ok) {
          const apiNotes: Note[] = await response.json();
          const notesWithPosition: NoteWithPosition[] = apiNotes.map(
            (note, index) => ({
              ...note,
              position: generateStarPosition(
                index,
                Math.max(apiNotes.length, 8)
              ),
            })
          );
          setNotes(notesWithPosition);
        }
      } catch (error) {
        console.error("Error reloading notes:", error);
      }
    };

    if (userState.user) {
      loadNotes();
    }
    setGalaxyRefreshTrigger((prev) => prev + 1);
  };

  const handleGalaxyRefresh = () => {
    // This will be called when galaxies are generated to refresh the galaxy view
    console.log("🔄 Refreshing galaxy view...");
  };

  const renderNoteStar = (note: NoteWithPosition, index: number) => {
    const animatedValues = starAnimations[index] || {
      opacity: new Animated.Value(0.7),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    };

    return (
      <Animated.View
        key={note.id}
        style={[
          styles.noteStar,
          {
            left: note.position.x,
            top: note.position.y,
            opacity: animatedValues.opacity,
            transform: [
              { translateX: animatedValues.translateX },
              { translateY: animatedValues.translateY },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.starButton}
          onPress={() => handleNotePress(note)}
          activeOpacity={0.8}
        >
          <Ionicons name="star" size={24} color={currentPalette.quaternary} />
          <Text
            style={[styles.starLabel, { color: currentPalette.quinary }]}
            numberOfLines={1}
          >
            {note.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Centered Title and Welcome Message */}
          <View style={styles.headerText}>
            <Text
              style={[styles.headerTitle, { color: currentPalette.quinary }]}
            >
              Renaissance
            </Text>
            <Text style={[styles.subheader, { color: currentPalette.quinary }]}>
              Welcome back, {userState.user?.username}
            </Text>
          </View>

          {/* Action Buttons Below */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setShowGalaxyModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="planet"
                size={20}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setShowAIModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="bulb" size={20} color={currentPalette.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cosmic Note Space */}
        <View style={styles.cosmicSpace}>
          {/* Render note stars */}
          {notes.map((note, index) => renderNoteStar(note, index))}

          {/* Central New Note Button (like the cosmic torus) */}
          <View style={styles.centralButtonContainer}>
            <TouchableOpacity
              style={[
                styles.centralButton,
                {
                  backgroundColor: currentPalette.quaternary,
                  shadowColor: currentPalette.accent,
                },
              ]}
              onPress={handleNewNote}
              activeOpacity={0.9}
            >
              <View style={styles.buttonInner}>
                <Ionicons
                  name="add"
                  size={32}
                  color={currentPalette.tertiary}
                />
                <Text
                  style={[
                    styles.buttonText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  New Note
                </Text>
              </View>
            </TouchableOpacity>

            {/* Cosmic ring effect */}
            <View
              style={[
                styles.cosmicRing,
                { borderColor: currentPalette.accent },
              ]}
            />
          </View>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Text style={[styles.infoText, { color: currentPalette.quinary }]}>
            {notes.length} notes in your galaxy
          </Text>
        </View>

        {/* AI Galaxy Modal */}
        <AIGalaxyModal
          visible={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGalaxiesGenerated={handleGalaxiesGenerated}
        />

        {/* Galaxy View Modal */}
        <Modal
          visible={showGalaxyModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <GalaxyView
            onRefresh={handleGalaxyRefresh}
            refreshTrigger={galaxyRefreshTrigger}
          />
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowGalaxyModal(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 36,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  cosmicSpace: {
    flex: 1,
    position: "relative",
  },
  centralButtonContainer: {
    position: "absolute",
    left: centerX - 60,
    top: centerY - 250, // Use this to move the button up and down
    alignItems: "center",
    justifyContent: "center",
  },
  centralButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  buttonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  cosmicRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    opacity: 0.3,
    zIndex: 5,
  },
  noteStar: {
    position: "absolute",
    alignItems: "center",
    zIndex: 8,
  },
  starButton: {
    alignItems: "center",
    padding: 8,
  },
  starLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    maxWidth: 60,
    textAlign: "center",
  },
  bottomInfo: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});

export default HomeScreen;

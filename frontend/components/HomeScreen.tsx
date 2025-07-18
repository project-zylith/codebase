import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { Note, getNotes, createNote } from "../adapters/noteAdapters";

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

  // Generate random positions for stars around the center
  const generateStarPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 80 + Math.random() * 120; // Random radius between 80-200
    const offsetAngle = (Math.random() - 0.5) * 0.8; // Random angle offset

    return {
      x: centerX + Math.cos(angle + offsetAngle) * radius - 60, // -60 to center the star
      y: centerY + Math.sin(angle + offsetAngle) * radius - 100, // -100 to account for header
    };
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
          <Text style={[styles.headerTitle, { color: currentPalette.quinary }]}>
            Renaissance
          </Text>
          <Text style={[styles.subheader, { color: currentPalette.quinary }]}>
            Welcome back, {userState.user?.username}
          </Text>
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
            {notes.length} notes in your universe
          </Text>
        </View>
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
});

export default HomeScreen;

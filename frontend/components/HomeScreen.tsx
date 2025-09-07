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
  PanResponder,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import {
  Note,
  getNotes,
  createNote,
  deleteNote,
} from "../adapters/noteAdapters";
import { getGalaxies } from "../adapters/galaxyAdapters";
import ZylithGalaxyModal from "./AIGalaxyModal";
import GalaxyView from "./GalaxyView";

interface NoteWithPosition extends Note {
  position: { x: number; y: number };
}

interface Galaxy {
  id: number;
  name: string;
  created_at: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const centerX = screenWidth / 2;
const centerY = screenHeight / 2;

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentPalette } = useTheme();
  const { state: userState } = useUser();
  const [notes, setNotes] = useState<NoteWithPosition[]>([]);
  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [currentGalaxyIndex, setCurrentGalaxyIndex] = useState(-1); // -1 means home view
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPosition[]>([]);
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
  const [selectedGalaxyForModal, setSelectedGalaxyForModal] = useState<
    number | undefined
  >(undefined);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [longPressNote, setLongPressNote] = useState<NoteWithPosition | null>(
    null
  );
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NoteWithPosition[]>([]);

  // PanResponder for Galaxy View Modal swipe-down-to-dismiss
  const galaxyModalPanY = useRef(new Animated.Value(0)).current;
  const galaxyModalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          gestureState.dy > 0
        );
      },
      onPanResponderGrant: () => {
        // Reset the value when starting a new gesture
        galaxyModalPanY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes
        if (gestureState.dy > 0) {
          galaxyModalPanY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped down more than 100px or with velocity > 500, dismiss the modal
        if (gestureState.dy > 100 || gestureState.vy > 500) {
          Animated.timing(galaxyModalPanY, {
            toValue: 1000,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleCloseGalaxyModal();
            galaxyModalPanY.setValue(0);
          });
        } else {
          // Snap back to original position
          Animated.spring(galaxyModalPanY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Debug: Log current state
  useEffect(() => {
    console.log("Current galaxy index:", currentGalaxyIndex);
    console.log("Number of galaxies:", galaxies.length);
    console.log("Filtered notes count:", filteredNotes.length);
  }, [currentGalaxyIndex, galaxies.length, filteredNotes.length]);

  // Cleanup modal when navigating away and refresh notes
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Ensure modals are closed when screen comes into focus
      setShowGalaxyModal(false);
      setShowAIModal(false);
      setSelectedGalaxyForModal(undefined);

      // Refresh notes when screen comes into focus
      if (userState.user) {
        const loadNotes = async () => {
          try {
            const response = await getNotes();
            if (response.ok) {
              const apiNotes: Note[] = await response.json();
              // Add position to each note for display, avoiding overlaps
              const notesWithPosition: NoteWithPosition[] = [];
              const existingPositions: { x: number; y: number }[] = [];

              apiNotes.forEach((note, index) => {
                const position = generateStarPosition(
                  index,
                  Math.max(apiNotes.length, 8),
                  existingPositions
                );
                existingPositions.push(position);
                notesWithPosition.push({
                  ...note,
                  position,
                });
              });

              setNotes(notesWithPosition);
            } else {
              console.error("Failed to load notes");
            }
          } catch (error) {
            console.error("Error loading notes:", error);
          }
        };
        loadNotes();
      }
    });

    return unsubscribe;
  }, [navigation, userState.user]);

  // Double-tap navigation handlers
  const lastTapTime = useRef(0);
  const doubleTapDelay = 300; // milliseconds

  const handleLeftSideTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime.current;

    if (timeDiff < doubleTapDelay) {
      // Double tap detected
      console.log("Left side double-tapped");
      previousGalaxy();
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      // Single tap - just update the time
      lastTapTime.current = now;
    }
  };

  const handleRightSideTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime.current;

    if (timeDiff < doubleTapDelay) {
      // Double tap detected
      console.log("Right side double-tapped");
      nextGalaxy();
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      // Single tap - just update the time
      lastTapTime.current = now;
    }
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSearchResultPress = (note: NoteWithPosition) => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    (navigation.navigate as any)("NoteEditor", { noteId: note.id });
  };

  // Generate random positions for stars around the center, avoiding restricted areas
  const generateStarPosition = (
    index: number,
    total: number,
    existingPositions: { x: number; y: number }[] = []
  ) => {
    const maxAttempts = 50; // Maximum attempts to find a non-overlapping position
    const starSize = 60; // Approximate size of star + label
    let attempts = 0;

    // For the first 20 notes, use stricter bounds to ensure they appear on screen
    const isFirstTwenty = index < 20;

    while (attempts < maxAttempts) {
      const angle = (index / total) * 2 * Math.PI;
      let radius, offsetAngle;

      if (isFirstTwenty) {
        // For first 20 notes, use smaller radius to keep them closer to center and in bounds
        radius = 80 + Math.random() * 80; // Smaller radius range: 80-160
        offsetAngle = (Math.random() - 0.5) * 0.4; // Smaller angle variation
      } else {
        // For additional notes, allow original behavior
        radius = 80 + Math.random() * 120; // Original radius: 80-200
        offsetAngle = (Math.random() - 0.5) * 0.8; // Original angle offset
      }

      let x = centerX + Math.cos(angle + offsetAngle) * radius - 60; // -60 to center the star
      let y = centerY + Math.sin(angle + offsetAngle) * radius - 100; // -100 to account for header

      // Define safe zones and restricted areas
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

      // For first 20 notes, ensure they stay within screen bounds
      if (isFirstTwenty) {
        const padding = 40; // Extra padding for first 20 notes
        const maxX = screenWidth - starSize - padding;
        const maxY = screenHeight - starSize - padding - 100; // Extra bottom padding
        const minX = padding;
        const minY = padding + 120; // Extra top padding for header

        // Clamp to safe bounds
        x = Math.max(minX, Math.min(maxX, x));
        y = Math.max(minY, Math.min(maxY, y));
      }

      // Check collision with existing stars
      const minDistanceBetweenStars = starSize + 10; // Minimum distance between stars
      let hasCollision = false;

      for (const existingPos of existingPositions) {
        const distance = Math.sqrt(
          Math.pow(x - existingPos.x, 2) + Math.pow(y - existingPos.y, 2)
        );
        if (distance < minDistanceBetweenStars) {
          hasCollision = true;
          break;
        }
      }

      // If no collision, return this position
      if (!hasCollision) {
        return { x, y };
      }

      attempts++;
    }

    // Fallback positioning
    const fallbackAngle =
      (index / total) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
    const fallbackRadius = isFirstTwenty ? 100 : 100 + Math.random() * 100;
    let x = centerX + Math.cos(fallbackAngle) * fallbackRadius - 60;
    let y = centerY + Math.sin(fallbackAngle) * fallbackRadius - 100;

    // Ensure star doesn't go off screen - stricter bounds for first 20
    const padding = isFirstTwenty ? 40 : 20;
    const maxX = screenWidth - starSize - padding;
    const maxY = screenHeight - starSize - padding - (isFirstTwenty ? 100 : 0);
    const minX = padding;
    const minY = padding + (isFirstTwenty ? 120 : 100);

    // Clamp positions
    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    return { x, y };
  };

  // Load notes from API
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const response = await getNotes();
        if (response.ok) {
          const apiNotes: Note[] = await response.json();
          // Add position to each note for display, avoiding overlaps
          const notesWithPosition: NoteWithPosition[] = [];
          const existingPositions: { x: number; y: number }[] = [];

          apiNotes.forEach((note, index) => {
            const position = generateStarPosition(
              index,
              Math.max(apiNotes.length, 8),
              existingPositions
            );
            existingPositions.push(position);
            notesWithPosition.push({
              ...note,
              position,
            });
          });

          setNotes(notesWithPosition);
        } else {
          console.error("Failed to load notes");
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userState.user) {
      loadNotes();
    } else {
      setIsLoading(false);
    }
  }, [userState.user]);

  // Load galaxies from API
  useEffect(() => {
    const loadGalaxies = async () => {
      try {
        const response = await getGalaxies();
        if (response.ok) {
          const galaxiesData = await response.json();
          setGalaxies(galaxiesData);
        } else {
          console.error("Failed to load galaxies");
        }
      } catch (error) {
        console.error("Error loading galaxies:", error);
      }
    };

    if (userState.user) {
      loadGalaxies();
    }
  }, [userState.user, galaxyRefreshTrigger]);

  // Filter notes by current galaxy
  useEffect(() => {
    if (currentGalaxyIndex === -1) {
      // Home view - show all notes
      setFilteredNotes(notes);
    } else if (galaxies.length > 0 && notes.length > 0) {
      const currentGalaxy = galaxies[currentGalaxyIndex];
      if (currentGalaxy) {
        const galaxyNotes = notes.filter(
          (note) => note.galaxy_id === currentGalaxy.id
        );
        // Regenerate positions for the filtered notes, avoiding overlaps
        const notesWithNewPositions: NoteWithPosition[] = [];
        const existingPositions: { x: number; y: number }[] = [];

        galaxyNotes.forEach((note, index) => {
          const position = generateStarPosition(
            index,
            Math.max(galaxyNotes.length, 8),
            existingPositions
          );
          existingPositions.push(position);
          notesWithNewPositions.push({
            ...note,
            position,
          });
        });

        setFilteredNotes(notesWithNewPositions);
      } else {
        setFilteredNotes(notes); // Show all notes if no galaxy selected
      }
    } else {
      setFilteredNotes(notes); // Show all notes if no galaxies
    }
  }, [galaxies, currentGalaxyIndex, notes]);

  // Carousel navigation functions
  const nextGalaxy = () => {
    if (currentGalaxyIndex === -1 && galaxies.length > 0) {
      // From home to first galaxy
      setCurrentGalaxyIndex(0);
    } else if (
      currentGalaxyIndex >= 0 &&
      currentGalaxyIndex < galaxies.length - 1
    ) {
      // To next galaxy
      setCurrentGalaxyIndex((prev) => prev + 1);
    }
  };

  const previousGalaxy = () => {
    if (currentGalaxyIndex === 0) {
      // From first galaxy back to home
      setCurrentGalaxyIndex(-1);
    } else if (currentGalaxyIndex > 0) {
      // To previous galaxy
      setCurrentGalaxyIndex((prev) => prev - 1);
    }
  };

  const getCurrentGalaxyName = () => {
    if (currentGalaxyIndex === -1) return "REN|AI";
    if (galaxies.length === 0) return "REN|AI";
    return galaxies[currentGalaxyIndex]?.name || "REN|AI";
  };

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
                // Get current galaxy ID if in a galaxy view
                const currentGalaxy =
                  currentGalaxyIndex >= 0 ? galaxies[currentGalaxyIndex] : null;
                const noteData = {
                  title: title.trim(),
                  galaxy_id: currentGalaxy?.id || null,
                };

                // Create note in database first
                const response = await createNote(noteData);
                if (response.ok) {
                  const newNote = await response.json();
                  console.log("Note created:", newNote);
                  // Navigate to editor with the new note
                  (navigation.navigate as any)("NoteEditor", {
                    noteId: newNote.id,
                    isNewNote: true,
                  });
                } else {
                  const errorData = await response.json();
                  if (
                    response.status === 403 &&
                    errorData.type === "note_limit"
                  ) {
                    Alert.alert("Note Limit Reached", errorData.message, [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Upgrade",
                        onPress: () => {
                          // Navigate to subscription modal or account screen
                          (navigation.navigate as any)("Account");
                        },
                      },
                    ]);
                  } else {
                    Alert.alert(
                      "Error",
                      errorData.message ||
                        "Failed to create note. Please try again."
                    );
                  }
                }
              } catch (error) {
                console.error("Error creating note:", error);
                Alert.alert(
                  "Error",
                  "Failed to create note. Please try again."
                );
              }
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

  const handleNoteLongPress = (note: NoteWithPosition) => {
    // Start 3-second timer
    const timer = setTimeout(() => {
      Alert.alert(
        "Delete Note",
        `Are you sure you want to delete "${note.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleDeleteNote(note),
          },
        ]
      );
    }, 3000);

    setLongPressTimer(timer);
    setLongPressNote(note);
  };

  const handleNotePressIn = (note: NoteWithPosition) => {
    // Clear any existing timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
    handleNoteLongPress(note);
  };

  const handleNotePressOut = () => {
    // Clear timer if user releases before 3 seconds
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setLongPressNote(null);
  };

  const handleDeleteNote = async (note: NoteWithPosition) => {
    try {
      const response = await deleteNote(note.id);
      if (response.ok) {
        // Remove note from state
        setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
        setFilteredNotes((prevNotes) =>
          prevNotes.filter((n) => n.id !== note.id)
        );
        Alert.alert("Success", "Note deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Failed to delete note");
    }
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
      setGalaxyRefreshTrigger((prev) => prev + 1); // Refresh galaxies too
    }
  };

  const handleGalaxyRefresh = () => {
    setGalaxyRefreshTrigger((prev) => prev + 1);
  };

  const handleGalaxyButtonPress = () => {
    if (currentGalaxyIndex === -1) {
      // On home view - show galaxy modal with no pre-selection
      setSelectedGalaxyForModal(undefined);
      setShowGalaxyModal(true);
    } else {
      // In a galaxy - show all notes in this galaxy
      const currentGalaxy = galaxies[currentGalaxyIndex];
      if (currentGalaxy) {
        setSelectedGalaxyForModal(currentGalaxy.id);
        setShowGalaxyModal(true);
      }
    }
  };

  const handleCloseGalaxyModal = () => {
    setShowGalaxyModal(false);
    setSelectedGalaxyForModal(undefined);
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
          onLongPress={() => handleNoteLongPress(note)}
          onPressIn={() => handleNotePressIn(note)}
          onPressOut={handleNotePressOut}
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

  // Show loading screen to prevent flashing
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: currentPalette.quinary }]}>
            Loading your notes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Search Button - Top Right - Only on home page */}
          {currentGalaxyIndex === -1 && (
            <TouchableOpacity
              style={[
                styles.searchButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={() => setShowSearchModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="search"
                size={20}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>
          )}

          {/* Centered Title and Welcome Message */}
          <View style={styles.headerText}>
            <Text
              style={[styles.headerTitle, { color: currentPalette.quinary }]}
            >
              {getCurrentGalaxyName()}
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
              onPress={handleGalaxyButtonPress}
              activeOpacity={0.8}
            >
              <Ionicons
                name={currentGalaxyIndex === -1 ? "planet" : "list"}
                size={20}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>

            {/* Only show AI generation button on home view */}
            {currentGalaxyIndex === -1 && (
              <TouchableOpacity
                style={[
                  styles.headerButton,
                  { backgroundColor: currentPalette.quaternary },
                ]}
                onPress={() => setShowAIModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="bulb"
                  size={20}
                  color={currentPalette.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cosmic Note Space */}
        <View style={styles.cosmicSpace}>
          {/* Render note stars */}
          {filteredNotes.map((note, index) => renderNoteStar(note, index))}

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

        {/* Double-tap Navigation Areas */}
        <TouchableOpacity
          style={styles.leftTapArea}
          onPress={handleLeftSideTap}
          activeOpacity={0.1}
        />
        <TouchableOpacity
          style={styles.rightTapArea}
          onPress={handleRightSideTap}
          activeOpacity={0.1}
        />

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Text style={[styles.infoText, { color: currentPalette.quinary }]}>
            {currentGalaxyIndex === -1
              ? `${filteredNotes.length} notes in your universe`
              : `${filteredNotes.length} notes in galaxy`}
          </Text>
        </View>

        {/* Swipe Indicators */}
        {galaxies.length > 0 && (
          <View style={styles.swipeIndicators}>
            <View style={styles.swipeIndicator}>
              <Ionicons
                name="chevron-back"
                size={16}
                color={currentPalette.quinary}
              />
              <Text
                style={[styles.swipeText, { color: currentPalette.quinary }]}
              >
                {currentGalaxyIndex === -1 ? "Home" : "Previous"}
              </Text>
            </View>
            <View style={styles.swipeIndicator}>
              <Text
                style={[styles.swipeText, { color: currentPalette.quinary }]}
              >
                {currentGalaxyIndex === -1
                  ? "Double tap to galaxies"
                  : `${currentGalaxyIndex + 1} of ${galaxies.length}`}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={currentPalette.quinary}
              />
            </View>
          </View>
        )}

        {/* Zylith Galaxy Modal */}
        <ZylithGalaxyModal
          visible={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGalaxiesGenerated={handleGalaxiesGenerated}
        />

        {/* Search Modal */}
        <Modal
          visible={showSearchModal}
          animationType="slide"
          presentationStyle="pageSheet"
          transparent={false}
          onRequestClose={() => setShowSearchModal(false)}
        >
          <SafeAreaView
            style={[
              styles.searchModalContainer,
              { backgroundColor: currentPalette.primary },
            ]}
          >
            <View style={styles.searchModalHeader}>
              <TouchableOpacity
                onPress={() => setShowSearchModal(false)}
                style={styles.searchModalCloseButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={currentPalette.tertiary}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.searchModalTitle,
                  { color: currentPalette.tertiary },
                ]}
              >
                Search Notes
              </Text>
              <View style={styles.searchModalPlaceholder} />
            </View>

            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color={currentPalette.quinary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    color: currentPalette.tertiary,
                    backgroundColor: currentPalette.card,
                    borderColor: currentPalette.border,
                  },
                ]}
                placeholder="Search by note title..."
                placeholderTextColor={currentPalette.quinary}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.searchResultItem,
                    { backgroundColor: currentPalette.card },
                  ]}
                  onPress={() => handleSearchResultPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.searchResultContent}>
                    <Text
                      style={[
                        styles.searchResultTitle,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.searchResultPreview,
                        { color: currentPalette.quinary },
                      ]}
                      numberOfLines={2}
                    >
                      {item.content
                        ?.replace(/<[^>]*>/g, "")
                        .substring(0, 100) || "No content"}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={currentPalette.quinary}
                  />
                </TouchableOpacity>
              )}
              style={styles.searchResultsList}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                searchQuery ? (
                  <View style={styles.searchEmptyState}>
                    <Ionicons
                      name="search"
                      size={48}
                      color={currentPalette.quinary}
                    />
                    <Text
                      style={[
                        styles.searchEmptyText,
                        { color: currentPalette.quinary },
                      ]}
                    >
                      No notes found for "{searchQuery}"
                    </Text>
                  </View>
                ) : (
                  <View style={styles.searchEmptyState}>
                    <Ionicons
                      name="document-text"
                      size={48}
                      color={currentPalette.quinary}
                    />
                    <Text
                      style={[
                        styles.searchEmptyText,
                        { color: currentPalette.quinary },
                      ]}
                    >
                      Start typing to search your notes
                    </Text>
                  </View>
                )
              }
            />
          </SafeAreaView>
        </Modal>

        {/* Galaxy View Modal */}
        <Modal
          key={`galaxy-modal-${showGalaxyModal}-${selectedGalaxyForModal}`}
          visible={showGalaxyModal}
          animationType="slide"
          presentationStyle="pageSheet"
          transparent={false}
          onRequestClose={handleCloseGalaxyModal}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: galaxyModalPanY }],
              },
            ]}
          >
            <GalaxyView
              onRefresh={handleGalaxyRefresh}
              refreshTrigger={galaxyRefreshTrigger}
              preSelectedGalaxyId={selectedGalaxyForModal}
              onClose={handleCloseGalaxyModal}
              panResponder={galaxyModalPanResponder}
            />
          </Animated.View>
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
  swipeIndicators: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    marginTop: 10,
  },
  swipeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  swipeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  leftTapArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.2, // 20% of screen width
    backgroundColor: "transparent",
    zIndex: 1,
  },
  rightTapArea: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.2, // 20% of screen width
    backgroundColor: "transparent",
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  searchButton: {
    position: "absolute",
    top: 20,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  searchModalContainer: {
    flex: 1,
  },
  searchModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  searchModalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchModalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchModalPlaceholder: {
    width: 40,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  searchResultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  searchResultContent: {
    flex: 1,
    marginRight: 12,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  searchResultPreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  searchEmptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  searchEmptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "400",
  },
});

export default HomeScreen;

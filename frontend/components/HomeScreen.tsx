import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import colorPalette from "../assets/colorPalette";
import { useUser } from "../contexts/UserContext";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  position: { x: number; y: number };
}

const { width, height } = Dimensions.get("window");
const centerX = width / 2;
const centerY = height / 2;

export const HomeScreen = () => {
  const { state: userState } = useUser();
  const navigation = useNavigation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [starAnimations] = useState(() =>
    Array.from({ length: 20 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  );

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

  // Mock notes data - in real app this would come from storage/API
  useEffect(() => {
    // TODO: Get notes from API
    const mockNotes: Note[] = [
      {
        id: "1",
        title: "Project Notes",
        content: "Some brilliant thoughts...",
        createdAt: new Date(),
        position: generateStarPosition(0, 8),
      },
      {
        id: "2",
        title: "Meeting Notes",
        content: "Important discussion points...",
        createdAt: new Date(),
        position: generateStarPosition(1, 8),
      },
      {
        id: "3",
        title: "Daily Journal",
        content: "Today was interesting...",
        createdAt: new Date(),
        position: generateStarPosition(2, 8),
      },
      {
        id: "4",
        title: "Recipe Notes",
        content: "Delicious combinations...",
        createdAt: new Date(),
        position: generateStarPosition(3, 8),
      },
      {
        id: "5",
        title: "Travel Plans",
        content: "Places to visit...",
        createdAt: new Date(),
        position: generateStarPosition(4, 8),
      },
      {
        id: "6",
        title: "Book Notes",
        content: "Key insights...",
        createdAt: new Date(),
        position: generateStarPosition(5, 8),
      },
    ];
    setNotes(mockNotes);

    // Start twinkling and drifting animation for stars
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

  const handleNewNote = () => {
    // Navigate to editor with new note
    navigation.navigate("Insight" as never);
  };

  const handleNotePress = (note: Note) => {
    // Navigate to editor with existing note
    // In a real app, you'd pass the note data
    navigation.navigate("Insight" as never);
  };

  const renderNoteStar = (note: Note, index: number) => {
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
          <Ionicons name="star" size={24} color={colorPalette.quaternary} />
          <Text style={styles.starLabel} numberOfLines={1}>
            {note.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Renaissance</Text>
          <Text style={styles.subheader}>
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
              style={styles.centralButton}
              onPress={handleNewNote}
              activeOpacity={0.9}
            >
              <View style={styles.buttonInner}>
                <Ionicons name="add" size={32} color={colorPalette.quinary} />
                <Text style={styles.buttonText}>New Note</Text>
              </View>
            </TouchableOpacity>

            {/* Cosmic ring effect */}
            <View style={styles.cosmicRing} />
          </View>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.infoText}>
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
    backgroundColor: colorPalette.primary,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: colorPalette.quinary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    color: colorPalette.quinary,
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
    backgroundColor: colorPalette.quaternary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colorPalette.accent,
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
    color: colorPalette.tertiary,
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
    borderColor: colorPalette.accent,
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
    color: colorPalette.quinary,
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
    color: colorPalette.quinary,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
});

export default HomeScreen;

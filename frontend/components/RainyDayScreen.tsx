import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { LoveLetter, getLoveLetters } from "../adapters/loveLetterAdapters";
import LoveLetterModal from "./LoveLetterModal";
import LoveLetterForm from "./LoveLetterForm";

const { width, height } = Dimensions.get("window");

const RainyDayScreen: React.FC = () => {
  const { logout } = useUser();
  const { currentPalette } = useTheme();
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLoveLetters();
  }, []);

  const loadLoveLetters = async () => {
    try {
      setIsLoading(true);
      const letters = await getLoveLetters();
      setLoveLetters(letters);
    } catch (error) {
      console.error("Error loading love letters:", error);
      Alert.alert("Error", "Failed to load love letters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLetterPress = (letter: LoveLetter) => {
    setSelectedLetter(letter);
  };

  const handleCloseModal = () => {
    setSelectedLetter(null);
  };

  const handleLetterUpdated = () => {
    loadLoveLetters();
    setSelectedLetter(null);
  };

  const handleLetterDeleted = () => {
    loadLoveLetters();
    setSelectedLetter(null);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    loadLoveLetters();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderOrigamiHeart = (letter: LoveLetter, index: number) => {
    const angle = (index * 15) % 360; // Rotate each heart slightly
    const x = width / 2 + Math.sin((index * 0.5 * Math.PI) / 180) * 100;
    const y = 200 + ((index * 80) % (height - 400));

    return (
      <TouchableOpacity
        key={letter.id}
        style={[
          styles.heartContainer,
          {
            left: x - 25,
            top: y - 25,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
        onPress={() => handleLetterPress(letter)}
      >
        <Ionicons name="heart" size={50} color="#ff6b6b" />
        <Text style={styles.heartDate}>
          {new Date(letter.written_date).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: "#87CEEB" }]}>
        <Text style={[styles.loadingText, { color: currentPalette.tertiary }]}>
          Loading love letters...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#87CEEB" }]}>
      {/* Red String of Fate */}
      <View style={styles.redString} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#8B0000" }]}>
          Rainy Day Letters
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#8B0000" />
        </TouchableOpacity>
      </View>

      {/* Love Letters */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heartsContainer}>
          {loveLetters.map((letter, index) =>
            renderOrigamiHeart(letter, index)
          )}
        </View>
      </ScrollView>

      {/* Add Letter Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#ff6b6b" }]}
        onPress={() => setShowForm(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modals */}
      {selectedLetter && (
        <LoveLetterModal
          letter={selectedLetter}
          onClose={handleCloseModal}
          onUpdate={handleLetterUpdated}
          onDelete={handleLetterDeleted}
        />
      )}

      {showForm && (
        <LoveLetterForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  redString: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 4,
    height: "100%",
    backgroundColor: "#DC143C",
    transform: [{ translateX: -2 }],
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  heartsContainer: {
    minHeight: height,
    position: "relative",
  },
  heartContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 3,
  },
  heartDate: {
    fontSize: 10,
    color: "#8B0000",
    marginTop: 4,
    fontWeight: "600",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
});

export default RainyDayScreen;

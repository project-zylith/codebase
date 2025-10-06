import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
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

    return (
      <TouchableOpacity
        key={letter.id}
        style={[
          styles.heartContainer,
          {
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
        onPress={() => handleLetterPress(letter)}
      >
        <View style={styles.heartCard}>
          <Ionicons name="heart" size={80} color="#ff6b6b" />
          <View style={styles.heartDetails}>
            <Text style={styles.heartTo}>To: {letter.recipient}</Text>
            <Text style={styles.heartOccasion}>{letter.occasion}</Text>
            <Text style={styles.heartDate}>
              {new Date(letter.written_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require("../assets/flower-letter.jpg")}
        style={styles.container}
        resizeMode="cover"
      >
        <Text style={[styles.loadingText, { color: "#FFB6C1" }]}>
          Loading love letters...
        </Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/flower-letter.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Light Pink String of Fate */}
      <View style={styles.pinkString} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* <Text style={[styles.title, { color: "#000000" }]}>
            Rainy Day Letters
          </Text> */}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
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
        <Ionicons name="add" size={30} color="#FFB6C1" />
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinkString: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 4,
    height: "100%",
    backgroundColor: "#FF0000",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: "center",
  },
  heartContainer: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 3,
  },
  heartCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
  },
  heartDetails: {
    alignItems: "center",
    marginTop: 8,
  },
  heartTo: {
    fontSize: 12,
    color: "#8B0000",
    fontWeight: "700",
    marginBottom: 2,
  },
  heartOccasion: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  heartDate: {
    fontSize: 10,
    color: "#8B0000",
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

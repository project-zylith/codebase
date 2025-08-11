import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { getGalaxies, getGalaxyNotes } from "../adapters/galaxyAdapters";

interface Galaxy {
  id: number;
  name: string;
  created_at: string;
}

interface GalaxyNote {
  id: number;
  title: string;
  content: string;
}

interface GalaxyViewProps {
  onRefresh?: () => void;
  refreshTrigger?: number;
  preSelectedGalaxyId?: number; // New prop for pre-selecting a galaxy
  onClose?: () => void; // New prop for closing the modal
  panResponder?: any; // New prop for PanResponder
}

const GalaxyView: React.FC<GalaxyViewProps> = ({
  onRefresh,
  refreshTrigger = 0,
  preSelectedGalaxyId,
  onClose,
  panResponder,
}) => {
  const { currentPalette } = useTheme();
  const navigation = useNavigation();
  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(null);
  const [galaxyNotes, setGalaxyNotes] = useState<GalaxyNote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGalaxies();
  }, []);

  // Refresh galaxies when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadGalaxies();
    }
  }, [refreshTrigger]);

  // Handle pre-selected galaxy
  useEffect(() => {
    if (preSelectedGalaxyId && galaxies.length > 0) {
      const galaxy = galaxies.find((g) => g.id === preSelectedGalaxyId);
      if (galaxy) {
        handleGalaxyPress(galaxy);
      }
    }
  }, [preSelectedGalaxyId, galaxies]);

  const loadGalaxies = async () => {
    try {
      setLoading(true);
      const response = await getGalaxies();
      if (response.ok) {
        const data = await response.json();
        setGalaxies(data);
      }
    } catch (error) {
      console.error("Error loading galaxies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalaxyPress = async (galaxy: Galaxy) => {
    try {
      setSelectedGalaxy(galaxy);
      const response = await getGalaxyNotes(galaxy.id);
      if (response.ok) {
        const notes = await response.json();
        setGalaxyNotes(notes);
      }
    } catch (error) {
      console.error("Error loading galaxy notes:", error);
    }
  };

  const handleBackPress = () => {
    if (preSelectedGalaxyId && onClose) {
      // If we came from a pre-selected galaxy, close the modal entirely
      onClose();
      return;
    }
    setSelectedGalaxy(null);
    setGalaxyNotes([]);
  };

  const handleNotePress = (note: GalaxyNote) => {
    // Close the modal first, then navigate to the editor
    if (onClose) {
      onClose();
    }
    // Navigate to the editor with the note ID
    (navigation.navigate as any)("NoteEditor", { noteId: note.id });
  };

  if (selectedGalaxy) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
        {...(panResponder?.panHandlers || {})}
      >
        {/* Drag Indicator */}
        <View style={styles.dragIndicator}>
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: currentPalette.quinary },
            ]}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={currentPalette.tertiary}
            />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: currentPalette.tertiary }]}
          >
            {selectedGalaxy.name}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Galaxy Notes */}
        <ScrollView style={styles.content}>
          {galaxyNotes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-outline"
                size={48}
                color={currentPalette.quinary}
              />
              <Text
                style={[styles.emptyText, { color: currentPalette.quinary }]}
              >
                No notes in this galaxy yet
              </Text>
            </View>
          ) : (
            galaxyNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={[
                  styles.noteCard,
                  { backgroundColor: currentPalette.card },
                ]}
                onPress={() => handleNotePress(note)}
                activeOpacity={0.8}
              >
                <View style={styles.noteHeader}>
                  <Text
                    style={[
                      styles.noteTitle,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {note.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={currentPalette.quinary}
                  />
                </View>
                <Text
                  style={[
                    styles.noteContent,
                    { color: currentPalette.quinary },
                  ]}
                  numberOfLines={3}
                >
                  {note.content?.replace(/<[^>]*>/g, "") || "No content"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentPalette.primary }]}
      {...(panResponder?.panHandlers || {})}
    >
      {/* Drag Indicator */}
      <View style={styles.dragIndicator}>
        <View
          style={[
            styles.dragHandle,
            { backgroundColor: currentPalette.quinary },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentPalette.tertiary }]}>
          Your Galaxies
        </Text>
      </View>

      {/* Galaxies List */}
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingState}>
            <Text
              style={[styles.loadingText, { color: currentPalette.quinary }]}
            >
              Loading galaxies...
            </Text>
          </View>
        ) : galaxies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="planet-outline"
              size={48}
              color={currentPalette.quinary}
            />
            <Text style={[styles.emptyText, { color: currentPalette.quinary }]}>
              No galaxies yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: currentPalette.quinary }]}
            >
              Use the REN|AI generator to create your first galaxy
            </Text>
          </View>
        ) : (
          galaxies.map((galaxy) => (
            <TouchableOpacity
              key={galaxy.id}
              style={[
                styles.galaxyCard,
                { backgroundColor: currentPalette.card },
              ]}
              onPress={() => handleGalaxyPress(galaxy)}
              activeOpacity={0.8}
            >
              <View style={styles.galaxyHeader}>
                <Ionicons
                  name="planet"
                  size={24}
                  color={currentPalette.quaternary}
                />
                <Text
                  style={[
                    styles.galaxyName,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  {galaxy.name}
                </Text>
              </View>
              <Text
                style={[styles.galaxyDate, { color: currentPalette.quinary }]}
              >
                Created {new Date(galaxy.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dragIndicator: {
    alignItems: "center",
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.8,
  },
  galaxyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  galaxyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  galaxyName: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  galaxyDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GalaxyView;

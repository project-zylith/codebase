import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
}

const GalaxyView: React.FC<GalaxyViewProps> = ({
  onRefresh,
  refreshTrigger = 0,
}) => {
  const { currentPalette } = useTheme();
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
    setSelectedGalaxy(null);
    setGalaxyNotes([]);
  };

  if (selectedGalaxy) {
    return (
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
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
              <View
                key={note.id}
                style={[
                  styles.noteCard,
                  { backgroundColor: currentPalette.card },
                ]}
              >
                <Text
                  style={[styles.noteTitle, { color: currentPalette.tertiary }]}
                >
                  {note.title}
                </Text>
                <Text
                  style={[
                    styles.noteContent,
                    { color: currentPalette.quinary },
                  ]}
                  numberOfLines={3}
                >
                  {note.content?.replace(/<[^>]*>/g, "") || "No content"}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentPalette.primary }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentPalette.tertiary }]}>
          Your Galaxies
        </Text>
        <TouchableOpacity onPress={loadGalaxies} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={currentPalette.tertiary} />
        </TouchableOpacity>
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
              Use the AI generator to create your first galaxy
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  refreshButton: {
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
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GalaxyView;

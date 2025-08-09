import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, Alert } from "react-native";
import {
  useRoute,
  useNavigation,
  usePreventRemove,
} from "@react-navigation/native";
import { QuillEditor, QuillEditorRef } from "./QuillEditor";
import { NoteInsightModal } from "./NoteInsightModal";
import colorPalette from "../assets/colorPalette";
import {
  Note,
  getNoteById,
  updateNote,
  getNotes,
  deleteNote,
} from "../adapters/noteAdapters";
import { getGalaxyById, getGalaxyNotes } from "../adapters/galaxyAdapters";

interface RouteParams {
  noteId?: number;
  isNewNote?: boolean;
}

export const EditorScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [initialContent, setInitialContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isSavingRef = useRef(false);
  const lastSavedContentRef = useRef("");
  const editorRef = useRef<QuillEditorRef>(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [galaxy, setGalaxy] = useState<any>(null);
  const [relatedNotes, setRelatedNotes] = useState<any[]>([]);

  // Load note content
  useEffect(() => {
    const loadNote = async () => {
      console.log("Loading note with params:", params);

      if (params?.noteId) {
        try {
          console.log("Loading specific note with ID:", params.noteId);
          const response = await getNoteById(params.noteId);
          if (response.ok) {
            const note: Note = await response.json();
            console.log("Loaded note:", note);
            setCurrentNote(note);
            setInitialContent(note.content || "");
            setCurrentContent(note.content || "");
            lastSavedContentRef.current = note.content || "";
            // Load galaxy data if note belongs to a galaxy
            await loadGalaxyData(note);
          } else {
            console.error("Failed to load note, response not ok");
            Alert.alert("Error", "Failed to load note");
          }
        } catch (error) {
          console.error("Error loading note:", error);
          Alert.alert("Error", "Failed to load note");
        }
      } else {
        console.log("No noteId provided, loading most recent note");
        // Fallback: load most recent note
        try {
          const response = await getNotes();
          if (response.ok) {
            const notes: Note[] = await response.json();
            if (notes.length > 0) {
              const mostRecentNote = notes[0];
              console.log("Loading most recent note:", mostRecentNote);
              setCurrentNote(mostRecentNote);
              setInitialContent(mostRecentNote.content || "");
              setCurrentContent(mostRecentNote.content || "");
              lastSavedContentRef.current = mostRecentNote.content || "";
              // Load galaxy data if note belongs to a galaxy
              await loadGalaxyData(mostRecentNote);
            }
          }
        } catch (error) {
          console.error("Error loading recent note:", error);
        }
      }
      setIsLoading(false);
    };

    loadNote();
  }, [params?.noteId]);

  // Use usePreventRemove instead of beforeRemove listener
  usePreventRemove(
    Boolean(hasUnsavedChanges && currentNote && !isSavingRef.current),
    async (data) => {
      console.log("Preventing removal, auto-saving note");
      if (editorRef.current) {
        try {
          const { html } = await editorRef.current.getCurrentContent();
          if (html !== lastSavedContentRef.current) {
            await saveNoteSync(html);
          }
        } catch (error) {
          console.error("Error during auto-save:", error);
        }
      }
    }
  );

  const saveNoteSync = async (content: string) => {
    if (!currentNote || isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      console.log("Saving note with content:", content);
      const response = await updateNote(currentNote.id, {
        content: content,
      });

      if (response.ok) {
        console.log("Note saved successfully");
        const updatedNote = await response.json();
        setCurrentNote(updatedNote);
        setHasUnsavedChanges(false);
        lastSavedContentRef.current = content;
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
    setCurrentContent(html);

    // Only mark as unsaved if content is different from last saved
    if (html !== lastSavedContentRef.current) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const handleSave = async (html: string, text: string) => {
    if (!currentNote) {
      Alert.alert("Error", "No note to save");
      return;
    }

    try {
      const response = await updateNote(currentNote.id, {
        content: html,
      });

      if (response.ok) {
        Alert.alert("Success", "Note saved successfully!");
        // Update the current note state
        const updatedNote = await response.json();
        setCurrentNote(updatedNote);
        setHasUnsavedChanges(false);
        lastSavedContentRef.current = html;
      } else {
        Alert.alert("Error", "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const handleSaveAndExit = async (html: string, text: string) => {
    if (!currentNote) {
      Alert.alert("Error", "No note to save");
      return;
    }

    try {
      const response = await updateNote(currentNote.id, {
        content: html,
      });

      if (response.ok) {
        // Don't show success alert since we're exiting
        setHasUnsavedChanges(false);
        lastSavedContentRef.current = html;
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const handleInsight = () => {
    if (currentNote) {
      setShowInsightModal(true);
    }
  };

  const handleDelete = async () => {
    if (!currentNote) return;

    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${currentNote.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await deleteNote(currentNote.id);
              if (response.ok) {
                // Navigate back to home screen
                navigation.goBack();
                Alert.alert("Success", "Note deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete note");
              }
            } catch (error) {
              console.error("Error deleting note:", error);
              Alert.alert("Error", "Failed to delete note");
            }
          },
        },
      ]
    );
  };

  const loadGalaxyData = async (note: Note) => {
    if (note.galaxy_id) {
      try {
        // Load galaxy data
        const galaxyResponse = await getGalaxyById(note.galaxy_id);
        if (galaxyResponse.ok) {
          const galaxyData = await galaxyResponse.json();
          setGalaxy(galaxyData);
        }

        // Load related notes in the same galaxy
        const relatedNotesResponse = await getGalaxyNotes(note.galaxy_id);
        if (relatedNotesResponse.ok) {
          const relatedNotesData = await relatedNotesResponse.json();
          // Filter out the current note
          const filteredNotes = relatedNotesData.filter(
            (n: any) => n.id !== note.id
          );
          setRelatedNotes(filteredNotes);
        }
      } catch (error) {
        console.error("Error loading galaxy data:", error);
      }
    }
  };

  if (isLoading) {
    return <SafeAreaView style={styles.container} />;
  }

  console.log("Rendering EditorScreen with initialContent:", initialContent);
  console.log("Current note:", currentNote);

  return (
    <SafeAreaView style={styles.container}>
      <QuillEditor
        ref={editorRef}
        initialContent={initialContent}
        onContentChange={handleContentChange}
        onSave={handleSave}
        onSaveAndExit={handleSaveAndExit}
        placeholder={`Start writing your note: ${
          currentNote?.title || "Untitled"
        }...`}
        note={
          currentNote
            ? {
                id: currentNote.id,
                title: currentNote.title,
                content: currentNote.content || "",
                galaxy_id: currentNote.galaxy_id || undefined,
              }
            : null
        }
        galaxy={galaxy}
        relatedNotes={relatedNotes}
        onInsight={handleInsight}
        onDelete={handleDelete}
      />
      <NoteInsightModal
        visible={showInsightModal}
        onClose={() => setShowInsightModal(false)}
        note={
          currentNote
            ? {
                id: currentNote.id,
                title: currentNote.title,
                content: currentNote.content || "",
                galaxy_id: currentNote.galaxy_id || undefined,
              }
            : null
        }
        galaxy={galaxy}
        relatedNotes={relatedNotes}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.tertiary,
  },
});

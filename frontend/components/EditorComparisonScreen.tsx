import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { QuillEditor, QuillEditorRef } from "./QuillEditor";
import { TenTapEditorNew, TenTapEditorRef } from "./TenTapEditorNew";

export const EditorComparisonScreen = () => {
  const [activeEditor, setActiveEditor] = useState<"quill" | "tentap">("quill");
  const [content, setContent] = useState(
    "<p>Hello world! This is a test note.</p>"
  );

  const quillRef = useRef<QuillEditorRef>(null);
  const tentapRef = useRef<TenTapEditorRef>(null);

  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
  };

  const handleSave = (html: string, text: string) => {
    Alert.alert("Saved!", `HTML: ${html.substring(0, 50)}...`);
  };

  const handleGetContent = async () => {
    try {
      let result;
      if (activeEditor === "quill") {
        result = await quillRef.current?.getCurrentContent();
      } else {
        result = await tentapRef.current?.getCurrentContent();
      }

      Alert.alert(
        "Current Content",
        `HTML: ${result?.html.substring(
          0,
          100
        )}...\n\nText: ${result?.text.substring(0, 100)}...`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to get content");
    }
  };

  const mockNote = {
    id: 1,
    title: "Test Note",
    content: content,
    galaxy_id: 1,
  };

  const mockGalaxy = {
    id: 1,
    name: "Test Galaxy",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Editor Comparison</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeEditor === "quill" && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveEditor("quill")}
          >
            <Text
              style={[
                styles.toggleText,
                activeEditor === "quill" && styles.toggleTextActive,
              ]}
            >
              Quill
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeEditor === "tentap" && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveEditor("tentap")}
          >
            <Text
              style={[
                styles.toggleText,
                activeEditor === "tentap" && styles.toggleTextActive,
              ]}
            >
              TenTap
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleGetContent} style={styles.testButton}>
          <Text style={styles.testButtonText}>Get Content</Text>
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <View style={styles.editorContainer}>
        {activeEditor === "quill" ? (
          <QuillEditor
            ref={quillRef}
            initialContent={content}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onSaveAndExit={() => console.log("Save and exit")}
            placeholder="Start writing with Quill editor..."
            note={mockNote}
            galaxy={mockGalaxy}
            onInsight={() => Alert.alert("Insight", "Quill editor insight!")}
          />
        ) : (
          <TenTapEditorNew
            ref={tentapRef}
            initialContent={content}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onSaveAndExit={() => console.log("Save and exit")}
            placeholder="Start writing with TenTap editor..."
            note={mockNote}
            galaxy={mockGalaxy}
            onInsight={() => Alert.alert("Insight", "TenTap editor insight!")}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
  },
  toggleText: {
    fontSize: 16,
    color: "#666666",
  },
  toggleTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  editorContainer: {
    flex: 1,
  },
});

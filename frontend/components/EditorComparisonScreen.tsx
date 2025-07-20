// DEPRECATED: This component is no longer used. Renaissance now uses TenTapEditorNew exclusively.
// This file can be safely deleted after testing.

/*
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuillWebViewEditor } from "./QuillWebViewEditor";
import { TenTapEditorNew } from "./TenTapEditorNew";
import { useTheme } from "../contexts/ThemeContext";

export const EditorComparisonScreen = () => {
  const { currentPalette } = useTheme();
  const [selectedEditor, setSelectedEditor] = useState<"quill" | "tentap">("tentap");

  const handleEditorChange = (editor: "quill" | "tentap") => {
    setSelectedEditor(editor);
  };

  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
  };

  const handleSave = (html: string, text: string) => {
    console.log("Saving content:", { html, text });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentPalette.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentPalette.tertiary }]}>
          Editor Comparison
        </Text>
        <Text style={[styles.subtitle, { color: currentPalette.quinary }]}>
          Compare Quill vs TenTap editors
        </Text>
      </View>

      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedEditor === "quill" && { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={() => handleEditorChange("quill")}
        >
          <Ionicons
            name="document-text"
            size={20}
            color={selectedEditor === "quill" ? currentPalette.primary : currentPalette.tertiary}
          />
          <Text
            style={[
              styles.selectorButtonText,
              {
                color: selectedEditor === "quill" ? currentPalette.primary : currentPalette.tertiary,
              },
            ]}
          >
            Quill Editor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectorButton,
            selectedEditor === "tentap" && { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={() => handleEditorChange("tentap")}
        >
          <Ionicons
            name="create"
            size={20}
            color={selectedEditor === "tentap" ? currentPalette.primary : currentPalette.tertiary}
          />
          <Text
            style={[
              styles.selectorButtonText,
              {
                color: selectedEditor === "tentap" ? currentPalette.primary : currentPalette.tertiary,
              },
            ]}
          >
            TenTap Editor
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        {selectedEditor === "quill" ? (
          <QuillWebViewEditor
            initialContent="<p>This is the Quill WebView editor. It provides rich text editing capabilities through a WebView component.</p>"
            onContentChange={handleContentChange}
            onSave={handleSave}
            placeholder="Start writing with Quill..."
          />
        ) : (
          <TenTapEditorNew
            initialContent="<p>This is the TenTap editor. It provides native rich text editing with better performance and mobile optimization.</p>"
            onContentChange={handleContentChange}
            onSave={handleSave}
            placeholder="Start writing with TenTap..."
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: currentPalette.tertiary }]}>
          Editor Information
        </Text>
        <Text style={[styles.infoText, { color: currentPalette.quinary }]}>
          {selectedEditor === "quill"
            ? "Quill Editor: Web-based rich text editor with extensive formatting options. Runs in a WebView for cross-platform compatibility."
            : "TenTap Editor: Native React Native rich text editor optimized for mobile devices. Provides better performance and native feel."}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  selectorContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectorButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectorButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  editorContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  infoContainer: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
*/

import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { QuillWebViewEditor } from "./QuillWebViewEditor";
import { TenTapEditorNew } from "./TenTapEditorNew";
import colorPalette from "../assets/colorPalette";

export const EditorComparisonScreen = () => {
  const [activeEditor, setActiveEditor] = useState<"quill" | "tentap">("quill");
  const [sharedContent, setSharedContent] = useState("");

  const handleContentChange = (html: string, text: string) => {
    console.log(`${activeEditor} content changed:`, { html, text });
    setSharedContent(html);
  };

  const handleSave = (html: string, text: string) => {
    console.log(`${activeEditor} content saved:`, { html, text });
    // Here you would typically save to backend or local storage
  };

  const switchEditor = (editor: "quill" | "tentap") => {
    setActiveEditor(editor);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Editor Switch Header */}
      <View style={styles.switchHeader}>
        <Text style={styles.headerTitle}>Editor Comparison</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              activeEditor === "quill" && styles.activeSwitch,
            ]}
            onPress={() => switchEditor("quill")}
          >
            <Text
              style={[
                styles.switchText,
                activeEditor === "quill" && styles.activeSwitchText,
              ]}
            >
              Quill WebView
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              activeEditor === "tentap" && styles.activeSwitch,
            ]}
            onPress={() => switchEditor("tentap")}
          >
            <Text
              style={[
                styles.switchText,
                activeEditor === "tentap" && styles.activeSwitchText,
              ]}
            >
              TenTap Native
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor Content */}
      <View style={styles.editorContent}>
        {activeEditor === "quill" ? (
          <QuillWebViewEditor
            initialContent={sharedContent}
            onContentChange={handleContentChange}
            onSave={handleSave}
            placeholder="Start writing with Quill WebView..."
          />
        ) : (
          <TenTapEditorNew
            initialContent={sharedContent}
            onContentChange={handleContentChange}
            onSave={handleSave}
            placeholder="Start writing with TenTap Native..."
          />
        )}
      </View>

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          Current:{" "}
          {activeEditor === "quill"
            ? "Quill.js WebView Editor"
            : "TenTap Native Editor"}
        </Text>
        <Text style={styles.infoSubtext}>
          Switch between editors to compare functionality and performance
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
  },
  switchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.secondary,
    backgroundColor: colorPalette.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.quaternary,
    textAlign: "center",
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: colorPalette.secondary,
    borderRadius: 12,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeSwitch: {
    backgroundColor: colorPalette.quaternary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  switchText: {
    fontSize: 14,
    fontWeight: "600",
    color: colorPalette.tertiary,
  },
  activeSwitchText: {
    color: colorPalette.primary,
  },
  editorContent: {
    flex: 1,
  },
  infoFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colorPalette.secondary,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  infoText: {
    fontSize: 12,
    fontWeight: "600",
    color: colorPalette.quaternary,
    textAlign: "center",
  },
  infoSubtext: {
    fontSize: 10,
    color: colorPalette.tertiary,
    textAlign: "center",
    marginTop: 2,
  },
});

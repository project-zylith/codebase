// DEPRECATED: This component has been replaced by TenTapEditorNew.
// This file can be safely deleted after testing.

/*
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useEditorBridge, RichText } from "@10play/tentap-editor";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export const TenTapEditor = () => {
  const { currentPalette } = useTheme();
  const [currentHtmlContent, setCurrentHtmlContent] = useState("");
  const [currentTextContent, setCurrentTextContent] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: "",
  });

  // Content change listener
  useEffect(() => {
    const unsubscribe = editor._subscribeToEditorStateUpdate(() => {
      getContent();
    });

    return unsubscribe;
  }, [editor]);

  const getContent = async () => {
    try {
      const htmlContent = await editor.getHTML();
      const textContent = await editor.getText();

      setCurrentHtmlContent(htmlContent);
      setCurrentTextContent(textContent);

      console.log("Content changed:", { html: htmlContent, text: textContent });
    } catch (error) {
      console.error("Error getting content:", error);
    }
  };

  // Formatting functions
  const toggleBold = async () => {
    try {
      await editor.toggleBold();
      setLastUsedTool("bold");
      setShowToolsDropdown(false);
    } catch (error) {
      console.error("Error toggling bold:", error);
    }
  };

  const toggleItalic = async () => {
    try {
      await editor.toggleItalic();
      setLastUsedTool("italic");
      setShowToolsDropdown(false);
    } catch (error) {
      console.error("Error toggling italic:", error);
    }
  };

  const toggleUnderline = async () => {
    try {
      await editor.toggleUnderline();
      setLastUsedTool("underline");
      setShowToolsDropdown(false);
    } catch (error) {
      console.error("Error toggling underline:", error);
    }
  };

  const toggleStrikethrough = async () => {
    try {
      await editor.toggleStrikethrough();
      setLastUsedTool("strikethrough");
      setShowToolsDropdown(false);
    } catch (error) {
      console.error("Error toggling strikethrough:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.insightButton}
          onPress={() => Alert.alert("Insight", "Insight feature coming soon!")}
        >
          <Ionicons name="bulb" size={24} color={currentPalette.tertiary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.editorWrapper}>
          <ScrollView
            style={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.editorContainer}>
              <RichText editor={editor} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {showToolsDropdown && (
        <View style={styles.toolsDropdown}>
          <TouchableOpacity onPress={toggleBold} style={styles.toolOption}>
            <Text style={[styles.toolOptionText, lastUsedTool === "bold" && styles.activeToolText]}>
              Bold
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleItalic} style={styles.toolOption}>
            <Text style={[styles.toolOptionText, lastUsedTool === "italic" && styles.activeToolText]}>
              Italic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleUnderline} style={styles.toolOption}>
            <Text style={[styles.toolOptionText, lastUsedTool === "underline" && styles.activeToolText]}>
              Underline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleStrikethrough} style={styles.toolOption}>
            <Text style={[styles.toolOptionText, styles.strikethroughText, lastUsedTool === "strikethrough" && styles.activeToolText]}>
              Strikethrough
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  insightButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  editorWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    minHeight: 400,
    paddingVertical: 16,
  },
  toolsDropdown: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 12,
    padding: 8,
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toolOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toolOptionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  activeToolText: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  strikethroughText: {
    textDecorationLine: "line-through",
  },
});
*/

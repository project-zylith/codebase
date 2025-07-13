import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

interface TenTapEditorNewProps {
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onSave?: (html: string, text: string) => void;
  placeholder?: string;
}

export const TenTapEditorNew: React.FC<TenTapEditorNewProps> = ({
  initialContent = "",
  onContentChange,
  onSave,
  placeholder = "Start writing your note...",
}) => {
  const [currentHtmlContent, setCurrentHtmlContent] = useState("");
  const [currentTextContent, setCurrentTextContent] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent || "", // Clean start like Apple Notes
  });

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setIsEditing(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setIsEditing(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Clear last used tool after a delay
  useEffect(() => {
    if (lastUsedTool) {
      const timer = setTimeout(() => {
        setLastUsedTool(null);
      }, 1000); // Clear highlight after 1 second

      return () => clearTimeout(timer);
    }
  }, [lastUsedTool]);

  // Listen for content changes
  useEffect(() => {
    const getContent = async () => {
      try {
        const htmlContent = await editor.getHTML();
        const textContent = await editor.getText();

        setCurrentHtmlContent(htmlContent);
        setCurrentTextContent(textContent);

        if (onContentChange) {
          onContentChange(htmlContent, textContent);
        }
      } catch (error) {
        console.error("Error getting content:", error);
      }
    };

    // Set up content change listener
    const unsubscribe = editor._subscribeToEditorStateUpdate(() => {
      getContent();
    });

    return unsubscribe;
  }, [editor, onContentChange]);

  // Save function
  const handleSave = async () => {
    try {
      const htmlContent = await editor.getHTML();
      const textContent = await editor.getText();

      if (htmlContent.trim() || textContent.trim()) {
        if (onSave) {
          onSave(htmlContent, textContent);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    }
  };

  const handleDone = async () => {
    await handleSave();
    dismissKeyboard();
  };

  const handleTools = () => {
    setShowToolsDropdown(!showToolsDropdown);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    editor.blur();
  };

  // Formatting functions
  const toggleBold = () => {
    editor.toggleBold();
    setLastUsedTool("bold");
    setShowToolsDropdown(false);
  };

  const toggleItalic = () => {
    editor.toggleItalic();
    setLastUsedTool("italic");
    setShowToolsDropdown(false);
  };

  const toggleHeading1 = () => {
    editor.toggleHeading(1);
    setLastUsedTool("heading1");
    setShowToolsDropdown(false);
  };

  const toggleHeading2 = () => {
    editor.toggleHeading(2);
    setLastUsedTool("heading2");
    setShowToolsDropdown(false);
  };

  const toggleHeading3 = () => {
    editor.toggleHeading(3);
    setLastUsedTool("heading3");
    setShowToolsDropdown(false);
  };

  const toggleUnderline = () => {
    editor.toggleUnderline();
    setLastUsedTool("underline");
    setShowToolsDropdown(false);
  };

  const toggleStrikethrough = () => {
    editor.toggleStrike();
    setLastUsedTool("strikethrough");
    setShowToolsDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Done and Tools buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleTools}>
          <Text style={styles.headerButtonText}>Tools</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Notes</Text>

        <TouchableOpacity style={styles.headerButton} onPress={handleDone}>
          <Text style={styles.headerButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Tools Dropdown */}
      {showToolsDropdown && (
        <View style={styles.toolsDropdown}>
          <TouchableOpacity onPress={toggleBold} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                styles.boldText,
                lastUsedTool === "bold" && styles.activeToolText,
              ]}
            >
              Bold
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleItalic} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                styles.italicText,
                lastUsedTool === "italic" && styles.activeToolText,
              ]}
            >
              Italic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleUnderline} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                styles.underlineText,
                lastUsedTool === "underline" && styles.activeToolText,
              ]}
            >
              Underline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleStrikethrough}
            style={styles.toolOption}
          >
            <Text
              style={[
                styles.toolOptionText,
                styles.strikethroughText,
                lastUsedTool === "strikethrough" && styles.activeToolText,
              ]}
            >
              Strikethrough
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={toggleHeading1} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                lastUsedTool === "heading1" && styles.activeToolText,
              ]}
            >
              Heading 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleHeading2} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                lastUsedTool === "heading2" && styles.activeToolText,
              ]}
            >
              Heading 2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleHeading3} style={styles.toolOption}>
            <Text
              style={[
                styles.toolOptionText,
                lastUsedTool === "heading3" && styles.activeToolText,
              ]}
            >
              Heading 3
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={styles.contentContainer}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            dismissKeyboard();
            setShowToolsDropdown(false);
          }}
        >
          <View style={styles.editorWrapper}>
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.editorContainer}>
                <RichText editor={editor} />
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Simple Done button above keyboard when typing */}
      {isKeyboardVisible && (
        <View style={styles.keyboardAccessory}>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.doneButton} onPress={dismissKeyboard}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Clean white background like Apple Notes
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 50,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  toolsDropdown: {
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  toolOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toolOptionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  activeToolText: {
    color: "#007AFF", // Blue when active
  },
  boldText: {
    fontWeight: "800",
  },
  italicText: {
    fontStyle: "italic",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  strikethroughText: {
    textDecorationLine: "line-through",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  editorWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: "100%",
  },
  editorContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: 500,
  },
  keyboardAccessory: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  spacer: {
    flex: 1,
  },
  doneButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});

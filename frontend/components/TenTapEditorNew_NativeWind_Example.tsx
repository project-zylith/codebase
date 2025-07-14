import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { RichText, useEditorBridge } from "@10play/tentap-editor";

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
    initialContent: initialContent || "",
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
      }, 1000);

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
    <SafeAreaView className="flex-1 bg-dark-primary">
      {/* Header with Done and Tools buttons */}
      <View className="flex-row justify-between items-center px-5 py-4 bg-dark-primary border-b border-dark-border-primary">
        <TouchableOpacity
          className="px-2 py-1 min-w-[50px]"
          onPress={handleTools}
        >
          <Text className="text-base font-medium text-dark-accent-blue">
            Tools
          </Text>
        </TouchableOpacity>

        <Text className="text-xl font-semibold text-dark-text-primary flex-1 text-center">
          Notes
        </Text>

        <TouchableOpacity
          className="px-2 py-1 min-w-[50px]"
          onPress={handleDone}
        >
          <Text className="text-base font-medium text-dark-accent-blue">
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tools Dropdown */}
      {showToolsDropdown && (
        <View className="absolute top-[70px] left-5 bg-dark-elevated rounded-xl py-2 min-w-[160px] shadow-medium z-[1000] border border-dark-border-primary">
          <TouchableOpacity onPress={toggleBold} className="px-4 py-3">
            <Text
              className={`text-base font-extrabold ${
                lastUsedTool === "bold"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Bold
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleItalic} className="px-4 py-3">
            <Text
              className={`text-base font-medium italic ${
                lastUsedTool === "italic"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Italic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleUnderline} className="px-4 py-3">
            <Text
              className={`text-base font-medium underline ${
                lastUsedTool === "underline"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Underline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleStrikethrough} className="px-4 py-3">
            <Text
              className={`text-base font-medium line-through ${
                lastUsedTool === "strikethrough"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Strikethrough
            </Text>
          </TouchableOpacity>

          <View className="h-[0.5px] bg-dark-border-primary my-1 mx-4" />

          <TouchableOpacity onPress={toggleHeading1} className="px-4 py-3">
            <Text
              className={`text-base font-medium ${
                lastUsedTool === "heading1"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Heading 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleHeading2} className="px-4 py-3">
            <Text
              className={`text-base font-medium ${
                lastUsedTool === "heading2"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
            >
              Heading 2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleHeading3} className="px-4 py-3">
            <Text
              className={`text-base font-medium ${
                lastUsedTool === "heading3"
                  ? "text-dark-accent-blue"
                  : "text-dark-text-primary"
              }`}
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
        className="flex-1 bg-dark-primary"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            dismissKeyboard();
            setShowToolsDropdown(false);
          }}
        >
          <View className="flex-1">
            <ScrollView
              className="flex-1 bg-dark-primary"
              contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 bg-dark-primary px-5 py-5 min-h-[500px]">
                <RichText editor={editor} />
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Simple Done button above keyboard when typing */}
      {isKeyboardVisible && (
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center bg-dark-secondary border-t border-dark-border-primary py-3 px-4 shadow-medium">
          <View className="flex-1" />
          <TouchableOpacity
            className="bg-dark-accent-blue px-4 py-2 rounded-lg"
            onPress={dismissKeyboard}
          >
            <Text className="text-white font-semibold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { WebView } from "react-native-webview";
import colorPalette from "../assets/colorPalette";

interface QuillWebViewEditorProps {
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onSave?: (html: string, text: string) => void;
  placeholder?: string;
}

export const QuillWebViewEditor: React.FC<QuillWebViewEditorProps> = ({
  initialContent = "",
  onContentChange,
  onSave,
  placeholder = "Start writing your note...",
}) => {
  const webviewRef = useRef<WebView>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [currentHtmlContent, setCurrentHtmlContent] = useState("");
  const [currentTextContent, setCurrentTextContent] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Function to send messages to the WebView
  const sendMessageToWebview = (type: string, payload?: any) => {
    if (webviewRef.current && editorLoaded) {
      const message = JSON.stringify({ type, payload });
      webviewRef.current.postMessage(message);
    }
  };

  // Handler for messages coming from the WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case "EDITOR_READY":
          setEditorLoaded(true);
          console.log("Editor is ready!");
          break;

        case "EDITOR_CONTENT_CHANGE":
          const { html, text } = message.payload;
          setCurrentHtmlContent(html);
          setCurrentTextContent(text);
          if (onContentChange) {
            onContentChange(html, text);
          }
          break;

        case "EDITOR_FOCUS":
          // Handle focus events if needed
          break;

        case "EDITOR_BLUR":
          // Handle blur events if needed
          break;

        case "EDITOR_ERROR":
          console.error("Editor error:", message.payload);
          Alert.alert("Editor Error", message.payload);
          break;

        case "CONTENT_RESPONSE":
          // Handle content response if needed
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Save function
  const handleSave = async () => {
    try {
      if (currentHtmlContent.trim() || currentTextContent.trim()) {
        if (onSave) {
          onSave(currentHtmlContent, currentTextContent);
        }
        Alert.alert("Notes Saved", "Your notes have been saved successfully!");
      } else {
        Alert.alert("Nothing to Save", "Please write something first!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  // Clear function
  const handleClear = () => {
    Alert.alert("Clear Notes", "Are you sure you want to clear all notes?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          sendMessageToWebview("CLEAR_CONTENT");
          setCurrentHtmlContent("");
          setCurrentTextContent("");
        },
      },
    ]);
  };

  // Formatting functions
  const toggleBold = () => {
    sendMessageToWebview("FORMAT_BOLD");
  };

  const toggleItalic = () => {
    sendMessageToWebview("FORMAT_ITALIC");
  };

  const toggleUnderline = () => {
    sendMessageToWebview("FORMAT_UNDERLINE");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* Header with controls */}
          <View style={styles.header}>
            <Text style={styles.title}>My Notes</Text>
            <View style={styles.buttonContainer}>
              {isKeyboardVisible && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={dismissKeyboard}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Native Toolbar for additional controls */}
          <View style={styles.nativeToolbar}>
            <TouchableOpacity onPress={toggleBold} style={styles.toolbarButton}>
              <Text style={styles.toolbarButtonText}>B</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleItalic}
              style={styles.toolbarButton}
            >
              <Text style={[styles.toolbarButtonText, styles.italicText]}>
                I
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleUnderline}
              style={styles.toolbarButton}
            >
              <Text style={[styles.toolbarButtonText, styles.underlineText]}>
                U
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading overlay */}
          {!editorLoaded && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colorPalette.quaternary} />
              <Text style={styles.loadingText}>Loading editor...</Text>
            </View>
          )}

          {/* WebView Editor */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            style={styles.webviewContainer}
          >
            <WebView
              ref={webviewRef}
              source={require("../assets/editor/offline-editor.html")}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              style={styles.webview}
              originWhitelist={["*"]}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              onLoadEnd={() => {
                console.log("WebView finished loading");
              }}
              onError={(error) => {
                console.error("WebView error:", error);
                Alert.alert("Error", "Failed to load editor");
              }}
              // Disable zoom
              scalesPageToFit={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              keyboardDisplayRequiresUserAction={false}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colorPalette.quaternary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colorPalette.tertiary,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colorPalette.quaternary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colorPalette.primary,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.secondary,
    backgroundColor: colorPalette.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPalette.quaternary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  saveButton: {
    backgroundColor: colorPalette.quaternary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    color: colorPalette.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: colorPalette.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: colorPalette.tertiary,
    fontWeight: "600",
    fontSize: 14,
  },
  doneButton: {
    backgroundColor: colorPalette.quaternary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  doneButtonText: {
    color: colorPalette.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  nativeToolbar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: colorPalette.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  toolbarButton: {
    backgroundColor: colorPalette.quaternary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 36,
    alignItems: "center",
  },
  toolbarButtonText: {
    color: colorPalette.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  italicText: {
    fontStyle: "italic",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 10,
  },
});

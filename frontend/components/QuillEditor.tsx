import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
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
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

interface QuillEditorProps {
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onSave?: (html: string, text: string) => void;
  onSaveAndExit?: (html: string, text: string) => void;
  placeholder?: string;
  note?: {
    id: number;
    title: string;
    content: string;
    galaxy_id?: number;
  } | null;
  galaxy?: {
    id: number;
    name: string;
  } | null;
  relatedNotes?: Array<{
    id: number;
    title: string;
    content: string;
  }> | null;
  onInsight?: () => void;
  onDelete?: () => void;
}

export interface QuillEditorRef {
  getCurrentContent: () => Promise<{ html: string; text: string }>;
  saveCurrentContent?: () => Promise<void>;
}

export const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
  (
    {
      initialContent = "",
      onContentChange,
      onSave,
      onSaveAndExit,
      placeholder = "Start writing your note...",
      note,
      galaxy,
      relatedNotes,
      onInsight,
      onDelete,
    },
    ref
  ) => {
    const [currentHtmlContent, setCurrentHtmlContent] = useState("");
    const [currentTextContent, setCurrentTextContent] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [showToolsDropdown, setShowToolsDropdown] = useState(false);
    const webViewRef = useRef<WebView>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getCurrentContent: async () => {
        return new Promise((resolve) => {
          webViewRef.current?.postMessage(
            JSON.stringify({ type: "GET_CONTENT" })
          );
          // We'll resolve this when we get the response
          const timeout = setTimeout(() => {
            resolve({ html: currentHtmlContent, text: currentTextContent });
          }, 1000);
        });
      },
      saveCurrentContent: async () => {
        if (onSave) {
          onSave(currentHtmlContent, currentTextContent);
        }
      },
    }));

    // Keyboard listeners
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setKeyboardVisible(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setKeyboardVisible(false)
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }, []);

    // Initialize content when editor is ready
    useEffect(() => {
      if (isEditorReady && initialContent) {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "SET_CONTENT",
            content: initialContent,
          })
        );
      }
    }, [isEditorReady, initialContent]);

    const handleWebViewMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        switch (data.type) {
          case "EDITOR_READY":
            setIsEditorReady(true);
            break;
          case "CONTENT_CHANGE":
            setCurrentHtmlContent(data.html);
            setCurrentTextContent(data.text);
            onContentChange?.(data.html, data.text);
            break;
          case "CONTENT_RESPONSE":
            // Handle getCurrentContent response
            break;
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error);
      }
    };

    const handleSave = () => {
      if (onSave) {
        onSave(currentHtmlContent, currentTextContent);
      }
    };

    const handleSaveAndExit = () => {
      if (onSaveAndExit) {
        onSaveAndExit(currentHtmlContent, currentTextContent);
      }
    };

    const handleInsight = () => {
      if (onInsight) {
        onInsight();
      }
    };

    const handleDelete = () => {
      if (onDelete) {
        onDelete();
      }
      setShowToolsDropdown(false);
    };

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };

    const quillHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #ffffff;
        }
        #editor {
          min-height: 300px;
          border: none;
          outline: none;
        }
        .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e0e0e0;
          padding: 8px 0;
        }
        .ql-container {
          border: none;
          font-size: 16px;
          line-height: 1.6;
        }
        .ql-editor {
          padding: 16px 0;
        }
        .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
          content: attr(data-placeholder);
        }
      </style>
    </head>
    <body>
      <div id="editor"></div>
      
      <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
      <script>
        var quill = new Quill('#editor', {
          theme: 'snow',
          placeholder: '${placeholder}',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, false] }],
              ['clean']
            ]
          }
        });

        // Send ready message
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'EDITOR_READY'
        }));

        // Listen for content changes
        quill.on('text-change', function() {
          const html = quill.root.innerHTML;
          const text = quill.getText();
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'CONTENT_CHANGE',
            html: html,
            text: text
          }));
        });

        // Listen for messages from React Native
        document.addEventListener('message', function(event) {
          const data = JSON.parse(event.data);
          
          switch(data.type) {
            case 'SET_CONTENT':
              quill.root.innerHTML = data.content;
              break;
            case 'GET_CONTENT':
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'CONTENT_RESPONSE',
                html: quill.root.innerHTML,
                text: quill.getText()
              }));
              break;
          }
        });

        // Handle window messages for iOS
        window.addEventListener('message', function(event) {
          const data = JSON.parse(event.data);
          
          switch(data.type) {
            case 'SET_CONTENT':
              quill.root.innerHTML = data.content;
              break;
            case 'GET_CONTENT':
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'CONTENT_RESPONSE',
                html: quill.root.innerHTML,
                text: quill.getText()
              }));
              break;
          }
        });
      </script>
    </body>
    </html>
    `;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{note?.title || "New Note"}</Text>
            {galaxy && (
              <Text style={styles.headerSubtitle}>in {galaxy.name}</Text>
            )}
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleInsight} style={styles.headerButton}>
              <Ionicons name="bulb-outline" size={24} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowToolsDropdown(!showToolsDropdown)}
              style={styles.headerButton}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tools Dropdown */}
        {showToolsDropdown && (
          <Modal
            visible={showToolsDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowToolsDropdown(false)}
          >
            <TouchableWithoutFeedback
              onPress={() => setShowToolsDropdown(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setShowToolsDropdown(false);
                      handleSave();
                    }}
                  >
                    <Ionicons name="save-outline" size={20} color="#007AFF" />
                    <Text style={styles.dropdownText}>Save Note</Text>
                  </TouchableOpacity>
                  
                  {note?.id && (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={handleDelete}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      <Text style={[styles.dropdownText, { color: "#FF3B30" }]}>Delete Note</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {/* Editor */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.editorContainer}
        >
          <WebView
            ref={webViewRef}
            source={{ html: quillHtml }}
            onMessage={handleWebViewMessage}
            style={styles.webView}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyboardDisplayRequiresUserAction={false}
            hideKeyboardAccessoryView={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
  },
  editorContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 16,
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#007AFF",
  },
});

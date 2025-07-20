// DEPRECATED: This component is no longer used. Renaissance now uses TenTapEditorNew.
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
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

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
  const { currentPalette } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [currentContent, setCurrentContent] = useState(initialContent);

  const quillHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quill Editor</title>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
        <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
        <style>
            body {
                margin: 0;
                padding: 20px;
                background-color: ${currentPalette.primary};
                color: ${currentPalette.tertiary};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #editor {
                background-color: ${currentPalette.secondary};
                border: 1px solid ${currentPalette.quaternary};
                border-radius: 8px;
                min-height: 300px;
                color: ${currentPalette.tertiary};
            }
            .ql-editor {
                min-height: 300px;
                font-size: 16px;
                line-height: 1.6;
            }
            .ql-toolbar {
                background-color: ${currentPalette.secondary};
                border-color: ${currentPalette.quaternary};
            }
            .ql-toolbar button {
                color: ${currentPalette.tertiary};
            }
            .ql-toolbar button:hover {
                color: ${currentPalette.quaternary};
            }
            .ql-toolbar .ql-active {
                color: ${currentPalette.quaternary};
            }
        </style>
    </head>
    <body>
        <div id="editor">${initialContent}</div>
        <script>
            var quill = new Quill('#editor', {
                theme: 'snow',
                placeholder: '${placeholder}',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['link', 'blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                    ]
                }
            });

            quill.on('text-change', function() {
                var html = quill.root.innerHTML;
                var text = quill.getText();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'content-change',
                    html: html,
                    text: text
                }));
            });

            // Handle save command
            window.addEventListener('message', function(event) {
                if (event.data.type === 'save') {
                    var html = quill.root.innerHTML;
                    var text = quill.getText();
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'save',
                        html: html,
                        text: text
                    }));
                }
            });
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'content-change') {
        setCurrentContent(data.html);
        if (onContentChange) {
          onContentChange(data.html, data.text);
        }
      } else if (data.type === 'save') {
        if (onSave) {
          onSave(data.html, data.text);
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleSave = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'save' }));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentPalette.primary }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentPalette.quaternary }]}
            onPress={handleSave}
          >
            <Ionicons name="save" size={20} color={currentPalette.tertiary} />
            <Text style={[styles.saveButtonText, { color: currentPalette.tertiary }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
        
        <WebView
          ref={webViewRef}
          source={{ html: quillHTML }}
          onMessage={handleMessage}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
});
*/

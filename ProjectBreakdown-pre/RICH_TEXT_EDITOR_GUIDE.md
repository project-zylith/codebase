# Rich Text Editor Integration - Renaissance MVP

## ✍️ Overview

Renaissance uses **TenTap Editor** as its primary rich text editing solution, providing users with a powerful, mobile-optimized writing experience. This guide covers the integration, customization, and advanced features of the rich text editor.

---

## 🏗️ Architecture Overview

### Editor System Flow

```
User Input → TenTap Editor → Content Processing → Auto-save → Database Storage → Real-time Updates
```

### Key Components

- **TenTap Editor**: Core rich text editing engine
- **Custom Toolbar**: Formatting controls and paste functionality
- **Auto-save System**: Real-time content preservation
- **Content Validation**: HTML sanitization and processing
- **Mobile Optimization**: Touch-friendly interface

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── TenTapEditorNew.tsx        # Main rich text editor component
│   ├── EditorScreen.tsx           # Editor screen wrapper
│   └── QuillWebViewEditor.tsx     # Legacy Quill editor (deprecated)
├── assets/
│   └── editor/
│       ├── quill.min.js           # Quill editor library
│       └── quill.snow.css         # Quill styling
└── types/
    └── types.ts                   # Editor type definitions

backend/
└── controllers/
    └── noteControllers.ts         # Content processing and storage
```

---

## 🔧 TenTap Editor Integration

### 1. Editor Component Setup

**Location**: `frontend/components/TenTapEditorNew.tsx`

```typescript
import { useEditorBridge, RichText } from "@10play/tentap-editor";

export const TenTapEditorNew = forwardRef<
  TenTapEditorRef,
  TenTapEditorNewProps
>(
  (
    {
      initialContent,
      onContentChange,
      onSave,
      note,
      galaxy,
      relatedNotes,
      onInsight,
    },
    ref
  ) => {
    const { currentPalette } = useTheme();
    const [currentHtmlContent, setCurrentHtmlContent] = useState("");
    const [currentTextContent, setCurrentTextContent] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showToolsDropdown, setShowToolsDropdown] = useState(false);
    const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);

    // Initialize TenTap editor
    const editor = useEditorBridge({
      autofocus: false,
      avoidIosKeyboard: true,
      initialContent: initialContent || "",
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getCurrentContent: async () => {
        const htmlContent = await editor.getHTML();
        const textContent = await editor.getText();
        return { html: htmlContent, text: textContent };
      },
      saveCurrentContent: async () => {
        const htmlContent = await editor.getHTML();
        const textContent = await editor.getText();
        if (onSave) {
          onSave(htmlContent, textContent);
        }
      },
    }));

    // Content change listener
    useEffect(() => {
      const unsubscribe = editor._subscribeToEditorStateUpdate(() => {
        getContent();
      });

      return unsubscribe;
    }, [editor, onContentChange]);

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

    return (
      <SafeAreaView style={styles.container}>
        {/* Header with insight button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.insightButton} onPress={onInsight}>
            <Ionicons name="bulb" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Rich text editor */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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

        {/* Tools dropdown */}
        {showToolsDropdown && (
          <View style={styles.toolsDropdown}>
            <TouchableOpacity onPress={toggleBold} style={styles.toolOption}>
              <Text
                style={[
                  styles.toolOptionText,
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
                  lastUsedTool === "italic" && styles.activeToolText,
                ]}
              >
                Italic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleUnderline}
              style={styles.toolOption}
            >
              <Text
                style={[
                  styles.toolOptionText,
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

            <TouchableOpacity onPress={handlePaste} style={styles.toolOption}>
              <Text style={styles.toolOptionText}>Paste</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
);
```

### 2. Formatting Functions

```typescript
// Bold formatting
const toggleBold = async () => {
  try {
    await editor.toggleBold();
    setLastUsedTool("bold");
    setShowToolsDropdown(false);
  } catch (error) {
    console.error("Error toggling bold:", error);
  }
};

// Italic formatting
const toggleItalic = async () => {
  try {
    await editor.toggleItalic();
    setLastUsedTool("italic");
    setShowToolsDropdown(false);
  } catch (error) {
    console.error("Error toggling italic:", error);
  }
};

// Underline formatting
const toggleUnderline = async () => {
  try {
    await editor.toggleUnderline();
    setLastUsedTool("underline");
    setShowToolsDropdown(false);
  } catch (error) {
    console.error("Error toggling underline:", error);
  }
};

// Strikethrough formatting
const toggleStrikethrough = async () => {
  try {
    await editor.toggleStrikethrough();
    setLastUsedTool("strikethrough");
    setShowToolsDropdown(false);
  } catch (error) {
    console.error("Error toggling strikethrough:", error);
  }
};
```

### 3. Paste Functionality

```typescript
const handlePaste = async () => {
  try {
    const text = await Clipboard.getString();
    if (text) {
      // Get current content and append the pasted text
      const currentContent = await editor.getHTML();
      const newContent = currentContent + text;
      await editor.setContent(newContent);
    }
  } catch (error) {
    console.error("Error pasting text:", error);
    Alert.alert("Error", "Failed to paste text");
  }
  setLastUsedTool("paste");
  setShowToolsDropdown(false);
};
```

---

## 📱 Editor Screen Integration

### 1. Editor Screen Wrapper

**Location**: `frontend/components/EditorScreen.tsx`

```typescript
export const EditorScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { currentPalette } = useTheme();
  const editorRef = useRef<TenTapEditorRef>(null);

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [initialContent, setInitialContent] = useState("");
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [galaxy, setGalaxy] = useState<Galaxy | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<Note[]>([]);

  const noteId = route.params?.noteId as number;
  const isNewNote = route.params?.isNewNote as boolean;

  // Load note data
  useEffect(() => {
    if (noteId && !isNewNote) {
      loadNote();
      loadGalaxyData();
    }
  }, [noteId]);

  const loadNote = async () => {
    try {
      const response = await getNoteById(noteId);
      if (response.ok) {
        const note = await response.json();
        setCurrentNote(note);
        setInitialContent(note.content || "");
      }
    } catch (error) {
      console.error("Error loading note:", error);
    }
  };

  const handleContentChange = (html: string, text: string) => {
    // Real-time content updates
    console.log("Content changed:", { html, text });
  };

  const handleSave = async (html: string, text: string) => {
    try {
      if (currentNote) {
        await updateNote(currentNote.id, { content: html });
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleInsight = () => {
    setShowInsightModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        ref={editorRef}
        initialContent={initialContent}
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder={`Start writing your note: ${
          currentNote?.title || "Untitled"
        }...`}
        note={currentNote}
        galaxy={galaxy}
        relatedNotes={relatedNotes}
        onInsight={handleInsight}
      />
      <NoteInsightModal
        visible={showInsightModal}
        onClose={() => setShowInsightModal(false)}
        note={currentNote}
        galaxy={galaxy}
        relatedNotes={relatedNotes}
      />
    </SafeAreaView>
  );
};
```

---

## 🎨 Styling and Theming

### 1. Editor Styles

```typescript
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
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 4,
  },
});
```

### 2. Theme Integration

```typescript
// Dynamic theme application
const editorStyles = {
  backgroundColor: currentPalette.primary,
  color: currentPalette.tertiary,
  fontSize: 16,
  lineHeight: 24,
  fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
};

// Toolbar theming
const toolbarStyles = {
  backgroundColor: currentPalette.secondary,
  borderColor: currentPalette.quaternary,
  color: currentPalette.tertiary,
};
```

---

## 🔄 Content Management

### 1. Auto-save Implementation

```typescript
// Debounced auto-save
const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

const handleContentChange = (html: string, text: string) => {
  // Clear existing timeout
  if (autoSaveTimeout.current) {
    clearTimeout(autoSaveTimeout.current);
  }

  // Set new timeout for auto-save
  autoSaveTimeout.current = setTimeout(async () => {
    try {
      if (currentNote) {
        await updateNote(currentNote.id, { content: html });
        console.log("Auto-saved note content");
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, 2000); // 2-second delay
};
```

### 2. Content Validation

```typescript
const validateContent = (html: string): boolean => {
  // Basic HTML validation
  if (html.length > 100000) {
    Alert.alert("Error", "Note content is too large");
    return false;
  }

  // Check for potentially harmful content
  const dangerousTags = ["script", "iframe", "object", "embed"];
  const hasDangerousContent = dangerousTags.some((tag) =>
    html.toLowerCase().includes(`<${tag}`)
  );

  if (hasDangerousContent) {
    Alert.alert("Error", "Note contains unsupported content");
    return false;
  }

  return true;
};
```

### 3. Content Processing

```typescript
const processContent = (html: string): string => {
  // Remove excessive whitespace
  let processed = html.replace(/\s+/g, " ").trim();

  // Ensure proper paragraph structure
  if (!processed.includes("<p>")) {
    processed = `<p>${processed}</p>`;
  }

  // Clean up empty paragraphs
  processed = processed.replace(/<p>\s*<\/p>/g, "");

  return processed;
};
```

---

## 🚀 Advanced Features

### 1. Keyboard Shortcuts

```typescript
// Keyboard event handling
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "b":
        event.preventDefault();
        toggleBold();
        break;
      case "i":
        event.preventDefault();
        toggleItalic();
        break;
      case "u":
        event.preventDefault();
        toggleUnderline();
        break;
      case "s":
        event.preventDefault();
        handleSave();
        break;
    }
  }
};
```

### 2. Undo/Redo Support

```typescript
const handleUndo = async () => {
  try {
    await editor.undo();
  } catch (error) {
    console.error("Error undoing:", error);
  }
};

const handleRedo = async () => {
  try {
    await editor.redo();
  } catch (error) {
    console.error("Error redoing:", error);
  }
};
```

### 3. Content Export

```typescript
const exportContent = async (format: "html" | "text" | "markdown") => {
  try {
    switch (format) {
      case "html":
        return await editor.getHTML();
      case "text":
        return await editor.getText();
      case "markdown":
        // Convert HTML to Markdown
        const html = await editor.getHTML();
        return convertHtmlToMarkdown(html);
      default:
        throw new Error("Unsupported export format");
    }
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
```

---

## 🐛 Common Issues and Solutions

### 1. Content Not Saving

**Problem**: Changes disappear after app restart
**Solution**: Check auto-save implementation and API calls

### 2. Formatting Not Working

**Problem**: Bold, italic, etc. don't apply
**Solution**: Verify TenTap editor initialization and method calls

### 3. Paste Issues

**Problem**: Paste functionality doesn't work
**Solution**: Check clipboard permissions and content processing

### 4. Performance Issues

**Problem**: Editor becomes slow with large content
**Solution**: Implement content chunking and virtual rendering

---

## 🚀 Future Enhancements

### Planned Features

1. **Advanced Formatting**: Headers, lists, code blocks
2. **Image Support**: Insert and manage images
3. **Tables**: Create and edit tables
4. **Collaborative Editing**: Real-time multi-user editing
5. **Version History**: Track content changes over time

### Technical Improvements

1. **Offline Support**: Local content caching
2. **Content Sync**: Cross-device synchronization
3. **Advanced Export**: PDF, Word, Markdown export
4. **Custom Themes**: User-defined editor themes
5. **Accessibility**: Screen reader support

---

## 📚 Learning Resources

- [TenTap Editor Documentation](https://github.com/10play/tentap-editor)
- [React Native Keyboard Handling](https://reactnative.dev/docs/keyboard)
- [HTML Content Processing](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
- [Clipboard API](https://reactnative.dev/docs/clipboard)

---

_The Rich Text Editor Integration provides a powerful, mobile-optimized writing experience in Renaissance. Its integration with the note system and AI features creates a seamless content creation workflow._

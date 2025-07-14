# TenTap Editor Integration System

## Overview

The Project Zylith TenTap editor integration provides a comprehensive rich text editing solution with an Apple Notes-inspired interface, real-time content synchronization, mobile-optimized interactions, and advanced formatting capabilities. The system is built on the `@10play/tentap-editor` library with extensive customizations for mobile optimization and user experience.

## Architecture

### Frontend Editor Implementation (React Native)

#### TenTapEditorNew Component (`frontend/components/TenTapEditorNew.tsx`)

The main editor interface component that provides a complete rich text editing experience.

**Key Features:**

- **Apple Notes-Inspired Design**: Clean white interface with minimal header
- **Real-time Content Synchronization**: Instant content updates and state management
- **Mobile-Optimized Interactions**: Touch-friendly formatting tools and keyboard handling
- **Visual Feedback System**: Blue text highlighting for recently used formatting tools
- **Dropdown Formatting Tools**: Organized formatting options with professional styling

**Component Interface:**

```typescript
interface TenTapEditorNewProps {
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onSave?: (html: string, text: string) => void;
  placeholder?: string;
}
```

**Editor Bridge Configuration:**

```typescript
const editor = useEditorBridge({
  autofocus: false, // Prevents automatic keyboard appearance
  avoidIosKeyboard: true, // Handles iOS keyboard positioning
  initialContent: initialContent || "", // Clean start content
});
```

#### State Management System

**Core State Variables:**

```typescript
const [currentHtmlContent, setCurrentHtmlContent] = useState("");
const [currentTextContent, setCurrentTextContent] = useState("");
const [isKeyboardVisible, setKeyboardVisible] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [showToolsDropdown, setShowToolsDropdown] = useState(false);
const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);
```

**State Management Logic:**

- **Content State**: Real-time HTML and plain text content tracking
- **Keyboard State**: Dynamic keyboard visibility and editing state
- **UI State**: Tools dropdown visibility and user interaction state
- **Feedback State**: Visual feedback for recently used formatting tools

#### Real-time Content Monitoring

**Content Change Detection:**

```typescript
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
```

**Content Monitoring Features:**

- **Automatic Updates**: Uses `_subscribeToEditorStateUpdate()` for real-time monitoring
- **Dual Format Support**: Extracts both HTML and plain text versions
- **Parent Communication**: Calls parent component's `onContentChange` callback
- **Error Handling**: Comprehensive error handling with logging
- **Memory Management**: Proper cleanup with unsubscribe function

### Mobile Optimization System

#### Keyboard Management

**Keyboard Event Handling:**

```typescript
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
```

**Keyboard Optimization Features:**

- **State Synchronization**: Keyboard visibility synced with editing state
- **Event Listener Management**: Proper setup and cleanup of keyboard listeners
- **UI State Updates**: Triggers keyboard accessory view appearance
- **Memory Leak Prevention**: Comprehensive cleanup on component unmount

#### Touch Interaction System

**Touch Handling Implementation:**

```typescript
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
```

**Touch Optimization Features:**

- **Gesture Dismissal**: Tap outside to dismiss keyboard and dropdown
- **Scroll Optimization**: Proper keyboard persistence and smooth scrolling
- **Visual Cleanliness**: Hidden scroll indicators for Apple Notes feel
- **Content Wrapping**: Proper container structure for touch handling

### Formatting Tools System

#### Core Formatting Functions

**Text Formatting Implementation:**

```typescript
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
```

**Heading Formatting Implementation:**

```typescript
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
```

**Formatting Tools Features:**

- **Instant Application**: Immediate formatting application to selected text
- **Visual Feedback**: Sets `lastUsedTool` for blue text highlighting
- **Dropdown Management**: Auto-closes dropdown after tool selection
- **Comprehensive Options**: Bold, Italic, Underline, Strikethrough, Headings 1-3

#### Visual Feedback System

**Feedback Timer Implementation:**

```typescript
useEffect(() => {
  if (lastUsedTool) {
    const timer = setTimeout(() => {
      setLastUsedTool(null);
    }, 1000); // Clear highlight after 1 second

    return () => clearTimeout(timer);
  }
}, [lastUsedTool]);
```

**Visual Feedback Features:**

- **Immediate Response**: Instant visual feedback on tool usage
- **Timed Clearing**: Auto-clears highlight after 1 second
- **Memory Management**: Proper timer cleanup
- **Blue Text Highlighting**: Apple-style blue text for active tools

### Save and Content Management

#### Save Functionality

**Save Implementation:**

```typescript
const handleSave = async () => {
  try {
    const htmlContent = await editor.getHTML();
    const textContent = await editor.getText();

    if (htmlContent.trim() || textContent.trim()) {
      if (onSave) {
        onSave(htmlContent, textContent);
      }
      Alert.alert("Note Saved", "Your note has been saved successfully!");
    } else {
      Alert.alert("Nothing to Save", "Please write something first!");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to save note");
  }
};
```

**Save System Features:**

- **Content Validation**: Checks for non-empty content before saving
- **Dual Format Extraction**: Saves both HTML and plain text versions
- **User Feedback**: Success and error alerts with descriptive messages
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Parent Communication**: Calls parent component's `onSave` callback

#### Done Button Integration

**Done Button Implementation:**

```typescript
const handleDone = async () => {
  await handleSave();
  dismissKeyboard();
};

const dismissKeyboard = () => {
  Keyboard.dismiss();
  editor.blur();
};
```

**Done Button Features:**

- **Dual Action**: Saves content and dismisses keyboard
- **Editor Blur**: Properly blurs editor to end editing session
- **Clean UX**: Single action for save and completion

## UI/UX Design System

### Apple Notes-Inspired Interface

#### Header Design

**Header Implementation:**

```typescript
<View style={styles.header}>
  <TouchableOpacity style={styles.headerButton} onPress={handleTools}>
    <Text style={styles.headerButtonText}>Tools</Text>
  </TouchableOpacity>

  <Text style={styles.title}>Notes</Text>

  <TouchableOpacity style={styles.headerButton} onPress={handleDone}>
    <Text style={styles.headerButtonText}>Done</Text>
  </TouchableOpacity>
</View>
```

**Header Styling:**

```typescript
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
```

**Header Features:**

- **Three-Column Layout**: [Tools] [Notes] [Done] button arrangement
- **Apple Blue Buttons**: #007AFF color matching iOS design language
- **Minimal Borders**: Subtle bottom border for visual separation
- **Center Title**: "Notes" title centered in header

#### Tools Dropdown System

**Dropdown Implementation:**

```typescript
{
  showToolsDropdown && (
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

      {/* More tools... */}
    </View>
  );
}
```

**Dropdown Styling:**

```typescript
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
```

**Dropdown Features:**

- **Absolute Positioning**: Positioned below Tools button
- **iOS-Native Styling**: Rounded corners, shadows, and borders
- **Auto-Close**: Closes after tool selection
- **Visual Feedback**: Blue text for recently used tools
- **Professional Appearance**: Clean, modern design

#### Keyboard Accessory View

**Keyboard Accessory Implementation:**

```typescript
{
  isKeyboardVisible && (
    <View style={styles.keyboardAccessory}>
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.doneButton} onPress={dismissKeyboard}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Keyboard Accessory Styling:**

```typescript
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
```

**Keyboard Accessory Features:**

- **Conditional Rendering**: Only appears when keyboard is visible
- **Above Keyboard**: Positioned above keyboard using absolute positioning
- **Blue Done Button**: Matches iOS design language
- **Subtle Shadows**: Professional appearance with shadow effects

### Color System

**Color Palette:**

```typescript
const colors = {
  background: "#ffffff", // Clean white background
  text: "#333333", // Dark gray text
  accent: "#007AFF", // Apple blue for buttons
  border: "#e0e0e0", // Light gray borders
  shadow: "#000", // Black shadows with opacity
  accessory: "#f8f9fa", // Light gray accessory background
  active: "#007AFF", // Blue for active tools
};
```

**Color Usage:**

- **Background**: Pure white for clean Apple Notes appearance
- **Text**: Dark gray for optimal readability
- **Accent**: Apple blue for interactive elements
- **Borders**: Light gray for subtle visual separation
- **Shadows**: Black with opacity for depth and professionalism

## Integration Implementation

### EditorScreen Integration

**EditorScreen Implementation:**

```typescript
export const EditorScreen = () => {
  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
    // Save to local storage or sync with backend
  };

  const handleSave = (html: string, text: string) => {
    console.log("Content saved:", { html, text });
    // Handle save logic - backend sync, local storage, etc.
  };

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        initialContent=""
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder="Start writing your note..."
      />
    </SafeAreaView>
  );
};
```

**Integration Features:**

- **Content Monitoring**: Real-time content change handling
- **Save Management**: Centralized save logic handling
- **Safe Area**: Proper safe area handling for all devices
- **Container Styling**: Clean container with proper background color

### Advanced Integration Examples

**Backend Integration:**

```typescript
const EditorScreen = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleContentChange = useCallback((html: string, text: string) => {
    setContent(html);
    // Debounced auto-save to backend
    debouncedSave(html, text);
  }, []);

  const debouncedSave = useCallback(
    debounce(async (html: string, text: string) => {
      try {
        setIsLoading(true);
        await saveNoteToBackend({
          htmlContent: html,
          textContent: text,
          timestamp: Date.now(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000),
    []
  );

  const handleSave = useCallback(async (html: string, text: string) => {
    try {
      setIsLoading(true);
      await saveNoteToBackend({
        htmlContent: html,
        textContent: text,
        timestamp: Date.now(),
      });
      setLastSaved(new Date());
      Alert.alert("Success", "Note saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        initialContent={content}
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder="Start writing your note..."
      />
      {isLoading && <LoadingIndicator />}
      {lastSaved && (
        <Text style={styles.lastSavedText}>
          Last saved: {lastSaved.toLocaleTimeString()}
        </Text>
      )}
    </SafeAreaView>
  );
};
```

**Advanced Integration Features:**

- **Debounced Auto-save**: Automatic saving with debouncing
- **Loading States**: Visual feedback during save operations
- **Last Saved Indicator**: Shows when content was last saved
- **Error Handling**: Comprehensive error handling with user feedback
- **Performance Optimization**: Optimized with useCallback and debounce

## Performance Optimizations

### Rendering Optimizations

**Component Memoization:**

```typescript
export const TenTapEditorNew = React.memo<TenTapEditorNewProps>(
  ({
    initialContent = "",
    onContentChange,
    onSave,
    placeholder = "Start writing your note...",
  }) => {
    // Component implementation
  }
);
```

**Callback Optimization:**

```typescript
const handleContentChange = useCallback((html: string, text: string) => {
  console.log("Content changed:", { html, text });
  // Optimized content change handling
}, []);

const handleSave = useCallback(async (html: string, text: string) => {
  // Optimized save handling
}, []);
```

### Memory Management

**Event Listener Cleanup:**

```typescript
useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
    "keyboardDidShow",
    handleKeyboardShow
  );
  const keyboardDidHideListener = Keyboard.addListener(
    "keyboardDidHide",
    handleKeyboardHide
  );

  return () => {
    keyboardDidHideListener.remove();
    keyboardDidShowListener.remove();
  };
}, []);
```

**Timer Cleanup:**

```typescript
useEffect(() => {
  if (lastUsedTool) {
    const timer = setTimeout(() => {
      setLastUsedTool(null);
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [lastUsedTool]);
```

### Content Optimization

**Debounced Content Updates:**

```typescript
const debouncedContentUpdate = useCallback(
  debounce((html: string, text: string) => {
    if (onContentChange) {
      onContentChange(html, text);
    }
  }, 300),
  [onContentChange]
);
```

**Optimized Content Extraction:**

```typescript
const getContentOptimized = useCallback(async () => {
  try {
    const [htmlContent, textContent] = await Promise.all([
      editor.getHTML(),
      editor.getText(),
    ]);

    return { htmlContent, textContent };
  } catch (error) {
    console.error("Error getting content:", error);
    return { htmlContent: "", textContent: "" };
  }
}, [editor]);
```

## Error Handling System

### Frontend Error Handling

**Content Extraction Errors:**

```typescript
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
    // Fallback to last known content
    if (onContentChange) {
      onContentChange(currentHtmlContent, currentTextContent);
    }
  }
};
```

**Save Error Handling:**

```typescript
const handleSave = async () => {
  try {
    const htmlContent = await editor.getHTML();
    const textContent = await editor.getText();

    if (htmlContent.trim() || textContent.trim()) {
      if (onSave) {
        await onSave(htmlContent, textContent);
      }
      Alert.alert("Note Saved", "Your note has been saved successfully!");
    } else {
      Alert.alert("Nothing to Save", "Please write something first!");
    }
  } catch (error) {
    console.error("Save error:", error);
    Alert.alert("Error", "Failed to save note. Please try again.");
  }
};
```

### Error Recovery

**Retry Logic:**

```typescript
const saveWithRetry = async (html: string, text: string, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await saveNoteToBackend({ htmlContent: html, textContent: text });
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

**Fallback Content:**

```typescript
const getContentWithFallback = async () => {
  try {
    const content = await editor.getHTML();
    return content;
  } catch (error) {
    console.error("Failed to get content:", error);
    return currentHtmlContent || "";
  }
};
```

## Testing and Quality Assurance

### Unit Testing Examples

**Component Testing:**

```typescript
describe("TenTapEditorNew", () => {
  test("renders correctly with initial content", () => {
    const { getByText } = render(
      <TenTapEditorNew initialContent="<p>Test content</p>" />
    );
    expect(getByText("Notes")).toBeTruthy();
  });

  test("calls onContentChange when content changes", async () => {
    const mockOnContentChange = jest.fn();
    const { getByTestId } = render(
      <TenTapEditorNew onContentChange={mockOnContentChange} />
    );

    // Simulate content change
    await act(async () => {
      // Content change simulation
    });

    expect(mockOnContentChange).toHaveBeenCalled();
  });
});
```

**Integration Testing:**

```typescript
describe("EditorScreen Integration", () => {
  test("saves content when Done button is pressed", async () => {
    const mockSave = jest.fn();
    const { getByText } = render(<EditorScreen onSave={mockSave} />);

    fireEvent.press(getByText("Done"));

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
```

### Testing Data

**Mock Content Examples:**

```typescript
const mockContent = {
  html: "<p>This is <strong>bold</strong> text with <em>italic</em> formatting.</p>",
  text: "This is bold text with italic formatting.",
};

const mockFormattedContent = {
  html: "<h1>Heading 1</h1><p>Regular paragraph text.</p><ul><li>List item</li></ul>",
  text: "Heading 1\nRegular paragraph text.\n• List item",
};
```

## Security Considerations

### Content Security

**Input Sanitization:**

```typescript
const sanitizeContent = (html: string): string => {
  // Remove dangerous HTML tags and attributes
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};
```

**Content Validation:**

```typescript
const validateContent = (content: string): boolean => {
  // Check content length
  if (content.length > MAX_CONTENT_LENGTH) {
    return false;
  }

  // Check for malicious patterns
  const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];

  return !maliciousPatterns.some((pattern) => pattern.test(content));
};
```

### Data Protection

**Local Storage Security:**

```typescript
const saveToSecureStorage = async (content: string) => {
  try {
    const encryptedContent = await encryptData(content);
    await SecureStore.setItemAsync("editor_content", encryptedContent);
  } catch (error) {
    console.error("Failed to save to secure storage:", error);
  }
};
```

## Future Enhancements

### Planned Features

#### Advanced Formatting

- **Lists**: Ordered and unordered lists with nested support
- **Tables**: Table creation and editing capabilities
- **Links**: Hyperlink insertion and editing
- **Images**: Image insertion with resizing and positioning
- **Code Blocks**: Syntax-highlighted code blocks
- **Quotes**: Blockquote formatting
- **Alignment**: Text alignment options (left, center, right, justify)

#### Collaboration Features

- **Real-time Collaboration**: Multiple users editing simultaneously
- **Comments**: Inline comments and suggestions
- **Version History**: Track changes and restore previous versions
- **User Permissions**: Read-only, edit, and admin permissions
- **Change Tracking**: Highlight changes and track authorship

#### Export and Import

- **PDF Export**: Convert notes to PDF format
- **Word Export**: Export to Microsoft Word format
- **Markdown Export**: Export to Markdown format
- **HTML Export**: Clean HTML export
- **Import Support**: Import from various formats

#### AI Integration

- **Smart Suggestions**: AI-powered writing suggestions
- **Grammar Check**: Real-time grammar and spelling correction
- **Style Recommendations**: Writing style improvements
- **Auto-formatting**: Intelligent formatting suggestions
- **Content Summarization**: AI-generated summaries

### Technical Improvements

#### Performance Enhancements

- **Virtual Scrolling**: Efficient rendering for large documents
- **Lazy Loading**: Load content sections on demand
- **Caching**: Intelligent content caching
- **Compression**: Content compression for storage
- **Streaming**: Stream large documents progressively

#### Mobile Optimizations

- **Gesture Support**: Swipe, pinch, and pan gestures
- **Voice Input**: Voice-to-text functionality
- **Offline Mode**: Full offline editing capability
- **Push Notifications**: Real-time collaboration notifications
- **Widget Support**: Home screen widgets for quick access

#### Accessibility Improvements

- **Screen Reader Support**: Enhanced screen reader compatibility
- **Keyboard Navigation**: Full keyboard navigation support
- **High Contrast Mode**: Improved visibility options
- **Voice Commands**: Voice-controlled editing
- **Customizable UI**: Adjustable text sizes and colors

## Monitoring and Analytics

### Performance Metrics

**Editor Performance:**

```typescript
const performanceMetrics = {
  loadTime: 0,
  renderTime: 0,
  typingLatency: 0,
  saveTime: 0,
  contentSize: 0,
};

const measurePerformance = (operation: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  performanceMetrics[operation] = duration;
  console.log(`${operation} took ${duration}ms`);
};
```

**Content Analytics:**

```typescript
const contentAnalytics = {
  wordCount: 0,
  characterCount: 0,
  formattingUsage: {
    bold: 0,
    italic: 0,
    underline: 0,
    headings: 0,
  },
  sessionDuration: 0,
  saveFrequency: 0,
};
```

### User Behavior Analytics

**Usage Tracking:**

```typescript
const trackUserAction = (action: string, details?: any) => {
  analytics.track("editor_action", {
    action,
    timestamp: Date.now(),
    details,
  });
};

// Usage examples
trackUserAction("format_text", { type: "bold" });
trackUserAction("save_content", { wordCount: 150 });
trackUserAction("keyboard_shown");
```

**Feature Usage:**

```typescript
const featureUsage = {
  toolsDropdown: 0,
  keyboardAccessory: 0,
  doneButton: 0,
  saveButton: 0,
  formattingTools: {
    bold: 0,
    italic: 0,
    underline: 0,
    strikethrough: 0,
    heading1: 0,
    heading2: 0,
    heading3: 0,
  },
};
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Keyboard Issues

**Problem**: Keyboard overlaps editor content
**Solution**: Adjust `keyboardVerticalOffset` in `KeyboardAvoidingView`

```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  style={styles.contentContainer}
>
```

#### Content Loss

**Problem**: Content disappears on app backgrounding
**Solution**: Implement proper save/restore mechanisms

```typescript
useEffect(() => {
  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === "background") {
      handleSave();
    }
  };

  const subscription = AppState.addEventListener(
    "change",
    handleAppStateChange
  );
  return () => subscription?.remove();
}, []);
```

#### Performance Issues

**Problem**: Lag during typing
**Solution**: Implement debounced content updates

```typescript
const debouncedContentUpdate = useCallback(
  debounce((html: string, text: string) => {
    if (onContentChange) {
      onContentChange(html, text);
    }
  }, 300),
  [onContentChange]
);
```

#### Formatting Issues

**Problem**: Formatting tools not working
**Solution**: Ensure editor is properly initialized

```typescript
useEffect(() => {
  if (editor && editor.isReady) {
    // Editor is ready for formatting operations
  }
}, [editor]);
```

## Usage Examples

### Basic Implementation

```typescript
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { TenTapEditorNew } from "./components/TenTapEditorNew";

const MyApp = () => {
  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
  };

  const handleSave = (html: string, text: string) => {
    console.log("Content saved:", { html, text });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        initialContent="<p>Welcome to the editor!</p>"
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder="Start writing..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
```

### Advanced Implementation with Backend

```typescript
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { TenTapEditorNew } from "./components/TenTapEditorNew";
import { debounce } from "lodash";

const AdvancedEditorScreen = ({ noteId }: { noteId: string }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load initial content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    };

    loadContent();
  }, [noteId]);

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce(async (html: string, text: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            htmlContent: html,
            textContent: text,
          }),
        });

        if (response.ok) {
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000),
    [noteId]
  );

  const handleContentChange = useCallback(
    (html: string, text: string) => {
      setContent(html);
      debouncedSave(html, text);
    },
    [debouncedSave]
  );

  const handleSave = useCallback(
    async (html: string, text: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            htmlContent: html,
            textContent: text,
          }),
        });

        if (response.ok) {
          setLastSaved(new Date());
          Alert.alert("Success", "Note saved successfully!");
        } else {
          throw new Error("Save failed");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to save note");
      } finally {
        setIsLoading(false);
      }
    },
    [noteId]
  );

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        initialContent={content}
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder="Start writing your note..."
      />
      {/* Add loading indicator and last saved timestamp */}
    </SafeAreaView>
  );
};
```

---

_Last updated: December 2024_
_Version: 2.0.0_
_Author: Project Zylith Team_

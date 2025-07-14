# TenTap Editor Integration Guide

## Overview

This document details the implementation of the TenTap rich text editor integration in the React Native app. The implementation creates an Apple Notes-like experience with clean design, formatting tools, and mobile-optimized interactions.

## Core Component: TenTapEditorNew

### Component Structure

```typescript
interface TenTapEditorNewProps {
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onSave?: (html: string, text: string) => void;
  placeholder?: string;
}
```

### Key Dependencies

- `@10play/tentap-editor` - The core TenTap editor library
- `react-native` - Standard React Native components
- `react-native-keyboard-aware-scroll-view` - For keyboard handling

## Core Features Implemented

### 1. Editor Bridge Setup

```typescript
const editor = useEditorBridge({
  autofocus: false,
  avoidIosKeyboard: true,
  initialContent: initialContent || "",
});
```

**Key Configuration:**

- `autofocus: false` - Prevents automatic keyboard appearance
- `avoidIosKeyboard: true` - Handles iOS keyboard positioning
- `initialContent` - Sets starting content from props

### 2. State Management

```typescript
const [currentHtmlContent, setCurrentHtmlContent] = useState("");
const [currentTextContent, setCurrentTextContent] = useState("");
const [isKeyboardVisible, setKeyboardVisible] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [showToolsDropdown, setShowToolsDropdown] = useState(false);
const [lastUsedTool, setLastUsedTool] = useState<string | null>(null);
```

**State Variables:**

- `currentHtmlContent` - Real-time HTML content
- `currentTextContent` - Real-time plain text content
- `isKeyboardVisible` - Keyboard visibility state
- `isEditing` - Editor focus state
- `showToolsDropdown` - Tools dropdown visibility
- `lastUsedTool` - Recently used formatting tool (for visual feedback)

### 3. Content Change Monitoring

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

**Implementation Details:**

- Uses `editor._subscribeToEditorStateUpdate()` for real-time content updates
- Extracts both HTML and plain text versions
- Calls parent component's `onContentChange` callback
- Proper cleanup with unsubscribe function

### 4. Keyboard Management

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

**Features:**

- Tracks keyboard visibility state
- Updates editing state accordingly
- Proper event listener cleanup
- Triggers UI changes (keyboard accessory view)

### 5. Formatting Tools Implementation

#### Core Formatting Functions

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

const toggleHeading1 = () => {
  editor.toggleHeading(1);
  setLastUsedTool("heading1");
  setShowToolsDropdown(false);
};
```

**Available Formatting Options:**

- **Bold** - `editor.toggleBold()`
- **Italic** - `editor.toggleItalic()`
- **Underline** - `editor.toggleUnderline()`
- **Strikethrough** - `editor.toggleStrike()`
- **Heading 1** - `editor.toggleHeading(1)`
- **Heading 2** - `editor.toggleHeading(2)`
- **Heading 3** - `editor.toggleHeading(3)`

#### Visual Feedback System

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

**Features:**

- Shows blue text color for recently used tools
- Auto-clears highlight after 1 second
- Provides immediate visual feedback

### 6. Save Functionality

```typescript
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
```

**Implementation:**

- Extracts current content from editor
- Validates content exists before saving
- Calls parent component's `onSave` callback
- Error handling with user feedback

## UI/UX Design

### Apple Notes-Inspired Design

#### Header Design

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

**Features:**

- Clean three-column layout: [Tools] [Notes] [Done]
- Apple blue (#007AFF) button colors
- Minimal border styling

#### Tools Dropdown

```typescript
{
  showToolsDropdown && (
    <View style={styles.toolsDropdown}>{/* Formatting options */}</View>
  );
}
```

**Features:**

- Positioned absolutely below Tools button
- iOS-native styling with shadows and borders
- Auto-closes after tool selection
- Proper z-index layering

#### Keyboard Accessory View

```typescript
{
  isKeyboardVisible && (
    <View style={styles.keyboardAccessory}>
      <TouchableOpacity style={styles.doneButton} onPress={dismissKeyboard}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Features:**

- Appears only when keyboard is visible
- Positioned above keyboard
- Blue "Done" button for dismissing keyboard
- Subtle shadow and border styling

### Color Scheme

```typescript
const colors = {
  background: "#ffffff", // Clean white background
  text: "#333333", // Dark gray text
  accent: "#007AFF", // Apple blue for buttons
  border: "#e0e0e0", // Light gray borders
  shadow: "#000", // Black shadows with opacity
};
```

## Mobile Optimization

### Keyboard Handling

- `KeyboardAvoidingView` with platform-specific behavior
- `keyboardVerticalOffset` for precise positioning
- `avoidIosKeyboard` option in editor configuration

### Touch Interactions

- `TouchableWithoutFeedback` for dismissing keyboard/dropdown
- `keyboardShouldPersistTaps="handled"` for proper scroll behavior
- `showsVerticalScrollIndicator={false}` for clean appearance

### Performance Optimizations

- Efficient event listener management
- Proper cleanup in useEffect hooks
- Minimal re-renders with targeted state updates

## Integration Example

### Basic Usage in EditorScreen

```typescript
export const EditorScreen = () => {
  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
    // Save to local storage or sync with backend
  };

  const handleSave = (html: string, text: string) => {
    console.log("Content saved:", { html, text });
    // Handle save logic
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

### Advanced Integration with Backend

```typescript
const [content, setContent] = useState("");

const handleContentChange = useCallback((html: string, text: string) => {
  setContent(html);
  // Debounced auto-save
  debouncedSave(html, text);
}, []);

const handleSave = useCallback(async (html: string, text: string) => {
  try {
    await saveNoteToBackend({
      htmlContent: html,
      textContent: text,
      timestamp: Date.now(),
    });
    showSuccessMessage("Note saved successfully!");
  } catch (error) {
    showErrorMessage("Failed to save note");
  }
}, []);
```

## Best Practices

### 1. State Management

- Use proper cleanup in useEffect hooks
- Implement debouncing for frequent content changes
- Handle loading states for async operations

### 2. Error Handling

- Wrap editor operations in try-catch blocks
- Provide user-friendly error messages
- Implement retry mechanisms for failed saves

### 3. Performance

- Use React.memo for expensive components
- Implement virtualization for large content
- Optimize re-renders with useMemo and useCallback

### 4. Accessibility

- Add proper accessibility labels
- Ensure keyboard navigation works
- Test with screen readers

## Common Issues and Solutions

### 1. Keyboard Overlap

**Problem:** Keyboard overlaps editor content
**Solution:** Use `KeyboardAvoidingView` with proper offset values

### 2. Content Loss

**Problem:** Content disappears on component unmount
**Solution:** Implement proper save/restore mechanisms

### 3. Performance Issues

**Problem:** Lag during typing
**Solution:** Debounce content change callbacks

### 4. iOS vs Android Differences

**Problem:** Different keyboard behaviors
**Solution:** Use platform-specific configurations

## Future Enhancements

### Planned Features

- [ ] Auto-save functionality
- [ ] Rich media support (images, links)
- [ ] Export options (PDF, HTML)
- [ ] Collaboration features
- [ ] Offline sync capabilities

### Technical Improvements

- [ ] Better error handling
- [ ] Performance optimizations
- [ ] Enhanced accessibility
- [ ] Unit test coverage
- [ ] Integration tests

## References

- [TenTap Editor Documentation](https://github.com/10play/tentap-editor)
- [React Native Keyboard Handling](https://reactnative.dev/docs/keyboardavoidingview)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

_Last updated: [Current Date]_
_Version: 1.0.0_
_Author: [Your Name]_

# Note Management System - Renaissance MVP

## 📝 Overview

The Note Management System is the core feature of Renaissance, providing users with a powerful, AI-enhanced note-taking experience. This system combines rich text editing, intelligent organization, and seamless integration with the galaxy system.

---

## 🏗️ Architecture Overview

### Note System Flow

```
Note Creation → Rich Text Editor → Content Storage → Galaxy Assignment → AI Insights → Task Generation
```

### Key Components

- **TenTap Editor**: Advanced rich text editing
- **Galaxy Organization**: AI-powered note categorization
- **Real-time Saving**: Auto-save functionality
- **AI Integration**: Intelligent insights and task generation
- **Cross-platform**: Works on iOS and Android

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── EditorScreen.tsx           # Main note editor screen
│   ├── TenTapEditorNew.tsx        # Rich text editor component
│   ├── NoteInsightModal.tsx       # AI insights display
│   └── HomeScreen.tsx             # Note overview with stars
├── adapters/
│   └── noteAdapters.ts            # Note API communication
└── types/
    └── types.ts                   # Note type definitions

backend/
├── controllers/
│   └── noteControllers.ts         # Note CRUD operations
├── database/
│   └── migrations/
│       └── 20240101000003_create_notes_table.ts
└── src/
    └── services/
        └── noteService.ts         # Note business logic
```

---

## 🗄️ Database Schema

### Notes Table

**Location**: `backend/database/migrations/20240101000003_create_notes_table.ts`

```typescript
exports.up = function (knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("galaxy_id")
      .nullable()
      .references("id")
      .inTable("galaxies")
      .onDelete("SET NULL");
    table.string("title", 255).notNullable();
    table.text("content").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at");
  });
};
```

**Key Features**:

- **User association**: Each note belongs to a user
- **Galaxy assignment**: Optional galaxy categorization
- **Rich content**: Text field for HTML content
- **Timestamps**: Creation and update tracking

---

## 🔧 Backend Implementation

### 1. Note Controllers

**Location**: `backend/controllers/noteControllers.ts`

#### Create Note

```typescript
export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, galaxy_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Note title is required" });
    }

    const [newNote] = await knex("notes")
      .insert({
        user_id: req.session.userId,
        title,
        content: content || "",
        galaxy_id: galaxy_id || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    console.log("✨ Created note:", newNote);
    res.status(201).json(newNote);
  } catch (error) {
    console.error("❌ Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};
```

#### Get User Notes

```typescript
export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notes = await knex("notes")
      .select("*")
      .where({ user_id: req.session.userId })
      .orderBy("updated_at", "desc");

    console.log("📡 Fetched notes:", notes.length);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};
```

#### Update Note

```typescript
export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, galaxy_id } = req.body;

    const [updatedNote] = await knex("notes")
      .where({ id: parseInt(id), user_id: req.session.userId })
      .update({
        title: title || undefined,
        content: content || undefined,
        galaxy_id: galaxy_id !== undefined ? galaxy_id : undefined,
        updated_at: new Date(),
      })
      .returning("*");

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("🔄 Updated note:", updatedNote);
    res.json(updatedNote);
  } catch (error) {
    console.error("❌ Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};
```

#### Delete Note

```typescript
export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCount = await knex("notes")
      .where({ id: parseInt(id), user_id: req.session.userId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("🗑️ Deleted note:", id);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
```

### 2. Note Service Layer

**Location**: `backend/src/services/noteService.ts`

```typescript
export class NoteService {
  static async getNotesByUserId(userId: number): Promise<Note[]> {
    return await knex("notes")
      .where({ user_id: userId })
      .orderBy("updated_at", "desc");
  }

  static async getNotesByGalaxyId(
    galaxyId: number,
    userId: number
  ): Promise<Note[]> {
    return await knex("notes")
      .where({ galaxy_id: galaxyId, user_id: userId })
      .orderBy("updated_at", "desc");
  }

  static async createNote(noteData: CreateNoteRequest): Promise<Note> {
    const [note] = await knex("notes")
      .insert({
        ...noteData,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning("*");
    return note;
  }

  static async updateNote(
    id: number,
    noteData: UpdateNoteRequest,
    userId: number
  ): Promise<Note> {
    const [note] = await knex("notes")
      .where({ id, user_id: userId })
      .update({
        ...noteData,
        updated_at: db.fn.now(),
      })
      .returning("*");
    return note;
  }
}
```

---

## 📱 Frontend Implementation

### 1. Note Adapters

**Location**: `frontend/adapters/noteAdapters.ts`

```typescript
export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  galaxy_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export const getNotes = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.LIST}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Get notes error:", error);
    throw error;
  }
};

export const createNote = async (noteData: {
  title: string;
  galaxy_id?: number | null;
}) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.CREATE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(noteData),
    });
  } catch (error) {
    console.error("Create note error:", error);
    throw error;
  }
};

export const updateNote = async (
  id: number,
  noteData: { title?: string; content?: string; galaxy_id?: number | null }
) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.UPDATE(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(noteData),
    });
  } catch (error) {
    console.error("Update note error:", error);
    throw error;
  }
};

export const deleteNote = async (id: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.NOTES.DELETE(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    throw error;
  }
};
```

### 2. Editor Screen

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

### 3. Rich Text Editor Integration

**Location**: `frontend/components/TenTapEditorNew.tsx`

```typescript
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
    const [currentHtmlContent, setCurrentHtmlContent] = useState("");
    const [currentTextContent, setCurrentTextContent] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showToolsDropdown, setShowToolsDropdown] = useState(false);

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

    // Paste functionality
    const handlePaste = async () => {
      try {
        const text = await Clipboard.getString();
        if (text) {
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

---

## 🌟 Home Screen Note Display

### Star-based Note Visualization

**Location**: `frontend/components/HomeScreen.tsx`

```typescript
const renderNoteStar = (note: NoteWithPosition, index: number) => {
  const animatedValues = starAnimations[index] || {
    opacity: new Animated.Value(0.7),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
  };

  return (
    <Animated.View
      key={note.id}
      style={[
        styles.noteStar,
        {
          left: note.position.x,
          top: note.position.y,
          opacity: animatedValues.opacity,
          transform: [
            { translateX: animatedValues.translateX },
            { translateY: animatedValues.translateY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.starButton}
        onPress={() => handleNotePress(note)}
        onLongPress={() => handleNoteLongPress(note)}
        activeOpacity={0.8}
      >
        <Ionicons name="star" size={24} color={currentPalette.quaternary} />
        <Text style={[styles.starLabel, { color: currentPalette.quinary }]}>
          {note.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### Long Press to Delete

```typescript
const handleNoteLongPress = (note: NoteWithPosition) => {
  const timer = setTimeout(() => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${note.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteNote(note),
        },
      ]
    );
  }, 3000);

  setLongPressTimer(timer);
  setLongPressNote(note);
};

const handleDeleteNote = async (note: NoteWithPosition) => {
  try {
    const response = await deleteNote(note.id);
    if (response.ok) {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));
      setFilteredNotes((prevNotes) =>
        prevNotes.filter((n) => n.id !== note.id)
      );
      Alert.alert("Success", "Note deleted successfully");
    } else {
      Alert.alert("Error", "Failed to delete note");
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    Alert.alert("Error", "Failed to delete note");
  }
};
```

---

## 🤖 AI Integration Features

### 1. Note Insights

**Location**: `frontend/components/NoteInsightModal.tsx`

```typescript
const handleInsight = async () => {
  try {
    setLoading(true);

    const response = await generateNoteInsight({
      note: currentNote,
      galaxy: galaxy,
      relatedNotes: relatedNotes,
    });

    if (response.ok) {
      const data = await response.json();
      const insightData = JSON.parse(data.result);
      setInsightData(insightData);
    }
  } catch (error) {
    console.error("Error generating insight:", error);
    Alert.alert("Error", "Failed to generate insight");
  } finally {
    setLoading(false);
  }
};
```

### 2. Task Generation from Insights

```typescript
const handleAddToTodo = async (action: string, description: string) => {
  try {
    const shortAction =
      action.length > 50 ? action.substring(0, 50) + "..." : action;

    let goal = "Note Action";
    if (note?.title) {
      goal = note.title;
    } else if (galaxy?.name) {
      goal = galaxy.name;
    }

    const response = await createTask({
      content: shortAction,
      goal: goal,
      is_completed: false,
      is_ai_generated: true,
      is_favorite: false,
    });

    if (response.ok) {
      Alert.alert("Success", "Task added to your todo list!");
    }
  } catch (error) {
    console.error("Error adding task to todo:", error);
    Alert.alert("Error", "Failed to add task to todo list");
  }
};
```

---

## 🎨 UI/UX Features

### 1. Cosmic Theme Integration

- **Dark theme** with cosmic color palette
- **Animated stars** for note visualization
- **Smooth transitions** and micro-interactions
- **Responsive design** for all screen sizes

### 2. Rich Text Editing

- **Formatting tools**: Bold, italic, headings, lists
- **Paste functionality** for external content
- **Auto-save** with real-time content updates
- **Keyboard optimization** for mobile devices

### 3. Note Organization

- **Galaxy categorization** with AI assistance
- **Visual star layout** with collision avoidance
- **Search and filtering** capabilities
- **Drag and drop** for manual organization

---

## 🚀 API Endpoints

### Note Routes

```typescript
// backend/src/index.ts
app.get("/api/notes", checkAuthentication, noteControllers.getNotes);
app.post("/api/notes", checkAuthentication, noteControllers.createNote);
app.get("/api/notes/:id", checkAuthentication, noteControllers.getNoteById);
app.put("/api/notes/:id", checkAuthentication, noteControllers.updateNote);
app.delete("/api/notes/:id", checkAuthentication, noteControllers.deleteNote);
```

---

## 🔄 Data Flow

### 1. Note Creation

```
User taps "New Note" → Title prompt → Editor opens → Content editing → Auto-save → Galaxy assignment
```

### 2. Note Editing

```
User opens note → Content loads → Real-time editing → Auto-save → Content updates
```

### 3. Note Organization

```
User generates galaxies → AI analyzes notes → Galaxy creation → Note assignment → Visual update
```

### 4. Note Insights

```
User requests insight → AI analyzes content → Structured insights → Modal display → Task generation
```

---

## 🐛 Common Issues and Solutions

### 1. Content Not Saving

**Problem**: Note content disappears after app restart
**Solution**: Check auto-save implementation and API calls

### 2. Editor Performance

**Problem**: Slow typing or lag in editor
**Solution**: Optimize content change listeners and debounce updates

### 3. Galaxy Assignment

**Problem**: Notes not appearing in correct galaxies
**Solution**: Verify galaxy_id updates and refresh logic

### 4. AI Insights

**Problem**: Insights not generating or showing errors
**Solution**: Check API key configuration and prompt formatting

---

## 🚀 Future Enhancements

### Planned Features

1. **Collaborative Editing**: Real-time multi-user editing
2. **Version History**: Track note changes over time
3. **Advanced Formatting**: Tables, images, code blocks
4. **Note Templates**: Pre-built note structures
5. **Export Options**: PDF, Markdown, Word export

### Technical Improvements

1. **Offline Support**: Local storage and sync
2. **Search Enhancement**: Full-text search with filters
3. **Performance Optimization**: Virtual scrolling for large note lists
4. **Accessibility**: Screen reader support and keyboard navigation

---

## 📚 Learning Resources

- [TenTap Editor Documentation](https://github.com/10play/tentap-editor)
- [React Native Rich Text](https://reactnative.dev/docs/text)
- [Express.js CRUD Operations](https://expressjs.com/en/guide/routing.html)
- [SQLite with Knex.js](https://knexjs.org/)

---

_The Note Management System provides the foundation for Renaissance's note-taking capabilities. Its integration with AI and the galaxy system creates a unique, intelligent note-taking experience._

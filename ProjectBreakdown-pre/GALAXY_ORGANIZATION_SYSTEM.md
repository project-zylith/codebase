# Galaxy Organization System - Renaissance MVP

## 🌌 Overview

The Galaxy Organization System is Renaissance's unique approach to note organization, using AI to automatically group related notes into themed "galaxies." This system provides intelligent content organization while maintaining a beautiful cosmic visual metaphor.

---

## 🏗️ Architecture Overview

### Galaxy System Flow

```
Notes Collection → AI Analysis → Galaxy Generation → Note Assignment → Visual Display → User Navigation
```

### Key Components

- **AI-Powered Organization**: Automatic note grouping using Google Generative AI
- **Visual Star Layout**: Cosmic-themed note display with collision avoidance
- **Galaxy Navigation**: Swipe-based navigation between galaxies
- **Manual Override**: User control over galaxy assignments
- **Real-time Updates**: Dynamic reorganization and refresh

---

## 📁 File Structure

```
frontend/
├── components/
│   ├── HomeScreen.tsx             # Main galaxy view with stars
│   ├── AIGalaxyModal.tsx          # AI galaxy generation modal
│   ├── GalaxyView.tsx             # Galaxy detail view
│   └── AppNavigator.tsx           # Navigation with galaxy support
├── adapters/
│   └── galaxyAdapters.ts          # Galaxy API communication
└── types/
    └── types.ts                   # Galaxy type definitions

backend/
├── controllers/
│   └── galaxyControllers.ts       # Galaxy CRUD operations
├── database/
│   └── migrations/
│       └── 20240101000002_create_galaxies_table.ts
├── src/
│   └── aiServices/
│       └── galaxyAi.ts            # AI galaxy generation logic
└── services/
    └── galaxyService.ts           # Galaxy business logic
```

---

## 🗄️ Database Schema

### Galaxies Table

**Location**: `backend/database/migrations/20240101000002_create_galaxies_table.ts`

```typescript
exports.up = function (knex) {
  return knex.schema.createTable("galaxies", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("name", 100).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
};
```

**Key Features**:

- **User association**: Each galaxy belongs to a user
- **Name field**: Descriptive galaxy names (e.g., "Programming Projects", "Personal Goals")
- **Timestamps**: Creation tracking for organization

### Notes-Galaxy Relationship

Notes are linked to galaxies through the `galaxy_id` foreign key in the notes table:

```typescript
// In notes table migration
table
  .integer("galaxy_id")
  .nullable()
  .references("id")
  .inTable("galaxies")
  .onDelete("SET NULL");
```

---

## 🔧 Backend Implementation

### 1. Galaxy Controllers

**Location**: `backend/controllers/galaxyControllers.ts`

#### Generate Galaxies with AI

```typescript
export const generateGalaxies = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log(
      "🚀 Starting AI galaxy generation for user:",
      req.session.userId
    );

    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      res.status(400).json({
        error: "Notes array is required and must not be empty",
      });
      return;
    }

    console.log(`📝 Processing ${notes.length} notes for galaxy generation`);

    // Clear existing galaxies and reset note assignments
    await knex("notes")
      .where({ user_id: req.session.userId })
      .update({ galaxy_id: null });

    const deletedGalaxies = await knex("galaxies")
      .where({ user_id: req.session.userId })
      .del();

    console.log(`🗑️ Deleted ${deletedGalaxies} existing galaxies`);

    // Call AI service to generate galaxies
    const aiResponse = await galaxyAi.generateGalaxiesWithAI(notes);

    if (!aiResponse || !Array.isArray(aiResponse)) {
      res.status(500).json({
        error: "Zylith failed to generate valid galaxy structure",
      });
      return;
    }

    console.log(`🤖 Zylith generated ${aiResponse.length} galaxies`);

    const results = [];
    const errors = [];

    // Process each galaxy from AI response
    for (const [galaxyIndex, galaxyData] of aiResponse.entries()) {
      try {
        const [galaxyName, galaxyNotes] = galaxyData;

        if (!galaxyName || !Array.isArray(galaxyNotes)) {
          console.warn(
            `⚠️ Invalid galaxy data at index ${galaxyIndex}:`,
            galaxyData
          );
          continue;
        }

        console.log(
          `🌌 Creating galaxy "${galaxyName}" with ${galaxyNotes.length} notes`
        );

        // Create the galaxy in database
        const [newGalaxy] = await knex("galaxies")
          .insert({
            user_id: req.session.userId,
            name: galaxyName,
            created_at: new Date(),
          })
          .returning("*");

        console.log(`✨ Created galaxy with ID: ${newGalaxy.id}`);

        // Update notes to assign them to this galaxy
        const noteIds = [];
        const noteTitles = [];

        for (const [noteTitle, noteContent] of galaxyNotes) {
          const [updatedNote] = await knex("notes")
            .where({
              user_id: req.session.userId,
              title: noteTitle,
            })
            .update({ galaxy_id: newGalaxy.id })
            .returning("*");

          if (updatedNote) {
            noteIds.push(updatedNote.id);
            noteTitles.push(noteTitle);
            console.log(
              `✅ Successfully assigned note "${noteTitle}" to galaxy "${galaxyName}"`
            );
          } else {
            console.warn(`❌ Could not find note: "${noteTitle}"`);
          }
        }

        results.push({
          galaxy: newGalaxy,
          assignedNotes: noteIds.length,
          noteTitles: noteTitles,
          galaxyName: galaxyName,
        });
      } catch (error) {
        console.error(`❌ Error processing galaxy ${galaxyIndex}:`, error);
        errors.push({
          galaxyIndex,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Get summary of what was cleaned up
    const notesWithoutGalaxy = await knex("notes")
      .where({ user_id: req.session.userId, galaxy_id: null })
      .count("* as count")
      .first();

    res.status(200).json({
      success: true,
      galaxiesCreated: results.length,
      totalGalaxies: aiResponse.length,
      previousGalaxiesDeleted: deletedGalaxies,
      notesWithoutGalaxy: notesWithoutGalaxy?.count || 0,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Error in generateGalaxies:", error);
    res.status(500).json({
      error: "Failed to generate galaxies",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
```

#### Get User Galaxies

```typescript
export const getGalaxies = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const galaxies = await knex("galaxies")
      .select("*")
      .where({ user_id: req.session.userId })
      .orderBy("created_at", "desc");

    console.log("📡 Fetched galaxies:", galaxies);
    res.json(galaxies);
  } catch (error) {
    console.error("❌ Error fetching galaxies:", error);
    res.status(500).json({ error: "Failed to fetch galaxies" });
  }
};
```

#### Get Galaxy Notes

```typescript
export const getGalaxyNotes = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "User must be authenticated" });
    return;
  }

  try {
    const { id } = req.params;

    // First verify the galaxy belongs to the user
    const galaxy = await knex("galaxies")
      .select("*")
      .where({ id: parseInt(id), user_id: req.session.userId })
      .first();

    if (!galaxy) {
      res.status(404).json({ error: "Galaxy not found" });
      return;
    }

    // Get notes in this galaxy
    const notes = await knex("notes")
      .select("*")
      .where({ galaxy_id: parseInt(id), user_id: req.session.userId })
      .orderBy("created_at", "desc");

    console.log(`📚 Fetched ${notes.length} notes for galaxy:`, galaxy.name);
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching galaxy notes:", error);
    res.status(500).json({ error: "Failed to fetch galaxy notes" });
  }
};
```

### 2. AI Galaxy Generation

**Location**: `backend/src/aiServices/galaxyAi.ts`

````typescript
const generateGalaxyPrompt = `You are Zylith, an AI assistant inside of a note taking/todo app. Your job is to create "galaxies", which are collections of related notes that help users organize their thoughts.

You will be provided all of the notes with their title and content inside of a nested array: [[title, content], [title, content], [title, content], ...]

Your task is to analyze the notes and create logical groupings. For each group, provide:
1. A clear, descriptive name for the galaxy (e.g., "Programming Projects", "Personal Goals", "Learning Notes")
2. The notes that belong in that group

Return your response as a nested array in this exact format:
[[galaxyName, [[title, content], [title, content], ...]], [galaxyName, [[title, content], ...]], ...]

Guidelines for creating galaxies:
- Group notes that are conceptually related or work toward similar goals
- Use descriptive, user-friendly names that clearly indicate the theme
- Aim for 2-5 galaxies total (unless you have very few notes)
- Each galaxy should have at least 2 notes (unless you have very few notes total)
- Consider both the title and content when determining relationships
- Examples of good groupings:
  * Programming notes + App development notes → "Software Development"
  * Gym notes + Nutrition notes → "Health & Fitness"
  * Travel plans + Budget notes → "Travel Planning"
  * Work goals + Career notes → "Career Development"

Make sure your response is valid JSON that can be parsed directly.`;

export const generateGalaxiesWithAI = async (
  notes: [string, string][]
): Promise<[string, [string, string][]][]> => {
  try {
    console.log(
      "🤖 Calling AI to generate galaxies for",
      notes.length,
      "notes"
    );

    if (!API_KEY) {
      console.error("❌ API_KEY not found! Using mock response for testing.");
      return [
        [
          "Programming",
          [
            [
              "AI-Powered Task Manager Notes",
              "Working on a smart task management system...",
            ],
            [
              "Collaborative Mind Mapping Tool Notes",
              "Developing a real-time collaborative mind mapping tool...",
            ],
          ],
        ],
        [
          "Personal Projects",
          [
            [
              "Indoor Garden Monitoring Notes",
              "Researching IoT sensors to monitor soil moisture...",
            ],
            [
              "Mobile App for Plant Care Notes",
              "Designing an app that helps users care for their plants...",
            ],
          ],
        ],
      ];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the prompt with the notes data
    const fullPrompt = `${generateGalaxyPrompt}\n\nHere are the notes to organize:\n${JSON.stringify(
      notes
    )}`;

    console.log(
      "🤖 Sending prompt to AI:",
      fullPrompt.substring(0, 200) + "..."
    );

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    console.log("🤖 AI Response:", response);

    // Parse the AI response
    try {
      let responseToParse = response;

      // Handle markdown-wrapped JSON responses
      if (response.includes("```json")) {
        responseToParse = response
          .replace(/```json\s*/, "")
          .replace(/\s*```/, "");
      } else if (response.includes("```")) {
        responseToParse = response.replace(/```\s*/, "").replace(/\s*```/, "");
      }

      const parsedResponse = JSON.parse(responseToParse);

      if (Array.isArray(parsedResponse)) {
        console.log(
          "✅ Successfully parsed Zylith response into",
          parsedResponse.length,
          "galaxies"
        );
        return parsedResponse;
      } else {
        console.error("❌ Zylith response is not an array:", parsedResponse);
        throw new Error("Zylith response is not in expected array format");
      }
    } catch (parseError) {
      console.error("❌ Failed to parse Zylith response as JSON:", parseError);
      console.log("Raw Zylith response:", response);

      // Fallback: create a single galaxy with all notes
      console.log("🔄 Creating fallback galaxy with all notes");
      return [["General Notes", notes]];
    }
  } catch (error) {
    console.error("❌ Error in generateGalaxiesWithAI:", error);
    throw error;
  }
};
````

---

## 📱 Frontend Implementation

### 1. Galaxy Adapters

**Location**: `frontend/adapters/galaxyAdapters.ts`

```typescript
export interface Galaxy {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
}

export const getGalaxies = async () => {
  try {
    return await fetch(`${API_ENDPOINTS.GALAXIES.LIST}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Get galaxies error:", error);
    throw error;
  }
};

export const generateGalaxies = async (notes: any[]) => {
  try {
    return await fetch(`${API_ENDPOINTS.GALAXIES.GENERATE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notes }),
    });
  } catch (error) {
    console.error("Generate galaxies error:", error);
    throw error;
  }
};

export const getGalaxyNotes = async (galaxyId: number) => {
  try {
    return await fetch(`${API_ENDPOINTS.GALAXIES.NOTES(galaxyId)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Get galaxy notes error:", error);
    throw error;
  }
};
```

### 2. Home Screen with Galaxy Navigation

**Location**: `frontend/components/HomeScreen.tsx`

```typescript
export const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentPalette } = useTheme();
  const { state: userState } = useUser();
  const [notes, setNotes] = useState<NoteWithPosition[]>([]);
  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [currentGalaxyIndex, setCurrentGalaxyIndex] = useState(-1); // -1 means home view
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPosition[]>([]);

  // Load galaxies from API
  useEffect(() => {
    const loadGalaxies = async () => {
      try {
        const response = await getGalaxies();
        if (response.ok) {
          const galaxiesData = await response.json();
          setGalaxies(galaxiesData);
        } else {
          console.error("Failed to load galaxies");
        }
      } catch (error) {
        console.error("Error loading galaxies:", error);
      }
    };

    if (userState.user) {
      loadGalaxies();
    }
  }, [userState.user, galaxyRefreshTrigger]);

  // Filter notes by current galaxy
  useEffect(() => {
    if (currentGalaxyIndex === -1) {
      // Home view - show all notes
      setFilteredNotes(notes);
    } else if (galaxies.length > 0 && notes.length > 0) {
      const currentGalaxy = galaxies[currentGalaxyIndex];
      if (currentGalaxy) {
        const galaxyNotes = notes.filter(
          (note) => note.galaxy_id === currentGalaxy.id
        );
        // Regenerate positions for the filtered notes, avoiding overlaps
        const notesWithNewPositions: NoteWithPosition[] = [];
        const existingPositions: { x: number; y: number }[] = [];

        galaxyNotes.forEach((note, index) => {
          const position = generateStarPosition(
            index,
            Math.max(galaxyNotes.length, 8),
            existingPositions
          );
          existingPositions.push(position);
          notesWithNewPositions.push({
            ...note,
            position,
          });
        });

        setFilteredNotes(notesWithNewPositions);
      } else {
        setFilteredNotes(notes); // Show all notes if no galaxy selected
      }
    } else {
      setFilteredNotes(notes); // Show all notes if no galaxies
    }
  }, [galaxies, currentGalaxyIndex, notes]);

  // Carousel navigation functions
  const nextGalaxy = () => {
    if (currentGalaxyIndex === -1 && galaxies.length > 0) {
      // From home to first galaxy
      setCurrentGalaxyIndex(0);
    } else if (
      currentGalaxyIndex >= 0 &&
      currentGalaxyIndex < galaxies.length - 1
    ) {
      // To next galaxy
      setCurrentGalaxyIndex((prev) => prev + 1);
    }
  };

  const previousGalaxy = () => {
    if (currentGalaxyIndex === 0) {
      // From first galaxy back to home
      setCurrentGalaxyIndex(-1);
    } else if (currentGalaxyIndex > 0) {
      // To previous galaxy
      setCurrentGalaxyIndex((prev) => prev - 1);
    }
  };

  const getCurrentGalaxyName = () => {
    if (currentGalaxyIndex === -1) return "Renaissance";
    if (galaxies.length === 0) return "Renaissance";
    return galaxies[currentGalaxyIndex]?.name || "Renaissance";
  };

  // Double-tap navigation handlers
  const lastTapTime = useRef(0);
  const doubleTapDelay = 300; // milliseconds

  const handleLeftSideTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime.current;

    if (timeDiff < doubleTapDelay) {
      // Double tap detected
      console.log("Left side double-tapped");
      previousGalaxy();
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      // Single tap - just update the time
      lastTapTime.current = now;
    }
  };

  const handleRightSideTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime.current;

    if (timeDiff < doubleTapDelay) {
      // Double tap detected
      console.log("Right side double-tapped");
      nextGalaxy();
      lastTapTime.current = 0; // Reset to prevent triple tap
    } else {
      // Single tap - just update the time
      lastTapTime.current = now;
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text
              style={[styles.headerTitle, { color: currentPalette.quinary }]}
            >
              {getCurrentGalaxyName()}
            </Text>
            <Text style={[styles.subheader, { color: currentPalette.quinary }]}>
              Welcome back, {userState.user?.username}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={handleGalaxyButtonPress}
              activeOpacity={0.8}
            >
              <Ionicons
                name={currentGalaxyIndex === -1 ? "planet" : "list"}
                size={20}
                color={currentPalette.tertiary}
              />
            </TouchableOpacity>

            {/* Only show AI generation button on home view */}
            {currentGalaxyIndex === -1 && (
              <TouchableOpacity
                style={[
                  styles.headerButton,
                  { backgroundColor: currentPalette.quaternary },
                ]}
                onPress={() => setShowAIModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="bulb"
                  size={20}
                  color={currentPalette.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cosmic Note Space */}
        <View style={styles.cosmicSpace}>
          {/* Render note stars */}
          {filteredNotes.map((note, index) => renderNoteStar(note, index))}

          {/* Central New Note Button */}
          <View style={styles.centralButtonContainer}>
            <TouchableOpacity
              style={[
                styles.centralButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={handleNewNote}
              activeOpacity={0.9}
            >
              <View style={styles.buttonInner}>
                <Ionicons
                  name="add"
                  size={32}
                  color={currentPalette.tertiary}
                />
                <Text
                  style={[
                    styles.buttonText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  New Note
                </Text>
              </View>
            </TouchableOpacity>

            {/* Cosmic ring effect */}
            <View
              style={[
                styles.cosmicRing,
                { borderColor: currentPalette.accent },
              ]}
            />
          </View>
        </View>

        {/* Double-tap Navigation Areas */}
        <TouchableOpacity
          style={styles.leftTapArea}
          onPress={handleLeftSideTap}
          activeOpacity={0.1}
        />
        <TouchableOpacity
          style={styles.rightTapArea}
          onPress={handleRightSideTap}
          activeOpacity={0.1}
        />

        {/* Swipe Indicators */}
        {galaxies.length > 0 && (
          <View style={styles.swipeIndicators}>
            <View style={styles.swipeIndicator}>
              <Ionicons
                name="chevron-back"
                size={16}
                color={currentPalette.quinary}
              />
              <Text
                style={[styles.swipeText, { color: currentPalette.quinary }]}
              >
                {currentGalaxyIndex === -1 ? "Home" : "Previous"}
              </Text>
            </View>
            <View style={styles.swipeIndicator}>
              <Text
                style={[styles.swipeText, { color: currentPalette.quinary }]}
              >
                {currentGalaxyIndex === -1
                  ? "Swipe to galaxies"
                  : `${currentGalaxyIndex + 1} of ${galaxies.length}`}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={currentPalette.quinary}
              />
            </View>
          </View>
        )}

        {/* AI Galaxy Modal */}
        <ZylithGalaxyModal
          visible={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGalaxiesGenerated={handleGalaxiesGenerated}
        />
      </View>
    </SafeAreaView>
  );
};
```

### 3. AI Galaxy Generation Modal

**Location**: `frontend/components/AIGalaxyModal.tsx`

```typescript
export const ZylithGalaxyModal: React.FC<ZylithGalaxyModalProps> = ({
  visible,
  onClose,
  onGalaxiesGenerated,
}) => {
  const { currentPalette } = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [galaxies, setGalaxies] = useState<GalaxyPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateGalaxies = async () => {
    try {
      setLoading(true);
      setLoadingStep("Fetching your notes...");

      // Step 1: Fetch all user notes
      const notesResponse = await getNotes();
      if (!notesResponse.ok) {
        throw new Error("Failed to fetch notes");
      }

      const notes: Note[] = await notesResponse.json();
      console.log(`📝 Found ${notes.length} notes to organize`);

      if (notes.length === 0) {
        Alert.alert(
          "No Notes",
          "You need to create some notes first before generating galaxies!"
        );
        setLoading(false);
        return;
      }

      setLoadingStep("Analyzing your notes with Zylith...");

      // Step 2: Prepare notes for AI
      const notesForAI = notes.map((note) => [
        note.title,
        note.content?.replace(/<[^>]*>/g, "") || "", // Strip HTML tags
      ]);

      // Step 3: Generate galaxies with AI
      const response = await generateGalaxies(notesForAI);
      if (!response.ok) {
        throw new Error("Failed to generate galaxies");
      }

      const result = await response.json();
      console.log("🌌 Galaxy generation result:", result);

      if (result.success) {
        setGalaxies(
          result.results.map((r: any) => ({
            name: r.galaxyName,
            notes: r.noteTitles,
          }))
        );
        setShowPreview(true);
      } else {
        throw new Error(result.error || "Failed to generate galaxies");
      }
    } catch (error) {
      console.error("❌ Error generating galaxies:", error);
      Alert.alert(
        "Generation Failed",
        "Zylith couldn't organize your notes. Please try again or create more notes first."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyGalaxies = () => {
    Alert.alert(
      "Apply Galaxies",
      "This will replace your current galaxy organization. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          onPress: () => {
            onGalaxiesGenerated();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Drag Indicator */}
        <View style={styles.dragIndicator}>
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: currentPalette.quinary },
            ]}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Zylith Galaxy Generator
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!showPreview ? (
            // Generation View
            <View style={styles.introSection}>
              <Ionicons
                name="bulb"
                size={80}
                color={currentPalette.quaternary}
                style={styles.bulbIcon}
              />
              <Text
                style={[styles.introText, { color: currentPalette.tertiary }]}
              >
                Let Zylith organize your notes into themed galaxies!
              </Text>
              <Text
                style={[styles.description, { color: currentPalette.quinary }]}
              >
                Zylith will analyze your notes and group them into meaningful
                collections based on their content and themes.
              </Text>

              {loading ? (
                <View style={styles.loadingSection}>
                  <ActivityIndicator
                    size="large"
                    color={currentPalette.quaternary}
                    style={styles.spinner}
                  />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {loadingStep || "Generating galaxies..."}
                  </Text>
                  <Text
                    style={[
                      styles.loadingSubtext,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Zylith is analyzing your notes and creating themed
                    collections
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    { backgroundColor: currentPalette.quaternary },
                  ]}
                  onPress={handleGenerateGalaxies}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={currentPalette.tertiary}
                  />
                  <Text
                    style={[
                      styles.generateButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Generate Galaxies
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Preview View
            <View style={styles.previewSection}>
              <Text
                style={[
                  styles.previewTitle,
                  { color: currentPalette.tertiary },
                ]}
              >
                Your New Galaxies
              </Text>
              <Text
                style={[
                  styles.previewSubtitle,
                  { color: currentPalette.quinary },
                ]}
              >
                Zylith has organized your notes into {galaxies.length} themed
                collections:
              </Text>

              {galaxies.map((galaxy, index) => (
                <View
                  key={index}
                  style={[
                    styles.galaxyPreview,
                    { backgroundColor: currentPalette.secondary },
                  ]}
                >
                  <View style={styles.galaxyPreviewHeader}>
                    <Ionicons
                      name="planet"
                      size={24}
                      color={currentPalette.quaternary}
                    />
                    <Text
                      style={[
                        styles.galaxyPreviewName,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      {galaxy.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.galaxyPreviewCount,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    {galaxy.notes.length} notes
                  </Text>
                  <View style={styles.galaxyPreviewNotes}>
                    {galaxy.notes.slice(0, 3).map((noteTitle, noteIndex) => (
                      <Text
                        key={noteIndex}
                        style={[
                          styles.galaxyPreviewNote,
                          { color: currentPalette.quinary },
                        ]}
                      >
                        • {noteTitle}
                      </Text>
                    ))}
                    {galaxy.notes.length > 3 && (
                      <Text
                        style={[
                          styles.galaxyPreviewMore,
                          { color: currentPalette.quinary },
                        ]}
                      >
                        ...and {galaxy.notes.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={[
                    styles.regenerateButton,
                    { backgroundColor: currentPalette.secondary },
                  ]}
                  onPress={() => setShowPreview(false)}
                >
                  <Text
                    style={[
                      styles.regenerateButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Regenerate
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    { backgroundColor: currentPalette.quaternary },
                  ]}
                  onPress={handleApplyGalaxies}
                >
                  <Text
                    style={[
                      styles.applyButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    Apply Galaxies
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
```

---

## 🎨 Visual Design Features

### 1. Star Layout Algorithm

```typescript
const generateStarPosition = (
  index: number,
  total: number,
  existingPositions: { x: number; y: number }[] = []
) => {
  const maxAttempts = 50;
  const starSize = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 80 + Math.random() * 120;
    const offsetAngle = (Math.random() - 0.5) * 0.8;

    let x = centerX + Math.cos(angle + offsetAngle) * radius - 60;
    let y = centerY + Math.sin(angle + offsetAngle) * radius - 100;

    // Check collision with existing stars
    const minDistanceBetweenStars = starSize + 10;
    let hasCollision = false;

    for (const existingPos of existingPositions) {
      const distance = Math.sqrt(
        Math.pow(x - existingPos.x, 2) + Math.pow(y - existingPos.y, 2)
      );
      if (distance < minDistanceBetweenStars) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      return { x, y };
    }

    attempts++;
  }

  // Fallback position
  const fallbackAngle =
    (index / total) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
  const fallbackRadius = 100 + Math.random() * 100;
  let x = centerX + Math.cos(fallbackAngle) * fallbackRadius - 60;
  let y = centerY + Math.sin(fallbackAngle) * fallbackRadius - 100;

  return { x, y };
};
```

### 2. Animated Stars

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

---

## 🚀 API Endpoints

### Galaxy Routes

```typescript
// backend/src/index.ts
app.get("/api/galaxies", checkAuthentication, galaxyControllers.getGalaxies);
app.post("/api/galaxies", checkAuthentication, galaxyControllers.createGalaxy);
app.post(
  "/api/galaxies/generate",
  checkAuthentication,
  galaxyControllers.generateGalaxies
);
app.get(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.getGalaxyById
);
app.put(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.updateGalaxy
);
app.delete(
  "/api/galaxies/:id",
  checkAuthentication,
  galaxyControllers.deleteGalaxy
);
app.get(
  "/api/galaxies/:id/notes",
  checkAuthentication,
  galaxyControllers.getGalaxyNotes
);
app.post(
  "/api/galaxies/assign-note",
  checkAuthentication,
  galaxyControllers.assignNoteToGalaxy
);
```

---

## 🔄 Data Flow

### 1. Galaxy Generation

```
User requests generation → Fetch all notes → Send to AI → Parse response → Create galaxies → Assign notes → Update UI
```

### 2. Galaxy Navigation

```
User swipes/double-taps → Update galaxy index → Filter notes → Regenerate positions → Animate transition
```

### 3. Note Assignment

```
Note created/updated → Check galaxy context → Assign to galaxy → Update database → Refresh UI
```

---

## 🐛 Common Issues and Solutions

### 1. AI Generation Fails

**Problem**: Galaxy generation returns errors
**Solution**: Check API key, note format, and AI response parsing

### 2. Star Collisions

**Problem**: Notes overlap in visual layout
**Solution**: Improve collision detection algorithm and fallback positioning

### 3. Navigation Issues

**Problem**: Galaxy switching doesn't work
**Solution**: Verify galaxy index state and note filtering logic

### 4. Performance Issues

**Problem**: Slow rendering with many notes
**Solution**: Implement virtualization and optimize star positioning

---

## 🚀 Future Enhancements

### Planned Features

1. **Manual Galaxy Creation**: User-defined galaxy organization
2. **Galaxy Merging**: Combine similar galaxies
3. **Galaxy Insights**: AI analysis of galaxy themes
4. **Custom Galaxy Icons**: Visual galaxy identification
5. **Galaxy Sharing**: Share galaxy collections

### Technical Improvements

1. **Advanced AI Models**: More sophisticated organization algorithms
2. **Real-time Collaboration**: Shared galaxy organization
3. **Galaxy Templates**: Pre-built galaxy structures
4. **Analytics**: Galaxy usage and organization statistics
5. **Export/Import**: Galaxy organization backup

---

## 📚 Learning Resources

- [React Native Animated API](https://reactnative.dev/docs/animated)
- [Google Generative AI](https://ai.google.dev/docs)
- [Express.js Routing](https://expressjs.com/en/guide/routing.html)
- [SQLite with Knex.js](https://knexjs.org/)

---

_The Galaxy Organization System provides a unique, AI-powered approach to note organization in Renaissance. Its cosmic visual metaphor and intelligent grouping create an engaging and efficient note-taking experience._

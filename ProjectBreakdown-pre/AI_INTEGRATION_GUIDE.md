# AI Integration Guide - Renaissance MVP

## 🤖 Overview

Renaissance leverages **Google Generative AI (Gemini 1.5 Flash)** to provide intelligent insights, task generation, and content organization. This guide explains how AI is integrated throughout the application, from note analysis to galaxy generation.

---

## 🏗️ Architecture Overview

### AI Service Structure

```
backend/src/aiServices/
├── galaxyAi.ts          # Galaxy generation and organization
├── noteInsights.ts      # Note analysis and insights
├── taskInsights.ts      # Task analysis and recommendations
└── aiTaskCreation.ts    # AI-powered task generation
```

### Key Components

- **Google Generative AI SDK**: Primary AI service
- **Custom Prompts**: Tailored for specific use cases
- **JSON Response Parsing**: Structured data handling
- **Error Handling**: Graceful fallbacks for AI failures

---

## 🎯 AI Features Breakdown

### 1. Note Insights Generation

**Purpose**: Analyze note content and provide actionable insights

**Location**: `backend/src/aiServices/noteInsights.ts`

**Prompt Structure**:

```typescript
const generateNoteInsightPrompt = `You are Zylith, an AI assistant inside of a note taking/todo app. Your job will be to take the provided galaxy and the notes contained within it, and give a general overview of the galaxy.
 So if the galaxy is about "Startup" and the notes are about building an app and starting a YC startup, you would return a summary of the galaxy like "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native.". The point is to provide the user with a in depth breakdown of their thoughts and some actionable steps they can take to get closer to their goals. 
 You should return your response in a json format like {galaxyName: "Startup", galaxyInsight: "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native."}.`;
```

**Response Format**:

```json
{
  "contentBreakdown": "Detailed analysis of note content",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "nextSteps": [
    {
      "action": "Research fishing rods",
      "description": "Look into different types of fishing rods for your trip"
    }
  ],
  "learnings": ["learning1", "learning2"],
  "resources": ["resource1", "resource2"],
  "connections": ["connection1", "connection2"],
  "overallInsight": "Comprehensive summary of the note"
}
```

**Implementation Flow**:

1. User clicks insight button in note editor
2. Frontend calls `/api/noteInsight` endpoint
3. Backend sends note content + galaxy context to AI
4. AI returns structured JSON with insights
5. Frontend displays insights in modal with "Add to Todo" buttons

**Key Code Snippet**:

```typescript
// backend/src/aiServices/noteInsights.ts
export const generateNoteInsight = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `${generateNoteInsightPrompt}\n\nHere are the galaxy notes to analyze:\n${JSON.stringify(
      req.body.notes
    )}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    res.status(200).send({ result: response });
  } catch (error) {
    console.error("❌ Error in generateNoteInsight:", error);
    res.status(500).send({ message: "Error generating note insight" });
  }
};
```

### 2. Galaxy Generation

**Purpose**: Automatically organize notes into themed collections

**Location**: `backend/src/aiServices/galaxyAi.ts`

**Prompt Structure**:

```typescript
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
- Consider both the title and content when determining relationships`;
```

**Response Format**:

```json
[
  [
    "Programming",
    [
      [
        "AI-Powered Task Manager Notes",
        "Working on a smart task management system..."
      ],
      [
        "Collaborative Mind Mapping Tool Notes",
        "Developing a real-time collaborative mind mapping tool..."
      ]
    ]
  ],
  [
    "Personal Projects",
    [
      [
        "Indoor Garden Monitoring Notes",
        "Researching IoT sensors to monitor soil moisture..."
      ],
      [
        "Mobile App for Plant Care Notes",
        "Designing an app that helps users care for their plants..."
      ]
    ]
  ]
]
```

**Implementation Flow**:

1. User clicks "Generate Galaxies" button
2. Backend fetches all user notes
3. Sends notes to AI for analysis
4. AI returns galaxy groupings
5. Backend creates galaxies in database and assigns notes
6. Frontend refreshes to show new organization

**Key Code Snippet**:

````typescript
// backend/src/aiServices/galaxyAi.ts
export const generateGalaxiesWithAI = async (
  notes: [string, string][]
): Promise<[string, [string, string][]][]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `${generateGalaxyPrompt}\n\nHere are the notes to organize:\n${JSON.stringify(
      notes
    )}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    // Parse JSON response and handle markdown wrapping
    let responseToParse = response;
    if (response.includes("```json")) {
      responseToParse = response
        .replace(/```json\s*/, "")
        .replace(/\s*```/, "");
    }

    const parsedResponse = JSON.parse(responseToParse);
    return parsedResponse;
  } catch (error) {
    console.error("❌ Error in generateGalaxiesWithAI:", error);
    throw error;
  }
};
````

### 3. Task Generation from Insights

**Purpose**: Convert AI insights into actionable tasks

**Location**: `frontend/components/NoteInsightModal.tsx`

**Implementation Flow**:

1. User clicks "Add to Todo" button on any insight step
2. Frontend creates task with shortened content
3. Task is marked as `is_ai_generated: true`
4. Goal is set to note title or galaxy name
5. Task appears in todo list with "ZYLITH GENERATED" label

**Key Code Snippet**:

```typescript
// frontend/components/NoteInsightModal.tsx
const handleAddToTodo = async (action: string, description: string) => {
  try {
    // Create a shorter, more concise task content
    const shortAction =
      action.length > 50 ? action.substring(0, 50) + "..." : action;

    // Determine goal based on note context
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

### 4. Galaxy Insights

**Purpose**: Provide overview of galaxy content and themes

**Location**: `backend/src/aiServices/galaxyAi.ts`

**Prompt Structure**:

```typescript
const generateGalaxyInsightPrompt = `You are Zylith, an AI assistant inside of a note taking/todo app. Your job will be to take the provided galaxy and the notes contained within it, and give a general overview of the galaxy.
 So if the galaxy is about "Startup" and the notes are about building an app and starting a YC startup, you would return a summary of the galaxy like "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native.". The point is to provide the user with a in depth breakdown of their thoughts and some actionable steps they can take to get closer to their goals. 
 You should return your response in a json format like {galaxyName: "Startup", galaxyInsight: "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native."}.`;
```

---

## 🔧 Technical Implementation Details

### 1. Error Handling

**Fallback Strategies**:

```typescript
// If AI fails, create a single "General Notes" galaxy
if (parseError) {
  console.log("🔄 Creating fallback galaxy with all notes");
  return [["General Notes", notes]];
}
```

**API Key Validation**:

```typescript
if (!API_KEY) {
  console.error("❌ API_KEY not found! Using mock response for testing.");
  return mockResponse;
}
```

### 2. Response Parsing

**Handling Markdown Wrapped JSON**:

````typescript
let responseToParse = response;
if (response.includes("```json")) {
  responseToParse = response.replace(/```json\s*/, "").replace(/\s*```/, "");
} else if (response.includes("```")) {
  responseToParse = response.replace(/```\s*/, "").replace(/\s*```/, "");
}
````

### 3. Rate Limiting and Performance

**Model Configuration**:

```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Fastest model for real-time responses
});
```

---

## 🎨 Prompt Engineering Best Practices

### 1. Clear Instructions

- Use specific, actionable language
- Provide examples of expected output
- Include format requirements

### 2. Context Provision

- Always include relevant user data
- Provide galaxy context for note insights
- Include related notes for better analysis

### 3. Structured Output

- Request JSON format for consistent parsing
- Define specific field names
- Include validation requirements

### 4. Error Prevention

- Provide fallback instructions
- Include format examples
- Specify character limits where needed

---

## 🚀 Future AI Enhancements

### Planned Features

1. **Smart Task Prioritization**: AI suggests task priority based on content
2. **Content Summarization**: Automatic note summaries
3. **Related Note Suggestions**: AI suggests connections between notes
4. **Writing Assistance**: Grammar and style suggestions
5. **Goal Tracking**: AI analyzes progress toward user goals

### Technical Improvements

1. **Caching**: Cache common AI responses
2. **Batch Processing**: Process multiple requests efficiently
3. **User Feedback**: Learn from user interactions
4. **Custom Models**: Fine-tuned models for specific use cases

---

## 🔍 Debugging AI Issues

### Common Problems

1. **JSON Parsing Errors**: Check for markdown wrapping
2. **Empty Responses**: Verify API key and model availability
3. **Inconsistent Format**: Review prompt instructions
4. **Rate Limiting**: Implement request throttling

### Debug Tools

```typescript
// Enable detailed logging
console.log("🤖 AI Response:", response);
console.log("📦 Request body:", req.body);
console.log("🔑 API_KEY available:", !!API_KEY);
```

---

## 📚 Learning Resources

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [JSON Schema Validation](https://json-schema.org/)
- [Error Handling Best Practices](https://expressjs.com/en/guide/error-handling.html)

---

_This AI integration guide covers the core AI features of Renaissance MVP. As the application evolves, new AI capabilities will be documented here._

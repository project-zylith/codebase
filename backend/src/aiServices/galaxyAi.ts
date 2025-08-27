import { GoogleGenerativeAI } from "@google/generative-ai";
const express = require("express");
import type { Request, Response } from "express";

const API_KEY = process.env.API_KEY as string;

// Debug API key
console.log("🔑 API_KEY available:", !!API_KEY);
console.log("🔑 API_KEY length:", API_KEY ? API_KEY.length : 0);
console.log(
  "🔑 API_KEY starts with:",
  API_KEY ? API_KEY.substring(0, 10) + "..." : "none"
);
if (!API_KEY) {
  console.error("❌ No API_KEY found in environment variables!");
}

const generateGalaxyPrompt = `Create note "galaxies" (groups) from the provided notes. Analyze titles and content to group related notes.

Input format: [[title, content], [title, content], ...]
Output format: [[galaxyName, [[title, content], [title, content]]], [galaxyName, [[title, content]]]]

Rules:
- Group conceptually related notes
- Use clear, descriptive galaxy names
- 2-5 galaxies total
- Min 2 notes per galaxy (unless very few notes)
- Return ONLY valid JSON, no explanations
- IMPORTANT: Do not include HTML tags or entities in the content
- If content contains HTML, strip it and return plain text only
- Ensure all quotes are properly escaped for valid JSON

Examples:
- Travel notes → "Travel Planning" 
- Work/career notes → "Career Development"
- Health/fitness notes → "Health & Fitness"
- Programming/tech notes → "Software Development"

CRITICAL: Return ONLY valid, parseable JSON with no HTML content or special characters that would break JSON parsing.`;
const galaxyReSortPrompt = `You are Zylith, an AI assistant inside of a note taking/todo app. Your job is to re-sort existing galaxies based on the current notes.

You will be provided all of the notes with their title and content inside of a nested array: [[title, content], [title, content], [title, content], ...]

Your task is to analyze the notes and reorganize them into logical groupings, potentially creating new galaxies or merging existing ones.

Return your response as a nested array in this exact format:
[[galaxyName, [[title, content], [title, content], ...]], [galaxyName, [[title, content], ...]], ...]

Guidelines for re-sorting:
- Group notes that are conceptually related or work toward similar goals
- Use descriptive, user-friendly names that clearly indicate the theme
- Aim for 2-5 galaxies total (unless you have very few notes)
- Each galaxy should have at least 2 notes (unless you have very few notes total)
- Consider both the title and content when determining relationships
- You can create new galaxy names if the current organization doesn't make sense

Make sure your response is valid JSON that can be parsed directly.`;
const generateGalaxyInsightPrompt = `You are Zylith, an AI assistant inside of a note taking/todo app. Your job will be to take the provided galaxy and the notes contained within it, and give a general overview of the galaxy.
 So if the galaxy is about "Startup" and the notes are about building an app and starting a YC startup, you would return a summary of the galaxy like "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native.". The point is to provide the user with a in depth breakdown of their thoughts and some actionable steps they can take to get closer to their goals. 
 You should return your response in a json format like {galaxyName: "Startup", galaxyInsight: "This galaxy is about startups and the notes are about building an app and starting a YC startup. In the note, 'Building an app' you spoke of creating an app using the PERN stack using react native."}.`;
// If I can figure out how to let users add todos the ai gives from the galaxy insight to their todo list that would be great.
const generateGalaxyInsightAllPrompt = ``;

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate galaxies with AI and return parsed data
// Helper function to clean HTML content from notes
const cleanHtmlContent = (content: string): string => {
  // Remove HTML tags and entities, convert to plain text
  return content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
};

export const generateGalaxiesWithAI = async (
  notes: [string, string][]
): Promise<[string, [string, string][]][]> => {
  try {
    console.log(
      "🤖 Calling AI to generate galaxies for",
      notes.length,
      "notes"
    );

    // Clean HTML content from notes before processing
    const cleanedNotes = notes.map(([title, content]) => [
      title,
      cleanHtmlContent(content),
    ]);

    if (!API_KEY) {
      console.error("❌ API_KEY not found! Using mock response for testing.");

      // Mock response for testing when API key is not available
      return [
        [
          "Programming",
          [
            [
              "AI-Powered Task Manager Notes",
              "Working on a smart task management system that uses AI to prioritize tasks and provide insights. Need to integrate with calendar and email for context.",
            ],
            [
              "Collaborative Mind Mapping Tool Notes",
              "Developing a real-time collaborative mind mapping tool with AI suggestions for connections between concepts. Perfect for brainstorming sessions.",
            ],
          ],
        ],
        [
          "Personal Projects",
          [
            [
              "Indoor Garden Monitoring Notes",
              "Researching IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Planning to send notifications to phone.",
            ],
            [
              "Mobile App for Plant Care Notes",
              "Designing an app that helps users care for their plants by providing watering schedules, care tips, and plant identification features.",
            ],
          ],
        ],
      ];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Truncate note content to prevent response truncation while keeping context
    const truncatedNotes = cleanedNotes.map(([title, content]) => [
      title,
      content.length > 500 ? content.substring(0, 500) + "..." : content,
    ]);

    console.log(
      `📝 Processing ${notes.length} notes, truncated content for AI efficiency`
    );

    // Combine the prompt with the notes data
    const fullPrompt = `${generateGalaxyPrompt}\n\nHere are the notes to organize:\n${JSON.stringify(
      truncatedNotes
    )}`;

    console.log(
      "🤖 Sending prompt to AI:",
      fullPrompt.substring(0, 200) + "..."
    );

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    console.log("🤖 AI Response:", response);
    console.log("🤖 AI Response length:", response.length);
    console.log("🤖 AI Response type:", typeof response);

    // Parse the AI response
    try {
      let responseToParse = response;

      // Handle markdown-wrapped JSON responses
      if (response.includes("```json")) {
        console.log("📝 Found JSON markdown wrapper, removing...");
        responseToParse = response
          .replace(/```json\s*/, "")
          .replace(/\s*```/, "");
      } else if (response.includes("```")) {
        console.log("📝 Found generic markdown wrapper, removing...");
        responseToParse = response.replace(/```\s*/, "").replace(/\s*```/, "");
      }

      // Clean the response to handle potential HTML entities and special characters
      responseToParse = responseToParse
        .trim()
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'");

      console.log(
        "🔧 Attempting to parse:",
        responseToParse.substring(0, 200) + "..."
      );

      // Try to parse the cleaned response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseToParse);
      } catch (initialParseError) {
        console.log(
          "🔄 Initial parse failed, attempting to fix common JSON issues..."
        );
        console.log("🔍 Initial parse error:", initialParseError.message);

        // Try to fix common JSON issues
        let fixedResponse = responseToParse;

        // Remove any trailing commas before closing brackets/braces
        fixedResponse = fixedResponse.replace(/,(\s*[\]}])/g, "$1");

        // Try to fix unescaped quotes in HTML content by escaping them
        fixedResponse = fixedResponse.replace(/(<[^>]*>)/g, (match) => {
          return match.replace(/"/g, '\\"');
        });

        console.log("🔧 Attempting to parse fixed response...");
        console.log(
          "🔍 Fixed response preview:",
          fixedResponse.substring(0, 300) + "..."
        );

        try {
          parsedResponse = JSON.parse(fixedResponse);
        } catch (fixError) {
          console.log("🔍 Fix attempt failed:", fixError.message);
          console.log("🔍 Response length:", fixedResponse.length);
          console.log("🔍 Last 200 characters:", fixedResponse.slice(-200));
          throw fixError;
        }
      }

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
      console.error(
        "❌ DEBUGGING: This is likely why you're seeing 'General Notes' instead of specific galaxies!"
      );
      console.error(
        "❌ The AI response could not be parsed. Check the raw response above."
      );

      // Fallback: create a single galaxy with all notes
      console.log("🔄 Creating fallback galaxy with all notes");
      return [["General Notes", notes]];
    }
  } catch (error) {
    console.error("❌ Error in generateGalaxiesWithAI:", error);
    throw error;
  }
};

export const generateGalaxy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🤖 Generating galaxy with notes:", req.body.notes);

    if (!API_KEY) {
      console.error("❌ API_KEY not found! Using mock response for testing.");

      // Mock response for testing when API key is not available
      const mockResponse = `[
        ["Programming", [
          ["AI-Powered Task Manager Notes", "Working on a smart task management system that uses AI to prioritize tasks and provide insights. Need to integrate with calendar and email for context."],
          ["Collaborative Mind Mapping Tool Notes", "Developing a real-time collaborative mind mapping tool with AI suggestions for connections between concepts. Perfect for brainstorming sessions."]
        ]],
        ["Personal Projects", [
          ["Indoor Garden Monitoring Notes", "Researching IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Planning to send notifications to phone."],
          ["Mobile App for Plant Care Notes", "Designing an app that helps users care for their plants by providing watering schedules, care tips, and plant identification features."]
        ]]
      ]`;

      res.status(200).send({ result: mockResponse });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the prompt with the notes data
    const fullPrompt = `${generateGalaxyPrompt}\n\nHere are the notes to organize:\n${JSON.stringify(
      req.body.notes
    )}`;

    console.log(
      "🤖 Sending prompt to AI:",
      fullPrompt.substring(0, 200) + "..."
    );

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    console.log("🤖 Zylith Response:", response);
    res.status(200).send({ result: response });
  } catch (error) {
    console.error("❌ Error in generateGalaxy:", error);
    console.error(
      "❌ Error details:",
      error instanceof Error ? error.message : String(error)
    );
    res.status(500).send({
      message: "Error generating galaxy",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const reSortGalaxy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🤖 Re-sorting galaxy with notes:", req.body.notes);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the prompt with the notes data
    const fullPrompt = `${galaxyReSortPrompt}\n\nHere are the notes to re-sort:\n${JSON.stringify(
      req.body.notes
    )}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    console.log("🤖 Zylith Re-sort Response:", response);
    res.status(200).send({ result: response });
  } catch (error) {
    console.error("❌ Error in reSortGalaxy:", error);
    res.status(500).send({ message: "Error re-sorting galaxy" });
  }
};

export const generateGalaxyInsight = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🤖 Generating galaxy insight with notes:", req.body.notes);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Combine the prompt with the notes data
    const fullPrompt = `${generateGalaxyInsightPrompt}\n\nHere are the galaxy notes to analyze:\n${JSON.stringify(
      req.body.notes
    )}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();

    console.log("🤖 Zylith Insight Response:", response);
    res.status(200).send({ result: response });
  } catch (error) {
    console.error("❌ Error in generateGalaxyInsight:", error);
    res.status(500).send({ message: "Error generating galaxy insight" });
  }
};

export const generateGalaxyInsightAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      generateGalaxyInsightAllPrompt,
      req.body.notes
    );
    const response = await result.response.text();
    res.status(200).send({ result: response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating galaxy insight all" });
  }
};

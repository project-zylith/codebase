import { GoogleGenerativeAI } from "@google/generative-ai";
const express = require("express");
import type { Request, Response } from "express";
import { SubscriptionLimitService } from "../services/subscriptionLimitService";
import { db } from "../database";

const API_KEY = process.env.API_KEY as string;

const generateNoteInsightsPrompt = `You are REN|AI, an AI assistant inside of a note taking app. Your job is to analyze a user's note and provide a comprehensive, friendly, and helpful breakdown.

You will receive:
1. A note with title and content
2. Information about the galaxy it belongs to (if any)
3. References to other related notes in the same galaxy (if any)

Your task is to provide a detailed analysis that includes:

1. **Content Breakdown**: A clear summary of what the note contains
2. **Key Themes**: Identify the main themes and topics discussed
3. **Next Steps**: Suggest actionable next steps the user can take
4. **Learnings & Resources**: Provide relevant learnings, tips, or resources
5. **Connections**: If there are related notes, explain how they connect

Guidelines:
- Be friendly, encouraging, and supportive
- Provide specific, actionable advice
- Reference the galaxy context when relevant
- Suggest resources, tools, or approaches that could help
- Keep the tone conversational but professional
- If the note seems incomplete, suggest ways to expand it
- If it's a project note, suggest next development steps
- If it's a learning note, suggest related topics to explore

Return your response as a JSON object with this structure:
{
  "contentBreakdown": "A clear summary of what the note contains...",
  "keyThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "nextSteps": [
    {
      "action": "Specific action to take",
      "description": "Why this action is helpful"
    }
  ],
  "learningsAndResources": [
    {
      "type": "resource|tip|learning",
      "title": "Title of the resource/tip",
      "description": "Description of why it's relevant"
    }
  ],
  "connections": "How this note connects to other notes in the galaxy (if applicable)",
  "overallInsight": "A friendly, encouraging summary of the note's value and potential"
}

Make sure your response is valid JSON that can be parsed directly.`;

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateNoteInsight = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🤖 Generating note insight:", req.body);

    const { note, galaxy, relatedNotes, userId } = req.body;

    if (!note || !note.title || !note.content) {
      res
        .status(400)
        .json({ error: "Note with title and content is required" });
      return;
    }

    // Check AI insight limits if userId is provided
    if (userId) {
      const limitCheck = await SubscriptionLimitService.canUseAIInsight(userId);

      if (!limitCheck.allowed) {
        const limitText =
          limitCheck.limit === -1 ? "unlimited" : limitCheck.limit;
        res.status(403).json({
          error: `AI insight limit reached. You have used ${limitCheck.current} insights today and your plan allows ${limitText} insights per day. Please upgrade your subscription to use more AI insights.`,
          current: limitCheck.current,
          limit: limitCheck.limit,
          type: "ai_insight_limit",
        });
        return;
      }
    }

    if (!API_KEY) {
      console.error("❌ API_KEY not found! Using mock response for testing.");

      // Mock response for testing when API key is not available
      const mockResponse = {
        contentBreakdown:
          "This note appears to be about project planning and development. It contains ideas for building a productivity app with AI features.",
        keyThemes: ["Project Planning", "AI Integration", "Productivity Tools"],
        nextSteps: [
          {
            action: "Create a project timeline",
            description:
              "Break down your ideas into specific milestones and deadlines",
          },
          {
            action: "Research similar apps",
            description:
              "Study existing productivity apps to understand the market",
          },
        ],
        learningsAndResources: [
          {
            type: "resource",
            title: "AI Integration Best Practices",
            description:
              "Learn about effective ways to integrate AI into productivity tools",
          },
          {
            type: "tip",
            title: "User Research",
            description:
              "Consider conducting user interviews to validate your ideas",
          },
        ],
        connections:
          "This note connects well with your other project planning notes in the galaxy.",
        overallInsight:
          "Great start on your project! You have solid foundational ideas. Consider expanding on the technical implementation details and user experience design.",
      };

      res.status(200).json({ result: mockResponse });
      return;
    }

    // List available models for debugging
    try {
      const modelsResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      const modelsData = await modelsResponse.json();
      console.log("Available models:", modelsData);
    } catch (error) {
      console.log("Error fetching available models:", error);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the context data
    const contextData = {
      note: {
        title: note.title,
        content: note.content,
      },
      galaxy: galaxy || null,
      relatedNotes: relatedNotes || [],
    };

    // Combine the prompt with the context data
    const fullPrompt = `${generateNoteInsightsPrompt}\n\nHere is the note and context to analyze:\n${JSON.stringify(
      contextData,
      null,
      2
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

      console.log("✅ Successfully parsed note insight response");

      // Save insight to database if userId is provided
      if (userId && note.id) {
        try {
          await db("insights").insert({
            note_id: note.id,
            user_id: userId,
            content: JSON.stringify(parsedResponse),
            created_at: new Date(),
          });
          console.log("💾 Insight saved to database");
        } catch (dbError) {
          console.error("❌ Error saving insight to database:", dbError);
          // Don't fail the request if saving fails
        }
      }

      res.status(200).json({ result: parsedResponse });
    } catch (parseError) {
      console.error("❌ Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", response);

      // Fallback response
      const fallbackResponse = {
        contentBreakdown:
          "I analyzed your note and found some interesting content that could be developed further.",
        keyThemes: ["Content Analysis", "Development Opportunities"],
        nextSteps: [
          {
            action: "Review and expand your ideas",
            description:
              "Consider adding more detail to make your note more actionable",
          },
        ],
        learningsAndResources: [
          {
            type: "tip",
            title: "Note Enhancement",
            description:
              "Try adding specific examples or use cases to make your note more concrete",
          },
        ],
        connections:
          "This note could connect with other related topics in your galaxy.",
        overallInsight:
          "Your note shows good thinking! Consider expanding on the details to make it even more valuable.",
      };

      res.status(200).json({ result: fallbackResponse });
    }
  } catch (error) {
    console.error("❌ Error in generateNoteInsight:", error);
    res.status(500).json({
      error: "Failed to generate note insight",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

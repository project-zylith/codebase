// Test script for galaxy generation API
import fetch from "node-fetch";

async function testGalaxyGeneration() {
  try {
    console.log("🧪 Testing galaxy generation API...");

    const testNotes = [
      [
        "AI-Powered Task Manager Notes",
        "Working on a smart task management system that uses AI to prioritize tasks and provide insights. Need to integrate with calendar and email for context.",
      ],
      [
        "Collaborative Mind Mapping Tool Notes",
        "Developing a real-time collaborative mind mapping tool with AI suggestions for connections between concepts. Perfect for brainstorming sessions.",
      ],
      [
        "Indoor Garden Monitoring Notes",
        "Researching IoT sensors to monitor soil moisture, light levels, and temperature for indoor plants. Planning to send notifications to phone.",
      ],
      [
        "Mobile App for Plant Care Notes",
        "Designing an app that helps users care for their plants by providing watering schedules, care tips, and plant identification features.",
      ],
      [
        "JavaScript Learning Notes",
        "Studying modern JavaScript features including ES6+ syntax, async/await, and functional programming concepts.",
      ],
      [
        "Python Data Analysis Notes",
        "Learning pandas, numpy, and matplotlib for data analysis and visualization projects.",
      ],
      [
        "Travel Planning for Europe",
        "Planning a 3-week trip to Europe including budget, itinerary, and accommodation research.",
      ],
      [
        "Fitness Goals and Workout Plan",
        "Setting up a comprehensive fitness routine with strength training, cardio, and nutrition tracking.",
      ],
    ];

    console.log("📝 Sending test notes:", testNotes.length, "notes");

    const response = await fetch("http://localhost:3000/api/generateGalaxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: testNotes,
      }),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", response.headers);

    const data = await response.text();
    console.log("📡 Response body:", data);

    if (response.ok) {
      console.log("✅ API call successful!");

      // Try to parse the response
      try {
        const parsedData = JSON.parse(data);
        console.log("✅ Response parsed successfully");
        console.log(
          "🤖 AI generated result:",
          parsedData.result ? "Available" : "Missing"
        );
      } catch (parseError) {
        console.log(
          "⚠️ Response is not valid JSON (this might be expected for some AI responses)"
        );
      }
    } else {
      console.log("❌ API call failed!");
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
  }
}

// Run the test
testGalaxyGeneration();

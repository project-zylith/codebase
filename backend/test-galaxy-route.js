// Test script to verify the galaxy generation route
const fetch = require("node-fetch");

async function testGalaxyRoute() {
  try {
    console.log("🧪 Testing galaxy generation route...");

    const testNotes = [
      ["Test Note 1", "This is a test note about programming"],
      ["Test Note 2", "This is a test note about cooking"],
    ];

    const response = await fetch(
      "http://localhost:3000/api/galaxies/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: testNotes,
        }),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", response.headers);

    const data = await response.text();
    console.log("📡 Response body:", data);

    if (response.ok) {
      console.log("✅ Route is working!");
    } else {
      console.log("❌ Route returned error status");
    }
  } catch (error) {
    console.error("❌ Error testing route:", error.message);

    if (error.message.includes("fetch")) {
      console.log("\n💡 Troubleshooting tips:");
      console.log(
        "1. Make sure the backend server is running: cd backend && npm run dev"
      );
      console.log("2. Check if the port 3000 is available");
      console.log("3. Verify the API endpoint is accessible");
    }
  }
}

// Run the test
testGalaxyRoute();

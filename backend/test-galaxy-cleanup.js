const fetch = require("node-fetch");

async function testGalaxyCleanup() {
  try {
    console.log("🧪 Testing galaxy cleanup functionality...\n");

    // First, let's check the current state
    console.log("📊 Checking current galaxies...");
    const galaxiesResponse = await fetch("http://localhost:3000/api/galaxies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: "sessionId=test-session-3", // Assuming user 3 session
      },
    });

    if (galaxiesResponse.ok) {
      const galaxies = await galaxiesResponse.json();
      console.log(`Found ${galaxies.length} existing galaxies`);
      galaxies.forEach((galaxy) => {
        console.log(`  - ID: ${galaxy.id}, Name: "${galaxy.name}"`);
      });
    }

    // Now let's generate new galaxies
    console.log("\n🚀 Generating new galaxies...");
    const notes = [
      ["Test Note 1", "This is a test note for cleanup verification"],
      ["Test Note 2", "Another test note to verify galaxy generation"],
      ["Test Note 3", "Third test note for the cleanup test"],
    ];

    const generateResponse = await fetch(
      "http://localhost:3000/api/galaxies/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "sessionId=test-session-3",
        },
        body: JSON.stringify({ notes }),
      }
    );

    if (generateResponse.ok) {
      const result = await generateResponse.json();
      console.log("✅ Galaxy generation successful!");
      console.log(`  - Galaxies created: ${result.galaxiesCreated}`);
      console.log(
        `  - Previous galaxies deleted: ${result.previousGalaxiesDeleted}`
      );
      console.log(`  - Notes without galaxy: ${result.notesWithoutGalaxy}`);
    } else {
      console.error(
        "❌ Galaxy generation failed:",
        await generateResponse.text()
      );
    }

    // Check the state after generation
    console.log("\n📊 Checking galaxies after generation...");
    const galaxiesAfterResponse = await fetch(
      "http://localhost:3000/api/galaxies",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: "sessionId=test-session-3",
        },
      }
    );

    if (galaxiesAfterResponse.ok) {
      const galaxiesAfter = await galaxiesAfterResponse.json();
      console.log(`Found ${galaxiesAfter.length} galaxies after generation`);
      galaxiesAfter.forEach((galaxy) => {
        console.log(`  - ID: ${galaxy.id}, Name: "${galaxy.name}"`);
      });
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testGalaxyCleanup();

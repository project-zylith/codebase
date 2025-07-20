// DEPRECATED: This test file is no longer needed for production.
// This file can be safely deleted after testing.

/*
const fetch = require("node-fetch");

async function testGalaxyRoute() {
  try {
    console.log("🧪 Testing galaxy route...");

    const response = await fetch("http://localhost:3000/api/galaxies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: "sessionId=test-session-1",
      },
    });

    if (response.ok) {
      const galaxies = await response.json();
      console.log("✅ Galaxy route working!");
      console.log(`Found ${galaxies.length} galaxies`);
    } else {
      console.error("❌ Galaxy route failed:", await response.text());
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testGalaxyRoute();
*/

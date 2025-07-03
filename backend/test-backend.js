const fetch = require("node-fetch");

async function testBackend() {
  try {
    console.log("🧪 Testing backend connectivity...");

    // Test basic connectivity
    const testResponse = await fetch("http://localhost:3000/test");
    const testData = await testResponse.json();
    console.log("✅ Test route response:", testData);

    // Test registration endpoint
    console.log("🧪 Testing registration endpoint...");
    const registerResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          username: "testuser123",
          password: "password123",
        }),
      }
    );

    console.log("📊 Registration response status:", registerResponse.status);
    const registerData = await registerResponse.text();
    console.log("📊 Registration response body:", registerData);
  } catch (error) {
    console.error("❌ Backend test failed:", error.message);
  }
}

testBackend();

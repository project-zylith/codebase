const fetch = require("node-fetch");

async function testLogin() {
  try {
    console.log("🧪 Testing login functionality...");

    // Test basic connectivity
    console.log("1. Testing backend connectivity...");
    const testResponse = await fetch("http://localhost:3000/test");
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log("✅ Backend is running:", testData.message);
    } else {
      console.log("❌ Backend is not responding");
      return;
    }

    // Test login with seeded user
    console.log("\n2. Testing login with seeded user...");
    const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "cool_cat",
        password: "password123", // This won't work with the seeded hash
      }),
    });

    console.log("📊 Login response status:", loginResponse.status);
    const loginData = await loginResponse.text();
    console.log("📊 Login response body:", loginData);

    // Test registration first
    console.log("\n3. Testing registration...");
    const registerResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser" + Date.now(),
          email: "test" + Date.now() + "@example.com",
          password: "password123",
        }),
      }
    );

    console.log("📊 Registration response status:", registerResponse.status);
    const registerData = await registerResponse.text();
    console.log("📊 Registration response body:", registerData);

    if (registerResponse.ok) {
      const userData = JSON.parse(registerData);
      console.log("✅ Registration successful for user:", userData.username);

      // Now test login with the newly created user
      console.log("\n4. Testing login with newly created user...");
      const newLoginResponse = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userData.username,
            password: "password123",
          }),
        }
      );

      console.log("📊 New login response status:", newLoginResponse.status);
      const newLoginData = await newLoginResponse.text();
      console.log("📊 New login response body:", newLoginData);

      if (newLoginResponse.ok) {
        console.log("✅ Login successful!");
      } else {
        console.log("❌ Login failed");
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testLogin();

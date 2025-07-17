const fetch = require("node-fetch");
const http = require("http");

async function testConnection() {
  console.log("🔗 Testing backend connection...");

  // Test different IP addresses and ports
  const testURLs = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.56.1:3000",
    "http://172.26.32.1:3000",
    "http://192.168.1.189:3000",
    "http://10.0.13.161:3000",
  ];

  for (const url of testURLs) {
    console.log(`\n🧪 Testing: ${url}`);

    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test", password: "test" }),
        timeout: 5000, // 5 second timeout
      });

      console.log(`✅ Connection successful! Status: ${response.status}`);

      if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 404
      ) {
        console.log(
          "🎉 Backend is responding (even if login fails, connection works)"
        );
      }
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log(
          "❌ Connection refused - backend not running on this address"
        );
      } else if (error.code === "ENOTFOUND") {
        console.log("❌ Host not found");
      } else if (error.code === "ETIMEDOUT") {
        console.log("❌ Connection timeout");
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }

  console.log("\n📝 Summary:");
  console.log(
    "- If you see 'Connection successful' for any URL, use that IP address"
  );
  console.log("- Make sure your backend is running with: npm start");
  console.log(
    "- Update frontend/utils/apiConfig.ts to use the working IP address"
  );
}

testConnection().catch(console.error);

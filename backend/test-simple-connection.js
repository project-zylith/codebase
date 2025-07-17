const http = require("http");

async function testConnection() {
  console.log("🔗 Testing backend connection...");

  const testAddresses = [
    { host: "localhost", port: 3000 },
    { host: "127.0.0.1", port: 3000 },
    { host: "192.168.56.1", port: 3000 },
    { host: "172.26.32.1", port: 3000 },
    { host: "192.168.1.189", port: 3000 },
    { host: "10.0.13.161", port: 3000 },
  ];

  for (const { host, port } of testAddresses) {
    console.log(`\n🧪 Testing: http://${host}:${port}`);

    try {
      await new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: host,
            port: port,
            path: "/api/auth/login",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000,
          },
          (res) => {
            console.log(`✅ Connection successful! Status: ${res.statusCode}`);
            if (
              res.statusCode === 400 ||
              res.statusCode === 401 ||
              res.statusCode === 404
            ) {
              console.log("🎉 Backend is responding (connection works)");
            }
            resolve();
          }
        );

        req.on("error", (error) => {
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
          resolve();
        });

        req.on("timeout", () => {
          console.log("❌ Connection timeout");
          req.destroy();
          resolve();
        });

        req.write(JSON.stringify({ username: "test", password: "test" }));
        req.end();
      });
    } catch (error) {
      console.log(`❌ Unexpected error: ${error.message}`);
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

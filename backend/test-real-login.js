const http = require("http");

async function testRealLogin() {
  console.log("🔐 Testing real login functionality...");

  const workingHost = "192.168.56.1";
  const port = 3000;

  // Test with real user credentials
  const testUsers = [
    { username: "cool_cat", password: "password123" },
    { username: "wowow", password: "password123" },
    { username: "iaso", password: "password123" },
  ];

  for (const user of testUsers) {
    console.log(`\n🧪 Testing login for: ${user.username}`);

    try {
      const result = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(user);

        const req = http.request(
          {
            hostname: workingHost,
            port: port,
            path: "/api/auth/login",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(postData),
            },
            timeout: 10000,
          },
          (res) => {
            let data = "";

            res.on("data", (chunk) => {
              data += chunk;
            });

            res.on("end", () => {
              console.log(`📊 Status: ${res.statusCode}`);
              console.log(`📝 Response: ${data}`);

              if (res.statusCode === 200) {
                console.log("✅ Login successful!");
                try {
                  const userData = JSON.parse(data);
                  console.log(
                    `👤 User data: ${JSON.stringify(userData, null, 2)}`
                  );
                } catch (e) {
                  console.log("⚠️ Could not parse user data as JSON");
                }
              } else {
                console.log("❌ Login failed");
                try {
                  const errorData = JSON.parse(data);
                  console.log(`🚨 Error: ${errorData.message}`);
                } catch (e) {
                  console.log("⚠️ Could not parse error as JSON");
                }
              }
              resolve();
            });
          }
        );

        req.on("error", (error) => {
          console.log(`❌ Request error: ${error.message}`);
          resolve();
        });

        req.on("timeout", () => {
          console.log("❌ Request timeout");
          req.destroy();
          resolve();
        });

        req.write(postData);
        req.end();
      });
    } catch (error) {
      console.log(`❌ Unexpected error: ${error.message}`);
    }
  }

  // Test with wrong credentials
  console.log("\n🧪 Testing with wrong credentials...");
  try {
    const result = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        username: "cool_cat",
        password: "wrongpassword",
      });

      const req = http.request(
        {
          hostname: workingHost,
          port: port,
          path: "/api/auth/login",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
          timeout: 10000,
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📝 Response: ${data}`);

            if (res.statusCode === 401) {
              console.log("✅ Correctly rejected invalid credentials");
            } else {
              console.log("⚠️ Unexpected response for invalid credentials");
            }
            resolve();
          });
        }
      );

      req.on("error", (error) => {
        console.log(`❌ Request error: ${error.message}`);
        resolve();
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.log(`❌ Unexpected error: ${error.message}`);
  }

  console.log("\n📝 Summary:");
  console.log(
    "- If login is successful, the frontend connection issue is fixed"
  );
  console.log("- If login fails, check the backend database and user seeds");
  console.log("- The frontend should now use http://192.168.56.1:3000");
}

testRealLogin().catch(console.error);

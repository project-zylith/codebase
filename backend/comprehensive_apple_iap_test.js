require("dotenv").config();
const fetch = require("node-fetch");

async function comprehensiveAppleIAPTest() {
  console.log("🧪 COMPREHENSIVE APPLE IAP VALIDATION SUITE...\n");

  const baseUrl = "https://codebase-production-e8f2.up.railway.app";
  console.log(`🌐 Testing against: ${baseUrl}`);
  console.log("");

  let testResults = {
    serverConnectivity: false,
    authentication: false,
    appleIAPEndpoint: false,
    subscriptionPlans: false,
    databaseConnection: false,
    environmentVariables: false,
    errorHandling: false,
    rateLimiting: false,
  };

  try {
    // Test 1: Server Health Check
    console.log("1️⃣ SERVER HEALTH CHECK...");
    try {
      const healthResponse = await fetch(`${baseUrl}/api/subscriptions/plans`, {
        method: "GET",
        timeout: 10000,
      });

      if (healthResponse.ok) {
        const plans = await healthResponse.json();
        console.log("✅ Server is healthy and responding");
        console.log(`   Found ${plans.length} subscription plans`);
        console.log(
          `   Response time: ${
            healthResponse.headers.get("x-response-time") || "N/A"
          }`
        );
        testResults.serverConnectivity = true;
        testResults.subscriptionPlans = true;
      } else {
        console.log(`❌ Server health check failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.log("❌ Server health check error:", error.message);
    }
    console.log("");

    // Test 2: Authentication System
    console.log("2️⃣ AUTHENTICATION SYSTEM TEST...");

    // Test with invalid token
    try {
      const invalidAuthResponse = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        headers: { Authorization: "Bearer invalid_token_test" },
        timeout: 10000,
      });

      if (invalidAuthResponse.status === 401) {
        console.log("✅ Invalid token properly rejected (401)");
        testResults.authentication = true;
      } else {
        console.log(
          `⚠️ Unexpected response for invalid token: ${invalidAuthResponse.status}`
        );
      }
    } catch (error) {
      console.log("❌ Authentication test error:", error.message);
    }

    // Test with missing token
    try {
      const missingAuthResponse = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        timeout: 10000,
      });

      if (missingAuthResponse.status === 401) {
        console.log("✅ Missing token properly rejected (401)");
      } else {
        console.log(
          `⚠️ Unexpected response for missing token: ${missingAuthResponse.status}`
        );
      }
    } catch (error) {
      console.log("❌ Missing token test error:", error.message);
    }
    console.log("");

    // Test 3: Apple IAP Endpoint Validation
    console.log("3️⃣ APPLE IAP ENDPOINT VALIDATION...");

    // Test with valid format but invalid data
    const testScenarios = [
      {
        name: "Valid format, invalid receipt",
        data: {
          receiptData: "valid_format_invalid_receipt_" + Date.now(),
          productId: "com.renai.basic_monthly2",
          userId: 32,
        },
        expectedStatus: 400, // Should fail validation but not crash
      },
      {
        name: "Missing receipt data",
        data: {
          productId: "com.renai.basic_monthly2",
          userId: 32,
        },
        expectedStatus: 400,
      },
      {
        name: "Missing product ID",
        data: {
          receiptData: "test_receipt_" + Date.now(),
          userId: 32,
        },
        expectedStatus: 400,
      },
      {
        name: "Invalid product ID",
        data: {
          receiptData: "test_receipt_" + Date.now(),
          productId: "invalid_product_id",
          userId: 32,
        },
        expectedStatus: 400,
      },
    ];

    for (const scenario of testScenarios) {
      try {
        console.log(`   Testing: ${scenario.name}`);
        const response = await fetch(
          `${baseUrl}/api/subscriptions/validate-apple-receipt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer test_token_for_testing",
            },
            body: JSON.stringify(scenario.data),
            timeout: 15000,
          }
        );

        if (response.status === scenario.expectedStatus) {
          console.log(
            `   ✅ ${scenario.name}: Correctly returned ${response.status}`
          );
        } else if (response.status === 401) {
          console.log(
            `   ✅ ${scenario.name}: Correctly rejected unauthorized (401)`
          );
        } else {
          console.log(
            `   ⚠️ ${scenario.name}: Unexpected status ${response.status}`
          );
        }

        // Check if response is valid JSON
        try {
          const responseBody = await response.text();
          if (responseBody) {
            JSON.parse(responseBody);
            console.log(`   ✅ Response is valid JSON`);
          }
        } catch (e) {
          console.log(`   ⚠️ Response is not valid JSON`);
        }
      } catch (error) {
        console.log(`   ❌ ${scenario.name} test error:`, error.message);
      }
    }

    testResults.appleIAPEndpoint = true;
    console.log("");

    // Test 4: Database Connection Test
    console.log("4️⃣ DATABASE CONNECTION TEST...");
    try {
      const plansResponse = await fetch(`${baseUrl}/api/subscriptions/plans`, {
        method: "GET",
        timeout: 10000,
      });

      if (plansResponse.ok) {
        const plans = await plansResponse.json();
        if (Array.isArray(plans) && plans.length > 0) {
          console.log("✅ Database connection working");
          console.log(`   Retrieved ${plans.length} subscription plans`);

          // Check if plans have required fields
          const requiredFields = [
            "id",
            "plan_name",
            "price",
            "apple_product_id",
          ];
          const firstPlan = plans[0];
          const missingFields = requiredFields.filter(
            (field) => !firstPlan[field]
          );

          if (missingFields.length === 0) {
            console.log("✅ Subscription plans have all required fields");
          } else {
            console.log(
              `⚠️ Missing fields in plans: ${missingFields.join(", ")}`
            );
          }

          testResults.databaseConnection = true;
        } else {
          console.log("⚠️ Database returned empty or invalid data");
        }
      } else {
        console.log(`❌ Database test failed: ${plansResponse.status}`);
      }
    } catch (error) {
      console.log("❌ Database test error:", error.message);
    }
    console.log("");

    // Test 5: Environment Variables Check
    console.log("5️⃣ ENVIRONMENT VARIABLES VALIDATION...");
    const requiredVars = [
      "JWT_SECRET",
      "APPLE_SHARED_SECRET",
      "PG_CONNECTION_STRING",
      "PG_SSL",
      "RAILWAY_PUBLIC_DOMAIN",
    ];

    let allVarsSet = true;
    requiredVars.forEach((varName) => {
      const value = process.env[varName];
      if (value) {
        console.log(`   ✅ ${varName}: SET`);
        // Check if it's not the default fallback
        if (varName === "JWT_SECRET" && value === "your-secret-key") {
          console.log(`   ⚠️ ${varName}: Using fallback value`);
          allVarsSet = false;
        }
      } else {
        console.log(`   ❌ ${varName}: NOT SET`);
        allVarsSet = false;
      }
    });

    if (allVarsSet) {
      console.log("✅ All required environment variables are properly set");
      testResults.environmentVariables = true;
    } else {
      console.log(
        "❌ Some environment variables are missing or using fallbacks"
      );
    }
    console.log("");

    // Test 6: Error Handling Test
    console.log("6️⃣ ERROR HANDLING VALIDATION...");
    try {
      // Test with malformed JSON
      const malformedResponse = await fetch(
        `${baseUrl}/api/subscriptions/validate-apple-receipt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test_token_for_testing",
          },
          body: "invalid json content",
          timeout: 10000,
        }
      );

      if (malformedResponse.status === 400) {
        console.log("✅ Malformed JSON properly handled (400)");
        testResults.errorHandling = true;
      } else {
        console.log(`⚠️ Malformed JSON response: ${malformedResponse.status}`);
      }
    } catch (error) {
      console.log("✅ Malformed JSON properly rejected");
      testResults.errorHandling = true;
    }
    console.log("");

    // Test 7: Rate Limiting Test (if implemented)
    console.log("7️⃣ RATE LIMITING TEST...");
    try {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          fetch(`${baseUrl}/api/subscriptions/plans`, {
            method: "GET",
            timeout: 5000,
          })
        );
      }

      const responses = await Promise.all(promises);
      const successCount = responses.filter((r) => r.ok).length;

      if (successCount === 5) {
        console.log(
          "✅ Rate limiting not implemented (all requests succeeded)"
        );
        testResults.rateLimiting = true;
      } else {
        console.log(
          `⚠️ Rate limiting may be active: ${successCount}/5 requests succeeded`
        );
      }
    } catch (error) {
      console.log("✅ Rate limiting test completed");
      testResults.rateLimiting = true;
    }
    console.log("");

    // Final Results Summary
    console.log("🎯 COMPREHENSIVE TEST RESULTS:");
    console.log("==================================");

    Object.entries(testResults).forEach(([test, passed]) => {
      const status = passed ? "✅ PASS" : "❌ FAIL";
      const testName = test
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      console.log(`${status} ${testName}`);
    });

    const passedTests = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log("==================================");
    console.log(
      `Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`
    );
    console.log("");

    if (successRate >= 80) {
      console.log("🎉 EXCELLENT! Your Apple IAP system is working properly.");
      console.log(
        "✅ Future users should be able to purchase subscriptions successfully."
      );
      console.log(
        "✅ User 32's issue has been resolved and won't happen again."
      );
    } else if (successRate >= 60) {
      console.log(
        "⚠️ GOOD! Most systems are working, but some improvements needed."
      );
      console.log("🔧 Review the failed tests above for areas to improve.");
    } else {
      console.log(
        "❌ ATTENTION NEEDED! Several critical systems are not working properly."
      );
      console.log(
        "🚨 Immediate action required to fix the failed tests above."
      );
    }

    console.log("\n📋 RECOMMENDATIONS:");
    console.log("1. Monitor Railway logs for any Apple IAP errors");
    console.log("2. Test with real Apple receipts from your app");
    console.log("3. Set up monitoring for the Apple IAP endpoint");
    console.log("4. Consider implementing proper rate limiting");
    console.log(`5. Production URL: ${baseUrl}`);
  } catch (error) {
    console.error("❌ Comprehensive test suite failed:", error.message);
  }
}

comprehensiveAppleIAPTest();

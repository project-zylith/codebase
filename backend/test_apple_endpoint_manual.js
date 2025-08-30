require("dotenv").config();
const fetch = require("node-fetch");

async function testAppleEndpoint() {
  console.log("🧪 TESTING APPLE IAP ENDPOINT MANUALLY...\n");

  try {
    // Test the endpoint with sample data
    const testData = {
      receiptData: "sample_receipt_data_for_testing",
      productId: "com.renai.basic_monthly2",
      userId: 32,
    };

    console.log("1️⃣ Testing with sample data...");
    console.log("Request payload:", JSON.stringify(testData, null, 2));
    console.log("");

    // Test the endpoint
    const response = await fetch(
      "http://localhost:3000/api/subscriptions/validate-apple-receipt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test_token_for_testing",
        },
        body: JSON.stringify(testData),
      }
    );

    console.log("2️⃣ Response Status:", response.status);
    console.log("Response Headers:", response.headers);
    console.log("");

    if (response.ok) {
      const result = await response.json();
      console.log("✅ SUCCESS Response:");
      console.log(JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log("❌ ERROR Response:");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Body:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.log("Parsed Error:", JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log("Could not parse error as JSON");
      }
    }
  } catch (error) {
    console.log("❌ Network/Connection Error:");
    console.log("Error:", error.message);
    console.log("");
    console.log("🔧 TROUBLESHOOTING:");
    console.log("1. Is your backend server running on port 3000?");
    console.log(
      "2. Check if the server is accessible at http://localhost:3000"
    );
    console.log("3. Look for any error logs in your backend console");
    console.log("4. Verify the endpoint route is properly configured");
  }

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Start your backend server: npm start");
  console.log("2. Check backend logs for Apple IAP errors");
  console.log(
    "3. Verify the /api/subscriptions/validate-apple-receipt route exists"
  );
  console.log("4. Test with real Apple receipt data");
}

testAppleEndpoint();

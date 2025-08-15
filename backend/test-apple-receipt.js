// Test script for Apple Receipt Validation
// Run with: node test-apple-receipt.js

const {
  AppleReceiptValidator,
} = require("./dist/src/services/appleReceiptValidation");

async function testReceiptValidation() {
  console.log("🧪 Testing Apple Receipt Validation Service...\n");

  const validator = new AppleReceiptValidator();

  // Test with a dummy receipt (this will fail, but tests the service structure)
  const dummyReceipt = "dummy_receipt_data_base64_encoded";

  try {
    console.log("📱 Testing receipt validation...");
    const result = await validator.validateReceipt(dummyReceipt);

    console.log("✅ Validation result:", {
      isValid: result.isValid,
      environment: result.environment,
      error: result.error,
    });

    if (!result.isValid) {
      console.log("❌ Expected failure with dummy receipt");
      console.log("🔍 Error details:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }

  // Test error message mapping
  console.log("\n📋 Testing error message mapping...");
  const testStatuses = [
    0, 21000, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21010, 21099,
  ];

  testStatuses.forEach((status) => {
    const errorMessage = validator.getErrorMessage
      ? validator.getErrorMessage(status)
      : "Method not accessible";
    console.log(`Status ${status}: ${errorMessage}`);
  });

  console.log("\n🎯 Test completed!");
  console.log("💡 To test with real receipts, use the API endpoints:");
  console.log("   POST /api/subscriptions/validate-apple-receipt");
  console.log("   POST /api/subscriptions/:id/refresh-apple-receipt");
  console.log("   GET /api/subscriptions/:id/apple-receipt-status");
}

// Run the test
testReceiptValidation().catch(console.error);

const { execSync } = require("child_process");

try {
  console.log("🔍 Testing TypeScript compilation...");
  execSync("npx tsc --noEmit", { stdio: "inherit" });
  console.log("✅ TypeScript compilation successful!");

  console.log("🔍 Building project...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build successful!");
} catch (error) {
  console.error("❌ Compilation failed:", error.message);
  process.exit(1);
}

const bcrypt = require("bcryptjs");

async function generateRealPasswordHashes() {
  const SALT_ROUNDS = 10;
  const commonPassword = "password123"; // Common password for all test users

  console.log("🔐 Generating real bcrypt hashes...");

  // Generate real hashes for each user
  const users = [
    { username: "cool_cat", password: "password123" },
    { username: "wowow", password: "password123" },
    { username: "iaso", password: "password123" },
    { username: "google_user", password: "password123" },
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    console.log(`${user.username}: ${hash}`);
  }

  console.log("\n📝 Copy these hashes to your seed file!");
  console.log('All users can login with password: "password123"');
}

generateRealPasswordHashes();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function hashAndVerify() {
  const adminPassword = "admin123";
  const userPassword = "user123";

  console.log("Generating fresh hashes...");
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log(`Admin Hash: ${adminHash}`);
  console.log(`User Hash: ${userHash}`);

  // Test compare
  const isMatchAdmin = await bcrypt.compare(adminPassword, adminHash);
  console.log(`Verification - Admin password match: ${isMatchAdmin}`);

  try {
    // Update the database with these fresh hashes
    console.log("Updating database user hashes...");
    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [adminHash, "admin@vibhuti.com"]
    );
    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [userHash, "user@vibhuti.com"]
    );
    console.log("User hashes successfully updated in the database!");
    process.exit(0);
  } catch (error) {
    console.error("Database update failed:", error);
    process.exit(1);
  }
}

hashAndVerify();

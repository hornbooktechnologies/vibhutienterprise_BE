const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function initDb() {
  console.log("Database Initializer started...");

  // Connection config without DB name first to ensure database creation
  const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    multipleStatements: true, // Enable multiple statements support
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log("Connected to MySQL server successfully.");

    // Read schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    console.log("Reading schema.sql...");
    
    // Execute schema statements
    await connection.query(schemaSql);
    console.log("Schema created successfully.");

    // Read seed.sql
    const seedPath = path.join(__dirname, "seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf8");
    console.log("Reading seed.sql...");

    // Execute seed statements
    await connection.query(seedSql);
    console.log("Seed data injected successfully.");

    console.log("Database initialization completed with 100% success!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

initDb();

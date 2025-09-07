const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Use absolute path for the database file
const dbPath = path.join(__dirname, "users.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connection error:", err);
    console.error("Database path:", dbPath);
  } else {
    console.log("SQLite database connected successfully.");
    console.log("Database path:", dbPath);
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table created or already exists.");
    }
  }
);

module.exports = db;

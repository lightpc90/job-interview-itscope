const db = require("../db")

// Define the user table schema
const users = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

// Create the user table if it doesn't exist
db.none(users)
  .then(() => {
    console.log("User table created or already exists.");
  })
  .catch((error) => {
    console.error("Error creating user table:", error);
  });

module.exports = users
const db = require("../db")

// Define the user table schema
const users = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    firstName text,
    lastName text,
    role text NOT NULL,
    businessName text, 
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp DEFAULT current_timestamp
  )
`;
const createUserTable = (db) => {
  // Create the user table if it doesn't exist
  db.none(users)
    .then(() => {
      console.log("User table created or already exists.");
    })
    .catch((error) => {
      console.error("Error creating user table:", error);
    });
}


module.exports = createUserTable
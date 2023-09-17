const db = require("../db")

// Define the user table schema
const transactions = `
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    business_id VARCHAR(255) NOT NULL,
    amount VARCHAR(255) NOT NULL,
    quantity VARCHAR(255) NOT NULL,
    bought_at VARCHAR(255) NOT NULL
  )
`;

// Create the user table if it doesn't exist
db.none(transactions)
  .then(() => {
    console.log("Transaction table created or already exists.");
  })
  .catch((error) => {
    console.error("Error creating transaction table:", error);
  });

module.exports = transactions;

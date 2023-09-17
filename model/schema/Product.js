const db = require("../db")

// Define the user table schema
const products = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imagesUrls VARCHAR(255) NOT NULL,
    business_id VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    quantity VARCHAR(255) NOT NULL
    amount VARCHAR(255) NOT NULL
  )
`;

// Create the user table if it doesn't exist
db.none(products)
  .then(() => {
    console.log("Product table created or already exists.");
  })
  .catch((error) => {
    console.error("Error creating product table:", error);
  });

  module.exports = products
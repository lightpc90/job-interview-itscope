
// Define the product table schema
const products = `
  -- Create the product table if it doesn't exist
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    imagesUrls text[] NOT NULL,
    business_id text NOT NULL,
    status text NOT NULL,
    quantity text NOT NULL,
    amount text NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp
  );
`;

// Create the product table, function, and trigger
const createProductTable = (db) => {  
  db.none(products)
    .then(() => {
      console.log("Product table created or already exists.");
      // Create the function
      return db.none(createFunction);
    })
    .catch((error) => {
      console.error(
        "Error creating product table",
        error
      );
    });

}
module.exports = createProductTable

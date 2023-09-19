const db = require("../db");

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

// Create the function to update the 'updated_at' timestamp if it doesn't exist
const createFunction = `
  CREATE OR REPLACE FUNCTION update_product_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

async function checkTriggerExistence() {
  // Table and trigger names
  const tableName = "products";
  const triggerName = "trigger_product_update_updated_at";

  // Query to check if the trigger exists
  const checkTriggerQuery = `
      SELECT trigger_name
      FROM information_schema.triggers
      WHERE event_object_table = $1 AND trigger_name = $2;
    `;

  // Execute the query
  const result = await db.oneOrNone(checkTriggerQuery, [
    tableName,
    triggerName,
  ]);

  return result;
}



// Create the trigger to call the update function before an update operation
const createTrigger = `
  CREATE TRIGGER trigger_product_update_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_updated_at();
`;

// Create the product table, function, and trigger
db.none(products)
  .then(() => {
    console.log("Product table created or already exists.");
    // Create the function
    return db.none(createFunction);
  })
  .then(() => {
    console.log(
      "Function update_product_updated_at created or already exists."
    );
    // Create the trigger
    const result = checkTriggerExistence();
    if (result) {
      return
    }
    return db.none(createTrigger);
  })
  .then(() => {
    console.log(
      "Trigger trigger_product_update_updated_at created or already exists."
    );
  })
  .catch((error) => {
    console.error(
      "Error creating product table, function, and trigger:",
      error
    );
  });

module.exports = products;

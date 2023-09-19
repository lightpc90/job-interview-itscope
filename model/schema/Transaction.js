const db = require("../db");

// Define the transactions table schema
const transactions = `
  -- Create the transactions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    buyer_id text NOT NULL,
    products_ids text[] NOT NULL,
    sellers_ids text[] NOT NULL,
    amounts text[] NOT NULL,
    quantities text[] NOT NULL,
    paymentId text NOT NULL,
    transaction_at timestamp
  );
`;

// Create the function to update the 'transaction_at' timestamp if it doesn't exist
const createFunction = `
  CREATE OR REPLACE FUNCTION update_transaction_transaction_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.transaction_at = current_timestamp;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;



async function checkTriggerExistence(db) {

    // Table and trigger names
    const tableName = "transactions";
    const triggerName = "trigger_transaction_update_transaction_at";

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
 
  return result  
}





// Create the trigger to call the update function before an update operation
const createTrigger = `
  CREATE TRIGGER trigger_transaction_update_transaction_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_transaction_at();
`;

// Create the transactions table, function, and trigger
const createTransactionTableFandT = (db) => {
  
db.none(transactions)
  .then(() => {
    console.log("Transaction table created or already exists.");
    // Create the function
    return db.none(createFunction);
  })
  .then(() => {
    console.log(
      "Function update_transaction_transaction_at created or already exists."
    );
    const result = checkTriggerExistence(db);
    if (result) {
      return;
    }
    // Create the trigger
    return db.none(createTrigger);
  })
  .then(() => {
    console.log(
      "Trigger trigger_transaction_update_transaction_at created or already exists."
    );
  })
  .catch((error) => {
    console.error(
      "Error creating transaction table, function, and trigger:",
      error
    );
  });
}

module.exports = createTransactionTableFandT;

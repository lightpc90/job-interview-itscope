
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

// Create the transactions table, function, and trigger
const createTransactionTable = (db) => {
  
db.none(transactions)
  .then(() => {
    console.log("Transaction table created or already exists.");
  })
  .catch((error) => {
    console.error(
      "Error creating transaction table",
      error
    );
  });
}

module.exports = createTransactionTable

const db = require("../model/db");
const transactions = require("../model/schema/Transaction");
transactions();

//############  function to get the list of all transactions  ###############
const allTransactions = async (req, res) => {
  try {
    const transactions = await db.many(`SELECT * FROM transactions`);
    if (transactions.length < 1)
      return res.status(200).json({ message: "No transaction has been made" });
    //when atleast a transaction has been made
    return res.status(200).json({ data: transactions });
  } catch (err) {
    console.error(" Internal Server error: ", err);
    return res.status(500).json({ message: "Internal server error: ", err });
  }
};

//############  function to add a new transaction  ###############
const addNewTransaction = async (req, res) => {
    const {product_id, business_id, user_id } = req.params
     const { quantity, amount } = req.body;
  try {
    const transaction = await db.one(
      "INSERT INTO transactions (user_id, product_id, business_id, amount, quantity, bought_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [user_id, product_id, business_id, amount, quantity, new Date().getDate()]
    );
    console.log("New transaction recorded: ", transaction);
    return res.status(200).json({ data: transaction });
  } catch (err) {
    console.error("Internal server error: ", err);
    return res.status(500).json({ message: "Internal server error: " });
  }
};

//############  function to get a transaction  ###############
const getSingleTransaction = async (req, res) => {
  const { id: transactionId } = req.params;
  const transaction = await db.one(`SELECT * FROM transactions WHERE id = $1`, [
    transactionId,
  ]);
  if (!transaction) {
    console.log("No transaction with Id: ", transactionId);
    return res.status(400).json({ error: `No transaction with Id ${transactionId}` });
  }

  res.status(200).json({ transaction });
};

//############  function to edit/update a transaction  ###############
const getMyTransactions = async (req, res) => {
  const { user_id } = req.params;

  try {
    //get the current user's transactions
    const myTransactions = await db.one(
      `SELECT * FROM transactions WHERE user_id=$1`,
      [user_id]
    );

    //if transaction not found
    if (!myTransactions) {
      console.log("No transaction for user with Id: ", user_id);
      return res.status(404).json({ error: `No transaction found with user with Id ${user_id}` });
    }

    //return the current user's transactions
    res.status(200).json({data: myTransactions});
  } catch (err) {
    console.log("Internal server error: ", err);
    return res
      .status(500)
      .json({ message: `Internal server error, error getting user transactions` });
  }
};



module.exports = {
    allTransactions,
    addNewTransaction,
    getMyTransactions,
    getSingleTransaction,
};

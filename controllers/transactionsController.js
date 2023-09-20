const db = require("../model/db");
const processTransaction = require("../helperFunctions/processTransaction")

//############  function to get the list of all transactions  ###############
const allTransactions = async (req, res) => {
  try {
    const transactions = await db.any(`SELECT * FROM transactions`);
    if (!transactions || transactions.length < 1){
          return res.status(201).json({ message: "No transaction has been made" })
      };
    //when atleast a transaction has been made
    return res.status(200).json({ data: transactions });
  } catch (err) {
    console.error(" Internal Server error: ", err);
    return res.status(500).json({ message: "Internal server error: ", err });
  }
};

//############  function to add a new transaction  ###############
const addNewTransaction = async (req, res) => {
  const user_id = req.user.userId
  const { cartItems } = req.body;
  console.log(cartItems)

    try {
      const transaction = await processTransaction(user_id, cartItems)
      console.log('transaction return: ',transaction)
      console.log("New transaction recorded: ");
      return res.status(200).json({ message: 'Transaction successful' });
    } catch (err) {
      console.error("Internal server error: ", err);
      return res.status(500).json({ message: "Internal server error: " });
    }
};


//############  function to get a transaction  ###############
const getSingleTransaction = async (req, res) => {
  const { transaction_id } = req.params;
  const transaction = await db.oneOrNone(`SELECT * FROM transactions WHERE id = $1`, [
    transaction_id,
  ]);
  if (!transaction) {
    console.log("No transaction with Id: ", transaction_id);
    return res.status(400).json({ error: `No transaction with Id ${transaction_id}` });
  }

  res.status(200).json({data: transaction });
};

//############  function to get a user transactions  ###############
const getMyTransactions = async (req, res) => {
    const user_id = req.params.user_id;
  try {
    //get the current user's transactions
    const myTransactions = await db.any(
      `SELECT * FROM transactions WHERE buyer_id=$1`,
      [user_id]
    );

    //if transaction not found
    if (!myTransactions || myTransactions.length < 1) {
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

//############  function to get a business transactions  ###############
const getMyBusinessTransactions = async (req, res) => {
  const { business_id } = req.params;
  console.log("business id: ", business_id)
  try {
    //get the transactions that the current business is involved
    const inclusiveTransactions = await db.any(
      `SELECT * FROM transactions WHERE $1=ANY(sellers_ids)`,
      [business_id]
    );
      console.log("inclusiveTransactions: ", inclusiveTransactions);
    //if transaction not found
    if (!inclusiveTransactions) {
      console.log("No transaction for business with Id: ", business_id);
      return res.status(404).json({ error: `No transaction found` });
    }
      const myTransactions = []
    //extract orders that are only for the current business from inclusiveTransactions 
      for (const myTransaction of inclusiveTransactions){
        const myPosition = myTransaction.sellers_ids.indexOf(business_id);

        //extracted transaction for the current business
        const eachTransction = {
          id: `${Math.random()-new Date()}`,
          product_id: myTransaction.products_ids[myPosition],
          buyer_id: myTransaction.buyer_id[myPosition],
          amount: myTransaction.amounts[myPosition],
          quantity: myTransaction.quantities[myPosition],
          paymentId: myTransaction.paymentId,
          transaction_at: myTransaction.transaction_at,
        };
        console.log("each transaction: ", eachTransction)
        myTransactions.push(eachTransction)
      }


    //return the current business's transactions
    res.status(200).json({data: myTransactions});
  } catch (err) {
    console.log("Internal server error: ", err);
    return res
      .status(500)
      .json({ message: `Internal server error, error getting business transactions` });
  }
};



module.exports = {
  allTransactions,
  addNewTransaction,
  getMyTransactions,
  getSingleTransaction,
  getMyBusinessTransactions,
};

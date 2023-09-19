const db = require("../model/db");
const fakePaymentApi = require('../helperFunctions/fakePaymentApi')
const transactions = require("../model/schema/Transaction");

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
    const user_id = req.user.userId
    const { items: cartItems } = req.body;
    
    try {
        if (!cartItems || cartItems.length < 1) {
          return res.status(400).json({error: 'No items in cart'})
        }

        //cart is not empty
        let productsIds = []
        let sellersIds = []
        let amounts = []
        let quantities = []
        let total = 0

        for (const item of cartItems) {
            const itemIsAvailable = await db.one(
                "SELECT * FROM products WHERE id=$1 AND quantities>=$2", [item.id, item.quantity]
            )
            if (!itemIsAvailable) {
                return res.status(404).json({error: `${item.name} is not available or quantity requested is bigger than what is available`})
            }

            //if item is available
            const { seller_id } = itemIsAvailable

            productsIds.push(item.id)
            sellersIds.push(seller_id)
            amounts.push(item.amount)
            quantities.push(item.quantity)
            
            //cost of each item(s) bought
            total += item.amount * item.quantity
        }

        //make payment
        const paymentId = await fakePaymentApi(total)
        
    const transaction = await db.one(
      "INSERT INTO transactions (buyer_id, products_ids, sellers_ids, amounts, quantities, paymentId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [user_id, productsIds, sellersIds, amounts, quantities, paymentId]
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
  const { transaction_id } = req.params;
  const transaction = await db.one(`SELECT * FROM transactions WHERE id = $1`, [
    transaction_id,
  ]);
  if (!transaction) {
    console.log("No transaction with Id: ", transaction_id);
    return res.status(400).json({ error: `No transaction with Id ${transaction_id}` });
  }

  res.status(200).json({ transaction });
};

//############  function to get a user transactions  ###############
const getMyTransactions = async (req, res) => {
    const { user_id } = req.params;
    const current_userId = req.user.userId
    if(current_userId !== user_id) return res.status(401).json({message: 'access denied: unauthorized user'})
  try {
    //get the current user's transactions
    const myTransactions = await db.many(
      `SELECT * FROM transactions WHERE buyer_id=$1`,
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

//############  function to get a business transactions  ###############
const getMyBusinessTransactions = async (req, res) => {
    const { business_id } = req.params;
    const current_userId = req.user.userId
    if(current_userId !== business_id) return res.status(401).json({message: 'access denied: unauthorized user'})
  try {
    //get the transactions that the current business is involved
    const inclusiveTransactions = await db.many(
      `SELECT * FROM transactions WHERE $1=ANY(sellers_ids)`,
      [seller_id]
    );

    //if transaction not found
    if (!inclusiveTransactions) {
      console.log("No transaction for business with Id: ", user_id);
      return res.status(404).json({ error: `No transaction found` });
    }
      const myTransactions = []
    //extract orders that are only for the current business from inclusiveTransactions 
      for (let i = 0; i < inclusiveTransactions.length; i++){
        const myPosition = inclusiveTransactions[i].sellers_ids.indexOf(seller_id);

        //extracted transaction for the current business
        const eachTransction = {
          id: inclusiveTransactions[i].id,
          product_id: inclusiveTransactions[i].products_ids[myPosition],
          buyer_id: inclusiveTransactions[i].buyers_ids[myPosition],
          amount: inclusiveTransactions[i].amounts[myPosition],
          quantity: inclusiveTransactions[i].quantities[myPosition],
          paymentId: inclusiveTransactions[i].paymentId,
          transaction_at: inclusiveTransactions[i].transaction_at,
        };
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

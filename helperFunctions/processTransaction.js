const db = require("../model/db");
const callPaymentAPI = require("./fakePaymentApi")

const processTransaction = async (userId, cartItems) => {
  
  const handleTransaction = async(req, res) => {
    db.tx(async (transaction) => {
      console.log("start of transaction...");
      // Start a database transaction
      // Check product availability and calculate total price
      let totalPrice = 0;

      let productsIds = [];
      let sellersIds = [];
      let amounts = [];
      let quantities = [];
      console.log("start of iterating through cartItems");
      for (const cartItem of cartItems) {
        console.log(
          `cartItem quantity: ${cartItem.quantity}, product id to be fetched: ${cartItem.product_id}`
        );
        //get the product data
        const product = await transaction.oneOrNone(
          "SELECT * FROM products WHERE id=$1",
          [cartItem.product_id]
        );
        console.log(`product fetched: ${product}`);
        const productQty = parseInt(product?.quantity);
        const cartItemQty = parseInt(cartItem.quantity);
        console.log(`${productQty} - ${cartItem.quantity}`);
        if (!product || productQty < cartItemQty) {
          throw new Error("Product not available in sufficient quantity.");
        }
        totalPrice += product.amount * cartItem.quantity;

        productsIds.push(cartItem.product_id);
        sellersIds.push(product.business_id);
        amounts.push(product.amount);
        quantities.push(cartItem.quantity);
        console.log("item passed...");
      }

      // Call Payment API (simulated)
      console.log("entering payment gateway...");
      const paymentResult = await callPaymentAPI(totalPrice);
      console.log("return from payment gateway: ", paymentResult.success);

      if (paymentResult.success) {
        console.log("payment made and receipt returned");
        // Store transaction details
        console.log("recording the transaction into the transaction table... ");
        const transactionId = await transaction.one(
          "INSERT INTO transactions (buyer_id, products_ids, sellers_ids, amounts, quantities, paymentId, transaction_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          [
            userId,
            productsIds,
            sellersIds,
            amounts,
            quantities,
            paymentResult.paymentId,
            new Date(),
          ]
        );
        console.log(`transactionId: ${transactionId}`);
        if (!transactionId) {
          console.log("failed to record the transaction");
          throw new Error("failed to record the txs");
        }
        // Update product quantities and mark items as purchased
        for (const cartItem of cartItems) {
          console.log("update each product quantity..");
          const productQty = await transaction.oneOrNone(
            "SELECT quantity FROM products WHERE id=$1",
            [cartItem.product_id]
          );
          console.log("product quantity returned: ", productQty);
          await transaction.none(
            "UPDATE products SET quantity=$1-$2 WHERE id=$3",
            [productQty.quantity, cartItem.quantity, cartItem.product_id]
          );
        }
        // Transaction succeeded
        return { success: true };
      } else {
        //if payment failed
        throw new Error("Payment failed.");
      }
    })
      .then((data) => {
        // success, COMMIT was executed
        console.log("successfully committed... ");
        console.log("transaction successful: ", data);
        return data;
      })
      .catch((error) => {
        // failure, ROLLBACK was executed
        console.log("transaction failed: ", error);
        return res.status(302).json({error: error})
      });

  }

  await handleTransaction()
  
}

module.exports = processTransaction
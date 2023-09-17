const express = require("express");
const router = express.Router();
const {
  allTransactions,
  addNewTransaction,
  getMyTransactions,
  getSingleTransaction,
} = require("../controllers/transactionsController");


router.route("/").get(allTransactions);
router.route("/transaction/:business_id/:product_id/:user_id").post(addNewTransaction);
router
  .route("/transaction/:id")
    .get(getSingleTransaction);
router
    .route('/myTransactions/:user_id')
    .get(getMyTransactions)

module.exports = router;

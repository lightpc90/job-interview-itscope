const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin")
const {
  allTransactions,
  addNewTransaction,
  getMyTransactions,
  getSingleTransaction,
  getMyBusinessTransactions,
} = require("../controllers/transactionsController");


router.route("/").get(isAdmin, allTransactions);

router.route("/transaction/").post(addNewTransaction);

router.route("/transaction/:transaction_id/").get(getSingleTransaction);
  

router.route('/my-transactions/:user_id')
    .get(getMyTransactions)

router.route("/my-business-transactions/:business_id").get(getMyBusinessTransactions);


module.exports = router;

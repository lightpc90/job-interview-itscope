const express = require("express");
const router = express.Router();
const verifyParam = require("../middleware/verifyParam")
const isAdmin = require("../middleware/isAdmin")
const isVerifiedBusiness = require("../middleware/isVerifiedBusiness")
const {
  allTransactions,
  addNewTransaction,
  getMyTransactions,
  getSingleTransaction,
  getMyBusinessTransactions,
} = require("../controllers/transactionsController");


router.get("/", isAdmin, allTransactions);

router.post("/transaction/:user_id", verifyParam, addNewTransaction);

router.get("/transaction/:transaction_id/", isAdmin, getSingleTransaction); 

router.get('/my-transactions/:user_id', verifyParam, getMyTransactions)

router.get("/my-business-transactions/:business_id", isVerifiedBusiness, getMyBusinessTransactions);


module.exports = router;

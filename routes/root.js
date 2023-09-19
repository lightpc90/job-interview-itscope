const express = require("express");
const router = express.Router();
const {
  allProducts,
  getSingleProduct,
} = require("../controllers/productsController");

router.get("/", allProducts);
router.get("/product/:product_id", getSingleProduct);

module.exports = router;
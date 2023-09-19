const express = require("express");
const router = express.Router();
const { allProducts } = require("../controllers/productsController");

router.get("/", allProducts);

module.exports = router;
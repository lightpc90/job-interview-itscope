const express = require("express")
const router = express.Router()
const {
  allProducts,
    getSingleProduct,
    getBusinessProducts,
    addNewProduct,
    updateProduct,
    handleProductDelete,
} = require("../controllers/productsController");

router.route('/')
    .get(allProducts)

router.route("/new-product/")
    .post(addNewProduct);

router.route('/product/:id')
    .get(getSingleProduct)
    .patch(updateProduct)
    .delete(handleProductDelete);

router.route('/:business_id/products/').get(getBusinessProducts)

module.exports = router
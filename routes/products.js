const express = require("express")
const router = express.Router()
const isAdmin = require("../middleware/isAdmin")
const isVerifiedBusiness = require("../middleware/isVerifiedBusiness")
const {
    allProducts,
    getSingleProduct,
    getBusinessProducts,
    addNewProduct,
    updateProduct,
    handleProductDelete,
} = require("../controllers/productsController");


router.route('/')
    .get(isAdmin, allProducts)

router.route("/new-product/")
    .post(isVerifiedBusiness, addNewProduct);

router.route('/product/:product_id/:business_id')
    .get(getSingleProduct)
    .patch(isVerifiedBusiness, updateProduct)
    .delete(isVerifiedBusiness, handleProductDelete);

router.route('/:business_id/products/').get(isVerifiedBusiness, getBusinessProducts)

module.exports = router
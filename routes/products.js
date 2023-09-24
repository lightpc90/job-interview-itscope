const express = require("express")
const router = express.Router()
const isAdmin = require("../middleware/isAdmin")
const upload = require("../middleware/multer-config")
const isValidProduct = require("../middleware/isValidProduct")
const isVerifiedBusiness = require("../middleware/isVerifiedBusiness")
const {
    getBusinessProducts,
    addNewProduct,
    updateProduct,
    handleProductDelete,
} = require("../controllers/productsController");

// upload.array('images', 5) =>> the file name must be images from the client with max of 5 images
router.route("/new-product/:business_id")
    .post(isVerifiedBusiness, isValidProduct, upload.array('images', 5), addNewProduct);

router.route('/product/:product_id/:business_id')
    .patch(isVerifiedBusiness, isValidProduct, updateProduct)
    .delete(isVerifiedBusiness, handleProductDelete);

router.route('/:business_id/products/').get(isVerifiedBusiness, getBusinessProducts)

module.exports = router
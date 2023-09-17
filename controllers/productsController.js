const db = require("../model/db")
const products = require("../model/schema/Product")
products()


//############  function to get the list of all products  ###############
const allProducts = async (req, res) => {
    try {
        const products = await db.many(`SELECT * FROM products`);
        if (products.length < 1) return res.status(200).json({ message: 'No product has been listed' })
        //when atleast a product has been listed
        return res.status(200).json({data: products})
    } catch (err) {
        console.error(" Internal Server error: ", err);
        return res.status(500).json({message: 'Internal server error: '})
    }
    
}


//############  function to add a new product  ###############
const addNewProduct = async (req, res) => {
    const {business_id} = req.params.business_id
    try {
        const {name, imagesUrls, status, quantity, amount} = req.body
        const product = await db.one(
          "INSERT INTO products (name, imagesurls, business_id, status, quantity, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [name, imagesUrls, business_id, status, quantity, amount ]
        );
        console.log("Successfully added a new product: ", product)
        return res.status(200).json({data: product})
    } catch (err) {
        console.error("Internal server error: ", err)
        return res.status(500).json({message: 'Internal server error: '})
    }
}


//############  function to get a product  ###############
const getSingleProduct = async(req, res) => {
    const { id: productId } = req.params
    const product = await db.one(`SELECT * FROM products WHERE id = $1`, [productId])
    if (!product) {
        console.log("No product with Id: ", productId)
        return res.status(400).json({error: `No product with Id ${productId}`})
    }
    
    res.status(200).json({product})
}


//############  function to get the products of a business  ###############
const getBusinessProducts = async(req, res) => {
    const { id: business_id } = req.params
    const businessProducts = await db.many(`SELECT * FROM products WHERE business_id = $1`, [business_id])
    if (!businessProducts) {
        console.log("No product with business Id: ", business_id)
        return res.status(404).json({error: `No product with business Id ${business_id}`})
    }
    res.status(200).json({data: businessProducts})
}

//############  function to edit/update a product  ###############
const updateProduct = async(req, res) => {
  const { id: productId, business_id } = req.params;
  const { name, imagesurls, status, quantity, amount } = req.body;

    try {
      //update the product
      const updatedProduct = await db.one(
        `UPDATE products SET name=$1, imagesurls=$2, status=$3, quantity=$4, amount=$5 WHERE id=$6 AND business_id=$7 RETURNING *`,
        [name, imagesurls, status, quantity, amount, productId, business_id]
      );

      //if product not found or does not belong to the business
      if (!updatedProduct) {
        console.log("The product is not found for the business");
        return res
          .status(404)
          .json({ error: `Product not found in business' products` });
      }

      //return the updated product
      res.status(200).json({data: updatedProduct});
    } catch (err) {
        console.log("Internal server error: ", err)
        return res.status(500).json({message: `Internal server error, error updating the product`})
    }

}

//############  function to delete a product  ###############
const handleProductDelete = async(req, res) => {
    const { id: productId, business_id } = req.params

    try {
        //check if the product exists and it belongs to the current business before attempting deletion
        const existingProduct = await db.oneOrNone(`SELECT * FROM products  WHERE id=$1 AND business_id = $2`, [productId, business_id])

        if (!existingProduct) {
            return res.status(404).json({message: `product not found`})
        }

        //Delete the product from the database
        await db.none(`DELETE FROM products WHERE id=$1`, [productId])
        res.status(200).json({message: `Product deleted successfully`})
    } catch (err) {
        console.error(`Error deleting product: `, err)
        res.status(500).json({message: `Internal server error`})
    }
}

module.exports = {
    allProducts,
    getSingleProduct,
    getBusinessProducts,
    addNewProduct,
    updateProduct,
    handleProductDelete
}
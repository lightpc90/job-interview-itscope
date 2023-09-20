const db = require("../model/db")


//############  function to get the list of all products  ###############
const allProducts = async (req, res) => {
    try {
        const products = await db.any(`SELECT * FROM products`);
        if (!products || products.length < 1) return res.status(400).json({ message: 'No product has been listed' })
        //when atleast a product has been listed
        return res.status(200).json({data: products})
    } catch (err) {
        console.error(" Internal Server error: ", err);
        return res.status(500).json({message: 'Internal server error: '})
    }
    
}


//############  function to add a new product  ###############
const addNewProduct = async (req, res) => {
    const {business_id} = req.params
    const {name, imagesUrls, status, quantity, amount} = req.body
    try {
        const product = await db.oneOrNone(
          "INSERT INTO products (name, imagesurls, business_id, status, quantity, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [name, imagesUrls, business_id, status, quantity, amount ]
        );
        console.log("Successfully added a new product: ", product)
        return res.status(200).json({data: product, message: 'Successfully added a new product to your store'})
    } catch (err) {
        console.error("Internal server error: ", err)
        return res.status(500).json({message: 'Internal server error: '})
    }
}


//############  function to get a product  ###############
const getSingleProduct = async(req, res) => {
    const { product_id } = req.params
    const product = await db.oneOrNone(`SELECT * FROM products WHERE id = $1`, [product_id])
    if (!product) {
        console.log("No product with Id: ", product_id)
        return res.status(400).json({error: `No product with Id ${product_id}`})
    }
    
    res.status(200).json({product})
}


//############  function to get the products of a business  ###############
const getBusinessProducts = async(req, res) => {
    const { business_id } = req.params

    const businessProducts = await db.any(`SELECT * FROM products WHERE business_id = $1`, [business_id])
    if (!businessProducts) {
        console.log("No product with business Id: ", business_id)
        return res.status(404).json({error: `No product with business Id ${business_id}`})
    }
    res.status(200).json({message: 'success', data: businessProducts})
}

//############  function to edit/update a product of a business  ###############
const updateProduct = async (req, res) => {
    const {business_id, product_id } = req.params
  const {name, imagesurls, status, quantity, amount } = req.body;

    try {
      //update the product
      const updatedProduct = await db.oneOrNone(
        `UPDATE products SET name=$1, imagesurls=$2, status=$3, quantity=$4, amount=$5, updated_at=$6 WHERE business_id=$7 AND id=$8 RETURNING *`,
        [name, imagesurls, status, quantity, amount, new Date(), business_id, product_id]
      );
        console.log(updatedProduct)
      //if product not found 
      if (!updatedProduct) {
        console.log("product not found");
        return res
          .status(404)
          .json({ error: `Product not found` });
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
    const { product_id, business_id } = req.params

    try {
        //check if the product exists and it belongs to the current business before attempting deletion
        const existingProduct = await db.oneOrNone(`SELECT * FROM products  WHERE id=$1 AND business_id = $2`, [product_id, business_id])

        if (!existingProduct) {
            return res.status(404).json({message: `product not in your list of products`})
        }

        //Delete the product from the database
        await db.none(`DELETE FROM products WHERE id=$1`, [product_id])
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
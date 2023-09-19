//############  function to update a business  ###############
const updateBusiness = async (req, res) => {
    const {userId} = req.user
  const { businessName } = req.body;

  try {
    //include the business name for a user
    const updateBusinessName = await db.one(
      `UPDATE users SET businessName=$1 WHERE id=$2 RETURNING *`,
      [businessName, userId]
    );

    //if user was not found
    if (!updateBusinessName) {
      console.log("Failed to update the user's business name");
      return res
        .status(404)
        .json({ error: `failed to update the user's business name` });
    }

    //return the updated product
    res.status(200).json({ data: updateBusinessName });
  } catch (err) {
    console.log("Internal server error: ", err);
    return res
      .status(500)
      .json({ message: `Internal server error, error updating the product`, error: err });
  }
};

module.exports = {updateBusiness};
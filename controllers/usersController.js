const db = require("../model/db")

//############  function to update a business  ###############
const updateBusiness = async (req, res) => {
    const {userId} = req.user
  const { businessName, firstName, lastName } = req.body;

  try {
    //include the business name for a user
    const updateBusinessName = await db.one(
      `UPDATE users SET businessName=$1, firstName=$2, lastName=$3 WHERE id=$4 RETURNING *`,
      [businessName, firstName, lastName, userId]
    );

    //if user was not found
    if (!updateBusinessName) {
      console.log("Failed to update the user's business name");
      return res
        .status(404)
        .json({ error: `failed to update the user's business name` });
    }
      const data = {
        id: updateBusinessName.id,
        username: updateBusinessName.username,
        firstName: updateBusinessName.firstName,
        lastName: updateBusinessName.lastName,
        role: updateBusinessName.role,
        businessName: updateBusinessName.businessName,
      };
    //return the updated product
    res.status(200).json({ data });
  } catch (err) {
    console.log("Internal server error: ", err);
    return res
      .status(500)
      .json({ message: `Internal server error, error updating the product`, error: err });
  }
};

module.exports = {updateBusiness};
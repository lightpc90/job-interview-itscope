const db = require("../model/db");

const isAdmin = async (req, res, next) => {
  const { userId } = req.user;
  const current_user = await db.oneOrNone("SELECT * FROM users WHERE id=$1", [
    userId,
  ]);
  if (current_user.role !== "Admin") {
    return res
      .status(401)
      .json({
        message: 'unauthorized: your role must be "Admin" ',
      });
  }
  // check passed
  next();
};

module.exports = isAdmin;

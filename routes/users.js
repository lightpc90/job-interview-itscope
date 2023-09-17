const express = require("express");
const router = express.Router();
const {
 
} = require("../controllers/usersController");

router.route("/").get(allUsers);

router
  .route("/user/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(userAccountDelete);

module.exports = router;

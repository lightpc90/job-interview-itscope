const express = require("express");
const router = express.Router();
const { updateBusiness } = require("../controllers/usersController");

router
  .route("/:username/business").patch(updateBusiness)

module.exports = router;

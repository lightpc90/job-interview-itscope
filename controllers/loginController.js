require("dotenv").config();
const db = require("../model/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  try {
    const { user, email, pwd } = req.body;
    if (!(email || user) || !pwd)
      return res
        .status(400)
        .json({ message: "Username/Email and Password required" });

    const foundUser = await db.oneOrNone(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [user, email]
    );
    if (!foundUser) return res.sendStatus(401); //unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (!match) return res.status(401).json({ message: "Incorrect Password" });

    //if authentication passed
    const userInfo = {
      userId: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
      businessName: foundUser.businessName,
    };

    //create JWT
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    //send the token in the response
    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("error during login: ", err);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

module.exports = { handleLogin };

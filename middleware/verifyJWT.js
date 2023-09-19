require("dotenv").config();
const jwt = require("jsonwebtoken");
const { blacklistTokens } = require("../helperFunctions/addTokenToBlacklist");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  console.log(token);

  //check if the token is blacklisted
  if (blacklistTokens.includes(token)) {
    return res.status(401).json({ message: "Unauthorized: Token is invalid" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    //pass the user
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;

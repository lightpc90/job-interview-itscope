const {addTokenToBlacklist} = require("../helperFunctions/addTokenToBlacklist")

const handleLogout = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({error: "no access token or make sure it starts with 'Bearer ' "});
    const token = authHeader.split(" ")[1];
    //invalidate access token
   addTokenToBlacklist(token)
    res.status(204).json({message: 'You are successfully logged out'})
}

module.exports = {handleLogout}
const db = require("../model/db")
const bcrypt = require("bcrypt")

const handleRegistration = async (req, res) => {
    const { user, email, pwd, role } = req.body;
    if(role !== "business" || role !== "user") return res.status(400).json({message: 'invalid role'})
  if (!user || !email || !pwd)
    return res
      .status(400)
      .json({ message: "Username, Email and Password are required" });

  // Check if the username or email already exists in the database
  const existingUser = await db.oneOrNone(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [user, email]
  );
    
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Username or email already exists." });
  }

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Insert the new user into the database
    const newUser = await db.one(
      "INSERT INTO users (username, role, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, role, email, hashedPwd]
    );

    console.log("successfully registered... ", result);
      res.status(201).json({
          success: `New user ${user} created!`,
userId: newUser.id});
  } catch (err) {
      console.log("error registering user: ", err)
    res.status(500).json({ message: err.message });
  }
}

module.exports = {handleRegistration}
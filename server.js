//load env file
require("dotenv").config();

//import express app
const express = require("express");
const app = express()

//import cross origin resource sharing...
const cors = require("cors")
const corsOptions = require("./config/corsOptions")

const verifyJWT = require("./middleware/verifyJWT")

const path = require("path")
const db = require("./model/db")

const PORT = process.env.PORT || 3500

//Cross Origin Resource Sharing...
app.use(cors(corsOptions))

//Middleware to parse JSON data
app.use(express.json())

// Middleware to parse form data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));



//routes
app.use('/api/v1/', require("./routes/root"))
app.use('/api/v1/register', require('./routes/register'))
app.use('/api/v1/login', require('./routes/login'))

app.use(verifyJWT);
app.use('/api/v1/logout', require('./routes/logout'))
//products route
app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/transactions', require('./routes/transactions'))

//to handle page-not-found error
app.all('*', (req, res) => {
    res.status(404).json({error: 'Page not Found'})
})


//Attempt to connect to the Database
db.connect()
    .then(() => {
      console.log(`Connected to the database`);
      // Start server after successful database connection
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
    console.error(`Error connecting to the database: `, err)
})
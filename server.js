//load env file
require("dotenv").config();

//import express app
const express = require("express");
const app = express()

//import cross origin resource sharing...
const cors = require("cors")
const corsOptions = require("./config/corsOptions")

//import middlewares
// const errorHandler = require("./middleware/errorHandler")

const verifyJWT = require("./middleware/verifyJWT")
const credentials = require("./middleware/credentials")

const cookieParser = require("cookie-parser")
const path = require("path")
const db = require("./model/db")

const PORT = process.env.PORT || 3500


//credential check before cors
// app.use(credentials);

//Cross Origin Resource Sharing...
app.use(cors(corsOptions))

//built-in middleware for json
app.use(express.json())

//middleware for cookies
// app.use(cookieParser())

//routes
// app.use('/', require('./routes/root'))
app.use('/api/v1/register', require('./routes/register'))
app.use('/api/v1/login', require('./routes/login'))

app.use(verifyJWT);
app.use('/api/v1/logout', require('./routes/logout'))

//products route
app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/transactions', require('./routes/transactions'))




app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" })
    }
    else {
        res.type("txt").send("404 Not Found")
    }
})

// app.use(errorHandler)


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
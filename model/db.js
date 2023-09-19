require("dotenv").config()
const pgp = require("pg-promise")();

const createProductTableFandT = require("./schema/Product")
const createTransactionTableFandT = require("./schema/Transaction");
const createUserTable = require("./schema/User");

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
};

const db = pgp(dbConfig);
 createProductTableFandT(db)
 createTransactionTableFandT(db)
 createUserTable(db)
module.exports = db;

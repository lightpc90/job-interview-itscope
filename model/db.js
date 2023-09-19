require("dotenv").config()
const pgp = require("pg-promise")();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
};

const db = pgp(dbConfig);

module.exports = db;


const pgp = require("pg-promise")();

const createProductTable = require("./schema/Product");
const createTransactionTable = require("./schema/Transaction");
const createUserTable = require("./schema/User");

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || process.env.AWS_DB_ENDPOINT,
  port: process.env.DB_PORT || process.env.AWS_DB_PORT,
  database: process.env.DB_NAME || process.env.AWS_DB_NAME,
  user: process.env.DB_USER || process.env.AWS_DB_USER,
  password: process.env.DB_PASSWORD || process.env.AWS_DB_PWD,
};

const db = pgp(dbConfig);
// createProductTable(db);
// createTransactionTable(db);
// createUserTable(db);
module.exports = db;

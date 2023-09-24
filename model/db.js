const response = require("../config/aws-env")
const pgp = require("pg-promise")();

const createProductTable = require("./schema/Product");
const createTransactionTable = require("./schema/Transaction");
const createUserTable = require("./schema/User");

const secret = response.SecretString;

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || secret.host,
  port: process.env.DB_PORT || secret.port,
  database: process.env.DB_NAME || secret.dbInstanceIdentifier,
  user: process.env.DB_USER || secret.username,
  password: process.env.DB_PASSWORD || secret.password,
};

const db = pgp(dbConfig);
createProductTable(db);
createTransactionTable(db);
createUserTable(db);
module.exports = db;

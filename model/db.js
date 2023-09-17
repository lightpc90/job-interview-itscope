require("dotenv").config()
const pgp = require("pg-promise")();

// Database connection configuration
const dbConfig = {
  host: "localhost", // Change this to your PostgreSQL server host
  port: 5432, // Change this to your PostgreSQL server port
  database: "marketplacedb", // Change this to your database name
  user: "admin", // Change this to your database user
  password: "Folahan/a90", // Change this to your database password
};

const db = pgp(dbConfig);

module.exports = db;

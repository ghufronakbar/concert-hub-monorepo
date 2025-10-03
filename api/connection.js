const mysql = require("mysql2");
require("dotenv").config();
const ENV = process.env;

//koneksi database
const conn = mysql.createConnection({
  host: ENV.DB_HOST || "localhost",
  user: ENV.DB_USER || "root",
  password: ENV.DB_PASSWORD || "",
  database: ENV.DB_NAME || "concert_hub",
  port: ENV.DB_PORT || 3306,
});

conn.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

module.exports = conn;

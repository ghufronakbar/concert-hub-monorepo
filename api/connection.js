const mysql = require("mysql2");
require("dotenv").config();
const ENV = process.env;

//koneksi database
const conn = mysql.createPool({
  host: ENV.DB_HOST || "mysql",
  user: ENV.DB_USER || "root",
  password: ENV.DB_PASSWORD || "",
  database: ENV.DB_NAME || "concert_hub",
  port: ENV.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

conn.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL pool connection error:", err.code, err.message);
    return;
  }
  console.log("MySQL Pool Connected");
  connection.release();
});


// conn.connect((err) => {
//   if (err) throw err;
//   console.log("MySQL Connected");
// });

module.exports = conn;

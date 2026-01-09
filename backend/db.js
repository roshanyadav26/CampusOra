const mysql = require("mysql2");

// ✅ Create connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "A@jay308325",
    database: "campusora",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

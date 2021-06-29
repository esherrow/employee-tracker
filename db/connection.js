const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'C0ff33&c4t5',
    database: 'tracker_db'
    },
    console.log('Connected to Employee Tracker')
);

module.exports = db;
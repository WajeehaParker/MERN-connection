const mysql = require('mysql');
const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Karachi!22',
    database : 'employees',
port : '3306'

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
  });

module.exports = connection;
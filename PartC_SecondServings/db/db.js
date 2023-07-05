const mysql = require('mysql2');
const DBconfig = require('./db.config');

//create connection
const connection = mysql.createConnection({
    host: DBconfig.HOST,
    user: DBconfig.USER,
    password: DBconfig.PASSWORD,
    database: DBconfig.DB
});

//connect using the connection
connection.connect(error =>{
    if(error) throw error;
    console.log("Successfully connected to the database.");
});

//export the connection
module.exports = connection;




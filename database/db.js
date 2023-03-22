const mysql = require("mysql2/promise");
module.exports = mysql.createConnection({
    user: "customer_420400_database",
    password: "k^5A%7DsXXpW8*2%QkhEw3UK%",
    database: "customer_420400_database",
    host: "eu01-sql.pebblehost.com",
    port: "3306"
}).catch(err => {
    if(err) throw err;
})

console.log("MySQL has connected succesfully!")
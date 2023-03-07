require('dotenv').config()
const mysql = require('mysql')

const Pool = mysql.createPool({
  connectionLimit: 100, // important
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  debug: process.env.DBDEBUG
})

module.exports = { Pool }

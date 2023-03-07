/* eslint-disable n/no-path-concat */
// migration.js
const mysql = require('mysql')
const migration = require('mysql-migrations')

const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jmk-database'
})

migration.init(connection, __dirname + '/migrations')

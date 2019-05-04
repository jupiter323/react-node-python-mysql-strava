


var dbconfig = require('../../config/db-config');

const $servername = dbconfig.connection.host
const $username = dbconfig.connection.user
const $password = dbconfig.connection.password
const $dbname = dbconfig.connection.database

const mysql_args = { host: $servername, user: $username, password: $password, database: $dbname, dateStrings: true }

module.exports = {
    mysql_args: mysql_args
}
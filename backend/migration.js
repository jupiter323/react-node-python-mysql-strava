var migration = require('mysql-migrations');
var { pool } = require('./model/db');
var fs = require("fs");
migration.init(pool, __dirname + '/migrations');


var migrationsfolder = `migrations`;

if (!fs.existsSync(migrationsfolder)) {
    fs.mkdirSync(migrationsfolder);
}

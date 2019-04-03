
var mysql=require('mysql');
var dbconfig = require('../config/db-config');
var pool = mysql.createPool(dbconfig.connection);

pool.getConnection(function(err, conn) {
  conn.query('USE ' + dbconfig.connection.database, function() {
    console.log('connected succuessfully to ' + dbconfig.connection.database)
    conn.release();
  });
});

// Returns a connection to the db
var getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    callback(err, conn);
  });
};

// Helper function for querying the db; releases the db connection
// callback(err, rows)
var query = function(queryString, params, callback) {
  getConnection(function(err, conn) {
    conn.query(queryString, params, function(err, rows) {
      conn.release();
      if (err)
        return callback(err);

      return callback(err, rows);
    });
  });
};

exports.query = query;
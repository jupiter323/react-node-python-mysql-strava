
var _ = require('lodash')
var db = require('./db');

var UIoptions = function (values) {
  let temp = {}
  let tempArr = []
  _.map(values, (value, key) => {

  })

}

exports.get_all = function (callback) {
  db.query('SELECT * FROM system_options', [], function (err, rows) {
    if (err) return callback(err)
    let temp = new UIoptions(rows)
    return callback(null, rows);
  });
}
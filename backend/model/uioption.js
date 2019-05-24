
var _ = require('lodash')
var db = require('./db');
var Utils = require('./../web/utils.js')

exports.get_all = function (callback) {
  db.query('SELECT * FROM system_options', [], function (err, rows) {
    if (err) return callback(err)
    return callback(null, rows);
  });
}

exports.fromSystemTableToSlopAndOutcol = (cb) => {
  var outputcolIndex = 0;
  var slopecatIndex = 0
  db.query('SELECT * FROM system_options', [],  (err, rows)=> {
    var exceptionData = {
      slopecat: "default = -3,-1.5,-0.5,0.5,1.5,3.0,5.0,9.0,12.0",
      outputcols: "all = index,cumdist,ele,time,time1,temp,beats,speed,dist,azimuth,windload,windspd,winddir,humidity,meteotemp,hrCategory,beatcount,gpxtimestamp,gpxdist,valid_speed,slopeCategory,error,realpower,estpower,estaccelpower,esttotalpower,lat,lon,cumrealenergy,cumestenergy,hrCategory1,numparticipants,intensityscore",
      defaults: [{ "name": "seglen", "values": ["100"] }, { "name": "rollingresistance", "values": ["0.006"] }, { "name": "surfacearea", "values": ["0.5"] }, { "name": "airresistance", "values": ["0.7"] }, { "name": "zeronegativeenergy", "values": ["1"] }, { "name": "csvwithcomma", "values": ["0"] }, { "name": "saveuploads", "values": ["0"] }, { "name": "savetimeslotfiles", "values": ["0"] }, { "name": "saveweatherfiles", "values": ["0"] }, { "name": "loadweatherfromdarksky", "values": ["1"] }]
    }

    if (err) return cb(err, exceptionData)

    try {
      var output_column_selections = _.filter(rows, (item) => item.ui_name == "output_col")['0']['default_value'];
      var slope_divisions = _.filter(rows, (item) => item.ui_name == "slope_cat")['0']['default_value'];

      var slopecat = slope_divisions.split('\n')[slopecatIndex];
      var outputcols = output_column_selections.split('\n')[outputcolIndex];
      var defaults = Utils.OptionTableStringToJson(rows)["defaults"];
      return cb(err, { slopecat, outputcols, defaults })
    } catch (err) {     
      return cb(err, exceptionData)
    }
  });

}
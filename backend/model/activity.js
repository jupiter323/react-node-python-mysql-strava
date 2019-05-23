var db = require('./db');
var Constants = require('../config/contants')

exports.getactivityCountByUsername =  (clientId, callback)=> {
    db.query('SELECT * FROM activity WHERE username = ?', [clientId], function (err, rows) {
        if (err) {
            callback(err);
        }
        if (rows.length)
            return callback(err, rows[0].count);
        else
            return callback(err, 0);
    });
}
exports.activitiesUpdate = function (params, callback) {
    var clientId = params.clientId;
    var activitiesCount = params.activitiesCount;
    db.query('SELECT * FROM activity WHERE username = ?', [clientId], function (err, rows) {
        if (err) {
            callback(err);
        }
        if (rows.length) {
            return updateActivityCount(params, callback);
        }
        return insertActivityCount(params, callback);
    });
}

var updateActivityCount = function (params, callback) {
    var clientId = params.clientId;
    var activitiesCount = params.activitiesCount;
    db.query('UPDATE activity SET ? WHERE username = ?', [{ username: clientId, count: activitiesCount }, clientId]
        , function (err) {

            let msg = ''

            if (err) msg = Constants.ACTIVTY_COUNT_UPDATE_FAILD
            else msg = Constants.ACTIVTY_COUNT_UPDATE_OK
            return callback(err, msg)
        })
}

var insertActivityCount = function (params, callback) {
    var clientId = params.clientId;
    var activitiesCount = params.activitiesCount;
    db.query(`INSERT INTO activity (username,count) values (?,?)`,
        [clientId, activitiesCount],
        function (err) {
            let msg = ''
            if (err) {

                if (err.code === 'ER_DUP_ENTRY') {
                    // If we somehow generated a duplicate user id, try again
                    return insertActivityCount(params, callback);
                }
                msg = Constants.ACTIVTY_COUNT_UPDATE_FAILD
                return callback(err, msg);
            }
            // Successfully created activity
            return callback(err, msg);
        }
    )
}


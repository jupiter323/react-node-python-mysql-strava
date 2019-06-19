var db = require('./db');
var getGpxList = (projection, cb) => {
    if (projection === '') projection = '*'
    var extention = `%.gpx`
    db.query("SELECT " + projection + " FROM organizedevents WHERE file_name LIKE ?", [extention],
        (err, response) => {
            if (err) cb(err)
            else {
                if (response)
                    cb(err, response)
            }
        })
}
var getById = (projection, id, cb) => {
    if (projection === '') projection = '*'
    var extention = `%.gpx`
    db.query("SELECT " + projection + " FROM organizedevents WHERE id = ?", [id],
        (err, response) => {
            if (err) cb(err)
            else {
                if (response)
                    cb(err, response)
            }
        })
}

exports.getGpxList = getGpxList
exports.getById = getById

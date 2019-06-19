var db = require('./db');
var add = (params, cb) => {
    var { product_selection_id, user_id, product_id } = params
    db.query("INSERT INTO product_user (product_selection_id,user_id,product_id) values (?,?,?)", [product_selection_id, user_id, product_id], (err, response) => {
        if (err) cb(err)
        else {
            if (response)
                cb(err, response)
        }
    })
}
var deleteById = (params, cb) => {
    var { id } = params
    db.query("DELETE FROM product_user WHERE id = ?", [id], (err, response) => {
        if (err) cb(err)
        else {
            if (response)
                cb(err, response)
        }
    })
}

var getListByUserSelection = (projection, params, cb) => {
    var { user_id, product_selection_id } = params
    if (projection === '') projection = '*'
    db.query("SELECT " + projection + " FROM product_user WHERE user_id = ? AND product_selection_id = ?", [user_id, product_selection_id],
        (err, response) => {
            if (err) cb(err)
            else {
                if (response)
                    cb(err, response)
            }
        })
}

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
exports.add = add
exports.deleteById = deleteById
exports.getListByUserSelection = getListByUserSelection

var db = require('./db');

var getProductList = (projection, cb) => {
    if (projection === '') projection = '*'
    db.query("SELECT " + projection + " FROM products", [],
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
    db.query("SELECT " + projection + " FROM products WHERE product_id = ?", [id],
        (err, response) => {
            if (err) cb(err)
            else {
                if (response)
                    cb(err, response)
            }
        })
}

exports.getProductList = getProductList
exports.getById = getById

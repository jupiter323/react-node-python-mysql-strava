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

var getListByUserSelection = (projection, params, callback) => {
    var { user_id, product_selection_id } = params
    if (projection === '') projection = '*'
    db.query('SELECT ' + projection + ' FROM products INNER JOIN product_user ON products.product_id = product_user.product_id WHERE product_user.user_id = ? AND product_user.product_selection_id = ?', [user_id, product_selection_id], function (err, rows) {
        if (err) return callback(err)
        return callback(err, rows);
    });
}

exports.getProductList = getProductList
exports.getById = getById
exports.getListByUserSelection = getListByUserSelection

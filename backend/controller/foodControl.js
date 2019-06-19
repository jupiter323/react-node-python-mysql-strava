const Products = require('../model/products');

exports.getAllProducts = (req, res) => {
    var projection = "*"
    Products.getProductList(projection, (err, products) => {
        if (err) res.send({ success: false, err })
        else {
            res.send({ success: true, products });
        }
    })

}
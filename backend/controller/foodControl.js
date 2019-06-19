const Products = require('../model/products');
const ProductSelect = require('../model/product_select');
exports.getAllProducts = (req, res) => {
    var projection = "*"
    Products.getProductList(projection, (err, products) => {
        if (err) res.send({ success: false, err })
        else {
            res.send({ success: true, products });
        }
    })

}
exports.userAddProduct = (req, res) => {
    const { product_selection_id, product_id } = req.body
    var user_id = req.user.id
    var params = { product_selection_id, user_id, product_id }
    ProductSelect.add(params, (err, result) => {
        if (err) res.send({ success: false, err })
        else {
            res.send({ success: true, result });
        }
    })

}
exports.userDeleteProduct = (req, res) => {
    const { id } = req.body
    var params = { id }
    ProductSelect.deleteById(params, (err, result) => {
        if (err) res.send({ success: false, err })
        else {
            res.send({ success: true, result });
        }
    })

}

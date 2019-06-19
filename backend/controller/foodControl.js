const Products = require('../model/products');
const ProductSelect = require('../model/product_select');
var _ = require('lodash');
exports.getAllProducts = (req, res) => {
    var projection = "*"
    Products.getProductList(projection, (err, products) => {
        if (err) res.send({ success: false, err })
        else {
            res.send({ success: true, products });
        }
    })

}
exports.getAllUserProduct = (req, res) => {
    var { id } = req.user
    var { product_selection_id } = req.body
    var projection = "*"
    var params = { user_id: id, product_selection_id }
    Products.getListByUserSelection(projection, params, (err, userproducts) => {
        if (err) res.send({ success: false, err })
        else {
            var productsByUser = []
            projection = "*"
            for (let userproduct of userproducts)
                Products.getById(projection, userproduct.product_id, (eerr, products) => { //get product detail by userproduct
                    if (eerr) res.send({ success: false, err: eerr })
                    else {
                        productsByUser.push(products[0]);
                    }
                })
            res.send({ success: true, productsByUser });

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

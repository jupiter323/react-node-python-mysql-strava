
var db = require('./db');
var sponsors = require('./sponsors');

var Product = function (product) {
  var that = new Object();
  that.id = product.id
  that.product_des   = product.product_des;
  that.product_image = product.product_image;
  that.price = product.price;
  that.sponsorName = product.sponsorName;

  return that;
};

var createProduct = function (body, callback) {
  
  var newProduct = {
    product_des: body.product_des,
    product_image: body.product_image,
    price: body.price,
    sponsorName: body.sponsorName
  };

  db.query(`INSERT INTO product ( product_image, price, sponsorName,product_des) values (?,?,?,?)`,
    [body.product_image, body.price, body.sponsorName, body.product_des],
    function (err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return createProduct(body, callback);
        }
        return callback(err);
      }

      return callback(null, true, new Product(newProduct));
    }
  )
}

var registerProduct = function (body, callback) {
  db.query('SELECT * FROM product WHERE product_image = ? AND sponsorName=?', [body.product_image, body.sponsorName], function (err, rows) {
    if (err) {
      callback(err);
    }
    if (rows.length) {
      return callback(null, false);
    }
    return createProduct(body, callback);
  });
}

var importProduct = function (body, callback) {
  
    db.query('SELECT * FROM product WHERE product_image = ? AND sponsorName=?', [body.product_image, body.sponsorName], function (err, rows) {
      if (err) {
        callback(err);
      }
      if (rows.length) {
        return callback(null, false);
      }
      return createProduct(body, callback);
    });
  
  
}

var findproduct = function (id, callback) {
  
  db.query('SELECT * FROM product WHERE id = ?', [id], function (err, row) {
    if (err) {      
      return callback(err);
    }
    else {
      return callback(null, row);
    }
  });
}

var findProducts = function (name, callback) {
 
  db.query('SELECT * FROM product WHERE sponsorName = ?', [name], function (err, rows) {
    if (err)
      return callback(err);
    else
      var products = [];
    for (let row of rows) {
      products.push(new Product(row));
    }
      
    return callback(null, products);
  });
}

var find_all = function (callback) {
  db.query('SELECT * FROM product', [], async function (err, rows) {
    if (err)
      return callback(err);
    else
      return callback(null, rows);
  });

}

var updateProduct = function (product, callback) {

  db.query('UPDATE product SET ? WHERE id = ?',
    [
      {
        product_image: product.product_image,
        price: parseFloat(product.price),
        sponsorName: product.sponsorName
      }
      , product.id
    ]
    , function (err) {
      return callback(err);
    });
}

var deleteProduct = function (id,sponsor, callback) {

  db.query('DELETE FROM product WHERE id = ? OR sponsorName = ?',
    [id,sponsor]
    , function (err) {
      return callback(err);
    });

  
}

exports.registerProduct = registerProduct;
exports.findproduct = findproduct;
exports.findProducts = findProducts;
exports.find_all = find_all;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.importProduct = importProduct;
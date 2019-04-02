
const Game = require('../model/game');
const Sponsor = require('../model/sponsors');
const Product = require('../model/product');
const Sponsordata = require('../controller/sponsorControl');

exports.products_list = function (req, res) {

    if (req.params.name) {
        Product.findProducts(req.params.name, (err, products) => {
            res.json({
                success: true,
                message: 'Received No.' + req.params.name + ' of products successfully',
                products: products
            });
        });
    } else {
        Product.find_all(async (err, products) => {
            let productArr = new Array();
            for (let list of products) {
                let sponsor = await Sponsordata.getSponsor(list.sponsorName);
                list.sponsorBanner = sponsor.sponsorBanner||'';
                productArr.push(list);
            }
            res.json({
                success: true,
                message: 'received all products successfully',
                products: productArr
            })
        });
    }
     
}

exports.import_product = async function (req, res) {

    var result = Object.keys(req.body).map(function (key) {
        return [Number(key), req.body[key]];
    });

    let ln = result.length
    let existArr = [];
    let isError=false;
    let isExist=false;

    for (let list of result){
        let state='';
        let p=new Promise((resolve)=>{
            Product.importProduct(list[1], function (err, status,product) {
                if (err) {
                    state=1;
                    resolve(state)
                } else if (status == false) {
                    state=2;
                    resolve(state)
                } else {
                    resolve(state)
                }
            });
            
        })
        
        if (await p=='1')
            { 
                isError=true; 
                break; 
            }
        else if(await p=='2')
            {
                isExist=true;
                existArr.push(ln);
                ln--;
            }
        else
            {
                ln--;
            }
        
    }

    if(isError){
        res.status(401).send({ success: false });
    }else if(isExist){
        res.send({
            success: false,
            message: existArr.toString().slice(0,11) + "... th products is already exist"
        });
    }else{
        res.send({
            success: true,
            message: "Your products was imported successfully!"
        });
    }
    
}

exports.create_product = function (req, res) {
    Product.registerProduct(req.body, function (err, status, product) {
        if (err) {
            res.status(401).send({ success: false });
        } else if (status == false) {
            res.send({
                success: false,
                message: "This product is already exist"
            });
        } else {
            res.send({
                success: true,
                message: "Your product was imported successfully!"
            });
        }
    });
}

exports.update_product = function (req, res) {
    
    if (req.params.mode == 'update') {
        Product.updateProduct(req.body, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "Your product was updated successfully!"
                });
            }
        });
    } else if (req.params.mode == 'delete') {
        Product.deleteProduct(req.body.id,null, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "Your product was deleted successfully!"
                });
            }
        });
    }

}
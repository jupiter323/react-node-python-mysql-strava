var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

const Game = require('../model/game');
const Sponsor = require('../model/sponsors');
const Product = require('../model/product');

var gameArray = ['subgame_checkout', 'subgame_lo2hi', 'subgame_pricing', 'subgame_tagsale', 'subgame_thatsnotrite']

exports.sponsors_list = function (req, res) {

    var sps = new Array();
    let json = {};
    Sponsor.find_all(async (err, sponsors) => {
        for (let list of sponsors) {
            var games = new Array();
            for (let game of gameArray) {
                json = await Game.countingSponsored(game, list.sponsorID);
                games.push(json);
            }
            list.games = games;
            sps.push(list);
        }

        res.json({
            success: true,
            message: 'success',
            sponsors: sps
        });
    });
}

exports.create_sponsor = function (req, res) {

    Sponsor.registerSponsor(req.body, function (err, status, sponsor) {
        if (err) {
            res.status(401).send({ success: false });
        } else if (status == false) {
            res.send({
                success: false,
                message: 'This sponsor with that name is already exist'
            });
        } else {
            res.send({
                success: true,
                message: 'Your sponsor was registered successfully! '
            });
        }
    });
}

exports.uploadSponsorImg = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.image != undefined) {
            var old_path = files.image.path;
            // var filename = uuidV4() +'.'+files.image.name.split('.').pop()
            var new_path = path.join(appRoot, '../assets/img/demo/sponsor',files.image.name );
            fs.readFile(old_path, function (err, data) {
                fs.writeFile(new_path, data, function (err) {
                    fs.unlink(old_path, function (err) {
                        if (err) {
                            console.log('uploading failure!');
                        } else {
                            console.log('uploading success!');
                        }
                    });
                });
            });
        }
    });
}

exports.getSponsor = async function (name) {

    let p = new Promise((resolve) => {
        Sponsor.findSponsor(name, (err, sponsor) => {
            if (err) {
                throw err
            } else {
                resolve(sponsor);
            }
        });
    });
    return await p;
}

exports.getSponsorWithID = async function (id) {

    let p = new Promise((resolve) => {
        Sponsor.findSponsorWithID(id, (err, sponsor) => {
            if (err) {
                throw err
            } else {
                resolve(sponsor);
            }
        });
    });
    return await p;
}

exports.getSponsorWithProduct = async function (id) {

    let p = new Promise((resolve) => {
        Sponsor.findSponsor(id, (err, sponsor) => {
            if (err) {
                throw err
            } else {
                Product.findProducts(sponsor.sponsorID, (err, products) => {
                    if (err) {
                        throw err
                    } else {
                        sponsor.product = products;
                    }
                    resolve(sponsor);
                });
            }
        });
    });

    return await p;
}

exports.update_sponsor = function (req, res) {
    if (req.params.mode == 'update') {
        Sponsor.updateSponsor(req.body, function (err) {
            if (err) {                
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "Updated successfully!"
                });
            }
        });
    } else if (req.params.mode == 'delete') {
        Sponsor.deleteSponsor(req.body.id, function (err) {
            if (err) {                
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "Your product was deleted successfully!"
                });
            }
        });
        Game.find_all(async (err, games) => {
            if (err) {
                throw err
            } else {
                for (let list of games) {
                    Game.deleteSubGame(list.sub_tables, req.body.id, (err) => {
                        if (err) throw err
                    })
                }
            }
        });
        Product.deleteProduct(null, req.body.sponsorName, function (err) {
            if (err) {                
                res.status(401).send({ success: false });
            }
        })
    }

}
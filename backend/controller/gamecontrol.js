
const Game = require('../model/game');
const Sponsor = require('../controller/sponsorControl');
const Product = require('../model/product');
const User = require('../model/user')

exports.game_list = function (req, res) {
    Game.find_all(async (err, games) => {
        if (err) {
            throw err
        } else {
            
            res.json({
                success: true,
                message: 'success',
                games: games
            });

        }
    });
}

exports.update_game = function(req, res){
    Game.updateGame(req, function (err) {
        if (err) {
            res.status(401).send({ success: false });
        } else {
            res.send({
                success: true,
                message: 'Your game editted successfully!'
            });
        }
    });   
}

exports.create_game = function (req, res) {
    
    Game.createSubGame(req, function (err) {
        if (err) {
            res.status(401).send({ success: false });
        } else {
            res.send({
                success: true,
                message: 'Your game registered successfully!'
            });
        }
    });
}

exports.recordWon = function(req,res){
    Game.updateSubGame(req,(err)=>{
        if(err){
            res.status(401).send({ success: false });
        }else{
            
            if(req.body.type=='game'){
                User.recordCounting(req,(err)=>{
                    if(err){
                        res.status(401).send({ success: false });
                    }else{
                        res.send({
                            success: true,
                            message: 'recorded result to user table successfully'
                        });
                    }
                })
            }else if(req.body.type=='trivia'){
                
            }
            
            
        }
    })  
    
}

exports.getsubGames = function (req, res) {
    Game.find_allsubGames(req,async (err, subgames) => {
        if (err) {
            throw err
        } else {
            let detailGame = await getGameWithSponsor(subgames);
            res.json({
                success: true,
                message: 'success',
                subgames: detailGame
            });
        }
    });
}

var getGameWithSponsor = async function (subgames) {   
    var newJsonArray = [];
    for (let row of subgames) {
        
       row.sponsor =await Sponsor.getSponsorWithID(row.sponsor_id);
        
        var b = row.product_id.split(',').map(function (item) {
            return parseInt(item, 10);
        });
        let productArray = [];
        productArray=new Array();
        
        for (let list of b) {
            let p=new Promise((resolve,reject)=>{
                Product.findproduct(list,function(err,product){                
                    productArray=productArray.concat(product);                    
                    resolve(productArray);
                });
            });                        
            row.products = await p;            
        }        
        newJsonArray.push(row);        
    }    
    return newJsonArray.reverse();
}


var express = require('express');
var router = express.Router();

const Users = require('../controller/userControl');
const Game = require('../controller/gamecontrol');
const Sponsor = require('../controller/sponsorControl');
const Product = require('../controller/productControl');
const Trivia = require('../controller/triviaControl');
const Message = require('../controller/message');
const GpxCvt = require('../controller/gpxConvert')

router.route('/users')
    .get(Users.userList)
router.route('/users/:mode')
    .post(Users.update_user);

router.route('/games')
    .get(Game.game_list)
    .post(Game.update_game);

router.route('/games/:gamename')
    .get(Game.getsubGames)
    .post(Game.create_game);

router.route('/games/result/:gamename')
    .post(Game.recordWon)    
    
router.route('/sponsor')
    .get(Sponsor.sponsors_list)
    .post(Sponsor.create_sponsor);
router.route('/sponsor/:mode')
    .post(Sponsor.update_sponsor)
router.route('/upload/sponsors')
    .post(Sponsor.uploadSponsorImg)

router.route('/product/:name')
    .get(Product.products_list)

router.route('/product')
    .get(Product.products_list)
    .post(Product.import_product);
router.route('/product/:mode')
    .post(Product.update_product);

router.route('/trivia')
    .get(Trivia.alltrivia)
    .post(Trivia.import_trivia)
router.route('/trivia/:mode')
    .post(Trivia.update_trivia);

router.route('/getMessages')    
    .post(Message.getMessage)

router.route('/gpxfileupload')
    .post(GpxCvt.convertgpx)

router.route('/options')
    .get(GpxCvt.OptionsToJson)
module.exports = router;
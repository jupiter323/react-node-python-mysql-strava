
var db = require('./db');
var sponsors = require('./sponsors');
var products = require('./product');
var uuid = require('uuid/v4');

var Game = function (game) {
  var that = new Object();

  that.game_name = game.game_name;
  that.game_image = game.game_image;
  that.direction = game.direction;
  that.isFeatured = game.isFeatured;

  return that;
};

var createGame = function (body, callback) {

  var newGame = {
    game_name: body.game_name,
    game_image: body.game_image,
    direction: body.direction,
    isFeatured: body.isFeatured
  };

  game_image = 'assets/img/demo/gameIcon/' + body.game_image;

  db.query(`INSERT INTO games (game_name, game_image, direction ) values (?,?,?,?,?,?)`,
    [body.game_name, game_image, body.direction, body.isFeatured],
    function (err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return createGame(body, callback);
        }
        return callback(err);
      }

      return callback(null, true, new Game(newGame));
    }
  )
}

var registerGame = function (body, callback) {
  db.query('SELECT * FROM games WHERE game_name = ?', [body.game_name], function (err, rows) {
    if (err) {
      callback(err);
    }
    if (rows.length) {
      return callback(null, false);
    }
    return createGame(body, callback);
  });
}

var findGameName = function (game, callback) {
  db.query('SELECT * FROM games WHERE game_name = ?', [game.game_name], function (err, rows) {
    if (err)
      return callback(err);
    else
      return callback(null, new Game(rows[0]));
  });
}

var find_all = function (callback) {
  db.query('SELECT * FROM games', [], async function (err, rows) {
    if (err)
      return callback(err);
    else
      return callback(null, rows);
  });
}

var updateGame = function (game, callback) {

  db.query('UPDATE games SET ? WHERE game_name = ?', [
    {
      game_name: game.body.game_name,
      game_image: game.body.game_image,
      isFeatured: game.body.isFeatured,
      direction: game.body.direction
    }, game.body.game_name]
    , function (err) {
      return callback(err);
    })
}

var deleteSubGame = function (gamename,id,callback) {
  db.query('DELETE FROM ?? WHERE sponsor_id = ? ',[gamename,id],(err)=>{
    return callback(err)
  })
}

var createSubGame = function (req, callback) {
  let jsonObj = gettingJson(req);
  db.query('INSERT INTO ?? SET ? ', [req.params.gamename, jsonObj],
    (err) => {
      return callback(err);
    });

}

var updateSubGame = function (req, callback){
  let jsonOBJ={}
  if(req.body.result){
    jsonOBJ.isWon=true,
    jsonOBJ.won_userID=req.body.userId
  }else{
    jsonOBJ.isWon = false
  }
  db.query('UPDATE ?? SET ? WHERE id=?', [req.params.gamename, jsonOBJ, req.body.id]
    , function (err) {
      return callback(err);
    })
}

var find_allsubGames = function (req, callback) {
  db.query('SELECT * FROM ??', [req.params.gamename], (err, rows) => {
    if (err) {
      return callback(err);
    }
    else {      
      return callback(null, rows);
    }
  });
}

var countingSponsored = async function (name, id) {
  var img='';
  var total=0;
  var won=0;
  var json={'name':'','game_banner':'','total':'','won':''};

  json.name=name;

  let p=new Promise((resolve)=>{
    db.query('SELECT game_image FROM games WHERE sub_tables=?',[name],(err,image)=>{
      if(err){throw err;}
      else{ 
       img =image[Object.keys(image)[0]][Object.keys(image[Object.keys(image)[0]])];
       resolve(img); 
       }
    });
  }); 
  json.game_banner=await p;

  let q=new Promise((resolve)=>{
    db.query('SELECT COUNT(sponsor_id) FROM ?? WHERE sponsor_id=?', [name, id], (err, count) => {
      if (err) { throw err; }
      else {     
        total=count[Object.keys(count)[0]][Object.keys(count[Object.keys(count)[0]])]; 
        resolve(total);           
      }
    });
  });   
  json.total=await q;

  let r=new Promise((resolve)=>{
    db.query('SELECT COUNT(sponsor_id) FROM ?? WHERE sponsor_id=? AND isWon=1', [name, id], (err, win_count) => {
      if (err) { throw err; }
      else {      
        won=win_count[Object.keys(win_count)[0]][Object.keys(win_count[Object.keys(win_count)[0]])];
        resolve(won);
      }
    });
  });  
  json.won=await r;
  
  return json;
}

var gettingJson = function (req) {
  let gift_num=uuid()
  switch (req.params.gamename) {
    case 'subgame_lo2hi': {

      return {
        product_id: req.body.product_id,
        sponsor_id: req.body.sponsorID,
        gift_prize: req.body.gift_prize,
        gift_num:gift_num
      };
    }
    case 'subgame_checkout': {
      return {
        product_id: req.body.product_id,
        sponsor_id: req.body.sponsorID,
        gift_prize: req.body.gift_prize,
        total_price: req.body.total_price,
        pickCount: req.body.pickCount,
        gift_num:gift_num
      }
    }
    case 'subgame_pricing': {
      return {
        product_id: req.body.product_id,
        sponsor_id: req.body.sponsorID,
        gift_prize: req.body.gift_prize,
        gift_num:gift_num
      };
    }
    case 'subgame_tagsale': {
      return {
        product_id: req.body.product_id,
        sponsor_id: req.body.sponsorID,
        gift_prize: req.body.gift_prize,
        onSaleID: req.body.onSaleID,
        gift_num:gift_num
      };
    }
    case 'subgame_thatsnotrite': {
      return {
        product_id: req.body.product_id,
        sponsor_id: req.body.sponsorID,
        gift_prize: req.body.gift_prize,
        wrongIDs: req.body.wrongIDs,
        gift_num:gift_num
      };
    }
  }
}


exports.registerGame = registerGame;
exports.findGameName = findGameName;
exports.find_all = find_all;
exports.updateGame = updateGame;
exports.createSubGame = createSubGame;
exports.find_allsubGames = find_allsubGames;
exports.countingSponsored = countingSponsored;
exports.deleteSubGame = deleteSubGame;
exports.updateSubGame = updateSubGame
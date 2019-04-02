
var db = require('./db');

var Trivia = function (trivia) {
  var that = new Object();

  that.id = trivia.id
  that.category   = trivia.category;
  that.question = trivia.question;
  that.answerArr = trivia.answerArr;

  return that;
};

var createTrivia = function (body, callback) {
  
  var newTrivia = {
    category: body.category,
    question: body.question,
    answerArr: body.answerArr,
  };

  db.query(`INSERT INTO trivia ( category, question, answerArr) values (?,?,?)`,
    [body.category, body.question, body.answerArr],
    function (err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return createTrivia(body, callback);
        }
        return callback(err);
      }

      return callback(null, true, new Trivia(newTrivia));
    }
  )
}

var registerTrivia = function (body, callback) {
  db.query('SELECT * FROM trivia WHERE question = ?', [body.question], function (err, rows) {
    if (err) {
      callback(err);
    }
    if (rows.length) {
      return callback(null, false);
    }
    return createTrivia(body, callback);
  });
}

var importTrivia = function (body, callback) {
  
    db.query('SELECT * FROM trivia WHERE question = ?', [body.question], function (err, rows) {
      if (err) {
        callback(err);
      }
      if (rows.length) {
        return callback(null, false);
      }
      return createTrivia(body, callback);
    });
  
  
}

var findtrivia = function (id, callback) {
  
  db.query('SELECT * FROM trivia WHERE id = ?', [id], function (err, row) {
    if (err) {
      return callback(err);
    }
    else {      
      return callback(null, row);
    }
  });
}



var getTriviaCount = function(callback){
  db.query('SELECT id FROM trivia',function(err,count){
    if(err){ return callback(err)}
    else{return callback(null,count)}
  })
}

var findTrivias = function (category, callback) {
  
  db.query('SELECT * FROM trivia WHERE category = ?', [category], function (err, rows) {
    if (err)
      return callback(err);
    else
      var trivias = [];
    for (let row of rows) {
      trivias.push(new Trivia(row));
    }
       
    return callback(null, trivias);
  });
}

var find_all = function (callback) {
  db.query('SELECT * FROM trivia', [], async function (err, rows) {
    if (err)
      return callback(err);
    else
      return callback(null, rows);
  });

}

var updateTrivia = function (trivia, callback) {

  db.query('UPDATE trivia SET ? WHERE id = ?',
    [
      {
        category: trivia.category,
        question: trivia.question,
        answerArr: trivia.answerArr
      }
      , trivia.id
    ]
    , function (err) {
      return callback(err);
    });
}

var deleteTrivia = function (id, callback) {

  db.query('DELETE FROM trivia WHERE id = ?',
    [id]
    , function (err) {
      return callback(err);
    });

  
}

exports.registerTrivia = registerTrivia;
exports.findtrivia = findtrivia;
exports.findTrivias = findTrivias;
exports.find_all = find_all;
exports.updateTrivia = updateTrivia;
exports.deleteTrivia = deleteTrivia;
exports.importTrivia = importTrivia;
exports.getTriviaCount = getTriviaCount
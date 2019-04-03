var bcrypt = require('bcrypt-nodejs')
var uuidV4 = require('uuid/v4')
var crypto = require('crypto')

var db = require('./db');
// Set up User class
var User = function (user) {
  var that = new Object();
  if (user) {
    that.id = user.id;
    that.username = user.username;
    that.fullname = user.fullname;
    that.email = user.email;
    that.password = user.password;
    that.avatar = user.avatar;
    that.address = user.address;
    that.created = user.created;
    that.updated = user.updated;
    that.played_count = user.played_count;
    that.won_count = user.won_count;
    that.giftNumber = user.giftNumber;
    that.online = user.online;
    that.socketID = user.socketID;
    that.todayScore = user.todayScore;
    that.thisWeekScore = user.thisWeekScore;
    that.thisMonthScore = user.thisMonthScore;
    that.thisYearScore = user.thisYearScore;
    that.total_earned = user.total_earned;
    that.lastPlayed = user.lastPlayed;
    that.fullname = user.fullname;
    that.phone_num = user.phone_num;
  }

  return that;
};

// Gets a random id for this user
var generateUserId = function () {
  return uuidV4();
};

// Hash and salt the password with bcrypt
var hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// making gravatar

var gravatar = function (body) {
  if (!body.size) size = 200;
  if (!body.email) return 'https://gravatar.com/avatar/?' + size + '&d=robohash';
  var md5 = crypto.createHash('md5').update(body.email).digest('hex');

  return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=robohash';
}

var getDateTime = function () {
  return new Date().toISOString();
}

var login = function (email, password, callback) {
  db.query('SELECT username,password,id,email FROM users WHERE email = ?', [email], function (err, rows) {
    if (err) {
      return callback(err);
    }
    if (!rows.length)
      return callback(null, false);
    if (validPassword(password, rows[0].password)) {
      return callback(null, true, new User(rows[0]));
    } else {
      console.log('wrong pw')
      return callback(null, false, new User(rows[0]));
    }
  });
};

var createUser = function (user, token, callback) {

  db.query(`INSERT INTO user (userId, username, token ) values (?,?,?)`,
    [user.id, user.username, token],
    function (err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // If we somehow generated a duplicate user id, try again
          return createUser(user, callback);
        }
        return callback(err);
      }
      console.log(user)
      // Successfully created user
      return regiserProfile(user, callback);
    }
  )
}

var regiserProfile = function (user, callback) {
 
  db.query(`INSERT INTO user_profile (userId, username, firstname, lastname, badge_type_id, premium, resource_state, summit, sex, profile, profile_medium, city ,country,follower, friend, created_at, updated_at ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [user.id, user.username, user.firstname, user.lastname, user.badge_type_id, user.premium, user.resource_state, user.summit,user.sex, user.profile,user.profile_medium, user.city, user.country,user.follower,user.friend,user.created_at, user.updated_at ],
    function (err) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // If we somehow generated a duplicate user id, try again
          return createUser(user, callback);
        }
        return callback(err);
      }

      // Successfully created user
      return callback(null, true, user);
    }
  )
}

var register = function (user,token, callback) {

  db.query('SELECT * FROM user WHERE userId = ? OR username = ?', [user.id, user.username], function (err, rows) {
    if (err) {
      callback(err);
    }
    if (rows.length) {
      return callback(null, false);
    }
    return createUser(user,token, callback);
  });
}

var findOne = function (id, callback) {

  db.query('SELECT * FROM users WHERE id = ?', [id], function (err, rows) {
    if (err)
      return callback(err);
    else
      return callback(null, new User(rows[0]));
  });

}

var getUserSession = function (id, callback) {
  db.query('SELECT * FROM users WHERE id = ? AND online = "y"', [id], function (err, row) {

    if (err)
      return callback(err);
    else
      return callback(null, row);
  });
}

var find_all = function (callback) {
  db.query('SELECT * FROM users', [], function (err, rows) {
    if (err) return callback(err)
    return callback(err, rows);
  });
}

var updateProfile = function (user, callback) {

  if (user.changedPW) {
    user.password = hashPassword(user.password)
  }
  delete user.changedPW
  user.updated = getDateTime()
  db.query('UPDATE users SET ? WHERE id = ?', [user, user.id]
    , function (err) {
      return callback(err);
    })
}

var recordCounting = function (req, callback) {
  if (req.body.result == true) {
    db.query('UPDATE users SET played_count=played_count+1,won_count=won_count+1,total_earned=total_earned+?,lastWonDate=?,giftNumber=CONCAT(IFNULL(giftNumber,""),?) WHERE id = ?', [req.body.prize, req.body.lastWonDate, req.body.gift_num, req.body.userId]
      , function (err) {
        return callback(err);
      })
  } else {
    db.query('UPDATE users SET played_count=played_count+1 WHERE id = ?', [req.body.userId]
      , function (err) {
        return callback(err);
      })
  }

}

var gettingLastPlayed = function (userId, callback) {
  db.query('SELECT lastPlayed FROM users WHERE id=?', [userId], function (err, row) {
    if (err) return callback(err)
    return callback(err, row);
  });
}

var addingPoints = function (id, tdp, twp, tmp, typ, ly, callback) {
  db.query('UPDATE users SET ? WHERE id = ?', [{ todayScore: tdp, thisWeekScore: twp, thisMonthScore: tmp, thisYearScore: typ, lastPlayed: ly }, id]
    , function (err) {
      return callback(err);
    })
}

var zeroPoints = function (points, callback) {
  db.query('UPDATE users SET ?', [points]
    , function (err) {
      return callback(err);
    })
}

var addSocketID = function (id, socketID, callback) {
  db.query('UPDATE users SET ? WHERE id = ?', [{ socketID: socketID, online: 'y' }, id]
    , function (err) {
      return callback(err);
    })
}

var logout = function (id, callback) {

  db.query('UPDATE users SET ? WHERE id = ?', [{ online: 'n' }, id]
    , function (err) {
      return callback(err);
    })
}

var deleteUser = function (username, callback) {

  db.query('DELETE FROM users WHERE username = ?',
    [username]
    , function (err) {
      return callback(err);
    });


}

exports.login = login;
exports.register = register;
exports.findOne = findOne;
exports.find_all = find_all;
exports.updateProfile = updateProfile;
exports.gravatar = gravatar;
exports.deleteUser = deleteUser;
exports.getUserSession = getUserSession;
exports.addSocketID = addSocketID;
exports.logout = logout;
exports.recordCounting = recordCounting
exports.addingPoints = addingPoints
exports.gettingLastPlayed = gettingLastPlayed
exports.zeroPoints = zeroPoints
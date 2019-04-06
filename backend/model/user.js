var bcrypt = require('bcrypt-nodejs')
var crypto = require('crypto')

var Constants = require('../config/contants')

var db = require('./db');
// Set up User class
var User = function (param) {
  let tempObj = new Object();
  if (param) {
    let user = param.athlete
    tempObj.userId = user.id;
    tempObj.username = user.username;
    tempObj.refresh_token = param.refresh_token;
    tempObj.access_token = param.access_token;
    tempObj.expiretime = param.expires_at;
  }

  return tempObj;
};

var UserProfile = function (user) {
  let tempObj = new Object()
  if (user) {
    tempObj.userId = user.id
    tempObj.username = user.username
    tempObj.firstname = user.firstname
    tempObj.lastname = user.lastname
    tempObj.badge_type_id = user.badge_type_id
    tempObj.premium = user.premium
    tempObj.resource_state = user.resource_state
    tempObj.summit = user.summit
    tempObj.sex = user.sex
    tempObj.profile = user.profile
    tempObj.profile_medium = user.profile_medium
    tempObj.city = user.city
    tempObj.country = user.country
    tempObj.follower = user.follower
    tempObj.friend = user.friend
    tempObj.created_at = user.created_at
    tempObj.updated_at = user.updated_at
  }

}

var getUserList = function (projection, callback) {
  if (projection === '') projection = 'all'
  db.query('SELECT ' + projection + ' FROM user', [], function (err, rows) {
    if (err) return callback(err)
    return callback(err, rows);
  });
}

var getUser = function (projection, params, callback) {
  if (projection === '') projection = 'all'
  db.query('SELECT ' + projection + ' FROM user', [params], function (err, rows) {
    if (err) return callback(err)
    return callback(err, rows);
  });
}

var registerUser = function (params, callback) {
  let user = params.athlete
  db.query('SELECT * FROM user WHERE userId = ? AND username = ?', [user.id, user.username], function (err, rows) {
    if (err) {
      callback(err);
    }
    if (rows.length) {
      return updateUser(params, callback);
    }
    return insertUser(params, callback);
  });
}

var updateUser = function (params, callback) {
  let user = params.athlete
  db.query('UPDATE user SET ? WHERE id = ?', [new User(params), user.id]
    , function (err) {

      let msg = ''

      if (err) msg = Constants.USER_REGISTRATION_FAILED
      else msg = Constants.USER_REGISTRATION_OK

      return callback(err, msg)
    })
}

var insertUser = function (params, callback) {
  let user = params.athlete
  db.query(`INSERT INTO user (userId,username,access_token,refresh_token,expiretime) values (?,?,?,?,?)`,
    [user.id, user.username, params.access_token, params.refresh_token, params.expires_at],
    function (err) {
      let msg = ''
      if (err) {

        if (err.code === 'ER_DUP_ENTRY') {
          // If we somehow generated a duplicate user id, try again
          return insertUser(user, callback);
        }
        msg = Constants.USER_REGISTRATION_FAILED
        return callback(err, msg);
      }
      // Successfully created user
      return insertUserProfile(user, callback);
    }
  )
}


var insertUserProfile = function (user, callback) {

  db.query(`INSERT INTO user_profile (userId, username, firstname, lastname, badge_type_id, premium, resource_state, summit, sex, profile, profile_medium, city ,country,follower, friend, created_at, updated_at ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [user.id, user.username, user.firstname, user.lastname, user.badge_type_id, user.premium, user.resource_state, user.summit, user.sex, user.profile, user.profile_medium, user.city, user.country, user.follower, user.friend, user.created_at, user.updated_at],
    function (err) {
      if (err) {
        let msg = ''
        if (err.code === 'ER_DUP_ENTRY') {
          return createUser(user, callback);
        }
        msg = Constants.USER_REGISTRATION_FAILED
      }
      msg = Constants.USER_REGISTRATION_OK
      // Successfully created user
      return callback(err, msg);
    }
  )
}


var deleteUser = function (username, callback) {

  db.query('DELETE FROM users WHERE username = ?',
    [username]
    , function (err) {
      return callback(err);
    });


}

exports.insertUserProfile = insertUserProfile
exports.insertUser = insertUser
exports.updateUser = updateUser
exports.getUser = getUser
exports.registerUser = registerUser
exports.getUserList = getUserList


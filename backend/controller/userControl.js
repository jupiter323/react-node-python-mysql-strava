var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

const User = require('../model/user');

exports.userList = function (req, res) {
    User.find_all(async (err, users) => {
        if (err) {
            throw err
        } else {
            res.json({
                success: true,
                message: 'success',
                users: users
            });
        }
    });
}

exports.update_user = function (req, res) {

    if (req.params.mode == 'update') {

        User.updateProfile(req.body, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "this user was updated successfully!"
                });
            }
        });
    } else if (req.params.mode == 'delete') {
        User.deleteUser(req.body.username, function (err) {
            if (err) {
                res.status(401).send({ success: false });
            } else {
                res.send({
                    success: true,
                    message: "this user was deleted successfully!"
                });
            }
        });
    } else if (req.params.mode == 'avatar') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (files.image != undefined) {
                var old_path = files.image.path;
                console.log(appRoot)
                var new_path = path.join(appRoot, '../assets/img/demo/avatars', files.image.name);
                console.log(new_path)
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

}

exports.getUserInfo = function ({ userId, socketId = false }) {
    let queryProjection = null;
    if (socketId) {

        queryProjection = {
            "socketId": true
        }

    } else {

        queryProjection = {
            "id": true,
            "avatar": true,
            "online": true,
            "username": true,
            "fullname": true,
            "phone_num": true,
            "email": true,
            "address": true,
            "played_count": true,
            "won_count": true,
            "socketID": true,
            "todayScore": true,
            "thisWeekScore": true,
            "thisMonthScore": true,
            "thisYearScore": true,
            "total_earned": true,
            "lastPlayed": true,
            "lastWonDate": true,
            'giftNumber': true
        }

    }
    return new Promise(async (resolve, reject) => {

        try {
            User.findOne(userId, (err, user) => {
                if (err) console.log(err)
                else {
                    // user = recordFilter(user, queryProjection)
                    socketId ? resolve(user[0]['socketId']) : resolve(user);
                }
            });
        } catch (err) {
            reject(err)
        }
    });
}

exports.getChatList = function () {
    return new Promise(async (resolve, reject) => {
        try {

            User.find_all((err, rows) => {
                condition = {
                    "id": true,
                    "username": true,
                    "online": true,
                    "avatar": true,
                    "won_count": true,
                    "socketID": true,
                    "todayScore": true,
                    "thisWeekScore": true,
                    "thisMonthScore": true,
                    "thisYearScore": true,
                    'total_earned': true,
                    'played_count': true,
                    'lastPlayed': true,
                    'lastWonDate': true
                }
                let users = [];
                let cnt = 0;
                let user = {}
                for (let list of rows) {
                    user = recordFilter(list, condition)
                    users.push(JSON.stringify(user));
                }
                resolve(users)
            })
        } catch (error) {
            reject(error)
        }
    });
}

exports.addSocketId = function (userId) {
    return new Promise(async (resolve, reject) => {
        try {
            User.addSocketID(userId.userId, userId.socketId, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    });
}

exports.logout = function (userID, isSocketId) {

    return new Promise(async (resolve, reject) => {
        try {
            User.logout(userID, (err) => {
                if (err) reject(err)
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    });
}

exports.zeroPoints = function (pointsObj) {
    var msg = "success"
    console.log(pointsObj)
    return new Promise(async (resolve, reject) => {
        try {
            User.zeroPoints(pointsObj, (err) => {
                if (err) reject(err)
                resolve(msg)
            })
        } catch (error) {
            reject(error)
        }
    });
}



recordFilter = function (row, condition) {

    for (let i of Object.keys(condition)) {
        for (let j in row) {
            if (i == j) {
                condition[i] = row[j];
            }
        }
    }
    return condition;
}


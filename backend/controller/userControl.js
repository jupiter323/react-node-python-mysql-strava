const request = require("request");
const fs = require("fs");
const UserProfile = require('../model/user_profile')
const User = require('../model/user')
const Constants = require('../config/contants')
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const config = require('../config/db-config');
const urlCfg = require("../config/urls-config")
var sendEmail = (toEmail, html) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: toEmail,
        from: 'stravaservice@strava.com',
        subject: 'From Strava',
        text: 'Download finished!',
        html: html,
    };
    sgMail.send(msg);
}

var sendEmailVerifyLink = (user) => {
    const token = jwt.sign(user, config.secret, {
        expiresIn: '24h' // expires in 24 hours
    });
    var sendUrl = `${urlCfg.EMAIL_VERIFY_EMAIL_HOST}/notifications/?tk=${token}`
    var html =
        `<a href="${sendUrl}"><strong>Please verify Email</strong> </a>`
    sendEmail(user.email, html)
}

var sendPsswordChangeLink = (user) => {
    const token = jwt.sign(user, config.secret, {
        expiresIn: '24h' // expires in 24 hours
    });
    var sendUrl = `${urlCfg.EMAIL_VERIFY_EMAIL_HOST}/pages/forgotpassword/?cptk=${token}`
    var html =
        `<a href="${sendUrl}"><strong>Please Change your password with this link</strong> </a>`
    sendEmail(user.email, html)
}

exports.forgotPasswordRequest = (req, res) => {
    const { email } = req.body;
    var projection = "*"
    User.getUserByEmail(projection, email, (err, user) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                success: false,
                error: err,
                msg: Constants.USER_CHANGEPASSWORD_FAILED
            })
        } else if (!user) {
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: false,
                error: null,
                msg: Constants.USER_NOT_REGISTERED
            })
        } else {
            if (user['closed'])
                res.send({
                    status: Constants.SERVER_OK_HTTP_CODE,
                    success: false,
                    error: null,
                    msg: Constants.USER_CLOSED
                })
            else {
                var userData = { id: user.id, email: user.email, userId: user.userId, verified: user.verified }
                sendPsswordChangeLink(userData);
                res.send({
                    status: Constants.SERVER_OK_HTTP_CODE,
                    success: true,
                    error: null,
                    msg: Constants.USER_CHANGEPASSWORD_OK,
                    user
                })
            }
        }
    })
}
exports.forgotpasswordChange = (req, res) => {
    const { newpassword } = req.body
    const { id } = req.user
    User.changePassword({ id, newpassword }, (err, nonUser, response) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                success: false,
                error: err,
                msg: Constants.USER_CHANGEPASSWORD_FAILED
            })
        } else if (nonUser) { //not registered

            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: false,
                error: null,
                msg: Constants.USER_NOT_REGISTERED
            })
        } else { // success   

            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: true,
                error: null,
                msg: Constants.USER_CHANGEPASSWORD_OK,
                response
            })
        }
    })

}
exports.register = (req, res) => {
    var { email } = req.body;

    User.registerEmailUser(req.body, (err, registered, response) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                success: false,
                error: err,
                msg: Constants.USER_REGISTRATION_FAILED
            })
        } else if (registered) { //registered
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: false,
                error: null,
                msg: Constants.USER_REGISTERED
            })
        } else { // success
            var user = { id: response.insertId, email, userId: null, verified: false }
            sendEmailVerifyLink(user)
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: true,
                error: null,
                msg: Constants.USER_REGISTRATION_OK,
                response
            })
        }
    })

}

exports.getStravaToken = (req, res) => {
    var { user } = req
    request.post(
        "https://www.strava.com/oauth/token",
        {
            json: {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code: req.body.code,
                grant_type: "authorization_code",
                scope: "activity:read_all"
            }
        },
        (error, response, body) => {
            if (!error && response.statusCode == 200) {

                // saveStravaConfig(body.access_token)

                User.stravaRegisterUser({ ...body, user: req.user }, (err, msg) => {
                    let status = ''
                    if (err) {
                        status = Constants.SERVER_INTERNAL_ERROR
                    } else {
                        status = Constants.SERVER_OK_HTTP_CODE
                    }
                    res.send({
                        status: status,
                        error: err,
                        message: msg,
                        data: { clientId: user.id }
                    })
                })

            } else {
                res.send({
                    success: false,
                    message: error
                })
            }
        }
    );
}
exports.refreshTokenAbsoultely = (clientId) => {
    let projection = 'refresh_token,expiretime, userId, username,id'
    User.getUserList(projection, (err, users) => {
        users.forEach(element => {
            if (clientId == element.id)
                request.post(
                    "https://www.strava.com/oauth/token",
                    {
                        json: {
                            client_id: process.env.STRAVA_CLIENT_ID,
                            client_secret: process.env.STRAVA_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: element.refresh_token
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {

                            // saveStravaConfig(body.access_token)
                            Object.assign(body, { athlete: { id: element.userId, username: element.username, }, user: { id: element.id } })
                            User.stravaRegisterUser(body, (err, msg) => {
                                let status = ''
                                if (err) {
                                    status = Constants.SERVER_INTERNAL_ERROR
                                } else {
                                    status = Constants.SERVER_OK_HTTP_CODE;
                                    console.log("refreshed:   ", element.username);
                                }
                                return ({
                                    error: err,
                                    message: msg,
                                    data: body
                                })
                            })

                        } else {
                            return ({
                                success: false,
                                message: error
                            })
                        }
                    }
                );

        });
    })
}
exports.refreshCheckingToken = () => {
    let projection = 'refresh_token,expiretime, userId, username,id'
    User.getUserList(projection, (err, users) => {
        users.forEach(element => {
            let currTime = Date.now()

            if (element.expiretime * 1000 < currTime) {
                request.post(
                    "https://www.strava.com/oauth/token",
                    {
                        json: {
                            client_id: process.env.STRAVA_CLIENT_ID,
                            client_secret: process.env.STRAVA_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: element.refresh_token
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200) {

                            // saveStravaConfig(body.access_token)
                            Object.assign(body, { athlete: { id: element.userId, username: element.username, }, user: { id: element.id } })
                            User.stravaRegisterUser(body, (err, msg) => {
                                let status = ''
                                if (err) {
                                    status = Constants.SERVER_INTERNAL_ERROR
                                } else {
                                    status = Constants.SERVER_OK_HTTP_CODE;
                                    console.log("refreshed:   ", element.username);
                                }
                                return ({
                                    error: err,
                                    message: msg,
                                    data: body
                                })
                            })

                        } else {
                            return ({
                                success: false,
                                message: error
                            })
                        }
                    }
                );
            }

        });
    })
}
exports.eamilVerify = (req, res) => {
    var { id, data } = req.body
    User.setEmailVerified(id, (err, msg) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                msg
            })
        } else {
            res.send(data)
        }
    })
}
exports.getUserListOptions = (req, res) => {
    let projection = 'userId,username,profile_medium'
    UserProfile.getUserList(projection, (err, users) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                options: null
            })
        } else {
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                error: null,
                users: users
            })
        }
    })
}
exports.getUserOption = (req, res) => {
    let projection = "*"
    User.getUser(projection, { id: req.body.id }, (err, users) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                options: null
            })
        } else {
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                error: null,
                users: users
            })
        }
    })
}
exports.updateProfile = (req, res) => {
    User.updateUserProfile(req.body.profile, (err, msg) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                msg
            })
        }
        else {
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                error: null,
                msg
            })
        }
    })

}
exports.eraseProfile = (req, res) => {
    var { user } = req
    User.eraseUser({ user }, (err, msg) => {
        if (err)
            res.send({
                success: false,
                msg
            })
        else
            res.send({
                success: true,
                msg
            })
    })
}
exports.updateRideValue = (req, res) => {
    var { date, rideduration } = req.body;
    var { id } = req.user;
    User.updateRideValue(date, rideduration, id, (err, msg) => {
        if (err)
            res.send({
                success: false,
                msg
            })
        else
            res.send({
                success: true,
                msg
            })

    })

}
var saveStravaConfig = (token) => {
    fs.writeFileSync(
        Constants.STRAVA_CONFIG_PATH,
        `{\n"access_token"    :"${token}", \n"client_id"  :  "${process.env.STRAVA_CLIENT_ID}", \n"client_secret" :"${process.env.STRAVA_CLIENT_SECRET}", \n"redirect_uri"  :"${urlCfg.STRAVA_CALLBACK_URL}"\n}`
    );
}


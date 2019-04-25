const request = require("request");
const fs = require("fs");
const UserProfile = require('../model/user_profile')
const User = require('../model/user')
const Constants = require('../config/contants')
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const config = require('../config/db-config');

function sendEmail(toEmail, html) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: toEmail,
        from: 'test@test.com',
        subject: 'From Strava',
        text: 'Download finished!',
        html: html,
    };
    sgMail.send(msg);
}

function sendEmailVerifyLink(user) {
    const token = jwt.sign(user, config.secret, {
        expiresIn: '24h' // expires in 24 hours
    });
    var sendUrl = `${process.env.EMAIL_VERIFY_EMAIL_HOST}/notifications/?tk=${token}`
    var html =
        `<a href="${sendUrl}"><strong>Please verify Email</strong> </a>`
    sendEmail(user.email, html)
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
exports.getToken = function (req, res) {

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
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                // saveStravaConfig(body.access_token)

                User.registerUser(body, (err, msg) => {
                    let status = ''
                    if (err) {
                        status = Constants.SERVER_INTERNAL_ERROR
                    } else {
                        status = Constants.SERVER_OK_HTTP_CODE
                    }
                    let role = process.env.ADMIN_ID == body.athlete.id ? "admin" : "user"
                    res.send({
                        status: status,
                        error: err,
                        message: msg,
                        data: Object.assign(body, { role })
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



exports.refreshToken = () => {
    let projection = 'refresh_token,expiretime, userId, username'
    User.getUserList(projection, (err, users) => {
        users.forEach(element => {
            let currTime = Date.now()

            if (element.expiretime * 1000 < currTime) {
                console.log("refreshed 1");
                request.post(
                    "https://www.strava.com/oauth/token",
                    {
                        json: {
                            client_id: process.env.STRAVA_CLIENT_ID,
                            client_secret: process.env.STRAVA_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: element.refresh_token
                        }
                    }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {

                            // saveStravaConfig(body.access_token)
                            Object.assign(body, { athlete: { id: element.userId, username: element.username } })
                            User.registerUser(body, (err, msg) => {
                                let status = ''
                                if (err) {
                                    status = Constants.SERVER_INTERNAL_ERROR
                                } else {
                                    status = Constants.SERVER_OK_HTTP_CODE
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
exports.getUserListOptions = function (req, res) {
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
exports.getUserOption = function (req, res) {
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
function saveStravaConfig(token) {
    fs.writeFileSync(
        Constants.STRAVA_CONFIG_PATH,
        `{\n"access_token"    :"${token}", \n"client_id"  :  "${process.env.STRAVA_CLIENT_ID}", \n"client_secret" :"${process.env.STRAVA_CLIENT_SECRET}", \n"redirect_uri"  :"${process.env.STRAVA_CALLBACK_URL}"\n}`
    );
}


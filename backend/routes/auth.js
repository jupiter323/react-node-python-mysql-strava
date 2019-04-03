const router = require('express').Router();
const request = require("request");
const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy

const fs = require("fs");
const User = require('../model/user');
const StrvDataModel = require('../controller/stravaControl')
const config = require('../config/db-config')

const stravaConfig = {
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.callback_url
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const stravaLogin = new StravaStrategy(stravaConfig, (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
        return done(null, profile);
    });
})

passport.use(stravaLogin)

router.get('/login', passport.authenticate('strava', { scope: ['public'] }));

router.post('/token', (req, res, next) => {
    request.post(
        "https://www.strava.com/oauth/token",
        {
            json: {
                client_id: stravaConfig.clientID,
                client_secret: stravaConfig.clientSecret,
                code: req.body.code,
                grant_type: "authorization_code",
                scope: "activity:read_all"
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                fs.writeFileSync("storage/auth_data/strava-code-out.txt", JSON.stringify(body, "", 3));
                access_token = body.access_token;
                fs.writeFileSync(
                    "data/strava_config",
                    `{\n"access_token"    :"${access_token}", \n"client_id"  :  "16560", \n"client_secret" :"952ad2776cfeee810e58edc79b110713605b4e73", \n"redirect_uri"  :"http://localhost"\n}`
                );
                registerUser(body, access_token,res)
            } else {
                res.send({
                    success: false,
                    message: error
                })
            }
        }
    );

})

router.post('/getStrava', (req, res) => {     
    StrvDataModel.saveStravaData(req,res)        
})

function registerUser(body, token,res){
    if(body.athlete){
        User.register(body.athlete,token, function (err, status, user) {
            if (err) {
                res.status(401).send({ success: false,message:err });
            } else if (status == false) {
                res.send({
                    success: false,
                    message: 'successfully logged in!',
                    token:token,
                    profile:user
                });
            } else {            
                res.send({
                    success: true,
                    message: 'Registered successfully!',
                    token: token,
                    profile:user
                });
    
            }
        });
    }else{
        res.status(401).send({ success: false });
    }
    
}

// router.post('/register', (req, res, next) => {

//     User.register(req.body, function (err, status, user) {
//         if (err) {
//             res.status(401).send({ success: false });
//         } else if (status == false) {
//             res.send({
//                 success: false,
//                 message: 'this email or username is already taken by other user'
//             });
//         } else {
//             var token = jwt.sign({
//                 user: user
//             }, config.secret, {
//                     expiresIn: '7d'
//                 });
//             res.send({
//                 success: true,
//                 message: 'Registered successfully!',
//                 token: token
//             });

//         }
//     });

// });

// router.post('/userSessionCheck', function (request, response) {

//     var decoded = jwt_decode(request.body.token);
//     let userId = decoded.user.id;
//     if (userId === '') {
//         response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
//             error: true,
//             message: CONSTANTS.USERID_NOT_FOUND
//         });

//     } else {

//         User.getUserSession(userId, function (err, row) {

//             if (err) {
//                 response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
//                     error: true,
//                     message: CONSTANTS.USER_NOT_LOGGED_IN
//                 });
//             } else {
//                 response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
//                     error: false,
//                     username: row.username,
//                     message: CONSTANTS.USER_LOGIN_OK
//                 });
//             }
//         });
//     }
// });

// router.post('/login', (req, res) => {

//     User.login(req.body.email, req.body.password, function (err, status, user) {
//         if (!user) {
//             res.status(401).send({
//                 success: false,
//                 message: 'Authenticated failed, User not found'
//             })
//         } else {
//             if (status) {
//                 var token = jwt.sign({
//                     user: user
//                 }, config.secret, {
//                         expiresIn: '7d'
//                     });
//                 res.status(200).send({
//                     success: true,
//                     message: 'signed in successfully!',
//                     token: token
//                 })
//             } else {
//                 res.status(200).send({
//                     success: false,
//                     message: 'Authentication failed, Wrong Password'
//                 });
//             }
//         }
//     });
// });

// router.get('/profile', checkJWT, (req, res, next) => {
//     User.findOne(req.decoded.user.id, (err, user) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.json({
//                 success: true,
//                 user: user,
//                 message: 'successful'
//             });
//         }
//     });
// });

// router.post('/profile', checkJWT, (req, res, next) => {

//     User.updateProfile(req.body, (err) => {
//         if (err) return next(err);
//         res.json({
//             success: true,
//             message: 'succesfully edited your profile'
//         });
//     });

// });

module.exports = router;
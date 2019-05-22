const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const config = require('../config/db-config');
const User = require('../model/user')
const Constants = require('../config/contants')
const urlCfg = require('../config/urls-config')
const stravaConfig = {
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: urlCfg.STRAVA_CALLBACK_URL
}

passport.use(new LocalStrategy
    ({ usernameField: 'email', passwordField: 'password' }, (email, password, cb) => {
        //Assume there is a DB module pproviding a global UserModel
        return User.loginEmailUser({ email, password }, (err, nonUser, user, closed) => {
            if (err) return cb(err);
            if (closed)
                return cb(null, null, { msg: Constants.USER_CLOSED })
            if (nonUser)
                return cb(null, null, { msg: Constants.USER_NOT_REGISTERED });
            if (!user) {
                return cb(null, null, { msg: Constants.USER_PSSWORD_WRONG });
            }
            return cb(null, user, {
                msg: 'Logged In Successfully'
            });
        })
    })
)



passport.use(new JWTStrategy
    ({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: config.secret }, (jwtPayload, cb) => {
        //find the user in db if needed
        var projection = "email, userId, id"
        return User.getUserById(projection, jwtPayload.id, (err, user) => {
            if (err)
                return cb(err);
            return cb(null, user);
        })
    })
);

// passport.serializeUser(function (user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function (obj, done) {
//     done(null, obj);
// });

const stravaLogin = new StravaStrategy(stravaConfig, (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
        return done(null, profile);
    });
})
passport.use(stravaLogin)

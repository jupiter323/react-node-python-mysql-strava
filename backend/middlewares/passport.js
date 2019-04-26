const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const config = require('../config/db-config');
const User = require('../model/user')
const Constants = require('../config/contants')
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, cb) {
        //Assume there is a DB module pproviding a global UserModel
        return User.loginEmailUser({ email, password }, (err, nonUser, user) => {
            if (err) return cb(err);
            if (nonUser)
                return cb(null, null, { msg: Constants.USER_NOT_REGISTERED });
            if (!user) {
                return cb(null, null, { msg: Constants.USER_PSSWORD_WRONG });
            }
            return cb(null, user, {
                msg: 'Logged In Successfully'
            });
        })
    }
))



passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
},
    function (jwtPayload, cb) {
        //find the user in db if needed
        var projection = "email, userId, id"
        return User.getUserById(projection, jwtPayload.id, (err, user) => {            
            if (err)
                return cb(err);
            return cb(null, user);
        })
    }
));
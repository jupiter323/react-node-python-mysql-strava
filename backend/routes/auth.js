const router = require('express').Router();
const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy

const UserControl = require('../controller/userControl')
const StrvDataModel = require('../controller/stravaControl')

const stravaConfig = {
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: process.env.STRAVA_CALLBACK_URL
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

router.get('/login', passport.authenticate('strava', { scope: ['activity:read_all'] }));

router.post('/token', UserControl.getToken)

router.post('/getStrava', (req, res) => {
    StrvDataModel.saveStravaData(req, res)
})

router.post('/checkusersession')

module.exports = router;
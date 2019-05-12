const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/db-config');
const UserControl = require('../controller/userControl')

/* POST login. */
router.post('/login', (req, res, next) => {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.json({
                success: false,
                msg: info ? info.msg : 'Login failed',
                user
            });
        }

        req.login(user, { session: false }, (err) => {

            if (err) {
                res.send(err);
            }
            var sendUserData = { id: user.id, email: user.email, userId: user.userId, verified: user.verified }
            const token = jwt.sign(sendUserData, config.secret);
            jwt.verify(token, config.secret, (err, decoded) => {
                return res.json({ ...decoded, token, success: true });
            })
        });
    })(req, res);

});

router.post('/emailverify', (req, res) => {
    var { token } = req.body;
    jwt.verify(token, config.secret, (err, decoded) => {
        var user = decoded;
        var verified = true;
        var sendUserData = { id: user.id, email: user.email, userId: user.userId, verified }
        token = jwt.sign(sendUserData, config.secret, {
            expiresIn: '3d' // expires in 24 hours
        });
        // return res.json({ ...sendUserData, token });
        UserControl.eamilVerify({ body: { id: user.id, data: { ...sendUserData, token } } }, res)

    })
})

router.get('/login', passport.authenticate('strava', { scope: ['activity:read_all'] }));
router.post('/emailregister', UserControl.register)
router.post('/forgotpasswordrequest', UserControl.forgotPasswordRequest)



module.exports = router;
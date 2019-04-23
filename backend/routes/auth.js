const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/db-config');
const UserControl = require('../controller/userControl')
/* POST login. */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                msg: info ? info.msg : 'Login failed',
                user
            });
        }

        req.login(user, { session: false }, (err) => {

            if (err) {
                res.send(err);
            }
            var sendUserData = { id: user.id, email: user.email, userId: user.userId }
            const token = jwt.sign(sendUserData, config.secret);
            return res.json({ user: sendUserData, token });
        });
    })(req, res);

});

router.post('/emailregister', UserControl.register)


module.exports = router;
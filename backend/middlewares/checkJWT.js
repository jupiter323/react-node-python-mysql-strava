const jwt = require('jsonwebtoken');
const config = require('../config/db-config');

module.exports = (req, res, next) => {

    let token = req.headers["authorization"];
    if (token) {

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'failed to authenticate token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.status(403).json({
            success: false,
            message: 'No token provided'
        });
    }
}
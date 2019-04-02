const Message = require('../model/chat_msg')
const CONSTANTS = require('../config/contants')
const userControl = require('../controller/userControl')

exports.getMessage = function (req, res) {

    let userId = req.body.userId;
    // console.log(req.body.userId)
    if (userId == '') {
        res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
            error: true,
            message: CONSTANTS.USERID_NOT_FOUND
        });
    } else {
        Message.getMessage(async (err, messages) => {
            if (err) {
                res.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
                    error: true,
                    messages: CONSTANTS.USER_NOT_LOGGED_IN
                });
            } else {
                const msgResults = []
                for (let list of messages) {
                    let p = await Promise.resolve(userControl.getUserInfo({
                        userId: list.userID,
                        socketId: false
                    }))
                    const msgResult = extend(list, p)
                    msgResults.push(msgResult)
                }

                res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
                    error: false,
                    messages: messages
                });
            }
        })
    }
}

function extend(obj, src) {
    Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
    return obj;
}
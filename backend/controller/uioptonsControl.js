var UIoptionsModel = require('../model/uioption')
var Constants = require('../config/contants')
const request = require("request");
exports.getOptions = function (req, res) {
    UIoptionsModel.get_all((err, options) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                message: Constants.OPTIONS_LOAD_FAILURE,
                options: null
            })
        } else {
            res.send({
                status: 200,
                error: null,
                message: Constants.OPTIONS_LOAD_SUCCESS,
                options: options
            })
        }
    })
}
exports.callPythonTrain = (req, res) => {
    var url = `${process.env.PYTHON_URL}?user=${req.query.user}`
    request.get(
        url,
        function (error, response, body) {
            console.log(error, body)
            if (!error && JSON.parse(body).status === 'success') {

                let msg = Constants.CALL_PYTHON_SUCESS
                status = Constants.SERVER_OK_HTTP_CODE
                res.send({
                    status: status,
                    error: error,
                    message: msg + JSON.parse(body).message
                })

            } else {
                status = Constants.SERVER_INTERNAL_ERROR
                res.send({
                    status: status,
                    success: false,
                    message: error + JSON.parse(body).message
                })
            }
        }
    );
}
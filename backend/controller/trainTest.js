var Constants = require('../config/contants')
const request = require("request");
const urlCfg = require("../config/urls-config")


exports.callPythonTrainForHost = (req, res) => {
    var url = `${urlCfg.PYTHON_URL}?user=${req.query.user}`
    request.get(
        url,
         (error, response, body)=> {
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
exports.callPythonTrainAndTest = (userID) => {
    var url = `${urlCfg.PYTHON_URL}?user=${userID}`
    request.get(
        url,
        function (error, response, body) {
            console.log(error, body)
            if (!error && JSON.parse(body).status === 'success') {

                let msg = Constants.CALL_PYTHON_SUCESS
                status = Constants.SERVER_OK_HTTP_CODE
                return ({
                    error: error,
                    message: msg + JSON.parse(body).message
                })

            } else {
                return ({
                    success: false,
                    message: error + JSON.parse(body).message
                })
            }
        }
    );
}
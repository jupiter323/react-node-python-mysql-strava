var UIoptionsModel = require('../model/uioption')
var Constants = require('../config/contants')
const request = require("request");
const urlCfg = require("../config/urls-config")
var Utils = require('./../web/utils.js')
const _ = require("lodash")

exports.getAllOptionsTxt = function (req, res) {
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
                options
            })
        }
    })
}


exports.getSystemOptions = function (req, res) {
    UIoptionsModel.get_all((err, options) => {
        if (err) {
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                error: err,
                message: Constants.OPTIONS_LOAD_FAILURE,
                optionsRes: null

            })
        } else {
            var optionsRes = Utils.OptionTableStringToJson(options)
            res.send({
                status: 200,
                error: null,
                message: Constants.OPTIONS_LOAD_SUCCESS,
                optionsRes
            })
        }
    })
}


exports.callPythonTrain = (req, res) => {
    var url = `${urlCfg.PYTHON_URL}?user=${req.query.user}`
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

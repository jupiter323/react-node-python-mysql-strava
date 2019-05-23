var UIoptionsModel = require('../model/uioption')
var Constants = require('../config/contants')
var Utils = require('./../web/utils.js')

exports.getAllOptionsTxt =  (req, res)=> {
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


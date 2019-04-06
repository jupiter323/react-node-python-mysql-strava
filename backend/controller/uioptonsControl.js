var UIoptionsModel = require('../model/uioption')
var Constants = require('../config/contants')

exports.getOptions = function(req, res){
    UIoptionsModel.get_all((err,options)=>{
        if(err) {
            res.send({
                status:Constants.SERVER_INTERNAL_ERROR,
                error:err,
                message:Constants.OPTIONS_LOAD_FAILURE,
                options:null
            })             
        } else{
            res.send({
                status:200,
                error:null,
                message:Constants.OPTIONS_LOAD_SUCCESS,
                options:options
            })
        }
    })
}
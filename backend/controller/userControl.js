const request = require("request");
const fs = require("fs");
const UserProfile = require('../model/user_profile')
const User = require('../model/user')
const Constants = require('../config/contants')

exports.getToken = function(req, res) {
    request.post(
        "https://www.strava.com/oauth/token",
        {
            json: {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code: req.body.code,
                grant_type: "authorization_code",
                scope: "activity:read_all"
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                saveStravaConfig(body.access_token)
                
                User.registerUser(body,(err, msg)=>{
                    let status = ''
                    if(err){
                        status = Constants.SERVER_INTERNAL_ERROR
                    }else{
                        status = Constants.SERVER_OK_HTTP_CODE
                    }
                    res.send({
                        status:status,
                        error:err,
                        message:msg,
                        data: body
                    }) 
                })
                        
            } else {
                res.send({
                    success: false,
                    message: error
                })
            }
        }
    );
}

exports.getUserListOptions = function(req, res){
    let projection = 'userId,username,profile_medium'
    UserProfile.getUserList(projection, (err, users)=>{
        if(err){
            res.send({
                status:Constants.SERVER_INTERNAL_ERROR,
                error:err,
                options:null
            }) 
        }else{
            res.send({
                status:Constants.SERVER_OK_HTTP_CODE,
                error:null,
                users:users
            })
        }
    })
}

function saveStravaConfig(token) {
    fs.writeFileSync(
       Constants.STRAVA_CONFIG_PATH,
        `{\n"access_token"    :"${token}", \n"client_id"  :  "${process.env.STRAVA_CLIENT_ID}", \n"client_secret" :"${process.env.STRAVA_CLIENT_SECRET}", \n"redirect_uri"  :"${process.env.STRAVA_CALLBACK_URL}"\n}`
    ); 
}


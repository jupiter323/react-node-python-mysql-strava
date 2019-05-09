var Constants = require('../config/contants')
var db = require('./db');
var User = require('./user');
var _ = require('lodash');

var propertyToHrCat = (profile) => {
    var hrCat;
    try {
        hrCat = `${profile.hrzone0min},${0.75 * profile.hrzone0max},${profile.hrzone0max},${0.5 * profile.hrzone1max},${profile.hrzone1max},${0.5 * profile.hrzone2max},${profile.hrzone2max},${0.5 * profile.hrzone3max},${profile.hrzone3max},${0.5 * profile.hrzone4max},${profile.hrzone4max},${0.5 * profile.hrzone5max},${profile.hrzone5max}`
    } catch (err) {
        hrCat = "80,100,110,120,130,140,150,160,170,180,190,200,200"
    }
    return hrCat
}

var propertyToUserDataJson = (profile) => {
    const { firstname, lastname, sex, weight, age } = profile;
    var tempJson = { firstname: "", lastname: "", gender: "M", weight: "0", age: "0", length: "1.80", shape: "na", hrcat: "", send: "Update user settings" }

    var hrcat = propertyToHrCat(profile);
    try {
        tempJson.firstname = firstname;
        tempJson.lastname = lastname;
        tempJson.gender = sex;
        tempJson.weight = "" + weight;
        tempJson.age = "" + age;
        tempJson.length = "1.80";
        tempJson.shape = "na"
        tempJson.hrcat = hrcat;
        tempJson.send = "Update user settings"
    } catch (err) {
        console.log(err)
    }
    return tempJson
}


var insertFileRow = function (req, callback) {
    var { user, files } = req;
    var upload_user_id = user.id;
    var upload_filename = files[0]["originalname"];
    var upload_user_settings;
    var upload_system_settings;
    // _.forEach(files, (file) => {
    //     upload_filename = file["originalname"];
    //     console.log("file name:", upload_filename)
    // })

    User.getUserProfileByClientId("*", user.id, (err, userprofile) => {
        if (err) {
            return callback(err)
        } else {
            if (!userprofile)
                return callback(null, true);
            else {

                upload_system_settings = userprofile.systemsetting;
                upload_user_settings = JSON.stringify(propertyToUserDataJson(userprofile));

                var valueFiledsString = '';
                var valueArray = [];
                for (let i = 0; i < files.length; i++) {
                    valueFiledsString += i + 1 == files.length ? "(?,?,?,?)" : "(?,?,?,?),"
                    upload_filename = files[i]["originalname"];
                    valueArray.push(upload_user_id, upload_filename, upload_user_settings, upload_system_settings)
                }
                db.query(`INSERT INTO uploads (upload_user_id,upload_filename,upload_user_settings,upload_system_settings) values ${valueFiledsString}`,
                    valueArray,
                    function (err, response) {

                        if (err) {

                            if (err.code === 'ER_DUP_ENTRY') {
                                // If we somehow generated a duplicate user id, try again
                            }
                            return callback(err)

                        }
                        return callback(null, false); // success
                    })
            }
        }

    })

}

exports.insertFileRow = insertFileRow


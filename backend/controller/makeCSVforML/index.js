// Copyright (c) j.c. jansen klomp. All rights reserved.
const fs = require('fs')
// const fn = require('./functions.js')
const convert = require('./convert.js')
var db = require('../../model/db');

var rootpath = require('path').join(__dirname, "./../../storage/gpx")

function runconvert(filedata, params, isTestData) {
    return new Promise(function (resolve, reject) {
        convert.convert(filedata, params, isTestData, function (result) {
            resolve(result.parseresult)
            // if (err) reject(err)   // no error result         
        })
    })
}

var queryPromise = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows)
            // if (rows.length) {
            //     resolve(rows)
            // }
        });
    })
}

async function processFile(isTestData) {
    checkoutputdir()
    console.log('background process gpxconvert started')
    let delay = 2000
    try {
        var query = `SELECT upload_id from  uploads WHERE upload_status = ""`
        let worklist = await queryPromise(query, [])
        console.log("work list: ", worklist)
        if (worklist.length > 0) {
            delay = 300
            var query = `SELECT * from uploads WHERE upload_id = "${worklist[0].upload_id}"`
            let uploaddata = await queryPromise(query, [])

            var query = `UPDATE uploads SET upload_status = "ready" WHERE upload_id = "${uploaddata[0].upload_id}"`
            let updatedata = await queryPromise(query, [])

            // var query = `SELECT * from users WHERE user_id = "${uploaddata[0].upload_user_id}"`
            // let userdata = await queryPromise(query, [])

            // var query = `SELECT sys_settings from  system WHERE sys_id = 1`
            // let systemdata = await queryPromise(query, [])

            let userdata = uploaddata[0]["upload_user_settings"]
            let systemdata = uploaddata[0]["upload_system_settings"]
            let uploadUserId = uploaddata[0]["upload_user_id"];
            var sendparams = { userdata, systemdata, uploadUserId }
            let filename = uploaddata[0].upload_filename
            let filedata = fs.readFileSync(`${rootpath}/uploads/${uploadUserId}/${filename}`)
            let params = prepareparams(sendparams, filename)
            // fs.writeFileSync(`${rootpath}/uploads/${uploadUserId}/${filename}-convertparams.json`, JSON.stringify(params, "", 3))
            let convertresult = await runconvert(filedata, params, isTestData)
            console.log(convertresult)
        }
    }
    catch (err) {
        console.log(err)
    }
    // setTimeout(function(){ processFile() }, delay)
}

function prepareparams(receivedParams, filename) {
    let params = {}
    let usersettings = JSON.parse(receivedParams.userdata)
    let systemsettings = JSON.parse(receivedParams.systemdata)
    params['name'] = filename
    params['hr-cat-sel'] = usersettings.hrcat
    params['hr-cat-mult'] = systemsettings.hrweight
    params['slope-cat-sel'] = systemsettings.slopecat
    params['output-column-sel'] = systemsettings.outputcols
    params['saveuploads'] = "false"
    params['savetimeslotfiles'] = "false"
    params['saveweatherfiles'] = "false"
    params['loadweatherfromdarksky'] = "true"
    params['user-id'] = receivedParams.uploadUserId
    params['mv'] = usersettings.gender
    params['gewicht'] = usersettings.weight
    params['leeftijd'] = usersettings.age
    params['lengte'] = usersettings.length
    params['conditie'] = usersettings.shape
    params['activity-id'] = ""
    params['airresistance'] = systemsettings.airresist
    //params['surfacearea'] = systemsettings.surfacerea
    params['surfacearea'] = systemsettings.surfarea
    params['rollingresistance'] = systemsettings.rolresist
    params['seglen'] = systemsettings.seglen
    params['zeronegativeenergy'] = systemsettings.negzero && systemsettings.negzero == 'checked' ? 'true' : 'false'
    params['csvwithcomma'] = systemsettings.withcomma && systemsettings.withcomma == 'checked' ? 'true' : 'false'
    return params
}

function checkoutputdir() {
    let dir = rootpath + '/output-files'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}


exports.processFile = processFile
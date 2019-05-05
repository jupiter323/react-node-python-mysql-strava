// Copyright (c) j.c. jansen klomp. All rights reserved.
const fs = require('fs')
const fn = require('./functions.js')
const convert = require('./convert.js')

var rootpath = __dirname + "./../../storage/gpx"

function runconvert(filedata, params) {
    return new Promise(function (resolve, reject) {
        convert.convert(filedata, params, function (result) {
            resolve(result.parseresult)
            // if (err) reject(err)   // no error result         
        })
    })
}

async function processFile() {
    checkoutputdir()
    console.log('background process gpxconvert started')
    let delay = 2000
    var query = `SELECT sys_settings from  system WHERE sys_id = 1`
    let systemdata = await fn.queryPromise(query)
    var query = `SELECT * from users WHERE user_id = "1"`
    let userdata = await fn.queryPromise(query)

    console.log("datas from db: ", JSON.parse(systemdata[0].sys_settings),JSON.parse(userdata[0].user_settings))
    try {
        var query = `SELECT upload_id from  uploads WHERE upload_status = ""`
        let worklist = await fn.queryPromise(query)
        console.log("work list: ", worklist)
        if (worklist.length > 0) {
            delay = 300
            var query = `SELECT * from uploads WHERE upload_id = "${worklist[0].upload_id}"`
            let uploaddata = await fn.queryPromise(query)

            var query = `UPDATE uploads SET upload_status = "ready" WHERE upload_id = "${uploaddata[0].upload_id}"`
            let updatedata = await fn.queryPromise(query)

            var query = `SELECT * from users WHERE user_id = "${uploaddata[0].upload_user_id}"`
            let userdata = await fn.queryPromise(query)

            var query = `SELECT sys_settings from  system WHERE sys_id = 1`
            let systemdata = await fn.queryPromise(query)

            let filename = uploaddata[0].upload_filename
            let filedata = fs.readFileSync(rootpath + '/uploads/' + filename)
            let params = prepareparams(userdata[0], systemdata[0], filename)
            let convertresult = await runconvert(filedata, params)
            console.log(convertresult)
        }
    }
    catch (err) {
        console.log(err)
    }
    // setTimeout(function(){ processFile() }, delay)
}

function prepareparams(user, system, filename) {
    let params = {}
    let usersettings = JSON.parse(user.user_settings)
    let systemsettings = JSON.parse(system.sys_settings)
    params['name'] = filename
    params['hr-cat-sel'] = usersettings.hrcat
    params['hr-cat-mult'] = systemsettings.hrweight
    params['slope-cat-sel'] = systemsettings.slopecat
    params['output-column-sel'] = systemsettings.outputcols
    params['saveuploads'] = "false"
    params['savetimeslotfiles'] = "false"
    params['saveweatherfiles'] = "false"
    params['loadweatherfromdarksky'] = "true"
    params['user-id'] = user.user_id
    params['mv'] = usersettings.gender
    params['gewicht'] = usersettings.weight
    params['leeftijd'] = usersettings.age
    params['lengte'] = usersettings.length
    params['conditie'] = usersettings.shape
    params['activity-id'] = ""
    params['airresistance'] = systemsettings.airresist
    params['surfacearea'] = systemsettings.surfacearea
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
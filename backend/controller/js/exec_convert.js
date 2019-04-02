
// Copyright (c) j.c. jansen klomp. All rights reserved.  

let power   = require('./power')
let waypoints = require('./waypoints')
let segs    = require('./segments')
let fs      = require('fs')

let rootdir  = __dirname + '/..'

function sendres(params,result){
    // res.writeHead(200, { 'content-type': 'text/plain' });
    params["parseresult"] = result
    //res.end(JSON.stringify(params,"",3))
    process.stdout.write(JSON.stringify(params,"",3))
}

function convert(data) { // uploaded data : params + gpx/fit data in base64 format

    let i1 = data.indexOf('<params>')
    let i2 = data.indexOf('</params>')
    if (i1==-1 || i2 == -1) {
        sendres({name:"undefined"},'no params')
        return;                    
    }
    let s = data.substring(i1+8,i2)
    let arr = s.split(';')
    let params = {}
    for (var i=0; i < arr.length; i++){
        let pair = arr[i].split(':')
        if (pair.length == 2) {
            if (pair[0] != 'name') pair[1] = pair[1].replace(/ /g,'') // remove spaces, except from filename
            params[pair[0]] = pair[1]
        }
    }

    //let file = rootdir + '\\params.json'
    //fs.writeFileSync(file, JSON.stringify(params,"",3))

    data = data.substr(i2+9) // remove <param> .. </param> section

    // exit if extension is not supported
    if ( !params.name.endsWith('.gpx') && !params.name.endsWith('.fit') && !params.name.endsWith('_log_2.csv')) {
        sendres(params,'unsupported file extension')
        return
    }
    
    if (params.hasOwnProperty('name')) {
        let savealias = params.name
        if (params.hasOwnProperty('user-id') && params['user-id'] !=""){
            let index = params.name.indexOf('_')
            if (index > 0) savealias = params['user-id'] + params.name.substr(index)
        }
        let file = rootdir + '/uploads/' + params.name

        // ready if file is participants info file
        if (params.name.endsWith('_log_2.csv')) {
            fs.writeFileSync(file, data) // save in uploads
            sendres(params,'ok')
            return
        }

        // find participants file and search the # of participants for this ride
        // params.name examples: joramkolf_2017-06-25.gpx, joramkolf_2017-06-25_1.gpx
        // participants file line example: joramkolf;2018-07-29;1
        // participants file name example: joramkolf_log_2.csv
        let participants = -1
        if (params.name.indexOf('_') > 0) { // name must have '_'
            let splitname = params.name.split('_')
            try {
                let participantsdata = fs.readFileSync(rootdir + '/uploads/' + splitname[0] + '_log_2.csv' ).toString()
                let needle = splitname[0] + ';' + splitname[1].substr(0,10) + ';' // needle format: x...x;xxxx-xx-xx;
                let index = participantsdata.indexOf(needle)
                if (index >=0) {
                    let count = parseInt(participantsdata.substr(index+needle.length,10))  // # of participants for this ride
                    if (!isNaN(count)) participants = count
                }                    }
            catch(err) {
            }
        }
        // console.log('participants='+participants)

        // parse gpx data
        if (params.name.endsWith('.gpx')) {
            let gpx_xml_data = Buffer.from(data, 'base64').toString()
            if (params.saveuploads=='true') fs.writeFileSync(file, gpx_xml_data)
            let trackinfo = waypoints.gpxParser(gpx_xml_data)
            processParserData(trackinfo)
        }

        // parse fit data
        if (params.name.endsWith('.fit')) {
            let fit_data = Buffer.from(data, 'base64')
            if (params.saveuploads=='true') fs.writeFileSync(file, fit_data)
            waypoints.fitParser2(fit_data,processParserData)
        }

        // process waypoint data
        function processParserData(trackinfo) {
            if (trackinfo != null && trackinfo.waypoints != undefined ) {
                // fs.writeFileSync(file + '.trackinfo.json',JSON.stringify(trackinfo,"",3))
                // xmlparser.waypointsToCsv(file, trackinfo.waypoints)
                
                // get hourly weather 
                segs.getDarkSkyData(params, trackinfo, (weatherresult) => {
                    if (weatherresult.error !='') {
                        sendres(params,weatherresult.error)
                        return
                    }
                    
                    // segment length: default 100m, minimal 10m
                    let seglen = parseInt(params.seglen)
                    if (isNaN(seglen)) seglen = 100
                    if (seglen < 10) seglen = 10

                    // build segments
                    let segments = segs.buildSegments(params,trackinfo, seglen)

                    // calculate Functional Threshold Power
                    let timeslotsA = power.calcFTP(segments,30,300,0.82)
                    let timeslotsB = power.calcFTP(segments,30,600,0.885)
                    let timeslotsC = power.calcFTP(segments,30,1200,0.93)

                    if (params.savetimeslotfiles=='true') {
                    try {
                            let dir  = rootdir + '/timeslot-files/'
                            fs.writeFileSync(dir + savealias + '.timeslotsA.csv',power.toCSV(timeslotsA))
                            fs.writeFileSync(dir + savealias + '.timeslotsB.csv',power.toCSV(timeslotsB))
                            fs.writeFileSync(dir + savealias + '.timeslotsC.csv',power.toCSV(timeslotsC))
                        }
                        catch(err){
                            sendres(params,'error writing timeslots.csv file')
                        }                        
                    }

                    // save data in csv-file
                    if (params.hasOwnProperty("output-column-sel")) {
                        let csv = segs.toCsv(params, trackinfo, segments, timeslotsA, timeslotsB, timeslotsC, participants)
                        if (params.hasOwnProperty('csvwithcomma')) {
                            if (params.csvwithcomma == "true") csv = csv.replace(/\./g,',') 
                        }
                        try {
                            fs.writeFileSync(rootdir + '/output-files/' + savealias + '.csv',csv)
                            let warning = ""
                            if (weatherresult.warning !="") sendres(params, weatherresult.warning)
                            else sendres(params,'ok')
                        }
                        catch(err){
                            sendres(params,'error writing csv file')
                        }
                    }
                    else sendres(params,'error no column definition for csv file')
                })
            
            }
            else sendres(params,'error parsing track data')
        }
    }
    else sendres(params,'missing name parameter')
}

let infile = rootdir + '/temp_files/' + process.argv[2]

try {
    fs.readFile(infile, 'utf8', function(err, contents) {
        if (err) {
            sendres({infile:infile},'error reading file '+infile)            
        }
        convert(contents.toString())
        fs.unlinkSync(infile);
    });
    // let data = fs.readFileSync(infile)
    // fs.unlinkSync(infile);
    // convert(contents.toString())
}
catch (err) {
    sendres({infile:infile},'error processing file '+infile)
}
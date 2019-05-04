
// Copyright (c) j.c. jansen klomp. All rights reserved.  


let power   = require('./power')
let waypoints = require('./waypoints')
let segs    = require('./segments')
let fs      = require('fs')

var rootdir  = __dirname + "./../../" 
function convert(data, params, callback) { // data = ride file content 

    let result = ""
    
    function sendres(params,result){
        //res.writeHead(200, { 'content-type': 'text/plain' });
        params.parseresult = result
        callback(params)
        //res.end(JSON.stringify(params,"",3))
    }

    // init extra params
    params['intensityscore'] = ""
    params['otherpeople'] = 0
    params['participantdata'] = []
    params['timeslotsA'] = {}
    params['timeslotsB'] = {}
    params['timeslotsC'] = {}
    params['timeoffset'] = 0

    //let file = rootdir + '\\params.json'
    //fs.writeFileSync(file, JSON.stringify(params,"",3))

    // exit if extension is not supported
    if ( !params.name.endsWith('.gpx') && !params.name.endsWith('.fit') && !params.name.endsWith('_log_2.csv') && !params.name == '2501580_out.csv' && !params.name.endsWith('.csv')) {
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
        if (params.name.endsWith('_log_2.csv') || params.name == '2501580_out.csv') {
            sendres(params,'ok')
            return
        }

        // check if file is VirtualRide

        // Rides are in file 2501580_out.csv and row lay-out is as follows:
        // Joram Kolf;Virtual Ride;The McCarthy Special;27-1-2019;11:54:00;34.98km;4;85%
        // Joram Kolf;Ride;Heerlijk zonnig voorjaarsritje met Bart;20-1-2019;12:31:00;54.65km;1;81%
        // params.name examples: joramkolf_2017-06-25.gpx, joramkolf_2017-06-25_1.gpx, can also end on .fit
        
        let splitname = params.name.split('_')
        
        function strip(s){
            return s.replace(/ /g, "").toLowerCase().trim()
        }
        
        function unniformdate(s){
            let arr = s.split('-')
            if (arr.length < 3) return s // invalid format
            if (arr[2].length == 4) { // swap day and year
                let x = arr[0]
                arr[0] = arr[2]
                arr[2] = x
            }
            while (arr[1].length < 2) arr[1] = '0' + arr[1]
            while (arr[2].length < 2) arr[2] = '0' + arr[2]
            return arr.join('-') // yyyy-mm-dd
        }

        if (splitname.length >= 2) { // name must have '_'
            try {
                let fname = rootdir + '/uploads/2501580_out.csv'
                let data = fs.readFileSync(fname).toString()
                let rows = data.split('\n')
                let username = strip(splitname[0])
                let filedate = unniformdate(splitname[1].split('.')[0])
                for (var i=0; i < rows.length; i++) {
                    let cells = rows[i].split(';')
                    if (strip(cells[0]) == username && unniformdate(strip(cells[3])) == filedate){
                        if (strip(cells[1])=='virtualride'){
                            sendres(params,'virtual ride, processing skipped')
                            return
                        }
                        else {
                            params['intensityscore'] = strip(cells[7])
                            params['otherpeople'] = strip(cells[6])
                        }
                    }
                }
            }
            catch(err) {
            }
        }


        // find participants file and search the # of participants for this ride
        // params.name examples: joramkolf_2017-06-25.gpx, joramkolf_2017-06-25_1.gpx, can als end on .fit
        // participants file row example: joramkolf;2018-07-29;10:04:09;1
        // participants file name example: joramkolf_log_2.csv

        if (splitname.length >= 2) { // name must have '_'
            try {
                let fname = rootdir + '/uploads/' + splitname[0] + '_log_2.csv'
                let data = fs.readFileSync(fname).toString()
                let rows = data.split('\n')
                let needle = splitname[0] + ';' + splitname[1].substr(0,10) + ';' // needle format: x...x;yyyy-mm-dd;
                for (var i=0; i < rows.length; i++) {
                    if (rows[i].indexOf(needle) >= 0){
                        // get the cells from this row
                        let cells = rows[i].split(';')
                        if (cells.length == 3) { // assume row formatted without time: joramkolf;2018-07-29;1
                            params['participantdata'].push({name:cells[0], date: cells[1], time: "", participants: cells[2].trim()})
                            break // we use the first match 
                        }
                        else if (cells.length >= 4) {
                            params['participantdata'].push({name:cells[0], date: cells[1], time: cells[2], participants: cells[3].trim()})
                        }
                    }
                }

            }
            catch(err) {
            }
        }
        // console.log('participants='+participants)

        // parse gpx data
        if (params.name.endsWith('.gpx')) {
            let gpx_xml_data = data.toString()
            if (params.saveuploads=='true') fs.writeFileSync(file, gpx_xml_data)
            let trackinfo = waypoints.gpxParser(gpx_xml_data)
            processParserData(trackinfo)
        }

        // parse fit data
        if (params.name.endsWith('.fit')) {
            let fit_data = data
            if (params.saveuploads=='true') fs.writeFileSync(file, fit_data)
            waypoints.fitParser2(fit_data,processParserData)
        }

        // parse strava csv data 
        if (params.name.endsWith('.csv')) {
            let csv_data = data.toString()
            if (params.saveuploads=='true') fs.writeFileSync(file, fit_data)
            waypoints.csvParser(csv_data,processParserData)
        }

        // process waypoint data
        function processParserData(trackinfo) {
            if (trackinfo != null && trackinfo.waypoints != undefined ) {
                // fs.writeFileSync(file + '.trackinfo.json',JSON.stringify(trackinfo,"",3))
                waypoints.waypointsToCsv(file, trackinfo.waypoints)
                
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
                    params.timeslotsA = power.calcFTP(segments,30,300,0.82)
                    params.timeslotsB = power.calcFTP(segments,30,600,0.885)
                    params.timeslotsC = power.calcFTP(segments,30,1200,0.93)

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
                        let csv = segs.toCsv(params, trackinfo, segments)
                        if (params.hasOwnProperty('csvwithcomma')) {
                            if (params.csvwithcomma == "true") csv = csv.replace(/\./g,',') 
                        }
                        try {
                            fs.writeFileSync(rootdir + '/output-files/' + savealias + '.csv',csv)
                            let warning = ""
                            if (weatherresult.warning !="") sendres(params, weatherresult.warning)
                            else sendres(params,params.name+': ok')
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

module.exports = {
    convert: convert
}

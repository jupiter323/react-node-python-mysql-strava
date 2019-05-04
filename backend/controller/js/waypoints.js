// Copyright (c) j.c. jansen klomp. All rights reserved.

"use strict"

let fs    = require('fs');
let calcenergy   = require('./power');
let error = ""


/////////////////////////////////////////////////////////////////////////////////////////
//
//                                       xmlparser 2
//
/////////////////////////////////////////////////////////////////////////////////////////

function xmlParser2(data){
    let index = 0
    let waypoints = []
    let trkpt = ""

    function getEntity(name) {
        let i1 = data.indexOf('<' + name, index)
        if (i1 >= 0) {
            let i2 = data.indexOf('</' + name + '>', i1)
            if (i2 >= 0) {
                index = i2 + 3 + name.length
                return data.substr(i1, i2 - i1)
            }
        } 
        index = -1
    }

    function getAttribValue(name){
        let i1 = trkpt.indexOf(name)
        if (i1 >= 0) {
            let i2 =  i1 + name.length
            if (trkpt.charAt(i2) == '=') {
                let i3 = trkpt.indexOf(trkpt.charAt(i2+1), i2+2)  // find the closing delimiter, normally a double quote
                if (i3 >= 0) return trkpt.substr(i2 + 2, i3 - i2 - 2);
            }
        }
        return 0;
    }
    
    
    function getContentValue(name){
        let i1 = trkpt.indexOf('<' + name + '>')
        if (i1 >= 0) {
            let i2 = trkpt.indexOf('</' + name + '>')
            if (i2 >= 0) {
                let len = name.length + 2
                return trkpt.substr(i1 + len , i2 - i1 - len)
            }
        }
        return 0;
    }

    function getContentValueExtended(name){
        // <pwr:PowerInWatts xmlns:pwr="http://www.garmin.com/xmlschemas/PowerExtension/v1">167</pwr:PowerInWatts>
        let i1 = trkpt.indexOf('<' + name)
        if (i1 >= 0) {
            let i3 = trkpt.indexOf('>',i1)
            if (i3 > 0) {
                let i2 = trkpt.indexOf('</' + name + '>')
                if (i2 >= 0) {
                    let len = name.length + 2
                    return trkpt.substr(i3 + 1 , i2 - i3 - 1)
                }
            }
        }
        return 0;
    }


    do {
        trkpt = getEntity('trkpt');
        if (index > 0) {
            let power = parseFloat(getContentValue('power'))
            if (power == 0) power = parseFloat(getContentValueExtended('pwr:PowerInWatts'))
            let utc = new Date(getContentValue('time')).valueOf() / 1000 // in s
            waypoints.push( {
                lat : parseFloat(getAttribValue('lat')),
                lon : parseFloat(getAttribValue('lon')),
                ele : parseFloat(getContentValue('ele')),
                utc : utc,
                temp : parseFloat(getContentValue('gpxtpx:atemp')),
                hr : parseFloat(getContentValue('gpxtpx:hr')),   // heart rate in beats/min
                cad : parseFloat(getContentValue('gpxtpx:cad')), // cadence in rev/min
                power : power  // power in Watt
            })
        }
    }
    while ( index != -1);
    trkpt = data // needed for time and name
    return {'waypoints' : waypoints, 'time' : getContentValue('time'), 'name' : getContentValue('name')}
}

/////////////////////////////////////////////////////////////////////////////////////////
//
//                                       fit parser 1
//
/////////////////////////////////////////////////////////////////////////////////////////

/*
// Require the module
var EasyFit = require('./fit/easy-fit.js').default;


function fitParser1A(content,callback) {
    // Create a EasyFit instance (options argument is optional)
    var easyFit = new EasyFit({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'm',
        temperatureUnit: 'celsius',
        elapsedRecordField: true,
        mode: 'cascade',
    });
  
    // parse content
    easyFit.parse(content, function (error, data) {
  
        // Handle result of parse method
        if (error) {
            callback({'waypoints' : [], 'time' : "", 'name' : "", 'err' : error})
            return
        } else {

            try {
                var records = data.activity.sessions[0].laps[0].records
                var waypoints = []
                for (var i=0; i < records.length; i++){
                    let record = records[i]
                    waypoints.push( {
                        lat   : record['position_lat'],
                        lon   : record['position_long'],
                        ele   : record['altitude'],
                        temp  : record['temperature'],
                        hr    : record['heart_rate'],       // heart rate in beats/min
                        cad   : record['cadence'],          // cadence in rev/min
                        power : record['power'],            // power in Watt
                        utc   : record['timestamp']         // in s
                    })                    
                }
                var result = {'waypoints' : waypoints, 'time' : data.activity.sessions[0].laps[0]['start_time'], 'name' : "", 'err':""}
            }
            catch (err){
                var result = {'waypoints' : [], 'time' : "", 'name' : "", 'err' : err}
            }
            callback(result)
        }
    })
}

*/


/////////////////////////////////////////////////////////////////////////////////////////
//
//                                       fit parser 2
//
/////////////////////////////////////////////////////////////////////////////////////////

// Require the module
var parsefit = require('./parsefit/parsefit.js')


function fitParser2A(content) {
    var records = parsefit.parse(content)
    try {
        var waypoints = []
        for (var i=0; i < records.length; i++){
            let record = records[i]
            if (record.name == 'record'){
                let fields = record.fields
                if (fields.hasOwnProperty('position_lat') && fields.hasOwnProperty('position_long')){
                    let power = 0
                    if (fields.hasOwnProperty('power')) power = fields['power'].value
                    if (power = 65536) power =0 
                    let temperature = 0
                    if (fields.hasOwnProperty('temperature')) temperature = fields['temperature'].value
                    let heartrate = 0
                    if (fields.hasOwnProperty('heart_rate')) heartrate = fields['heart_rate'].value
                    let cadence = 0
                    if (fields.hasOwnProperty('cadence')) cadence = fields['cadence'].value
                    let altitude = 0
                    if (fields.hasOwnProperty('altitude')) altitude = fields['altitude'].value
                    let lat = fields['position_lat'].value
                    let lon = fields['position_long'].value
                    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180)
                        waypoints.push( {
                            lat   : lat,
                            lon   : lon,
                            ele   : altitude,
                            temp  : temperature,
                            hr    : heartrate,                  // heart rate in beats/min
                            cad   : cadence,                    // cadence in rev/min
                            power : power,                      // power in Watt
                            utc   : fields['timestamp'].value   // in s
                        })  
                }
                //else console.log(`no lat-lon at waypoint index ${i}`)
            }                  
        }
        var result = {'waypoints' : waypoints, 'time' : '', 'name' : "", 'err':""}
    }
    catch (err){
        var result = {'waypoints' : [], 'time' : "", 'name' : "", 'err' : err}
    }
    return result
}

/////////////////////////////////////////////////////////////////////////////////////////
//
//                                       csv parser
//
/////////////////////////////////////////////////////////////////////////////////////////

// Distance ,Altitude, Time, Lat, Lng , Heartrate, Speed, Power, Temperature , start_date, moving_time, elapsed_time, total_elevation_gain, type, id, timezone,athlete_count
// 0,-0.8,0,52.070206,5.12539,109,0,,,2019-02-18T16:24:24Z,2528,2528,13,Ride,2158641165,(GMT+01:00) Europe/Amsterdam,1
// 0,-0.6,1,52.070206,5.12539,109,0,,,2019-02-18T16:24:24Z,2528,2528,13,Ride,2158641165,(GMT+01:00) Europe/Amsterdam,1

function parseCsv(data){
    let cells    
    let waypoints = []
    let result = {'waypoints' : waypoints, 'time' : "", 'name' : "", 'err' : ''}

    let lines = data.split('\n')
    if (lines.length > 0) {
        let names = lines[0].split(',')
        for (var i=0; i < names.length; i++) names[i]=names[i].trim()
        if (names[0]=='Distance' && names[1]=='Altitude' && names[2]=='Time' && names[3]=='Lat' && names[4]=='Lng' &&
            names[5]=='Heartrate' && names[6]=='Speed' && names[7]=='Power' && names[8]=='Temperature' &&
            names[9]=='start_date' && names[10]=='moving_time' && names[11]=='elapsed_time' && names[12]=='total_elevation_gain' &&
            names[13]=='type' && names[14]=='id' && names[15]=='timezone' && names[16]=='athlete_count'){
            
            function celval(n){
                let val = parseFloat(cells[n])
                if (isNaN(val)) val = 0
                return val
            }

            for (var i=1; i < lines.length; i++){
                cells = lines[i].split(',')
                if (cells.length < 16) continue
                // 2019-02-18T16:24:24Z
                let utc = new Date(cells[9]).valueOf() / 1000 // in s
                waypoints.push( {
                    lat   : celval(3),
                    lon   : celval(4),
                    ele   : celval(1),
                    temp  : celval(8),
                    hr    : celval(5),                   // heart rate in beats/min
                    cad   : 0,                           // cadence in rev/min
                    power : celval(7),                   // power in Watt
                    utc   : utc + celval(2)              // in s
                })
            }
        }
        else result.err = 'invalid column names in csv file'
            
    }
    else result.err = 'invalid csv file'
    return result
}

/////////////////////////////////////////////////////////////////////////////////////
//
//    extend waypoint-records with dist, cumdist, timedif, azimuth, hour and eledif
//
/////////////////////////////////////////////////////////////////////////////////////

function azimuthLatLon(lat1, lat2, lon1, lon2){ // args in radians
    var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
    var y = Math.sin(lon2 - lon1) * Math.cos(lat2) 
    var angle = Math.atan2(y,x)
    if (angle < 0) angle += Math.PI * 2
    return  angle * 180 / Math.PI // in degrees, range 0..360
}


function extend_waypoints(waypoints){  // extend waypoints-records with dist, cumdist, timedif, azimuth, hour and eledif
    if (waypoints.length < 2) return
    var lat1 = Number(waypoints[0].lat)*Math.PI/180 
    var lon1 = Number(waypoints[0].lon)*Math.PI/180
    waypoints[0].cumdist = 0
    waypoints[0].timedif = 0
    waypoints[0].dist = 0
    waypoints[0].eledif = 0
    waypoints[0].speed = 0
    waypoints[0].heartbeats = 0
    waypoints[0]['energy'] = waypoints[0].power * waypoints[0].timedif / 1000 // in Joules
    for (var i=1; i < waypoints.length; i++){
        var lat2 = Number(waypoints[i].lat)*Math.PI/180 
        var lon2 = Number(waypoints[i].lon)*Math.PI/180 
        var dist = Math.acos(Math.sin(lat1)*Math.sin(lat2) +Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1)) * 6371000
        if (isNaN(dist)) waypoints[i]["dist"] = 0; else waypoints[i]["dist"] = dist
        waypoints[i]["cumdist"] = waypoints[i-1]["cumdist"] + waypoints[i]["dist"]
        waypoints[i]["azimuth"] = azimuthLatLon(lat1,lat2,lon1,lon2)
        lat1 = lat2
        lon1 = lon2
        waypoints[i]["timedif"] = ((waypoints[i]['utc'] - waypoints[i-1]['utc'])) * 1000   // in ms units
        waypoints[i]["eledif"] = waypoints[i].ele - waypoints[i-1].ele
        waypoints[i]['energy'] = waypoints[i].power * waypoints[i].timedif / 1000 // in Joules
        waypoints[i]['heartbeats'] = waypoints[i]["timedif"] * waypoints[i]['hr'] / 60000
        if (waypoints[i]['timedif'] == 0) waypoints[i]['speed'] = 0
        else {
            let speed = waypoints[i]['dist'] / waypoints[i]['timedif'] * 1000  // in m/s
            if (speed > 20) { // error
                waypoints[i]['dist'] = 0
                waypoints[i]['speed'] = 0
            }
            waypoints[i]['speed'] = speed
        }
    }
    waypoints[0]["azimuth"] = waypoints[1]["azimuth"]
    return waypoints
}

function waypointsSummary(waypoints){
    if (waypoints == undefined || waypoints.length == 0) return {}
    let stopdist = 0 
    let stoptime = 0
    let movdist = 0
    let movtime = 0
    let uphill = 0    // uphill with hysteresis
    let downhill = 0  // downhill with hysteresis
    let tempsum = waypoints[0].temp
    let lastele = waypoints[0].ele
    let uphillnohys = 0   // uphill without hysteresis
    let downhillnohys = 0 // downhill without hysteresis
    let maxheight = 0
    let minheight = 9999999
    let totalenergy = 0 // total measured energy in Joules
    let totalcalcenergy = 0 // total calculated energy in Joules

    for (var i=1; i < waypoints.length; i++) {
        let ele = waypoints[i].ele
        let eledif = ele - lastele
        if (eledif >= 8) {uphill += eledif; lastele = ele}
        if (eledif < -8) {downhill -= eledif ; lastele = ele}
        eledif  = waypoints[i].eledif
        if (eledif > 0) uphillnohys += eledif
        if (eledif < 0) downhillnohys -= eledif
        if (ele > maxheight) maxheight = ele
        if (ele < minheight) minheight = ele
        let speed = Math.round(waypoints[i].dist * 3600 / waypoints[i].timedif *100) / 100
        let dist = Math.round(waypoints[i].dist * 100) /100
        if (speed < 2 ) {
            stopdist += waypoints[i].dist
            stoptime += waypoints[i].timedif
        }
        else {
            movdist += waypoints[i].dist
            movtime += waypoints[i].timedif
        }
        tempsum += waypoints[i].temp
        totalenergy += waypoints[i].energy
        totalcalcenergy += waypoints[i].calcenergy
    }
    let summary = {
        movdist:movdist, 
        movtime:movtime, 
        stopdist:stopdist, 
        stoptime:stoptime, 
        uphill:uphill, 
        downhill:downhill, 
        uphillnohys:uphillnohys,
        downhillnohys:downhillnohys,
        avgtemp:Math.round(tempsum/waypoints.length*10)/10,
        minheight:minheight,
        maxheight:maxheight,
        totalenergy:totalenergy,
        totalcalcenergy:totalcalcenergy
    }
    return summary
}


function waypointsToCsv(file, waypoints){

    let rows=[]
    let row = []
    for (var name in waypoints[1]) { // column names
        row.push(name)
    }
    rows.push(row)

    for (var i=0; i < waypoints.length; i++) {
        row = []
        for (var name in waypoints[1]) { 
            row.push(waypoints[i][name]) // column values
        }
        rows.push(row)
    }

    // convert rows[] to string
    var str = ""
    for (var i=0; i < rows.length; i++){
        var s=""
        for (var j=0; j < rows[i].length; j++) s += rows[i][j] +';'
        str += s + '\r\n';
    }
    fs.writeFileSync(file + '.waypoints.csv',str)
}


///////////////////////////////////////////////////////////////////////////

function gpxParser(gpx_xml_data){
    let trackdata = xmlParser2(gpx_xml_data)
    let waypoints = extend_waypoints(trackdata.waypoints)
    let trackinfo =  waypointsSummary(waypoints)
    trackinfo.name = trackdata.name
    trackinfo.time = trackdata.time
    trackinfo.error = error
    trackinfo.waypoints = waypoints
    return trackinfo
}
/*
function fitParser1(fit_data,callback){

    fitParser1A(fit_data,fitParser1B)

    function fitParser1B(trackdata){
        let waypoints = extend_waypoints(trackdata.waypoints)
        let trackinfo =  waypointsSummary(waypoints)
        trackinfo.name = trackdata.name
        trackinfo.time = trackdata.time
        trackinfo.error = error
        trackinfo.waypoints = waypoints
        callback(trackinfo)
    }
}
*/
function fitParser2(fit_data,callback){

    let trackdata = fitParser2A(fit_data)
    let waypoints = extend_waypoints(trackdata.waypoints)
    let trackinfo =  waypointsSummary(waypoints)
    trackinfo.name = trackdata.name
    trackinfo.time = trackdata.time
    trackinfo.error = error
    trackinfo.waypoints = waypoints
    callback(trackinfo)
}

function csvParser(csv_data,callback){

    let trackdata = parseCsv(csv_data)
    let waypoints = extend_waypoints(trackdata.waypoints)
    let trackinfo =  waypointsSummary(waypoints)
    trackinfo.name = trackdata.name
    trackinfo.time = trackdata.time
    trackinfo.error = error
    trackinfo.waypoints = waypoints
    callback(trackinfo)
}

module.exports = {
    gpxParser: gpxParser,
    waypointsToCsv:waypointsToCsv,
    //fitParser1 : fitParser1,  // from internet
    fitParser2 : fitParser2,   // author jcjk
    csvParser : csvParser,
    azimuthLatLon:azimuthLatLon 
}  

/* 
trackinfo = {
    name:          x,  // name field of gpx-file
    time:          x,  // time field of gpx-file
    movdist:       x,  // total moving distance (m)
    movtime:       x,  // moving time (ms)
    stopdist:      x,  // stop distance (m) (distance of segments with speed below mov/stop level (== 2km/h)) 
    stoptime:      x,  // stop time (ms)
    uphill:        x,  // total uphill in m with hyst = 8m
    downhill:      x,  // total downhill in m with hyst = 8m
    uphillnohys:   x,  // total uphill in m with hyst = 0m
    downhillnohys: x,  // total downhill in m with hyst = 0m
    avgtemp:       x,  // average temperature (C)
    minheight:     x,  // lowest height in gpx-file (m)
    maxheight:     x,  // highest height in gps-file (m)
    waypoints:    []   // array of way-points
}

waypoint = {
    lat,   
    lon, 
    ele, 
    time, 
    temp, 
    hr, 
    cad,
    dist,
    cumdist,
    timedif,
    azimuth,
    hour,
    eledif,
    speed,
    energy
}

*/

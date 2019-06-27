// Copyright (c) j.c. jansen klomp. All rights reserved.

"use strict"

let calcenergy = require('./power');
let waypointsmodule = require('./waypoints')
//let heartRateCategoryDivision = []
//let slopeCategoryDivision = []
let actualWeather = { utc: 0, hour: 0, spd: 0, bearing: 0, temp: 0, humidity: 0 }
let weatherList = [] //{hour:,spd:,dir:,temp:}

const https = require('https');
const fs = require('fs');
const getTimezoneOffset = require('./getTimezoneOffset.js');
var rootpath = require('path').join(__dirname, "./../../storage/gpx")
function getCategory(value, division, resolution) {
    if (value <= division[0]) return 0
    for (var i = 0; i < division.length - 1; i++) if (value > division[i] && value <= division[i + 1]) {
        let frac = Math.round((value - division[i]) / (division[i + 1] - division[i]) / resolution) * resolution
        return i + 1 + frac
    }
    return division.length - 1; // above highest slope    
}

function initCategory(def) {
    let division = []
    if (def) {
        if (def.indexOf('=') > 0) division = def.split("=")[1].split(",")
        else division = def.split(',')
        for (var i = 0; i < division.length; i++) division[i] = Number(division[i])
    }
    return division
}

function fmtsec(secs) {
    var hh = Math.floor(secs / 3600)
    var remainder = secs - hh * 3600
    var mm = Math.floor(remainder / 60)
    var ss = Math.round((remainder - mm * 60) * 100) / 100
    var h = hh.toString(); if (h.length < 2) h = '0' + h
    var m = mm.toString(); if (m.length < 2) m = '0' + m
    var s = ss.toString(); if (s.length < 2) s = '0' + s
    if (hh > 0) return h + ":" + m + ":" + s
    return m + ':' + s
}

function windload(azimuth) {
    var winddir = actualWeather.bearing
    var angle = Math.abs(winddir - azimuth)
    if (angle > 180) angle = 360 - angle // angle in range 0..180
    var load = [1, 0.75, 0.5, 0.25, 0, -0.25, -0.5, -0.75, -1, -1]
    var index = Math.floor((angle + 11.25) / 22.5)
    return load[index];
}

function checkIndex(index) {
    if (index == 140) {
        return true;
    }
    return false;
}


function buildSegments(params, trackinfo, segsize) {
    //return buildSegments2(params, trackinfo, segsize)
    let loopcount = 0
    let test = false
    let diffsum = 0
    segsize = Number(segsize)
    let waypoints = trackinfo.waypoints
    let heartRateCategoryDivision = initCategory(params["hr-cat-sel"])
    let slopeCategoryDivision = initCategory(params["slope-cat-sel"])
    let heartRateCatMult = initCategory(params["hr-cat-mult"])
    let segments = []
    if (waypoints.length == 0) return
    var segment = { dist: 0, timedif: 0, beats: 0, temp: 0, ele: 0, eledif: 0, count: 0, error: 0, azimuth: 0, energy: 0, calcenergy: 0, lat: 0, lon: 0 }
    var index = 0
    var eledifsum = waypoints[0].ele
    let waypointcumdist = 0   // distance from track begin to current waypoint
    let segcumdist = segsize  // distance from track begin to current segment point
    let prevspeed = 0
    let speed = 0
    let cumrealenergy = 0
    let cumestenergy = 0
    params.cumHrIntScore = 0
    let nextFraction = 0
    let fractionToComplete = 0
    let wp1 = 0
    let wp2 = 0

    do {
        do {
            var distTooLong = false                            // 
            if (waypointcumdist + waypoints[index].dist < segcumdist && index < waypoints.length - 1) {
                segment.dist += waypoints[index].dist
                waypointcumdist += waypoints[index].dist
                segment.timedif += waypoints[index].timedif
                segment.eledif += waypoints[index].eledif
                segment.energy += waypoints[index].energy
                segment.beats += waypoints[index].hr
                segment.temp += waypoints[index].temp
                segment.azimuth += waypoints[index].azimuth
                segment.count++
                if (waypoints[index].dist > segsize) distTooLong = true;
                index++
                checkIndex(index)
            }
        }
        while (waypointcumdist + waypoints[index].dist < segcumdist && index < waypoints.length - 1)

        let waypointLength = waypoints[index].dist                         // length of the waypoint that will complete the segment 

        // complete the segment
        let lengthToComplete = segcumdist - waypointcumdist                // length to complete the segment (segment.dist equal to segzise) 
        if (lengthToComplete < 0) {
            lengthToComplete = 0                                           // this should never happen
            console.log('Error : lengthToComplete is negative, index=' + index)
        }
        let remainingLength = waypointLength - lengthToComplete            // remaining waypointlength for further processing 

        if (index >= waypoints.length - 1) {                                // end of waypoints, partial segment
            lengthToComplete = waypointLength
            remainingLength = 0
        }

        fractionToComplete = lengthToComplete / waypointLength            // fraction of the waypoint length to complete the segment
        segment.dist += lengthToComplete                                // equivalent to: segment.dist = segsize
        diffsum += segment.dist - segsize                                  // diffsum is used for check, should be zero at the end
        segment.dist = segsize                                             // prevent avelanche numeric errors
        segment.timedif += fractionToComplete * waypoints[index].timedif
        segment.eledif += fractionToComplete * waypoints[index].eledif
        segment.energy += fractionToComplete * waypoints[index].energy

        // calc speed + error
        speed = Math.round(segment.dist / segment.timedif * 1000 * 3.6 * 10) / 10
        if (speed > 100 || distTooLong || segment.timedif == 0) {
            var err = "error"
            var valid_speed = 0
            speed = 0
        } else {
            err = "";
            valid_speed = speed
        }
        if (valid_speed < 2) valid_speed = 0 // stopped

        wp2 = fractionToComplete + index

        // add item to segments

        let loop = false
        do {
            eledifsum += segment.eledif

            if (waypoints[index].utc < actualWeather.utc || waypoints[index].utc > actualWeather.utc + 3600) getActualWeatherFromUtc(waypoints[index].utc)
            segcumdist += segment.dist
            let azimuth = Math.round(segment.azimuth / segment.count)
            let cenergy = 0
            let accelerationPower = 0
            if (valid_speed != 0) {
                cenergy = calcenergy.calc(params, segment.timedif / 1000, segment.dist, segment.eledif, azimuth, actualWeather.bearing, actualWeather.spd, segment.temp / segment.count, eledifsum)
                if (params.zeronegativeenergy == "true" && cenergy < 0) cenergy = 0
                accelerationPower = calcenergy.accelerationPower(params, prevspeed / 3.6, speed / 3.6, segment.timedif / 1000)
            }

            cumrealenergy += segment.energy
            cumestenergy += cenergy
            //let hrcat = getCategory(segment.beats/segment.count, heartRateCategoryDivision,0.1)
            let hrcat = getCategory(segment.beats / segment.count, heartRateCategoryDivision, 1)
            let hrIntScore = 0
            if (hrcat > 0 && hrcat < 12)
                hrIntScore = hrcat * segment.timedif / 1000 * heartRateCatMult[hrcat - 1]
            params.cumHrIntScore += hrIntScore
            let hrmap = [0, 2, 2, 3, 3, 5, 5, 7, 8, 9]
            if (hrcat > 9) hrcat = 9
            let hrcatadj = hrmap[hrcat]
            segments.push({
                index: index,   // waypoints index
                cumdist: Math.round(segcumdist - segsize),
                ele: Math.round(eledifsum * 10) / 10,
                time: Math.round(segment.timedif) / 1000,
                time1: fmtsec(segment.timedif / 1000),
                temp: Math.round(segment.temp / segment.count * 10) / 10,
                beats: Math.round(segment.beats / segment.count * 10) / 10,
                speed: speed,
                dist: Math.round(segment.dist),
                azimuth: azimuth,
                windload: windload(segment.azimuth / segment.count),
                windspd: Number(actualWeather.spd),
                winddir: actualWeather.bearing,
                humidity: actualWeather.humidity * 100, // in %
                meteotemp: actualWeather.temp,
                hrCategory: Math.round(hrcat),
                hrCatOrg: hrcat,
                hrCatAdj: hrcatadj,
                hrIntScore: Math.round(hrIntScore * 10) / 10,
                cumHrIntScore: Math.round(params.cumHrIntScore),
                beatcount: segment.timedif == 0 ? 0 : Math.round(segment.beats / segment.count / 60 * segment.timedif / 1000 * 10) / 10,
                gpxtimestamp: params['ridedate'] ? new Date(params['ridedate']).toISOString().substr(0, 19) : new Date(waypoints[index].utc * 1000).toISOString().substr(0, 19) + 'Z',
                utctime: waypoints[index].utc,
                gpxdist: Math.round(waypoints[index].dist),
                valid_speed: valid_speed,
                slopeCategory: getCategory(segment.eledif / segment.dist * 100, slopeCategoryDivision, 1),
                error: err,
                eledif: Math.round(segment.eledif * 100) / 100,
                energy: Math.round(segment.energy),
                cumrealenergy: Math.round(cumrealenergy),
                realpower: segment.timedif == 0 ? 0 : Math.round(segment.energy / segment.timedif * 1000),
                calcenergy: Math.round(cenergy),
                cumestenergy: Math.round(cumestenergy),
                estpower: segment.timedif == 0 ? 0 : Math.round(cenergy / segment.timedif * 1000),
                estaccelpower: Math.round(accelerationPower),
                esttotalpower: segment.timedif == 0 ? 0 : Math.round(cenergy / segment.timedif * 1000) + Math.round(accelerationPower),
                lat: waypoints[index].lat,
                lon: waypoints[index].lon,
                //wpcount:Math.round((wp2-wp1) * 100) / 100,  // waypoint count
                //wp1:Math.round(wp1 * 100) / 100,            // waypoint 1
                //wp2:Math.round(wp2 * 100) / 100,            // waypoint 2
            })

            wp1 = wp2

            // prepare the next segment
            loop = false

            if (remainingLength >= segsize) {
                // add another segsize segment
                nextFraction = segsize / waypointLength
                remainingLength -= segsize
                loop = true
                wp2 += nextFraction
            }
            else {
                // put remaining in segment
                nextFraction = remainingLength / waypointLength
                segment.dist = remainingLength
            }
            // add the other segment data
            segment.timedif = nextFraction * waypoints[index].timedif
            segment.eledif = nextFraction * waypoints[index].eledif
            segment.energy = nextFraction * waypoints[index].energy
            segment.beats = waypoints[index].hr
            segment.temp = waypoints[index].temp
            segment.azimuth = waypoints[index].azimuth
            segment.count = 1

            prevspeed = speed

            if (!loop) {
                waypointcumdist += waypoints[index].dist
                index++ // index to next waypoint
                checkIndex(index)
            }
        } while (loop)
    } while (index < waypoints.length - 1)
    return segments
}
////////////////////////////////////////////////////////////////////////////////////////
//
//   build segments 2 (not used, better structure, time calculation not yet correct)
//
////////////////////////////////////////////////////////////////////////////////////////

function buildSegments2(params, trackinfo, segsize) {
    segsize = Number(segsize)
    let waypoints = trackinfo.waypoints

    let segcumdist = segsize
    let waypointcumdist = 0

    let split = []  // segment borders {index, waypoint_fraction}
    for (var i = 0; i < waypoints.length; i++) {
        let waypointLength = waypoints[i].dist
        while (waypointcumdist + waypointLength >= segcumdist) {
            let lengthToComplete = segcumdist - waypointcumdist          // length to complete the segment 
            let fractionToComplete = lengthToComplete / waypointLength  // waypoint fraction to complete the segment
            split.push({ index: i, frac: fractionToComplete })                // waypoint index + waypoint fraction of segment border 
            segcumdist += segsize
        }
        waypointcumdist += waypointLength
    }

    let heartRateCategoryDivision = initCategory(params["hr-cat-sel"])
    let slopeCategoryDivision = initCategory(params["slope-cat-sel"])

    let segments = []

    let time1 = waypoints[0].utc
    let ele1 = waypoints[0].ele
    let wp1 = 0
    let prev = { index: 0, frac: 0 }
    let err = ''
    let lat1 = waypoints[0].lat
    let lon1 = waypoints[0].lon
    let cumrealenergy = 0
    let cumestenergy = 0
    let prevspeed = 0

    for (var i = 0; i < split.length; i++) {
        let index = split[i].index
        let frac = split[i].frac
        // time
        let t1 = waypoints[index].utc      // in sec
        let t2 = waypoints[index + 1].utc  // in sec
        let time2 = t1 + (t2 - t1) * frac
        let segtime = time2 - time1
        // height
        let e1 = waypoints[index].ele
        let e2 = waypoints[index + 1].ele
        let ele2 = e1 + (e2 - e1) * frac
        // speed
        let speed = 0
        if (segtime > 0) speed = Math.round(segsize / segtime * 3.6 * 10) / 10   // in km/h
        if (speed > 100) {
            err = "error"
            var valid_speed = 0
        } else {
            err = "";
            valid_speed = speed
        }
        if (valid_speed < 2) valid_speed = 0 // stopped
        // waypoint reference
        let wp2 = index + split[i].frac
        // segment energy, beats 
        let realenergy = 0
        let segbeats = 0
        for (let j = prev.index + 1; j < index; j++) {
            realenergy += waypoints[j].energy
            segbeats += waypoints[j].heartbeats
        }
        realenergy += waypoints[prev.index].energy * (1 - prev.frac)
        realenergy += waypoints[index].energy * frac
        segbeats += waypoints[prev.index].heartbeats * (1 - prev.frac)
        segbeats += waypoints[index].heartbeats * frac
        cumrealenergy += realenergy
        // hrcat
        let hrcat = 0
        if (segtime > 0) hrcat = getCategory(segbeats / segtime * 60, heartRateCategoryDivision, 1)
        let hrmap = [0, 2, 2, 3, 3, 5, 5, 7, 8, 9]
        if (hrcat > 9) hrcat = 9
        hrcat = hrmap[hrcat]
        // azimuth
        let azimuth = 0
        let lat2
        let lon2
        if (index < waypoints.length - 1) {
            let lt1 = waypoints[index].lat
            let lt2 = waypoints[index + 1].lat
            lat2 = lt1 + (lt2 - lt1) * frac
            let ln1 = waypoints[index].lon
            let ln2 = waypoints[index + 1].lon
            lon2 = ln1 + (ln2 - ln1) * frac
            azimuth = Math.round(waypointsmodule.azimuthLatLon(lat1, lat2, lon1, lon2))
        }
        // weather
        if (waypoints[index].utc < actualWeather.utc || waypoints[index].utc > actualWeather.utc + 3600) getActualWeatherFromUtc(waypoints[index].utc)
        // calculated energy
        let accelerationPower = 0
        let cenergy = 0
        if (valid_speed != 0) {
            cenergy = calcenergy.calc(params, segtime, segsize, ele2 - ele1, azimuth, actualWeather.bearing, actualWeather.spd, waypoints[prev.index].temp, ele1)
            if (params.zeronegativeenergy == "true" && cenergy < 0) cenergy = 0
            accelerationPower = calcenergy.accelerationPower(params, prevspeed / 3.6, speed / 3.6, segtime)
        }
        cumestenergy += cenergy

        segments.push({
            index: index,
            cumdist: i * segsize,
            ele: Math.round(ele1 * 10) / 10,
            time: Math.round(segtime * 100) / 100,
            time1: fmtsec((segtime * 100) / 100),
            temp: waypoints[prev.index].temp,
            beats: segtime == 0 ? 0 : Math.round(segbeats / segtime * 600) / 10,
            speed: speed,
            dist: segsize,
            azimuth: azimuth,
            windload: 0,
            windspd: 0,
            winddir: 0,
            humidity: 0,
            meteotemp: 0,
            hrCategory: Math.round(hrcat),
            hrCategory1: hrcat,
            beatcount: Math.round(segbeats * 100) / 100,
            gpxtimestamp: params['ridedate'] ? new Date(params['ridedate']).toISOString().substr(0, 19) : new Date(time1 * 1000).toISOString().substr(0, 19) + 'Z',
            utctime: Math.round(time1),
            gpxdist: Math.round(waypoints[index].dist),
            valid_speed: valid_speed,
            slopeCategory: getCategory((ele2 - ele1) / segsize * 100, slopeCategoryDivision, 1),
            error: err,
            eledif: Math.round((ele2 - ele1) * 10) / 10,
            energy: Math.round(realenergy),
            cumrealenergy: Math.round(cumrealenergy),
            realpower: segtime == 0 ? 0 : Math.round(realenergy / segtime),
            calcenergy: Math.round(cenergy),
            cumestenergy: Math.round(cumestenergy),
            estpower: segtime == 0 ? 0 : Math.round(cenergy / segtime),
            estaccelpower: Math.round(accelerationPower),
            esttotalpower: segtime == 0 ? 0 : Math.round(cenergy / segtime + accelerationPower),
            lat: waypoints[index].lat,
            lon: waypoints[index].lon,

            wpcount: Math.round((wp2 - wp1) * 100) / 100,  // waypoint count
            wp1: Math.round(wp1 * 100) / 100,            // waypoint 1
            wp2: Math.round(wp2 * 100) / 100,            // waypoint 2
        })

        prev = split[i]
        time1 = time2
        ele1 = ele2
        wp1 = wp2
        lat1 = lat2
        lon1 = lon2
        prevspeed = speed
    }

    return segments
}


/////////////////////////////////////////////////////////////////////////////////////////
//
//                                  weather
//
/////////////////////////////////////////////////////////////////////////////////////////

function getActualWeatherFromUtc(utctime) { // utc time in seconds
    let defaultvalues = { utc: utctime, spd: 0, bearing: 0, temp: 0, humidity: 0 }
    // check hourly data available
    if (weatherList.length != 24) actualWeather = defaultvalues
    // fine time window
    let index = -1
    for (var i = 0; i < weatherList.length; i++) {
        if (utctime >= weatherList[i].utc && utctime < weatherList[i].utc + 3600) {
            index = i
            break
        }
    }
    // get actual values
    if (index >= 0) {
        actualWeather = {
            utc: weatherList[index].utc,
            spd: weatherList[index].spd,
            bearing: weatherList[index].bearing,
            temp: weatherList[index].temp,
            humidity: weatherList[index].humidity,
        }
    }
    else actualWeather = defaultvalues
}

/////////////////////////////////////////////////////////////////////////////////////////
//
//                                  darksky weather
//
/////////////////////////////////////////////////////////////////////////////////////////

function formatdate(d) {
    function d2(s) {
        s = s.toString()
        while (s.length < 2) {
            s = '0' + s
        }
        return s
    }
    return d.getUTCFullYear() + '-' + d2(d.getUTCMonth() + 1) + '-' + d2(d.getUTCDate()) + '_' + d2(d.getUTCHours()) + d2(d.getUTCMinutes())
}

function getDarkSkyData(params, trackinfo, callback) {

    if (params.loadweatherfromdarksky == "false") {
        callback({ warning: "", error: "" })
        return
    }

    let waypoint = trackinfo.waypoints[0]
    weatherList = []
    let warning = ""

    // load file from darksky
    var ts = Math.round(waypoint.utc)
    let url = "https://api.darksky.net/forecast/e5a1d23bbe1dc32bae69607a697b5124/" + waypoint.lat + "," + waypoint.lon + "," + ts + "?units=si"
    //    fs.writeFileSync(rootpath+'/weather-files/darksky_url.txt', url);
    var request = https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Process the result.
        resp.on('end', () => {
            try {
                var weatherdata = JSON.parse(data)
            }
            catch (err) {
                callback({ warning: "", error: 'error converting weather data: ' + data })
                //callback('ok')
                return;
            }
            try {
                if (weatherdata.hasOwnProperty('hourly')) {
                    if (weatherdata.hasOwnProperty('offset')) params.timeoffset = weatherdata['offset']
                    let hourlydata = weatherdata.hourly.data
                    for (var i = 0; i < hourlydata.length; i++) {
                        let hd = hourlydata[i]
                        let spd = 0; if (hd.hasOwnProperty('windSpeed')) spd = hd.windSpeed
                        let bearing = 0; if (hd.hasOwnProperty('windBearing')) bearing = hd.windBearing
                        let temp = 0; if (hd.hasOwnProperty('temperature')) temp = hd.temperature
                        let humidity = 0; if (hd.hasOwnProperty('humidity')) humidity = hd.humidity
                        weatherList.push({ utc: hd.time, spd: spd, bearing: bearing, temp: temp, humidity: humidity })
                    }
                }
                else warning = "warning: hourly weather data not available"
            }
            catch (err) {
                callback({ warning: "", error: 'error processing weather data: ' + err.message })
                return;
            }
            if (params.saveweatherfiles == 'true') {
                let json = JSON.stringify(weatherdata, "", 3)
                let name = params.name.slice(0, params.name.lastIndexOf(".")) // remove extension 
                let d = new Date(trackinfo.waypoints[0].utc * 1000)
                try { fs.mkdirSync(rootpath + '/weather-files') } catch (err) { }
                try {
                    fs.writeFileSync(rootpath + '/weather-files/' + name + '_' + formatdate(d) + '.json', json);
                }
                catch (err) {
                    callback({ warning: "", error: 'error writing weather data to file' })
                    return
                }
            }
            callback({ warning: warning, error: "" })
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    request.setTimeout(5000, function () { // 5sec timeout
        request.abort()
        callback({ warning: "", error: "error Darksky request timeout" })
    });

}


/////////////////////////////////////////////////////////////////////////////////////////
//
//                           segments to csv
//
/////////////////////////////////////////////////////////////////////////////////////////


let colnames = []


function segmentsToCSV(params, trackinfo, segments) {
    if (segments.length == 0) return ""
    //colnames = params["output-column-sel"].split('=')[1].split(',')
    colnames = params["output-column-sel"].split(',')
    let distsum = 0
    let timesum = 0
    let beatcountsum = 0
    let windspdsum = 0
    let winddirsum = 0
    let windloadsum = 0
    var errorsum = 0
    let realenergy = 0
    let adata = {}

    function calcTotals() {
        for (var i = 0; i < segments.length; i++) {
            for (var index in segments[i]) {
                if (index == "beatcount") beatcountsum += segments[i][index]
                if (index == "time") timesum += segments[i][index]
                if (index == "cumdist") distsum = segments[i][index]
                if (index == "error") { if (segments[i][index] == 'error') errorsum++ }
                if (index == "windspd") windspdsum += segments[i][index]
                if (index == "winddir") winddirsum += segments[i][index]
                if (index == "calcenergy") realenergy += segments[i][index]
                if (index == "windload") windloadsum += segments[i][index]
            }
        }
    }

    function getColNames(rows) {
        // get the column names
        rows.push(colnames)
    }

    function addRowData(rows) {
        for (var i = 0; i < segments.length; i++) {
            let row = [];
            let segment = segments[i]
            // push value for each col name
            for (var j = 0; j < colnames.length; j++) {
                let name = colnames[j]
                if (segment.hasOwnProperty(name)) {
                    if (segment[name] == undefined) segment[name] = "undefined"
                    row.push(segment[name].toString())
                }
                else if (adata.hasOwnProperty(name)) {
                    //if (rows.length == 1) 
                    row.push((adata[name][1]).toString())
                    //else row.push("")   
                }

                else row.push('undefined column name')
            }
            rows.push(row)
        }
    }

    // additional data

    function addAdata(rows) {
        let rowindex = 0;
        for (var name in adata) {
            rowindex++
            while (rows.length <= rowindex) {
                let row = []
                for (var i = 0; i < colnames.length; i++) row.push('')
                rows.push(row)
            }
            let item = adata[name]
            for (var i = 0; i < item.length; i++) rows[rowindex].push(item[i])
        }
    }

    function toAdata() {
        // arguments[0] = col name
        if (arguments.length > 0) {
            let data = []
            adata[arguments[0]] = data
            for (var i = 1; i < arguments.length; i++) data.push(arguments[i])
        }
    }

    function initAdata() {
        toAdata('user_id', 'user-id', params['user-id'])
        toAdata('m_v', 'm/v', params['mv'])
        toAdata('weight', 'weight', params['gewicht'])
        toAdata('age', 'age', params['leeftijd'])
        toAdata('length', 'length', params['lengte'])
        toAdata('shape', 'shape', params['conditie'])
        toAdata('activity_id', 'activity-id', params['activity-id'])
        toAdata()
        toAdata('name1', 'total time move/stop', fmtsec(trackinfo.movtime / 1000), ' ' + fmtsec(trackinfo.stoptime / 1000))
        toAdata('totdist', 'total distance (km)', Math.round((trackinfo.movdist + trackinfo.stopdist) / 100) / 10)
        toAdata('avgspeed', 'average speed (km/h)', trackinfo.movtime == 0 ? 0 : Math.round(trackinfo.movdist * 3600 / trackinfo.movtime * 100) / 100)
        toAdata('name2', 'errors', (Math.round(errorsum)).toString())
        let start
        let end
        if (params['ridedate']) {
            start = new Date(params['ridedate']).toISOString().substr(0, 19);
            end = new Date(Date.parse(params['ridedate']) + params['rideduration'] * 3600000).toISOString().substr(0, 19);
        } else {
            start = new Date(trackinfo.waypoints[0].utc * 1000 + params.timeoffset * 3600000).toISOString().substr(0, 19)
            end = new Date(trackinfo.waypoints[trackinfo.waypoints.length - 1].utc * 1000 + params.timeoffset * 3600000).toISOString().substr(0, 19)
        }
        toAdata('name3', 'ride time span local time', start, end)
        toAdata('name4', 'uphill/downhill hys=8 (m)', Math.round(trackinfo.uphill), Math.round(trackinfo.downhill))
        toAdata('name5', 'uphill/downhill hys=0 (m)', Math.round(trackinfo.uphillnohys), Math.round(trackinfo.downhillnohys))
        toAdata('avgtemp', 'average temperature', trackinfo.avgtemp)
        toAdata('avgwindspd', 'average wind speed (m/s)', Math.round(windspdsum / segments.length * 10) / 10)
        toAdata('avgwinddir', 'average wind direction (deg)', Math.round(winddirsum / segments.length))
        toAdata('name6', 'max/min gpx height', trackinfo.maxheight, trackinfo.minheight)
        toAdata('totrealenerg', 'total real energy (kJ)', Math.round(trackinfo.totalenergy / 1000))
        toAdata('totestenerg', 'total estimated energy (kJ)', Math.round(realenergy / 1000))
        toAdata('avgrealpower', 'average power (W)', trackinfo.movtime == 0 ? 0 : Math.round(trackinfo.totalenergy / trackinfo.movtime * 1000))
        toAdata('avgestpower', 'average estimated power (W)', trackinfo.movtime == 0 ? 0 : Math.round(realenergy / trackinfo.movtime * 1000))
        toAdata('normrealpower', 'normalized real power (W)', params.timeslotsA.normpower)
        toAdata('normestpower', 'normalized estimated power (W)', params.timeslotsA.normcalcpower)
        toAdata('ftpreal5min', 'FTP5min (W)', params.timeslotsA.maxAvgPower)
        toAdata('ftpest5min', 'FTPEst5min (W)', params.timeslotsA.maxAvgCalcPower)
        toAdata('ftpreal10min', 'FTP10min (W)', params.timeslotsB.maxAvgPower)
        toAdata('ftpest10min', 'FTPEst10min (W)', params.timeslotsB.maxAvgCalcPower)
        toAdata('ftpreal20min', 'FTP20min (W)', params.timeslotsC.maxAvgPower)
        toAdata('ftpest20min', 'FTPEst20min (W)', params.timeslotsC.maxAvgCalcPower)

        // get the number of participants
        let participants = 0

        if (trackinfo.hasOwnProperty('athletecount')) { // from strava csv
            participants = trackinfo['athletecount']
        }
        else if (params.participantdata.length == 1) {
            participants = params.participantdata[0]['participants']
        }
        else { // check with timestamp
            for (var i = 0; i < params.participantdata.length; i++) {
                let timestamp = new Date(params.participantdata[i]['date'] + 'T' + params.participantdata[i]['time'] + 'Z').getTime() / 1000 // in seconds
                // the used date and time are local, so we have to subtract the time offset
                // timestamp -= params.timeoffset*3600
                // check if time stamp is within the file range with a margin of 2 minutes
                if (timestamp >= trackinfo.waypoints[0].utc - 120 && timestamp <= trackinfo.waypoints[trackinfo.waypoints.length - 1].utc + 120) {
                    participants = params.participantdata[i]['participants']
                }
            }
        }

        // select params.otherpeople if participants = 0

        if (participants == 0) participants = params.otherpeople
        toAdata('numparticipants', 'number of participants', participants)
        //toAdata('numotherpeople','number of other people', params.otherpeople)
        toAdata('intensityscore', 'intensity score', params.intensityscore)
        toAdata('avgwindload', 'average wind load (1 to -1)', Math.round(windloadsum / segments.length * 100) / 100)
        toAdata('cumHrIntScore', 'cumulative hr intensity score', Math.round(params.cumHrIntScore))
    }

    function convertToString(rows) {
        // convert rows[] to string
        var str = ""
        for (var i = 0; i < rows.length; i++) {
            var s = ""
            for (var j = 0; j < rows[i].length; j++) s += rows[i][j] + ';'
            str += s + '\r\n';
        }
        return str
    }

    calcTotals()
    initAdata()
    let rows = []
    getColNames(rows)
    addRowData(rows)
    addAdata(rows)
    let str = convertToString(rows)
    return str;
}

module.exports = {
    buildSegments: buildSegments, // params, trackinfo, segzize 
    toCsv: segmentsToCSV,         // params, trackinfo, segments
    getDarkSkyData: getDarkSkyData // params, trackinfo, callback
}

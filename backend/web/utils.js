
var _ = require('lodash')
exports.OptionTableStringToJson = (tableData) => {
    var text = ``
    let settings = {}
    let groupname = "undefined"
    let item = {}
    let data = []
    try {
        var output_column_selections = _.filter(tableData, (item) => item.ui_name == "output_col")['0']['default_value'];
        var slope_divisions = _.filter(tableData, (item) => item.ui_name == "slope_cat")['0']['default_value'];
        var defaults = _.filter(tableData, (item) => item.ui_name == "defaults")['0']['default_value'];
        text = `[output_column_selections]\n${output_column_selections}\n[slope_divisions]\n${slope_divisions}\n[defaults]\n${defaults}`
        text = text.replace(/\r/g, ""); // remove return chars
    }
    catch (err) {
        console.log(err)
        var text = `   
        [output_column_selections]    

        all = index,cumdist,ele,time,time1,temp,beats,speed,dist,azimuth,windload,windspd,winddir,humidity,meteotemp,hrCategory,beatcount,gpxtimestamp,gpxdist,valid_speed,slopeCategory,error,realpower,estpower,estaccelpower,esttotalpower,lat,lon,cumrealenergy,cumestenergy,hrCategory1,numparticipants,intensityscore

        [slope_divisions]

        default = -3,-1.5,-0.5,0.5,1.5,3.0,5.0,9.0,12.0 

        [defaults]

        seglen = 100                // segment length in m
        rollingresistance = 0.006  // rolling resistance coeff	
        surfacearea = 0.5          // front surface area (m2)	
        airresistance = 0.7        // air resistance coefficient
        zeronegativeenergy = 1     // make neg. energy zero: 1 = yes, 0 = no
        csvwithcomma = 1           // csv numbers with comma: 1 = yes  0 = no 
        saveuploads = 0            // save uploaded files in directory uploads: 1 = yes, 0 = no
        savetimeslotfiles = 0      // save timeslot files in directory timeslot-files: 1 = yes, 0 = no
        saveweatherfiles = 0       // save weather files in directory weather-files: 1 = yes, 0 = no
        loadweatherfromdarksky = 1 // load weather files from darksky: 1 = yes, 0 = no 
        `
    }

    let list = text.split('\n')
    for (var i = 0; i < list.length; i++) {
        let line = list[i].trim()
        if (line.indexOf('//') >= 0) line = line.substr(0, line.indexOf('//'))
        if (line.indexOf('[') == 0) {
            groupname = line.substring(1, line.indexOf(']')).trim()
            settings[groupname] = []
        }
        else if (line.indexOf('=') > 0) {
            let split = line.split('=')
            item = { name: "", values: [] }
            settings[groupname].push(item)
            item.name = split[0].trim()
            item.values = []
            data = split[1].replace(/ /g, "").split(',') // remove spaces and split on ','
            for (var j = 0; j < data.length; j++) if (data[j] != "") item.values.push(data[j])
        }
        else { // could be secundary line
            data = line.replace(/ /g, "").split(',') // remove spaces and split on ','
            for (var j = 0; j < data.length; j++) if (data[j] != "") item.values.push(data[j])
        }
    }

    return settings;
}
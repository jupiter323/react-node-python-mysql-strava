var fs = require("fs");
const strava = require('strava-v3');
const sgMail = require('@sendgrid/mail');
var ActivityIDs = [];
// var number = 0;
var allActivities = [];
var requestTime = ''
var requestDate = ""
var fetching = false


var folderName = `storage/csv/strava/`;

if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}

function getValue(payload, name, num) {
    for (var i = 0; i < payload.length; i++) {
        if (payload[i].type === name) {
            return payload[i].data[num];
        }
    }
    return "";
}

function expertCSV(stravaId, payload, id) {

    var userfolder = folderName + stravaId + '/'
    var datefolder = userfolder + requestDate + '/'
    var timefolder = datefolder + requestTime + '/'

    if (!fs.existsSync(userfolder)) {
        fs.mkdirSync(userfolder);
    }

    if (!fs.existsSync(datefolder)) {
        fs.mkdirSync(datefolder);
    }

    if (!fs.existsSync(timefolder)) {
        fs.mkdirSync(timefolder);
    }

    var content =
        "Distance ,Altitude, Time, Lat, Lng , Heartrate, Speed, Power, Temperature , start_date, moving_time, elapsed_time, total_elevation_gain, type, id, timezone,athlete_count\n";
    for (var i = 0; i < payload[0].data.length; i++) {
        content +=
            getValue(payload, "distance", i) +
            //   payload[2].data[i] +
            "," +
            getValue(payload, "altitude", i) +
            //   payload[3].data[i] +
            "," +
            getValue(payload, "time", i) +
            //   payload[1].data[i] +
            "," +
            getValue(payload, "latlng", i)[0] +
            //   payload[0].data[i][0] +
            "," +
            getValue(payload, "latlng", i)[1] +
            //   payload[0].data[i][1] +
            "," +
            getValue(payload, "heartrate", i) +
            //   payload[4].data[i] +
            "," +
            getValue(payload, "velocity_smooth", i) +
            //   payload[7].data[i] +
            "," +
            getValue(payload, "watts", i) +
            //   payload[5].data[i] +
            "," +
            getValue(payload, "temp", i) +
            //   payload[6].data[i] +
            "," +
            allActivities[id].start_date +
            "," +
            allActivities[id].moving_time +
            "," +
            allActivities[id].elapsed_time +
            "," +
            allActivities[id].total_elevation_gain +
            "," +
            allActivities[id].type +
            "," +
            allActivities[id].id +
            "," +
            allActivities[id].timezone +
            "," +
            allActivities[id].athlete_count +
            "\n";
    }

    fs.writeFileSync(`${timefolder}/${allActivities[id].id}.csv`, content);
}

function getStreamActivities(number,stravaId,email) {
    id = number;
    number++;
    strava.streams.activity(
        {
            id: ActivityIDs[id],
            types:
                "heartrate,distance,latlng,time,altitude,watts,temp,velocity_smooth"
        },
        function (err, payload, limits) {
            console.log(` ${id}----->> streams segment ${ActivityIDs[id]}`);
            if (err) {
                console.log(err);
            } else {
                if (payload.message) {
                } else {
                    expertCSV(stravaId, payload, id);                    
                }
            }
            
            if (number < 10) getStreamActivities(number,stravaId,email);
            else {
                fetching = false
                emailConfirm(email)                
                console.log("==========================finished======================")
            }
        }
    );
}

function getAcitivies(number,stravaId,email, page) {
    strava.athlete.listActivities({ per_page: 200, page: page }, function (
        err,
        payload,
        limits
    ) {
        console.log("----->> Start list activities");
        if (payload.length === undefined){
            console.log(payload);
            return;
        }
        console.log("page count:" + payload.length)
        if (err || payload.length === 0) {
            if (err) return callback(err);
            getStreamActivities(number,stravaId,email);
            console.log(" <<----- End list activities");
        } else {
            // print number of list in current page
            console.log(`page ${page}' has ${payload.length} records`);

            // filter "type": "Ride"
            for (var i = 0; i < payload.length; i++) {
                if (payload[i].type === "Ride") {
                    allActivities.push(payload[i]);
                    ActivityIDs.push(payload[i].id);
                }
            }
            getAcitivies(number,stravaId,email, page+1);
        }
    });
}

function emailConfirm(toEmail){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: toEmail,
        from: 'test@test.com',
        subject: 'From Strava',
        text: 'Download finished!',
        html: '<strong>Download finished</strong>',
    };
    sgMail.send(msg);
}

exports.saveStravaData = async function (req,res) {
    if (fetching == false) {
        fetching=true
        allActivities = [];
        ActivityIDs = [];
        let number = 0
        const curr_time = new Date().toISOString()
        requestDate = curr_time.split("T")[0]
        requestTime = curr_time.split("T")[1].replace(/:|\//g, "-").split('.')[0]
        getAcitivies(number,req.body.stravaId, req.body.email,req.body.pageNum)      
        res.send({
            msg:"Download started, we will send email when download finish!"
        })           
    }else{
        res.send({
            msg:"Fetching on now, You can't send anymore, until completion current fetching, please wait your email"
        })    
    }

}
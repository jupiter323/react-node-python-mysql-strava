var fs = require('fs');
var makecsvML = require('./makeCSVforML')
var Uploads = require('../model/uploads')
const Constants = require('../config/contants')
var folderName = `storage/gpx/`;

if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}

exports.convertgpx = (req, res) => {
    const { files, body } = req;
    var { isTestData } = body
    var uploadedCount = files.length
    makedirs()
    // handler(req, res)
    Uploads.insertFileRow(req, (err, nonUser) => {
        if (err) {
            console.log(err)
            res.send({
                status: Constants.SERVER_INTERNAL_ERROR,
                success: false,
                error: err
            })
        } else if (nonUser) {
            console.log("non user...")
            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: false,
                error: null
            })
        } else { //success
            console.log("processing convert...")
            let delay = 1000
            var index = 0
            makecsvML.processFile(isTestData);
            var intervalFun = setInterval(() => {
                if (index++ >= uploadedCount) clearInterval(intervalFun);
                makecsvML.processFile(isTestData);
            }, delay)

            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: true,
                error: null
            })
        }
    })
}

var makedirs = () => {
    let uploads = 'storage/gpx/uploads/'
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads)

    let outfiles = 'storage/gpx/output-files/'
    if (!fs.existsSync(outfiles)) fs.mkdirSync(outfiles)

    let slotfiles = 'storage/gpx/timeslot-files/'
    if (!fs.existsSync(slotfiles)) fs.mkdirSync(slotfiles)

    let wfiles = 'storage/gpx/weather-files/'
    if (!fs.existsSync(wfiles)) fs.mkdirSync(wfiles)
}
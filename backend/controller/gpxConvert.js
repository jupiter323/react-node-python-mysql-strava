var fs = require('fs');
var makecsvML = require('./makeCSVforML')
var Uploads = require('../model/uploads')
var Organizedevents = require('../model/organizedevents')
const Constants = require('../config/contants')
var folderName = `storage/gpx/`;
var _ = require('lodash');
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
exports.convertAlreadyGpx = (req, res) => {
    var { id } = req.user
    var { fileID } = req.body
    var isTestData = true
    var projection = "*"
    var storageFolder = 'storage/gpx'

    let userDir = `${storageFolder}/uploads/${id}`
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);

    Organizedevents.getById(projection, fileID, (err, response) => {
        let fileName = response[0]['file_name']
        // copy file from organized folder to user uploads
        fs.copyFile(`${storageFolder}/organizedevents/${fileName}`, `${storageFolder}/uploads/${id}/${fileName}`, (err) => {
            if (err) {
                console.log(err)
                res.send({ success: false, err });
            } else {
                // insert row to the uploads table
                var files = [{ "originalname": fileName }]

                Uploads.insertFileRow(_.assign(req, { files }), (err, nonUser) => {
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
                        makecsvML.processFile(isTestData);
                        res.send({
                            status: Constants.SERVER_OK_HTTP_CODE,
                            success: true,
                            error: null
                        })
                    }
                })

            }

        });

    })

    // try {
    //     makecsvML.processAlreadyFile(isTestData, fileName, id);
    //     res.send({ success: true })
    // }
    // catch (err) {
    //     res.send({ success: false, err });
    // }

}
exports.getAllgpxs = (req, res) => {
    var projection = "upload_id,upload_user_id,upload_filename"
    Uploads.getGpxs(projection, (err, response) => {

        if (err) {
            console.log(err)
            res.send({ success: false, err });
        }
        else if (response) {
            res.send({ success: true, response })
        }

    })
}
exports.getOrganizedGpxs = (req, res) => {
    var projection = "*"
    Organizedevents.getGpxList(projection, (err, response) => {
        if (err) {
            console.log(err)
            res.send({ success: false, err });
        }
        else if (response) {
            res.send({ success: true, response })
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

    let org = 'storage/gpx/organizedevents/'
    if (!fs.existsSync(org)) fs.mkdirSync(org)

}
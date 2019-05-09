
var fs = require('fs');

let convert = require('./makeCSVforML/convert')
var exec = require('child_process').exec;
var makecsvML = require('./makeCSVforML')
var Uploads = require('../model/uploads')
const Constants = require('../config/contants')
var folderName = `storage/gpx/`;
var _ = require('lodash')
if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
}

exports.convertgpx = function (req, res) {
    const { files } = req;
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
            let delay = 2000

            for (let i = 0; i < uploadedCount; i++) {
                if (i == 0) makecsvML.processFile();
                else
                    setTimeout(() => { makecsvML.processFile(); }, delay)
            }

            res.send({
                status: Constants.SERVER_OK_HTTP_CODE,
                success: true,
                error: null
            })
        }
    })
}


function handler(req, res) {

    function sendres(params, result) {
        res.writeHead(200, { 'content-type': 'text/plain' });
        params.parseresult = result
        res.end(JSON.stringify(params, "", 3))
    }

    if (req.url == '/gpxfileupload' && req.method.toLowerCase() == 'post') {
        let data = '';
        let limiterror = false;
        req.on('data', function (chunk) {

            if (data.length < 50000000) data += chunk.toString() // limit file length to 50MB
            else limiterror = true;
        });

        req.on('end', function () {
            if (limiterror) {
                sendres({ name: "" }, 'upload limit exceeded')
                return
            }

            let useexec = false
            if (useexec) {
                let mstime = new Date().getTime()
                let fname = __dirname + '/temp_files/' + mstime + '.txt'
                fs.writeFileSync(fname, data)
                let pid = exec('node ./js/exec_convert.js ' + mstime + '.txt', function (error, stdout, stderr) {
                    console.log('stdout: ', stdout);
                    console.log('stderr: ', stderr);

                    if (error !== null) {
                        console.log('exec error: ', error);
                    }
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.end(stdout)
                });
                if (pid == 0) pid = 10
            }
            else
                convert.convert(data, res)
        });
    }
    else {
        var url = decodeURI(req.url);
        if (url.indexOf('.css') != -1) { // check if url contains '.css'
            console.log('****** reading css file ' + url);
            fs.readFile('.' + url, "utf-8", function (err, data) {
                if (err) console.log(err);
                res.setHeader("Content-Type", "text/css");
                res.writeHead(200);
                res.end(data);
            });
            return;
        }

        if (url.indexOf('.gif') != -1) { //check if url contains '.gif'
            console.log('****** reading gif file ' + url);
            fs.readFile('.' + url, function (err, data) {
                if (err) console.log(err);
                res.setHeader("Content-Type", "image/gif");
                res.writeHead(200);
                res.end(data);
            });
            return;
        }

        if (url.indexOf('.js') != -1) { //check if url contains '.js'
            console.log('****** reading script file ' + url);
            fs.readFile('.' + url, "utf-8", function (err, data) {
                if (err); // console.log(err);
                res.setHeader("Content-Type", "application/javascript");
                res.writeHead(200);
                if (url.indexOf('main.js') != -1) data = data.replace("serveripaddress", serveripaddress);
                res.end(data);
            });
            return;
        }
        if (url.indexOf('.html') != -1) { //check if url contains '.html'
            console.log('****** reading html file ' + url);
            fs.readFile('.' + url, "utf-8", function (err, data) {
                if (err) console.log(err);
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(data);
            });
            return;
        }

        if (url == '/') {
            fs.readFile(__dirname + '/main.html', function (err, data) {  // main html file
                console.log('****** reading index file ' + url);
                if (err) throw err;
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(data);
            });
            return;
        }
        if (url.indexOf('.ico') != -1) { //check if url contains '.gif'
            console.log('****** reading ico file ' + url);
            fs.readFile('.' + url, function (err, data) {
                if (err);// console.log(err);
                res.setHeader("Content-Type", "image/ico");
                res.writeHead(200);
                res.end(data);
            });
            return;
        }

        console.log('404 error');
        fs.readFile(__dirname + '/404.html', "utf-8", function (err, data) {
            if (err) console.log(err);
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(data);
        });

        return;

        fs.readFile('.' + url, "utf-8", function (err, data) {
            if (err) console.log(err);
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(data);
        });
    }
}

function makedirs() {
    let uploads = 'storage/gpx/uploads/'
    if (!fs.existsSync(uploads)) fs.mkdirSync(uploads)

    let outfiles = 'storage/gpx/output-files/'
    if (!fs.existsSync(outfiles)) fs.mkdirSync(outfiles)

    let slotfiles = 'storage/gpx/timeslot-files/'
    if (!fs.existsSync(slotfiles)) fs.mkdirSync(slotfiles)

    let wfiles = 'storage/gpx/weather-files/'
    if (!fs.existsSync(wfiles)) fs.mkdirSync(wfiles)
}
var express = require('express');
var router = express.Router();

const GpxCvt = require('../controller/gpxConvert')
const UIoptions = require('../controller/uioptonsControl')
const UserControl = require('../controller/userControl')
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/gpx/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
});
var upload = multer({ storage: storage })

router.route('/gpxfileupload')
    .post(upload.array('file', 1000), GpxCvt.convertgpx)

router.route('/getoptions')
    .get(UIoptions.getAllOptionsTxt)

router.route('/systemoptions')
    .get(UIoptions.getSystemOptions)

router.route('/getuserlistoptions')
    .get(UserControl.getUserListOptions)

router.route('/getuseroption')
    .post(UserControl.getUserOption)
router.route('/pythontrain')
    .get(UIoptions.callPythonTrain)

module.exports = router;
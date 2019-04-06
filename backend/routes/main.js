var express = require('express');
var router = express.Router();

const GpxCvt = require('../controller/gpxConvert')
const UIoptions = require('../controller/uioptonsControl')
const UserControl = require('../controller/userControl')

router.route('/gpxfileupload')
    .post(GpxCvt.convertgpx)

router.route('/options')
    .get(GpxCvt.OptionsToJson)

router.route('/getoptions')
    .get(UIoptions.getOptions)

router.route('/getuserlistoptions')
    .get(UserControl.getUserListOptions)

router.route('/getuseroption')
    .get()

module.exports = router;
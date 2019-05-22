const router = require('express').Router();
const UserControl = require('../controller/userControl')
const StrvaControl = require('../controller/stravaControl')

router.post('/stravatoken', UserControl.getStravaToken)
router.post('/getStrava', StrvaControl.saveStravaData);
router.post('/checkusersession')
router.post('/updateprofile', UserControl.updateProfile)
router.post('/forgotpassword', UserControl.forgotpasswordChange)
router.get('/eraseprofile', UserControl.eraseProfile)
module.exports = router;
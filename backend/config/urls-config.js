module.exports.PYTHON_URL = "http://localhost:5000"
module.exports.EMAIL_VERIFY_EMAIL_HOST = process.env.ENV === "prod" ? process.env.SERVER_HOST : "http://localhost:3000"
module.exports.STRAVA_CALLBACK_URL = process.env.ENV === "prod" ? `${process.env.SERVER_HOST}/profile/` : "http://localhost:3000/profile/"
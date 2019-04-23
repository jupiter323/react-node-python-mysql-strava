/*
* @author Shashank Tiwari
*/

/* Validation related  constants starts*/
module.exports.USERNAME_NOT_FOUND = `username can't be empty.`;
module.exports.PASSWORD_NOT_FOUND = `password can't be empty.`;
module.exports.USERID_NOT_FOUND = `User Id can't be empty.`;
module.exports.USER_NOT_FOUND = `User does not exits.`;
module.exports.MESSAGE_NOT_FOUND = `Message can't be empty.`;
module.exports.SELECT_USER = `Select a user to chat.`;
/* Validation related  constants ends*/

/* General Errors  constants start */
module.exports.MESSAGE_STORE_ERROR = `Chould not store messages, server error.`;
module.exports.ROUTE_NOT_FOUND = `You are at wrong place. Shhoooo...`;
module.exports.SERVER_ERROR_MESSAGE = `Something bad happend. It's not you, it's me.`;

/* HTTP status code constant starts */
module.exports.SERVER_ERROR_HTTP_CODE = 412;
module.exports.SERVER_NOT_ALLOWED_HTTP_CODE = 503;
module.exports.SERVER_OK_HTTP_CODE = 200;
module.exports.SERVER_NOT_FOUND_HTTP_CODE = 404;
module.exports.SERVER_INTERNAL_ERROR = 400
/* HTTP status codeconstant ends */

/* Route related constants starts*/
module.exports.USERNAME_AVAILABLE_FAILED = `Username is unavailable.`;
module.exports.USERNAME_AVAILABLE_OK = `Username is available.`;
module.exports.USER_REGISTRATION_OK = `Registered your account in our system successfully.`;
module.exports.USER_UPDATE_OK = `Updated your account in our system successfully.`;
module.exports.USER_UPDATE_FAILED = `Sorry, Unfortunately failed updating your account.`;
module.exports.USER_REGISTRATION_FAILED = `Sorry, Unfortunately failed your account registration.`;
module.exports.USER_REGISTERED = `Sorry, User has already registered. Try again with other email`
module.exports.USER_LOGGED_OUT = `User is not logged out.`;
module.exports.USER_NOT_REGISTERED = `That email is not registered`
module.exports.USER_PSSWORD_WRONG = `The password is wrong`
module.exports.CALL_PYTHON_SUCESS = `Python call succeed`
/* Route related constants ends*/

/* loading options  */

module.exports.OPTIONS_LOAD_SUCCESS = 'Loaded options successfully';
module.exports.OOPTIONS_LOAD_FAILURE = 'Failed loading options';

/* server folder path */

module.exports.STRAVA_CONFIG_PATH = 'data/strava_config';
module.exports.STRAVA_RESPONSE_PATH = ''


/* activity count updata */
module.exports.ACTIVTY_COUNT_UPDATE_FAILD = 'activity count update faild';
module.exports.ACTIVTY_COUNT_UPDATE_OK = 'activity count update successfully'
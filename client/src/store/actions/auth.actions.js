/**
 * Description: Actions of the login
 * Date: 12/28/2018
 */

import { getUserOption, setUserData } from './user.actions';
import * as service from 'restful';

export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOG_OUT = "LOG_OUT"
export const REGISTER = "REGISTER";
export const REGISTER_FAILD = "REGISTER_FAILD"
export const FORGOT_SUCCESS = "FORGOT_SUCCESS"
export const FORGOT_ERROR = "FORGOT_ERROR"
export const FORGOT = "FORGOT"

export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const EMAIL_VERIFY = "EMAIL_VERIFY"
export const EMAIL_VERIFY_ERROR = "EMAIL_VERIFY_ERROR";
export const EMAIL_VERIFY_SUCCESS = "EMAIL_VERIFY_SUCCESS";

export const STRAVA_GET_TOKEN = "STRAVA_GET_TOKEN";
export const STRAVA_GET_TOKEN_FAILD = "STRAVA_GET_TOKEN_FAILD";
export const STRAVA_GET_TOKEN_OK = "STRAVA_GET_TOKEN_OK"

export function logout() {
    localStorage.clear()
    window.location.href = "/";
    return dispatch => {
        return dispatch({
            type: LOG_OUT
        })
    }

}
export function setauth() {
    return dispatch => {
        return dispatch({
            type: LOGIN_SUCCESS
        });
    }
}
export function verifyEmail(token) {


    return (dispatch) => {
        dispatch({
            type: EMAIL_VERIFY
        });
        var userInfo = Promise.all([
            service.verifyEmail(token)
        ])
        userInfo.then((user) => {
            var data = user[0].data
            dispatch(setUserData({ access_token: data.token, expires_at: data.exp, verified: data.verified, clientId: data.id }))
            return dispatch({
                type: EMAIL_VERIFY_SUCCESS
            });
        }).catch((error) => {
            console.log(error)
            dispatch({
                type: EMAIL_VERIFY
            });
            return dispatch({
                type: EMAIL_VERIFY_ERROR,
                errorMsg: error
            });
        });
    }
}
export function emailLogin(params) {
    return (dispatch) => {
        dispatch({
            type: LOGIN
        });
        var userInfo = Promise.all([
            service.login(params)
        ]);
        userInfo.then((user) => {
            var data = user[0].data
            console.log("login status: ", data)
            if (data.success) {
                dispatch(setUserData({ access_token: data.token, expires_at: data.exp, verified: data.verified, clientId: data.id }))
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            } else
                return dispatch({
                    type: LOGIN_ERROR,
                    errorMsg: data.msg
                });
        }).catch((error) => {
            console.log("login error: ", error)
            return dispatch({
                type: LOGIN_ERROR,
                errorMsg: error
            });
        });
    }
}
export function stravaConnect(code) {


    return (dispatch) => {
        dispatch({
            type: STRAVA_GET_TOKEN
        });
        var userInfo = Promise.all([
            service.gettingToken(code)
        ]);
        userInfo.then((user) => {
            console.log(user[0].data.data)
            var tempuser = {};
            var userProfile = user[0].data.data
            tempuser.userId = userProfile.clientId;
            dispatch(getUserOption(tempuser))
            return dispatch({
                type: STRAVA_GET_TOKEN_OK
            });
        }).catch((error) => {
            console.log(error)            
            return dispatch({
                type: STRAVA_GET_TOKEN_FAILD,
                errorMsg: JSON.parse(error.request.response).error
            });
        });
    }
}

export function register(params) {


    return (dispatch) => {
        dispatch({
            type: REGISTER
        });
        var response = Promise.all([
            service.register(params)
        ]);
        response.then((res) => {
            var data = res[0].data
            if (data.success) {
                dispatch(emailLogin(params));
                return dispatch({
                    type: REGISTER_SUCCESS
                });
            } else
                return dispatch({
                    type: REGISTER_FAILD,
                    errorMsg: data.msg
                });
        }).catch((error) => {
            console.log(error)
            dispatch({
                type: REGISTER
            });
            return dispatch({
                type: REGISTER_FAILD,
                errorMsg: error
            });
        });
    }
}
export function forgotpasswordrequest(params) {
    return (dispatch) => {
        dispatch({
            type: FORGOT
        });
        var response = Promise.all([
            service.forgotpasswordrequest(params)
        ]);
        response.then((res) => {
            var data = res[0].data
            if (!data.success)
                return dispatch({
                    type: FORGOT_ERROR,
                    errorMsg: data.msg
                });
            return dispatch({
                type: FORGOT_SUCCESS
            });
        }).catch((error) => {
            console.log("login error: ", error)
            return dispatch({
                type: FORGOT_ERROR,
                errorMsg: error
            });
        });
    }
}

export function forgotpassword(params) {
    return (dispatch) => {
        dispatch({
            type: FORGOT
        });
        var response = Promise.all([
            service.forgotpassword(params)
        ]);
        response.then((res) => {
            var data = res[0].data
            if (!data.success)
                return dispatch({
                    type: FORGOT_ERROR,
                    errorMsg: data.msg
                });
            return dispatch({
                type: FORGOT_SUCCESS
            });
        }).catch((error) => {
            console.log("login error: ", error)
            return dispatch({
                type: FORGOT_ERROR,
                errorMsg: error
            });
        });
    }
}




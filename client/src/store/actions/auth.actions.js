/**
 * Description: Actions of the login
 * Date: 12/28/2018
 */

import { getUserOption } from './user.actions';
import * as service from 'restful';

export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOG_OUT = "LOG_OUT"
export const REGISTER = "REGISTER";
export const REGISTER_FAILD = "REGISTER_FAILD"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"


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
export function emailLogin(params) {
    var userInfo = Promise.all([
        service.login(params)
    ]);

    return (dispatch) =>
        userInfo.then((user) => {
            console.log(user[0].data, user)
            // var userProfile = user[0].data.data
            // var tempuser = {};
            // tempuser.userId = userProfile.id;
            // dispatch({
            //     type: LOGIN
            // });
            // dispatch(getUserOption(tempuser))
            // return dispatch({
            //     type: LOGIN_SUCCESS
            // });
        }).catch((error) => {
            console.log(error)
            dispatch({
                type: LOGIN
            });
            return dispatch({
                type: LOGIN_ERROR,
                errorMsg: error
            });
        });
}
export function login(code) {
    var userInfo = Promise.all([
        service.gettingToken(code)
    ]);

    return (dispatch) =>
        userInfo.then((user) => {
            console.log(user[0].data.data)
            var userProfile = user[0].data.data
            var tempuser = {};
            tempuser.userId = userProfile.athlete.id;
            dispatch({
                type: LOGIN
            });
            dispatch(getUserOption(tempuser))
            return dispatch({
                type: LOGIN_SUCCESS
            });
        }).catch((error) => {
            console.log(error)
            dispatch({
                type: LOGIN
            });
            return dispatch({
                type: LOGIN_ERROR,
                errorMsg: JSON.parse(error.request.response).error
            });
        });
}

export function register(params) {
    var response = Promise.all([
        service.register(params)
    ]);

    return (dispatch) =>
        response.then((res) => {
            dispatch({
                type: REGISTER
            });
            var data = res[0].data
            if (data.success) {
                dispatch(emailLogin(params));
                dispatch({
                    type: REGISTER_SUCCESS
                });
            }
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




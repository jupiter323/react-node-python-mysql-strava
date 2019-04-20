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


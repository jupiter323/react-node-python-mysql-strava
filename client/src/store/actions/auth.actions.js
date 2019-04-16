/**
 * Description: Actions of the login
 * Date: 12/28/2018
 */

import {setUserData} from './user.actions';
import * as Utils from 'utils';

export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const GET_COMPANY_DATA = '[COMPANY] GET DATA';
export const GET_COMPANY_DATA_SUCCESS = '[COMPANY] GET DATA SUCCESS';
export const GET_COMPANY_DATA_ERROR = '[COMPANY] GET DATA ERROR';
export const REGISTER = 'REGISTER';
export const REGISTER_SUCCESS = 'REGISTER SUCCESS';
export const REGISTER_ERROR = 'REGISTER ERROR';
export const FORGOTPASSWORD = 'FORGOTPASSWORD';
export const FORGOTPASSWORD_SUCCESS = 'FORGOTPASSWORD SUCCESS';
export const FORGOTPASSWORD_ERROR = 'FORGOTPASSWORD ERROR';
export const RESETPASSWORD = 'RESETPASSWORD';
export const RESETPASSWORD_SUCCESS = 'RESETPASSWORD SUCCESS';
export const RESETPASSWORD_ERROR = 'RESETPASSWORD ERROR';

export function login(data)
{
    const request = Utils.xapi().post('employee/login', data);
    return (dispatch) =>
        request.then((response) => {             
            dispatch({
                type: LOGIN
            });              
            dispatch(setUserData(response.data));
            return dispatch({
                type: LOGIN_SUCCESS
            });
        }).catch((error) => {     
            dispatch({
                type: LOGIN
            });
            return dispatch({
                type: LOGIN_ERROR,
                errorMsg: JSON.parse(error.request.response).error
            });
        });
}

export function getCompanyData(data) {
    const request = Utils.xapi().post('register/company/firststep', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_COMPANY_DATA_SUCCESS,
                data: response.data
            });
        }).catch((error) => {     
            dispatch({
                type: GET_COMPANY_DATA
            });
            return dispatch({
                type: GET_COMPANY_DATA_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function register(data) {
    const request = Utils.xapi().post('register/company/secondstep', data);
    return (dispatch) => 
        request.then((response) => {           
            return dispatch({
                type: REGISTER_SUCCESS,
            });
        }).catch((error) => {     
            return dispatch({
                type: REGISTER_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function forgotPassword(data) {
    const request = Utils.xapi().post('employee/forgotpassword', data);
    return (dispatch) => 
        request.then((response) => {  
            dispatch({
                type: FORGOTPASSWORD
            });            
            return dispatch({
                type: FORGOTPASSWORD_SUCCESS
            });
        }).catch((error) => {     
            dispatch({
                type: FORGOTPASSWORD
            });
            return dispatch({
                type: FORGOTPASSWORD_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function resetPassword(data) {
    const request = Utils.xapi().post('register/setpassword', data);
    return (dispatch) => 
        request.then((response) => {  
            dispatch({
                type: RESETPASSWORD
            });  
            dispatch(setUserData(response.data));          
            return dispatch({
                type: RESETPASSWORD_SUCCESS
            });
        }).catch((error) => {     
            dispatch({
                type: RESETPASSWORD
            });
            return dispatch({
                type: RESETPASSWORD_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}
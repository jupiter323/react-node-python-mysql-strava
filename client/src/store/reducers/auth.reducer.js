/**
 * Description: Reducer of the login
 * Date: 12/28/2018
 */

import * as Actions from '../actions';

const initialState = {
    status: false,
    errorMsg: "",
    companyData: null,
    fetching: false
};

const auth = function (state = initialState, action) {
    switch (action.type) {
        case Actions.LOGIN:
            {
                return {
                    ...initialState,
                    status: false,
                    fetching: true
                };
            }
        case Actions.LOG_OUT: {
            return {
                ...initialState,
                status: false
            }
        }
        case Actions.LOGIN_SUCCESS:
            {
                console.log("login success")
                return {
                    ...state,
                    errorMsg: "",
                    status: true,
                    fetching: false
                };
            }
        case Actions.LOGIN_ERROR:
            {
                console.log("login error")
                return {
                    status: false,
                    errorMsg: action.errorMsg,
                    fetching: false
                };
            }
        case Actions.REGISTER:
            {
                return {
                    ...initialState,
                    status: false,
                    fetching: true
                }
            }
        case Actions.REGISTER_FAILD:
            {               
                return {
                    status: false,
                    errorMsg: action.errorMsg,
                    fetching: false
                };
            }
        case Actions.REGISTER_SUCCESS:
            {
                return {
                    ...state
                };
            }
        case Actions.EMAIL_VERIFY_SUCCESS:
            {                
                return {
                    ...state,
                    fetching: false

                };
            }
        case Actions.EMAIL_VERIFY_ERROR:
            {                
                return {
                    ...state,
                    fetching: false
                };
            }
        case Actions.EMAIL_VERIFY:
            {
                return {
                    ...state,
                    fetching: true
                };
            }
        case Actions.FORGOT:
            {               
                return {
                    ...state,
                    fetching: true,
                    errorMsg: ""
                }
            }
        case Actions.FORGOT_ERROR:
            {               
                return {
                    ...state,
                    fetching: false,
                    errorMsg: action.errorMsg
                }
            }
        case Actions.FORGOT_SUCCESS:
            {               
                return {
                    ...state,
                    fetching: false,
                    errorMsg: ""
                }
            }
        default:
            {
                return state
            }
    }
};

export default auth;
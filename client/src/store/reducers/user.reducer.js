/**
 * Description: Reducer of the user data
 * Date: 12/28/2018
 */

import * as Actions from '../actions';

const initialState = {
    access_token: "",
    userProfile: "",
    expireTime: "",

    users: [],   
    currentUser: {}
};

const user = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_USER_OPTION:
            {
                return {
                    ...state
                }
            }
        case Actions.SET_USER_OPTION://currrent user setting
            {
                return {
                    ...state,
                    [action.payload.key]: action.payload.value
                };
            }
        case Actions.SET_USER_DATA:
            {
                return {
                    ...state,
                    access_token: action.access_token,
                    userProfile: action.userProfile,
                    expireTime: action.expireTime
                };
            }
        case Actions.GET_USER_DATA:
            {
                return {
                    ...state,
                    access_token: action.access_token,
                    userProfile: action.userProfile,
                    expireTime: action.expireTime
                };
            }
        case Actions.GET_USERS:
            {
                return {
                    ...state,
                    [action.payload.key]: action.payload.value
                }
            }
        default:
            {
                return state
            }
    }
};

export default user;
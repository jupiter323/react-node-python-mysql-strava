/**
 * Description: Reducer of the user data
 * Date: 12/28/2018
 */

import * as Actions from '../actions';

const initialState = {
    access_token: "",
    userProfile: "",
    expireTime: "",
    gotNewCoreData: false,

    users: [],
    currentUser: {},

    profileCompleted: false
};

const user = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CHECK_PROFILE_COMPLETION:
            {
                return {
                    ...state,
                    [action.payload.key]: action.payload.value
                }
            }
        case Actions.GET_USER_OPTION:
            {
                return {
                    ...state,
                    gotNewCoreData: false
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
                console.log("set user data")
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
                    gotNewCoreData: true,
                    access_token: action.access_token,
                    userProfile: action.userProfile,
                    expireTime: action.expireTime
                };
            }
        case Actions.GET_USERS:
            {
                let users = state.userProfile.role === "admin" ? action.payload.value : []
                return {
                    ...state,
                    [action.payload.key]: users
                }
            }
        default:
            {
                return state
            }
    }
};

export default user;
/**
 * Description: Reducer of the user data
 * Date: 12/28/2018
 */

import * as Actions from '../actions';

const initialState = {
    token: "",
    workingFor: "",
    workingForId: null,
    isEmployee: false,
    avatar: "",
};

const user = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SET_USER_DATA:
        {
            return {
                token: action.token,
                workingFor: action.workingFor,
                workingForId: null,
                username: action.username,
                isEmployee: state.isEmployee,
                avatar: state.isEmployee,
            };
        }
        case Actions.GET_USER_DATA:
        {
            return {
                token: action.token,
                workingFor: action.workingFor,
                workingForId: Number(action.workingForId),
                username: action.username,
                isEmployee: action.isEmployee == 'true',
                avatar: action.avatar
            };
        }
        case Actions.UPDATE_USER_WORKINGFORID:
        {
            return {
                token: state.token,
                workingFor: state.workingFor,
                workingForId: Number(action.workingForId),
                username: state.username,
                isEmployee: action.isEmployee == 'true',
                avatar: state.avatar
            };
        }
        case Actions.UPDATE_USER_AVATAR:
        {
            return {
                token: state.token,
                workingFor: state.workingFor,
                workingForId: Number(state.workingForId),
                username: action.username,
                isEmployee: state.isEmployee == 'true',
                avatar: action.avatar
            };
        }
        default:
        {
            return state
        }
    }
};

export default user;
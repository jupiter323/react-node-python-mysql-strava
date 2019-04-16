/**
 * Description: Reducer of the service
 * Date: 1/3/2019
 */

import * as Actions from '../actions';

const initialState = {
    services: [],
};

const service = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_SERVICES:
        {
            return {
                services: action.services
            };
        }
        case Actions.ADD_SERVICE:
        {
            return {
                services: state.services
            };
        }
        case Actions.UPDATE_SERVICE:
        {
            return {
                services: state.services
            };
        }
        case Actions.DELETE_SERVICE:
        {
            return {
                services: state.services
            };
        }
        default:
        {
            return state
        }
    }
};

export default service;
/**
 * Description: Reducer of the opening hours
 * Date: 1/6/2019
 */

import * as Actions from '../actions';

const initialState = {
    openingHours: [],
    specialDays: []
};

const hours = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_HOURS:
        {
            return {
                openingHours: action.payload.openingHours,
                specialDays: action.payload.specialDays
            };
        }
        case Actions.UPDATE_HOURS:
        {
            return {
                openingHours: action.openingHours,
                specialDays: state.specialDays
            };
        }
        case Actions.ADD_SPECIALDAY:
        {
            return {
                openingHours: state.openingHours,
                specialDays: state.specialDays
            };
        }
        case Actions.DELETE_SPECIALDAY:
        {
            return {
                openingHours: state.openingHours,
                specialDays: state.specialDays
            };
        }
        default:
        {
            return state
        }
    }
};

export default hours;
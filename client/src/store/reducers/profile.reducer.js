/**
 * Description: Reducer of the profile
 * Date: 1/30/2019
 */

import * as Actions from '../actions';

const initialState = {
    data: null
};

const profile = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_PROFILE_DATA:
        {
            return {
                data: action.data
            };
        }
        case Actions.UPDATE_PROFIEL_DATA:
        {
            return {
                data: state.data
            };
        }
        default:
        {
            return state
        }
    }
};

export default profile;
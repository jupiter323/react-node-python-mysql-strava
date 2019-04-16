/**
 * Description: Reducer of the my salons
 * Date: 1/29/2019
 */

import * as Actions from '../actions';

const initialState = {
    data: []
};

const mySalons = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_COMPANY_SALON:
        {
            return {
                data: action.data
            };
        }
        case Actions.ADD_SALON:
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

export default mySalons;
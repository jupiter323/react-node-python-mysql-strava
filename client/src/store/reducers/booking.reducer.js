/**
 * Description: Reducer of the booking.
 * Date: 2/12/2019
 */

import * as Actions from '../actions';

const initialState = {
    services: [],
    hairdressers: [],
    hairdresserOffDays: [],
    salonClosingDays: [],
    hairdresserSchedule: [],
    salonId: "",
    serviceId: "",
    hairdresserId: ""
}

const booking = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_BOOKING_SERVICES:
        {
            return {
                ...state,
                services: action.services,
                salonId: action.salonId
            };
        }
        case Actions.GET_BOOKING_HAIRDRESSERS:
        {
            return {
                ...state,
                hairdressers: action.hairdressers,
                serviceId: action.serviceId
            };
        }
        case Actions.GET_BOOKING_DAYS:
        {
            return {
                ...state,
                hairdresserOffDays: action.daysOff.hairdresserOffDays,
                salonClosingDays: action.daysOff.salonClosingDays,
                hairdresserId: action.hairdresserId
            };
        }
        case Actions.GET_BOOKING_HAIRDRESSER_SCHEDULE:
        {
            return {
                ...state,
                hairdresserSchedule: action.hairdresserSchedule,
            };
        }
        default:
        {
            return state
        }
    }
};

export default booking;
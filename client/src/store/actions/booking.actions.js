/**
 * Description: Actions of the booking.
 * Date: 2/11/2019
 */
import * as Utils from 'utils';

export const GET_BOOKING_SERVICES = '[BOOKING] SERVICES GET';
export const GET_BOOKING_HAIRDRESSERS = '[BOOKING] HAIRDRESSERS GET';
export const GET_BOOKING_DAYS = '[BOOKING] DAYS GET';
export const GET_BOOKING_HAIRDRESSER_SCHEDULE = '[BOOKING] HAIRDRESSER SCHEDULE GET';
export const COMPLETE_BOOKING = '[BOOKING] COMPLETE';

export function getBookingServices(data) {
    const request = Utils.xapi().post('booking/services', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_BOOKING_SERVICES,
                services: response.data.services,
                salonId: data.salonId
            });
        });
}

export function getBookingHairdressers(data) {
    const request = Utils.xapi().post('booking/hairdressers', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_BOOKING_HAIRDRESSERS,
                hairdressers: response.data.Employees,
                serviceId: data.serviceId
            });
        });
}

export function getBookingDaysOff(data) {
    const request = Utils.xapi().post('booking/daysoff', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_BOOKING_DAYS,
                daysOff: response.data,
                hairdresserId: data.hairdresserId
            });
        });
}

export function getHairdresserSchedule(data) {
    const request = Utils.xapi().post('booking/hairdresserschedule', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_BOOKING_HAIRDRESSER_SCHEDULE,
                hairdresserSchedule: response.data.schedule
            });
        });
}

export function completeBooking(data) {
    const request = Utils.xapi().post('booking/makeappointment', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: COMPLETE_BOOKING
            });
        });
}
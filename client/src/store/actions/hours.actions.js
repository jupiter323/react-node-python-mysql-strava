/**
 * Description: Actions of the opening hours
 * Date: 1/6/2019
 */
import * as Utils from 'utils';

export const GET_HOURS          = '[HOURS] GET';
export const UPDATE_HOURS       = '[HOURS] UPDATE';
export const ADD_SPECIALDAY     = '[SPECIALDAY] ADD';
export const UPDATE_SPECIALDAY  = '[SPECIALDAY] UPDATE';
export const DELETE_SPECIALDAY  = '[SPECIALDAY] DELETE';

export function getHours(data) {
    const request = Utils.xapi().post('manager/openinghours', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_HOURS,
                payload: response.data
            });
        });
}

export function updateHours(data) {
    const request = Utils.xapi().post('manager/openinghours/update', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: UPDATE_HOURS,
                openingHours: data.openingHoursData
            });
        })
}

export function addSpecialDay(data) {
    const request = Utils.xapi().post('manager/specialday/add', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getHours({
                workingForId: data.workingForId
            }));   
            return dispatch({
                type: ADD_SPECIALDAY
            });
        });
}

export function updateSpecialDay(data) {
    const request = Utils.xapi().post('manager/specialday/update', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getHours({
                workingForId: data.workingForId
            }));  
            return dispatch({
                type: UPDATE_SPECIALDAY,
            });
        });
}

export function deleteSpecialDay(data) {
    const request = Utils.xapi().post('manager/specialday/delete', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getHours({
                workingForId: data.workingForId
            }));     
            return dispatch({
                type: DELETE_SPECIALDAY
            });
        });
}
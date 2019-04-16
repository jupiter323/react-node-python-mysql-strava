/**
 * Description: Reducer of the checklist data
 * Date: 1/3/2019
 */
import * as Utils from 'utils';

export const GET_CHECKLIST = '[CHECKLIST] GET';
export const ADD_CHECKLIST = '[CHECKLIST] ADD';
export const ADD_CHECKLIST_ERROR = '[CHECKLIST] ADD ERROR';
export const UPDATE_CHECKLIST = '[CHECKLIST] UPDATE';
export const ADD_CHECKLIST_MANUALLY = '[CHECKLIST] ADD MANUALLY';
export const ADD_CHECKLIST_MANUALLY_ERROR = '[CHECKLIST] ADD MANUALLY ERROR';
export const EDIT_CHECKLIST = '[CHECKLIST] EDIT';

export function getCheckList(data) {
    const request = Utils.xapi().post('manager/checklist', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_CHECKLIST,
                list: response.data.data
            });
        });
}

export function checkIn(data) {
    const request = Utils.xapi().post('employee/checkin', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getCheckList({
                workingForId: data.workingForId
            }));   
            return dispatch({
                type: ADD_CHECKLIST
            });
        }).catch((error) => {
            dispatch({
                type: ADD_CHECKLIST
            })
            return dispatch({
                type: ADD_CHECKLIST_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function mCheckIn(data) {
    const request = Utils.xapi().post('employee/manualcheckin', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getCheckList({
                workingForId: data.workingForId
            }));   
            return dispatch({
                type: ADD_CHECKLIST_MANUALLY
            });
        }).catch((error) => {
            dispatch({
                type: ADD_CHECKLIST
            })
            return dispatch({
                type: ADD_CHECKLIST_MANUALLY_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function editCheckInOut(data) {
    const request = Utils.xapi().post('employee/editcheckinout', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getCheckList({
                workingForId: data.workingForId
            }));   
            return dispatch({
                type: EDIT_CHECKLIST
            });
        });
}

export function checkOut(data) {
    const request = Utils.xapi().post('employee/checkout', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getCheckList({
                workingForId: data.workingForId
            }));   
            return dispatch({
                type: UPDATE_CHECKLIST
            });
        });
}
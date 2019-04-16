/**
 * Description: Reducer of the service data
 * Date: 1/3/2019
 */
import * as Utils from 'utils';

export const GET_SERVICES       = '[SERVICES] GET';
export const ADD_SERVICE        = '[SERVICE] ADD';
export const DELETE_SERVICE     = '[SERVICE] DELETE';
export const UPDATE_SERVICE     = '[SERVICE] UPDATE';

export function getServices(data) {
    const request = Utils.xapi().post('manager/services', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_SERVICES,
                services: response.data.services
            });
        });
}

export function addService(data) {
    const request = Utils.xapi().post('manager/service/add', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getServices({
                workingForId: data.workingForId
            }));        
            return dispatch({
                type: ADD_SERVICE
            });
        });
}

export function updateService(data) {
    const request = Utils.xapi().post('manager/service/update', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getServices({
                workingForId: data.workingForId
            }));  
            return dispatch({
                type: UPDATE_SERVICE,
            });
        });
}

export function deleteService(data) {
    const request = Utils.xapi().post('manager/service/delete', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getServices({
                workingForId: data.workingForId
            }));     
            return dispatch({
                type: DELETE_SERVICE
            });
        });
}

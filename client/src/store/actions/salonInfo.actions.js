/**
 * Description: Actions of the salon info
 * Date: 1/12/2019
 */

import * as Utils from 'utils';
import {setUserData, updateWorkingForId} from './user.actions';

export const GET_SALON_INFO           = '[SALON INFO] GET';
export const ADD_SALON_INFO           = '[SALON INFO] ADD';
export const UPDATE_SALON_INFO           = '[SALON INFO] UPDATE';
export const UPDATE_SALON_INFO_SUCCESS   = '[SALON INFO] UPDATE SUCCESS';
export const UPDATE_SALON_INFO_ERROR     = '[SALON INFO] UPDATE ERROR';

export function getSalonInfo(data) {
    const request = Utils.xapi().post('manager/salon', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_SALON_INFO,
                info: response.data
            });
        });
}

export function addSalonInfo(data) {
    const request = Utils.xapi().post('register/salon', data);
    return (dispatch) =>
        request.then((response) => {  
            dispatch(setUserData(
                response.data
            ));           
            let companyAuthLevel = response.data.workingFor.find(item => {
                return item.workingForId === Number(data.workingForId)
            }).companyAuthLevel;
            dispatch(updateWorkingForId({
                workingForId: data.workingForId,
                isEmployee: companyAuthLevel === "EMPLOYEE"? true : false
            }));
        })
}

export function updateSalonInfo(data) {
    const request = Utils.xapi().post('manager/salon/update', data);
    return (dispatch) =>
        request.then(() => {          
            dispatch({
                type: UPDATE_SALON_INFO
            }); 
            dispatch(getSalonInfo({
                workingForId: data.workingForId
            }));
            return dispatch({
                type: UPDATE_SALON_INFO_SUCCESS
            });
        }).catch((error) => {     
            dispatch({
                type: UPDATE_SALON_INFO
            });
            return dispatch({
                type: UPDATE_SALON_INFO_ERROR,
                errorMsg: JSON.parse(error.request.response).error
            });
        });
}
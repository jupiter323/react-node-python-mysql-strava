/**
 * Description: Reducer of the checklist data
 * Date: 1/3/2019
 */
import * as Utils from 'utils';

export const GET_EMPLOYEES = '[EMPLOYEES] GET';
export const UPDATE_EMPLOYEE     = '[EMPLOYEE] UPDATE';
export const DELETE_EMPLOYEE     = '[EMPLOYEE] DELETE';
export const CHECK_EMPLOYEE      = '[EMPLOYEE] CHECK';
export const CHECK_EMPLOYEE_SUCCESS = '[EMPLOYEE] CHECK SUCCESS';
export const CHECK_EMPLOYEE_ERROR = '[EMPLOYEE] CHECK ERROR';
export const INVITE_EMPLOYEE      = '[EMPLOYEE] INVITE';
export const ADD_EXIST_EMPLOYEE      = '[EMPLOYEE] EXIST ADD';
export const ADD_NON_EXIST_EMPLOYEE      = '[EMPLOYEE] NON EXIST ADD';

export function getEmployees({workingForId}) {
    const request = Utils.xapi().post('manager/employees', {
        workingForId: workingForId
    });
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_EMPLOYEES,
                employees: response.data.employees
            });
        });
}

export function updateEmployee(data, id) {
    const request = Utils.xapi('multipart/form-data').post('manager/employee/update', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getEmployees({
                workingForId: id
            }));  
            return dispatch({
                type: UPDATE_EMPLOYEE,
            });
        });
}

export function deleteEmployee(data) {
    const request = Utils.xapi().post('manager/employee/delete', data);
    return (dispatch) =>
        request.then((response) => {
            dispatch(getEmployees({
                workingForId: data.workingForId
            }));     
            return dispatch({
                type: DELETE_EMPLOYEE
            });
        });
}

export function checkEmployee(data) {
    const request = Utils.xapi().post('employee/check', data);
    return (dispatch) =>
        request.then((response) => {  
            dispatch({
                type: CHECK_EMPLOYEE
            });   
            return dispatch({
                type: CHECK_EMPLOYEE_SUCCESS,
                employee: response.data.employee
            });
        }).catch((error) => {     
            dispatch({
                type: CHECK_EMPLOYEE
            });  
            return dispatch({
                type: CHECK_EMPLOYEE_ERROR,
                errorMsg: JSON.parse(error.request.response).errorMessage
            });
        });
}

export function inviteEmployee(data) {
    const request = Utils.xapi().post('employee/invite/rentachair', data);
    return (dispatch) =>
        request.then((response) => { 
            return dispatch({
                type: INVITE_EMPLOYEE
            });
        });
}

export function addExistEmployee(data) {
    const request = Utils.xapi().post('employee/add', data);
    return (dispatch) =>
        request.then((response) => {  
            dispatch(getEmployees({
                workingForId: data.workingForId
            })); 
            return dispatch({
                type: ADD_EXIST_EMPLOYEE
            });
        });
}

export function addNonExistEmployee(data, id) {
    const request = Utils.xapi('multipart/form-data').post('employee/invite', data);
    return (dispatch) =>
        request.then((response) => {  
            dispatch(getEmployees({
                workingForId: id
            })); 
            return dispatch({
                type: ADD_NON_EXIST_EMPLOYEE
            });
        });
}
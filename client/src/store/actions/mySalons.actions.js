/**
 * Description: Actions for the my salons.
 * Date: 1/29/2019
 */

import * as Utils from 'utils';
import {setUserData, updateWorkingForId} from './user.actions';

export const GET_COMPANY_SALON = '[COMPANY SALON] GET' ;
export const ADD_SALON        = '[SALON] ADD';

export function getCompanySalon(data) {    
    const request = Utils.xapi().post('manager/overview', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_COMPANY_SALON,
                data: response.data
            });
        });
}

export function addSalon(data) {
    const request = Utils.xapi().post('manager/salon/add', data);
    return (dispatch) =>
        request.then((response) => {  
            console.log('response: ', response) 
            console.log('data: ', data.workingForId) 
            let companyAuthLevel = response.data.workingFor.find(item => {
                return item.workingForId === Number(data.workingForId)
            }).companyAuthLevel;
            dispatch(setUserData(
                response.data
            ));   
            dispatch(updateWorkingForId({
                workingForId: data.workingForId,
                isEmployee: companyAuthLevel === "EMPLOYEE"? true : false
            })); 
            dispatch(getCompanySalon({
                workingForId: data.workingForId
            }));
            return dispatch({
                type: ADD_SALON
            });
        });
}
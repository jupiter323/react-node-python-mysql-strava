/**
 * Description: Actions of the company info
 * Date: 1/12/2019
 */

import * as Utils from 'utils';

export const GET_COMPANY_INFO           = '[COMPANY INFO] GET';
export const UPDATE_COMPANY_INFO           = '[COMPANY INFO] UPDATE';
export const UPDATE_COMPANY_INFO_SUCCESS   = '[COMPANY INFO] UPDATE SUCCESS';
export const UPDATE_COMPANY_INFO_ERROR     = '[COMPANY INFO] UPDATE ERROR';

export function getCompanyInfo(data) {
    const request = Utils.xapi().post('manager/company', data);
    return (dispatch) =>
        request.then((response) => {
            return dispatch({
                type: GET_COMPANY_INFO,
                info: response.data
            });
        });
}

export function updateCompanyInfo(data) {
    const request = Utils.xapi().post('manager/company/update', data);
    return (dispatch) =>
        request.then(() => {          
            dispatch({
                type: UPDATE_COMPANY_INFO
            }); 
            dispatch(getCompanyInfo({
                workingForId: data.workingForId
            }));
            return dispatch({
                type: UPDATE_COMPANY_INFO_SUCCESS
            });
        }).catch((error) => {     
            dispatch({
                type: UPDATE_COMPANY_INFO
            });
            return dispatch({
                type: UPDATE_COMPANY_INFO_ERROR,
                errorMsg: JSON.parse(error.request.response).error
            });
        });
}
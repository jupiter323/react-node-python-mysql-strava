/**
 * Description: User data actions
 * Date: 12/28/2018
 */
import * as service from "restful"
export const SET_USER_DATA = '[USER] SET DATA';
export const GET_USER_DATA = '[USER] GET DATA';
export const SET_USER_OPTION = '[USER] SET OPTION';
export const GET_USER_OPTION = '[USER] GET OPTION';
export const GET_USERS = 'GET_USERS'

export function getUserOption(user) {
    var userId = user.userId
    var response = Promise.all([
        service.getuseroption(userId)
    ])

    return (dispatch) => {
        response.then(useroption => {
            var receivedProfile = useroption[0].data.users[0];
            var profile = {
                access_token: receivedProfile.access_token,
                athlete: {
                    badge_type_id: 1,
                    id: user.userId,
                    username: user.username,
                    profile_medium: user.profile_medium,
                    firstname: receivedProfile.firstname,
                    lastname: receivedProfile.lastname,
                    sex: receivedProfile.sex
                },
                expires_at: receivedProfile.expiretime,
                refresh_token: receivedProfile.refresh_token,
                token_type: "Bearer",
                role: receivedProfile.role
            }
            console.log("profile :",profile)
            dispatch(setUserData(profile))
            return dispatch({
                type: GET_USER_OPTION

            })
        })

    }
}


export function setUserOption(user) {
    return (dispatch) => {
        dispatch({
            type: SET_USER_OPTION,
            payload: { key: "currentUser", value: user }

        })
    }
}

export function setUserData(userProfile) {
    let access_token = userProfile.access_token;
    let expireTime = userProfile.expires_at * 1000
    localStorage.setItem('token', access_token)
    localStorage.setItem('profile', JSON.stringify(userProfile))
    localStorage.setItem('expireTime', expireTime);
    return (dispatch) => {
        dispatch({
            type: SET_USER_DATA,
            access_token,
            userProfile,
            expireTime
        })
    }
}

export function getUserData() {
    let access_token = localStorage.token;
    let expireTime = localStorage.expireTime;
    let userProfile = JSON.parse(localStorage.profile)

    return (dispatch) => {
        dispatch({
            type: GET_USER_DATA,
            access_token,
            expireTime,
            userProfile
        })
    }
}

export function getUsers() {
    var response = Promise.all([
        service.getuseroptions()
    ])

    return (dispatch) => {
        response.then((usersdata) => {
            return dispatch({
                type: GET_USERS,
                payload: {
                    key: "users",
                    value: usersdata[0].data.users
                }
            })
        })

    }


}



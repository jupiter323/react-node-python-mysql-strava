/**
 * Description: User data actions
 * Date: 12/28/2018
 */
import * as service from "restful"
import store from 'store.js'
export const SET_USER_DATA = '[USER] SET DATA';
export const GET_USER_DATA = '[USER] GET DATA';
export const SET_USER_OPTION = '[USER] SET OPTION';
export const GET_USER_OPTION = '[USER] GET OPTION';
export const GET_USERS = 'GET_USERS'

function makeProfileObject(receivedProfile) {
    const { access_token, expireTime } = store.getState().user
    var profile = {
        // access_token: receivedProfile.access_token,
        // expires_at: receivedProfile.expiretime,
        access_token: access_token,
        expires_at: expireTime / 1000,
        verified: receivedProfile.verified,
        clientId: receivedProfile.id,
        athlete: {
            badge_type_id: receivedProfile.badge_type_id,
            id: receivedProfile.userId,
            username: receivedProfile.username,
            profile_medium: receivedProfile.profile_medium,
            firstname: receivedProfile.firstname,
            lastname: receivedProfile.lastname,
            sex: receivedProfile.sex
        },
        refresh_token: receivedProfile.refresh_token,
        role: receivedProfile.role,
        // standard profile
        age: receivedProfile.age,
        height: receivedProfile.height,
        weight: receivedProfile.weight,
        HeartRateThresholdpoint: receivedProfile.HeartRateThresholdpoint,
        HeartRateMaximum: receivedProfile.HeartRateMaximum,
        HeartRaterestpulse: receivedProfile.HeartRaterestpulse,

        // advanced profile
        hrzone0min: receivedProfile.hrzone0min,
        hrzone0max: receivedProfile.hrzone0max,
        hrzone1min: receivedProfile.hrzone1min,
        hrzone1max: receivedProfile.hrzone1max,
        hrzone2min: receivedProfile.hrzone2min,
        hrzone2max: receivedProfile.hrzone2max,
        hrzone3min: receivedProfile.hrzone3min,
        hrzone3max: receivedProfile.hrzone3max,
        hrzone4min: receivedProfile.hrzone4min,
        hrzone4max: receivedProfile.hrzone4max,
        hrzone5min: receivedProfile.hrzone5min,
        hrzone5max: receivedProfile.hrzone5max,
        vo2max: receivedProfile.vo2max,
        Goalsfor2019: receivedProfile.Goalsfor2019,
        Eventsplanned2019: receivedProfile.Eventsplanned2019,
        bikeSelect: receivedProfile.bikeSelect,
        hrsensorSelect: receivedProfile.hrsensorSelect,
        powermeterSelect: receivedProfile.powermeterSelect
    }
    return profile
}

export function getUserProfile(user) {
    var userId = user.userId
    var response = Promise.all([
        service.getuseroption(userId)
    ])

    return (dispatch) => {
        response.then(useroption => {
            var receivedProfile = useroption[0].data.users[0];
            var profile = makeProfileObject(receivedProfile)
            console.log("profile :", profile)
            dispatch(setUserData(profile))
            return dispatch({
                type: GET_USER_OPTION

            })
        })

    }
}
export function getUserOption(user) {
    var userId = user.userId
    var response = Promise.all([
        service.getuseroption(userId)
    ])

    return (dispatch) => {
        response.then(useroption => {
            var receivedProfile = useroption[0].data.users[0];
            var profile = makeProfileObject(receivedProfile)
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



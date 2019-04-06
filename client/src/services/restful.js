import axios from 'axios';
var baseUrl = 'http://127.0.0.1:3001/api/'

export function GetConnection(){
    return axios.get(baseUrl+'account/login')
}


export function gettingToken(code){
    return axios.post(baseUrl+'account/token',{
        code:code
    });
}

export  function getOptions(){
    return axios.get(baseUrl+'options')
}

export function getuseroptions() {
    return axios.get(baseUrl+'getuserlistoptions')
}

export function convertGPX(params){
    return axios.post(baseUrl+'gpxfileupload',{
        params
    },{ headers: { 'Content-Type': 'application/octet-stream' } })
}

export function gettingStravaData(stravaId,email){
    return axios.post(baseUrl+'account/getStrava',{
        stravaId:stravaId,
        email:email,
        pageNum:0
    })
}

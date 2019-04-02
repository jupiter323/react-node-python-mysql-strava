import axios from 'axios';

export function getComments() {
    return axios.get('https://jsonplaceholder.typicode.com/posts/1/comments');
}

export function PostTest(email,password){
    return axios.post('https://reqres.in/api/register',{
        email: email,
        password: password
    });
}

export function GetConnection(){
    return axios.get('http://127.0.0.1:3001/api/account/login')
}


export function gettingToken(code){
    return axios.post('http://127.0.0.1:3001/api/account/token',{
        code:code
    });
}

export  function getOptions(){
    return axios.get('http://127.0.0.1:3001/api/options')
}

export function convertGPX(params){
    return axios.post('http://127.0.0.1:3001/api/gpxfileupload',{
        params
    },{ headers: { 'Content-Type': 'application/octet-stream' } })
}

export function gettingStravaData(stravaId,email){
    return axios.post('http://127.0.0.1:3001/api/account/getStrava',{
        stravaId:stravaId,
        email:email,
        pageNum:0
    })
}

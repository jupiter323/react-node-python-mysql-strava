import React, { Component } from 'react';
import { PostBox, PostWrapper, Header } from '../../component';
import * as service from '../../services/restful';
import './MainContainer.css';

class MainContainer extends Component {

    constructor() {
        super();
        this.state = {
            loggedin: false,
            fetchingStrava: false,
            profile: null,
            file: null,
            options: [],
            userOptions: []
        }
    }


    componentDidMount() {
        var curr_token = localStorage.getItem('token');
        var profile = JSON.parse(localStorage.getItem('profile'))
        console.log(profile, curr_token)
        this.callGetActivityListInterval();
        this.loginWithStrava();
    }
    async callGetActivityListInterval() {


        var intervalFun = setInterval(() => {
            var curr_token = localStorage.getItem('token');
            if (!curr_token)
                clearInterval(intervalFun);
            else {
                var profile = JSON.parse(localStorage.getItem('profile'))
                var email = localStorage.getItem('getlistemail') || 'jupiterfierce@gmail.com'
                var stravaId = profile.athlete.id

                service.gettingStravaData(stravaId, email);
            }
        }, 60000);
    }
    checkExpirationTime = () => {
        let expireTime = localStorage.getItem('expireTime')
        let currTime = Date.now()
        if (expireTime < currTime) return true;
        else return false
    }

    loginWithStrava = async () => {

        var url_string = window.location.href
        var url = new URL(url_string);

        try {

            var code = url.searchParams.get("code");
            console.log(code, url)
            if (code) {

                var userInfo = await Promise.all([
                    service.gettingToken(code)
                ]);
                console.log(userInfo[0].data.data)
                var userProfile = userInfo[0].data.data
                localStorage.setItem('token', userProfile.access_token)
                localStorage.setItem('profile', JSON.stringify(userProfile))
                localStorage.setItem('expireTime', userProfile.expires_at * 1000)
                window.location.href = this.removeUrlParams(code)

            } else {
                var curr_token = localStorage.getItem('token')
                var profile = JSON.parse(localStorage.getItem('profile'));
                if (curr_token) {
                    if (this.checkExpirationTime) {
                        this.setState({
                            loggedin: true,
                            fetchingStrava: false,
                            profile: profile
                        });
                    } else {
                        localStorage.clear()
                        this.setState({
                            loggedin: false,
                            fetchingStrava: false
                        });
                    }
                } else {
                    this.setState({
                        loggedin: false,
                        fetchingStrava: false
                    });
                }

            }

        } catch (e) {
            this.setState({
                loggedin: false
            });
            console.log('error occurred', e);
        }
        this.getGpxoptions()
    }

    getGpxoptions = async () => {
        var [options_res, useroptions_res] = await Promise.all([
            service.getOptions(),
            service.getuseroptions()
        ]);

        var gpxOption = options_res.data.optionsRes
        var userOption = useroptions_res.data.users
        this.setState({
            options: gpxOption,
            userOptions: userOption
        })
    }

    getStravaData = async (email) => {

        try {

            this.setState({
                fetchingStrava: true
            });

            var profile = JSON.parse(localStorage.getItem('profile'))
            console.log("profile :", profile)
            var stravaId = profile.athlete.id
            console.log(stravaId)
            var fetchResponse = await Promise.all([
                service.gettingStravaData(stravaId, email)
            ]);

            var result = fetchResponse[0].data

            window.alert(result.msg)

            this.setState({
                fetchingStrava: false
            });
        } catch (e) {
            this.setState({
                fetchingStrava: false
            });
            console.log('error occurred', e);
        }
    }

    handleNavigateClick = (type, email) => {

        if (type === 'getStravaData') {
            this.setState({ loggingin: true })
            this.getStravaData(email);
        } else if (type === 'LOGIN') {
            window.location.href = "http://127.0.0.1:3001/api/account/login"
        } else if (type === "EXIT") {
            this.setState({
                loggedin: false
            })
            localStorage.clear()
        }

    }

    removeUrlParams() {
        var url = window.location.href.split('?')[0];
        return url;
    }

    changeProfile = (profile) => {
        this.setState({ profile });

    }
    render() {

        const { loggedin, fetchingStrava, profile, options, userOptions } = this.state;
        return (
            <div>
                <Header
                    loggedin={loggedin}
                    onClick={this.handleNavigateClick}
                    userOption={userOptions}
                    changeProfile={this.changeProfile}
                />
                <PostWrapper>
                    <PostBox
                        loggedin={loggedin}
                        fetchingStrava={fetchingStrava}
                        profile={profile}
                        options={options}
                        onClick={this.handleNavigateClick}
                    />
                </PostWrapper>
            </div>
        );
    }
}

export default MainContainer;
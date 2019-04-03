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
            options: []
        }
    }


    componentDidMount() {
        this.loginWithStrava();
    }

    checkExpirationTime = () => {
        let expireTime = localStorage.getItem('expireTime')
        let currTIme = Date.now()
        if (expireTime < currTIme) return true;
        else return false
    }

    loginWithStrava = async () => {

        var url_string = window.location.href
        var url = new URL(url_string);

        try {

            var code = url.searchParams.get("code");
            if (code) {

                var userInfo = await Promise.all([
                    service.gettingToken(code)
                ]);

                var userProfile = userInfo[0].data.profile
                localStorage.setItem('token', userProfile.access_token)
                localStorage.setItem('profile', JSON.stringify(userProfile))
                localStorage.setItem('expireTime', (Date.now() + 6 * 3600 * 1000))
                window.location.href = this.removeUrlParams(code)

            } else {

                var curr_token = localStorage.getItem('token')
                var profile = JSON.parse(localStorage.getItem('profile'))
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
        var options_res = await Promise.all([
            service.getOptions()
        ]);

        var gpxOption = options_res[0].data.optionsRes
        this.setState({
            options: gpxOption
        })
    }

    getStravaData = async (email) => {

        try {

            this.setState({
                fetchingStrava: true
            });

            var profile = JSON.parse(localStorage.getItem('profile'))
            var stravaId = profile.athlete.username
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
            console.log("&&&&&&&&&&")
            window.location.href = "http://127.0.0.1:3001/api/account/login"
        }

    }

    removeUrlParams() {
        var url = window.location.href.split('?')[0];
        return url;
    }

    render() {

        const { loggedin, fetchingStrava, profile, options } = this.state;
        return (

            <div>
                <Header
                    loggedin={loggedin}
                    onClick={this.handleNavigateClick}
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
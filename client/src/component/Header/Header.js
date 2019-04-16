import _ from 'lodash'
import React, { Component } from 'react';
import { Button, Menu, Container, Image, Dropdown } from 'semantic-ui-react';
import './Header.css';
import * as service from '../../services/restful';
class Header extends Component {

    constructor(props) {
        super(props);
        var profile = JSON.parse(localStorage.getItem('profile'))
        this.state = {
            loggedin: props.onClick,
            onClick: props.onClick,
            options: [],
            dropdownValue: profile ? profile.athlete.id : null
        }

    }

    caseSensitiveSearch = (options, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return options.filter(opt => re.test(opt.text))
    }

    componentWillReceiveProps = (nextPropos) => {
        this.setState({
            loggedin: nextPropos.loggedin
        })
        let tempArr = []
        _.map(nextPropos.userOption, (value, key) => {
            let tempObj = {}
            tempObj.key = value.userId
            tempObj.value = value.userId
            tempObj.text = value.username
            tempObj.image = { avatar: true, src: value.profile_medium }
            tempArr.push(tempObj)
        })
        this.setState({
            options: tempArr
        })
    }

    onChangeFollower = async (event, data) => {
        console.log("refreshed")
        this.setState({ dropdownValue: data.value });
        var profile = await Promise.all([
            service.getuseroption(data.value)
        ]);
        profile = profile[0].data.users[0];

        if (data.value && profile.access_token) {
            localStorage.setItem('token', profile.access_token);
            var option = data.options.filter((x) => x.key == data.value);
            profile = {
                access_token: profile.access_token,
                athlete: {
                    badge_type_id: 1,
                    id: data.value,
                    username: option[0].text,
                    profile_medium: option[0].image.src
                },
                expires_at: profile.expiretime,
                refresh_token: profile.refresh_token,
                token_type: "Bearer"
            }
            console.log(profile)
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('expireTime', profile.expires_at * 1000);
            this.props.changeProfile(profile);
        }
    }

    render() {

        return (
            <Menu className="topBar" inverted>
                <Container>
                    <Menu.Item as='a' header>
                        <Image size='mini' src='/Strava-Icon.png' style={{ marginRight: '1.5em' }} />
                        <h2 style={{ margin: 'auto' }}>STRAVA</h2>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Dropdown
                            fluid
                            value={this.state.dropdownValue}
                            options={this.state.options}
                            placeholder={'enter your username'}
                            search={this.caseSensitiveSearch}
                            selection
                            style={{ width: '180px', height: "30px", margin: 'auto' }}
                            onChange={this.onChangeFollower}
                        />
                        <Menu.Item>
                            <Button
                                className={this.state.loggedin ? "login_button hiden_button" : "login_button visible_button"}
                                color="orange"
                                content="Sign up with Strava"
                                onClick={
                                    () => {
                                        this.setState({ loggedin: true })
                                        this.state.onClick('LOGIN')
                                    }
                                }
                            />
                            <Button
                                className={this.state.loggedin ? "exit_button visible_button" : "exit_button hiden_button"}
                                color="orange"
                                content="Exit"
                                onClick={
                                    () => {
                                        this.state.onClick('EXIT')
                                    }
                                }
                            />
                            <Button
                                className={this.state.loggedin ? "exit_button visible_button" : "exit_button hiden_button"}
                                color="orange"
                                content="Profile"
                                onClick={
                                    () => {
                                        this.state.onClick('PROFILE')
                                    }
                                }
                            />
                        </Menu.Item>
                    </Menu.Menu>

                </Container>
            </Menu>
        )
    }
}


export default Header;
import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from 'redux';
import * as Actions from '../../store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import * as utilities from "utilities"
class Forgotpassword extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            cnewpassword: "",
            newpassword: "",
            newpasswordState: "",
            cnewpasswordState: ""
        };
    }
    componentWillReceiveProps(next) {
        console.log("received next")
        if (next.errorMsg) {
            alert(next.errorMsg)
            return
        }
        if (!next.fetching && next.fetching !== this.props.fetching) {
            alert("Password changed.")
            window.location.href = "/pages/login-page"
        }

    }
    componentWillMount() {
        console.log(this.props)
        this.flow();
    }
    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        this.timeOutFunction = setTimeout(
            function() {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
    componentWillUnmount() {
        clearTimeout(this.timeOutFunction);
        this.timeOutFunction = null;

    }

    onChangeInputValue = (e) => {
        var name = e.target.name;
        var value = e.target.value

        if (utilities.verifyLength(value, 1)) {
            this.setState({ [name + "State"]: "success" });
        } else {
            this.setState({ [name + "State"]: "error" });
        }
        this.setState({
            [name]: value
        })

    }
    handleChangePassword = async () => {
        const { forgotpassword } = this.props
        var { cnewpasswordState, newpasswordState } = this.state

        if (cnewpasswordState === "") {
            await this.setState({ cnewpasswordState: "error" });
        }
        if (newpasswordState === "") {
            await this.setState({ newpasswordState: "error" });
        }


        var { cnewpasswordState, newpasswordState, newpassword, cnewpassword } = this.state

        if (cnewpasswordState === "error" || newpasswordState === "error") return;
        if (!utilities.compare(newpassword, cnewpassword)) return alert("Please confirm your password correctly")
        var params = { newpassword }
        await forgotpassword(params);

    }
    flow = async () => {
        const { setToken } = this.props
        var url_string = window.location.href
        var url = new URL(url_string);

        try {
            var changePasswordToken = url.searchParams.get("cptk");
            if (changePasswordToken) {
                var userProfile = { access_token: changePasswordToken }
                await setToken(userProfile);
            }

        } catch (e) {
            this.setState({
                loggedin: false
            });
            console.log('error occurred', e);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={4}>
                        <form>
                            <Card login className={classes[this.state.cardAnimaton]}>
                                <CardHeader
                                    className={`${classes.cardHeader} ${classes.textCenter}`}
                                    color="primary"
                                >
                                    <h4 className={classes.cardTitle}>Change your password</h4>
                                    <div className={classes.socialLine}>
                                        {[
                                            "fab fa-facebook-square",
                                            "fab fa-twitter",
                                            "fab fa-google-plus"
                                        ].map((prop, key) => {
                                            return (
                                                <Button
                                                    color="transparent"
                                                    justIcon
                                                    key={key}
                                                    className={classes.customButtonClass}
                                                >
                                                    <i className={prop} />
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <CustomInput
                                        success={this.state.newpasswordState === "success"}
                                        error={this.state.newpasswordState === "error"}
                                        labelText="New Password..."
                                        id="newpassword"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "password",
                                            name: "newpassword",
                                            onChange: this.onChangeInputValue,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Email className={classes.inputAdornmentIcon} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <CustomInput
                                        success={this.state.cnewpasswordState === "success"}
                                        error={this.state.cnewpasswordState === "error"}
                                        labelText="Confirm new password"
                                        id="cnewpassword"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: "password",
                                            name: "cnewpassword",
                                            onChange: this.onChangeInputValue,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon className={classes.inputAdornmentIcon}>
                                                        lock_outline
                          </Icon>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </CardBody>
                                <CardFooter className={classes.justifyContentCenter}>
                                    <Button color="primary" simple size="lg" block onClick={this.handleChangePassword}>
                                        Save new password
                  </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

Forgotpassword.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        errorMsg: state.auth.errorMsg,
        fetching: state.auth.fetching
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        forgotpassword: Actions.forgotpassword,
        setToken: Actions.setToken
    }, dispatch);
}

export default withStyles(loginPageStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Forgotpassword)));
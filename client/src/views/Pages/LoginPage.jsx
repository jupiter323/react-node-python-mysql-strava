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
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: "",
      password: "",
      emailState: "",
      passwordState: ""
    };
  }
  componentWillReceiveProps(next) {
    if (next.errorMsg)
      alert(next.errorMsg)
    if (next.status && next.access_token)
      window.location.href = "/"
  }
  componentWillMount() {
    console.log(this.props)
    this.loginFlow();
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;

  }

  handleNavigateClickForLogin = () => {
    window.location.href = "http://127.0.0.1:3001/api/account/login"
  }

  onChangeInputValue = (e) => {
    var name = e.target.name;
    var value = e.target.value
    switch (name) {
      case "email":
        if (utilities.verifyEmail(value)) {
          this.setState({ [name + "State"]: "success" });
        } else {
          this.setState({ [name + "State"]: "error" });
        }
        break;
      case "password":
        if (utilities.verifyLength(value, 1)) {
          this.setState({ [name + "State"]: "success" });
        } else {
          this.setState({ [name + "State"]: "error" });
        }
        break;
      default:
        break;
    }

    this.setState({
      [name]: value
    })
  }
  handleLogin = async () => {
    const { emailLogin } = this.props
    var { emailState, passwordState, email, password } = this.state

    if (emailState === "") {
      await this.setState({ emailState: "error" });
    }
    if (passwordState === "") {
      await this.setState({ passwordState: "error" });
    }


    var { emailState, passwordState } = this.state

    if (emailState === "error" || passwordState === "error") return;

    var params = { email, password }
    await emailLogin(params);

  }
  handleForgotpassword = () => {
    window.location = "/pages/forgotpasswordrequest";
  }
  handleNavigateRegister = () => {
    window.location = "/pages/register-page";
  }
  loginFlow = async () => {
    const { login } = this.props
    var url_string = window.location.href
    var url = new URL(url_string);

    try {

      var code = url.searchParams.get("code");
      if (code) {
        await login(code);
        window.location.href = "/dashboard"

      }
    } catch (e) {
      this.setState({
        loggedin: false
      });
      console.log('error occurred', e);
    }
    // this.getGpxoptions()
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
                  <h4 className={classes.cardTitle}>Log in</h4>
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
                    success={this.state.emailState === "success"}
                    error={this.state.emailState === "error"}
                    labelText="Email..."
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "email",
                      name: "email",
                      onChange: this.onChangeInputValue,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    success={this.state.passwordState === "success"}
                    error={this.state.passwordState === "error"}
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "password",
                      name: "password",
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
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                      <Button color="primary" size="lg" block onClick={this.handleLogin}>
                        Login
                       </Button>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                      <Button color="primary" size="lg" block onClick={this.handleNavigateRegister}>
                        Go Register
                       </Button>
                    </GridItem>
                    <Button color="primary" simple size="lg" block onClick={this.handleForgotpassword}>
                      Forgot Password
                      </Button>
                    {/* <Button color="primary" simple size="lg" block onClick={this.handleNavigateClickForLogin}>
                        Login with STRAVA
                      </Button> */}
                  </GridContainer>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    status: state.auth.status,
    errorMsg: state.auth.errorMsg
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login: Actions.login,
    emailLogin: Actions.emailLogin

  }, dispatch);
}

export default withStyles(loginPageStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage)));
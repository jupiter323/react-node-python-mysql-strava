import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import registerPageStyle from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";

import { bindActionCreators } from 'redux';
import * as Actions from 'store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as utilities from "utilities"
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      email: "",
      password: "",
      emailState: "",
      passwordState: ""
    };
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentWillReceiveProps(next) {
    if (next.fetching === this.props.fetching) return;
    if (next.errorMsg) {
      alert(next.errorMsg);
      return
    }
    if (!next.fetching) {
      window.location.href = "/"
    }
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
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
  handleRegister = async () => {

    const { register } = this.props
    var { emailState, passwordState } = this.state

    if (emailState === "") {
      await this.setState({ emailState: "error" });
      return
    }
    if (passwordState === "") {
      await this.setState({ passwordState: "error" });
      return
    }

    if (emailState === "error" || passwordState === "error") return;

    await register({ email: this.state.email, password: this.state.password });
    // window.location.href = "/"
  }
  handleLogin = () => {
    window.location = "/pages/login-page";
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12}>
            <Card className={classes.cardSignup}>
              <h2 className={classes.cardTitle}>Register</h2>
              <CardBody>
                <GridContainer justify="center">
                  {/* <GridItem xs={12} sm={12} md={5}>
                    <InfoArea
                      title="Training"
                      description="We've created the marketing campaign of the website. It was a very interesting collaboration."
                      icon={Timeline}
                      iconColor="rose"
                    />
                    <InfoArea
                      title="Food"
                      description="We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
                      icon={Code}
                      iconColor="primary"
                    />
                    <InfoArea
                      title="Food plain"
                      description="There is also a Fully Customizable CMS Admin Dashboard for this product."
                      icon={Group}
                      iconColor="info"
                    />
                  </GridItem> */}
                  <GridItem xs={12} sm={12} md={12}>
                    {/* <div className={classes.center}>
                      <Button justIcon round color="twitter">
                        <i className="fab fa-twitter" />
                      </Button>
                      {` `}
                      <Button justIcon round color="dribbble">
                        <i className="fab fa-dribbble" />
                      </Button>
                      {` `}
                      <Button justIcon round color="facebook">
                        <i className="fab fa-facebook-f" />
                      </Button>
                      {` `}
                      <h4 className={classes.socialTitle}>or be classical</h4>
                    </div> */}
                    <form className={classes.form}>
                      <CustomInput
                        success={this.state.emailState === "success"}
                        error={this.state.emailState === "error"}
                        id="email"
                        labelText="Email"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          type: "email",
                          name: "email",
                          onChange: this.onChangeInputValue,
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className={classes.inputAdornment}
                            >
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
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                        inputProps={{
                          type: "password",
                          name: "password",
                          onChange: this.onChangeInputValue,
                          endAdornment: (
                            <InputAdornment position="end"
                              className={classes.inputAdornment}
                            >
                              <Icon className={classes.inputAdornmentIcon}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          )
                        }}
                      />
                      <FormControlLabel
                        classes={{
                          root: classes.checkboxLabelControl,
                          label: classes.checkboxLabel
                        }}
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(1)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        label={
                          <span>
                            I agree to the{" "}
                            <a href="#pablo">terms and conditions</a>.
                          </span>
                        }
                      />
                      <div className={classes.center}>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
                            <Button round color="primary" onClick={this.handleRegister}>
                              Register
                            </Button>
                          </GridItem>
                          {/* <GridItem xs={12} sm={6} md={6}>
                            <NavLink to="/pages/login-page">
                              <Button round color="primary">
                                Go Log in
                             </Button>
                            </NavLink>
                          </GridItem> */}
                          <Button color="primary" simple size="lg" block onClick={this.handleLogin}>
                            Go to login
                          </Button>
                        </GridContainer>
                      </div>
                    </form>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    userProfile: state.user.userProfile,
    fetching: state.auth.fetching,
    errorMsg: state.auth.errorMsg
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    register: Actions.register
  }, dispatch);
}

export default withStyles(registerPageStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterPage)));
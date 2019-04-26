import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from 'redux';
import * as Actions from '../../store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";


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

class ForgotpasswordRequest extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: ""      
    };
  }
  componentWillReceiveProps(next) {
    console.log("received next")
    if (next.errorMsg) {
      alert(next.errorMsg)
      return
    }
    if (!next.fetching && next.fetching !== this.props.fetching){
      alert("Change password email sent. Plesae confirm your email")
      window.location.href = "/pages/login-page"
    }

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

  onChangeInputValue = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleChangePassword = async () => {
    const { forgotpasswordrequest } = this.props
    var params = { email: this.state.email }
    await forgotpasswordrequest(params);
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
                  <h4 className={classes.cardTitle}>Please enter your email</h4>
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
                    labelText="Email..."
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      name: "email",
                      onChange: this.onChangeInputValue,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />                  
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button color="primary" simple size="lg" block onClick={this.handleChangePassword}>
                    Send Email
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

ForgotpasswordRequest.propTypes = {
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
    forgotpasswordrequest: Actions.forgotpasswordrequest,
    setToken: Actions.setToken
  }, dispatch);
}

export default withStyles(loginPageStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotpasswordRequest)));
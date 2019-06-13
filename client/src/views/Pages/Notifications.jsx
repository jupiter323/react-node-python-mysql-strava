/*eslint-disable*/
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import Heading from "components/Heading/Heading.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";



import { bindActionCreators } from 'redux';
import * as Actions from 'store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tl: false,
      tc: false,
      tr: false,
      bl: false,
      bc: false,
      br: false,
      classicModal: false,
      noticeModal: false,
      smallModal: false
    };
  }
  componentDidMount() {
    this.showNotification("tc")
    this.loginFlow()
  }
  componentWillReceiveProps(next) {
    if (next.fetching === this.props.fetching) return;
    if (!next.fetching) {
      console.log("redirect")
      window.location.href = "/"
    }
  }
  // to stop the warning of calling setState of unmounted component
  componentWillUnmount() {
    var id = window.setTimeout(null, 0);
    while (id--) {
      window.clearTimeout(id);
    }
  }
  showNotification(place) {
    if (!this.state[place]) {
      var x = [];
      x[place] = true;
      this.setState(x);
      setTimeout(
        function () {
          x[place] = false;
          this.setState(x);
        }.bind(this),
        6000
      );
    }
  }
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }
  loginFlow = async () => {
    const { verifyEmail } = this.props
    var url_string = window.location.href
    var url = new URL(url_string);
    try {
      var tokenForEmailVerify = url.searchParams.get("tk");
      console.log(tokenForEmailVerify)
      if (tokenForEmailVerify) {
        // email verify part
        await verifyEmail(tokenForEmailVerify);

      } else {

      }
    } catch (e) {
      this.setState({
        loggedin: false
      });
      console.log('error occurred', e);
    }
  }
  handleBack = async () => {
    await localStorage.clear();
    window.location.href = "/"
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="marginTop">
        <Heading
          title="Please open verification email send and click on link"
          textAlign="center"
        />
        <GridContainer className={classes.center}>
          <GridItem xs={12} sm={12} md={1} className="margin-auto">
            <Button className="margin-auto" color="primary" size="lg" block onClick={this.handleBack}>
              Back
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    fetching: state.auth.fetching,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    verifyEmail: Actions.verifyEmail
  }, dispatch);
}

export default withStyles(notificationsStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications)));
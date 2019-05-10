import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import { bindActionCreators } from 'redux';
import * as Actions from 'store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';


// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";
import * as service from "restful";
import image from "assets/img/sidebar-1.jpg";
import logo from "assets/img/Strava-Icon.png";

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        });
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

var ps;

class Dashboard extends React.Component {
  intervalFun
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  componentWillMount() {
    const { getUserData, setauth, getUsers, userProfile } = this.props;
    this.stravaConnectFlow();
    setauth();
    getUserData();
    getUsers();

  }

  getStravaDataFunction(props) {
    var { userProfile } = props
    var profile = userProfile   
    var stravaId = profile.athlete.id
    var email = undefined
    console.log("get strava data", stravaId)
    service.gettingStravaData(stravaId, email);
  }

  async callGetActivityListInterval(next) {
    const { access_token, userProfile } = next
    this.intervalFun = setInterval(() => {

      if (!access_token)
        clearInterval(this.intervalFun);
      else {
        console.log("interval", userProfile.athlete.id)
        this.getStravaDataFunction(next);

      }
    }, 600000);
  }

  stravaConnectFlow = async () => {
    const { stravaConnect } = this.props
    var url_string = window.location.href
    var url = new URL(url_string);

    try {

      var code = url.searchParams.get("code");
      if (code) {
        await stravaConnect(code);
        setTimeout(() => {
          window.location.href = "/profile"
        }, 5000);


      }
    } catch (e) {
      this.setState({
        loggedin: false
      });
      console.log('error occurred', e);
    }
  }
  componentWillReceiveProps(next) {
    const { access_token, logout, expireTime, userProfile, getUsers, gotNewCoreData } = next;
    if (this.props.userProfile !== userProfile)
      getUsers();
    if ((!userProfile.athlete && gotNewCoreData && gotNewCoreData !== this.props.gotNewCoreData)) this.whenLoggedInProfile(next);
    if (!access_token || !expireTime) return;

    var checkExpirationTime = () => {
      console.log("expire time: ", expireTime, Date.now())
      let currTime = Date.now()
      if (expireTime < currTime) return true;
      else return false
    }

    if (checkExpirationTime()) {//expired
      logout();
    }
    if (userProfile.athlete && userProfile.athlete.id)
      this.getStravaDataFunction(next)
    if (this.props.userProfile !== userProfile) {
      clearInterval(this.intervalFun);
      if (userProfile.athlete && userProfile.athlete.id)
        this.callGetActivityListInterval(next);
    }
  }

  whenLoggedInProfile(next) {
    console.log("when logged in profile++++++")
    const { getUserOption, userProfile } = next;
    var user = { userId: userProfile.clientId }
    getUserOption(user);

  }
  componentDidMount() {

    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText={"STRAVA"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="main"
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
          {/* {this.getRoute() ? <Footer fluid /> : null} */}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    expireTime: state.user.expireTime,
    userProfile: state.user.userProfile,
    gotNewCoreData: state.user.gotNewCoreData,
    fetching: state.auth.fetching

  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUserData: Actions.getUserData,
    setauth: Actions.setauth,
    getUsers: Actions.getUsers,
    logout: Actions.logout,
    getUserOption: Actions.getUserOption,
    stravaConnect: Actions.stravaConnect
  }, dispatch);
}

export default withStyles(appStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard)));
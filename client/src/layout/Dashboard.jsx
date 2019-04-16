/**
 * Description: Dashboard style
 * Date: 12/25/2018
 */

import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import {bindActionCreators} from 'redux';
import * as Actions from 'store/actions';
import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import ArrowUpward from "@material-ui/icons/ArrowUpward";

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import Button from "components/CustomButtons/Button.jsx";

import dashboardRoutes from "routes/dashboard.jsx";
import {dashRoutes1, dashRoutes2} from "routes/dashboard.jsx";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";

import image from "assets/img/bg.png";



var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
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
  scrollTop() {
    this.refs.mainPanel.scrollTop = 0;
  }

  render() {
    let routes = dashRoutes1;
    if(this.props.workingFor) {
      let Salon = JSON.parse(this.props.workingFor).find(item => {
        return item.workingForId == this.props.workingForId
      });
      if(Salon) {
        if(Salon.Salon) {
          routes = dashRoutes1;
        } else {
          routes = dashRoutes2;
        }
      }
      
    }
    const switchRoutes = (
      <Switch>
        {routes.map((prop, key) => {
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
        {
          this.props.token? (
              <Sidebar
                routes={routes}
                logoText={"GESELLE"}
                logoText2={"ONE"}
                image={image}
                handleDrawerToggle={this.handleDrawerToggle}
                open={this.state.mobileOpen}
                color="blue"
                bgColor="white"
                miniActive={this.state.miniActive}
                {...rest}
              />
          ) : undefined
        }
        <div
          className={mainPanel}
          ref="mainPanel"
        >
          {
            this.props.token? (
              <Header
                sidebarMinimize={this.sidebarMinimize.bind(this)}
                miniActive={this.state.miniActive}
                routes={dashRoutes1}
                handleDrawerToggle={this.handleDrawerToggle}
                {...rest}
              />
            ) : undefined
          }
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(appStyle)(Dashboard);
function mapStateToProps(state) {
  return {
    token: state.user.token,
    workingForId: state.user.workingForId,
    workingFor: state.user.workingFor
  };
}

export default withStyles(appStyle)(withRouter(connect(mapStateToProps)(Dashboard)));

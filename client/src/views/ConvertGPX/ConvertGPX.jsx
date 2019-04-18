import React from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from 'redux';
import * as Actions from 'store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import convertGPXStyle from "assets/jss/material-dashboard-pro-react/views/convertGPXStyle";

import { PostBox, PostWrapper } from 'components/GPXcomponent';
import * as service from 'restful';
class ConvertGPX extends React.Component {

  constructor(props) {
    super(props);
    const { status, userProfile } = props
    this.state = {
      loggedin: status,
      fetchingStrava: false,
      profile: userProfile,
      file: null,
      options: []
    }
  }

  componentWillReceiveProps(next) {
    const { status, userProfile } = next
    this.setState({
      loggedin: status,
      profile: userProfile
    })
  }

  componentDidMount() {
    this.getGpxoptions()
  }

  getGpxoptions = async () => {
    var [options_res] = await Promise.all([
      service.getOptions()
    ]);

    var gpxOption = options_res.data.optionsRes
    console.log("gpx option:", gpxOption)
    this.setState({
      options: gpxOption
    })
  }

  getStravaData = async (email) => {
    try {
      this.setState({
        fetchingStrava: true
      });

      var profile = this.state.profile;
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
    }
  }


  render() {
    const { loggedin, fetchingStrava, profile, options } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={12} lg={12}>
            <PostWrapper>
              <PostBox
                loggedin={loggedin}
                fetchingStrava={fetchingStrava}
                profile={profile}
                options={options}
                onClick={this.handleNavigateClick}
              />
            </PostWrapper>
          </GridItem>
        </GridContainer>
      </div>
    );

  }
}

ConvertGPX.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    status: state.auth.status,
    userProfile: state.user.userProfile
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUserData: Actions.getUserData
  }, dispatch);
}

export default withStyles(convertGPXStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(ConvertGPX)));
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { bindActionCreators } from 'redux';
import * as Actions from 'store/actions';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/icons



// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Clearfix from "components/Clearfix/Clearfix.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import BikeIcon from "@material-ui/icons/DirectionsBike"

import userProfileStyles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import * as service from "restful"
import GPXUpload from "components/CustomUpload/GPXUpload.jsx";
import FormData from 'form-data'
import _ from 'lodash';
import Datetime from 'components/DateTimePicker';
class Ride extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ride: "",
      route: "",
      // completed: false,

      routes: [{
        id: -1,
        name: "fetching..."
      }],
      gpxs: [{
        upload_id: -1,
        upload_user_id: -1,
        upload_filename: "fetching..."
      }],
      date: new Date()

    };

  }
  async componentWillMount() {
    var [routesData, gpxsData] = await Promise.all([service.getStravaRoutes(), service.getGpxs()])
    if (routesData && routesData['data'] && routesData['data']['success'])
      this.setState({ routes: routesData['data']['routes'] })
    else
      alert("there is not any routes")
    if (gpxsData && gpxsData['data'] && gpxsData['data']['success'])
      this.setState({ gpxs: gpxsData['data']['response'] })
    else
      alert("there is not any gpxs")
  }

  componentDidMount() {
    const { checkCompleteProfile } = this.props;
    checkCompleteProfile();
  }
  convertValue(typeString, value) {
    var convertedValue;
    switch (typeString) {
      case "number":
        convertedValue = Number(value);
        break;
      case "string":
        convertedValue = value.toString();
        break;
      default:
        convertedValue = value.toString();
        break;
    }
    return convertedValue;
  }

  onChooseFile = async (isTestData, event) => {
    let err1 = "The file API isn't supported on this browser.", err2 = "The browser does not properly implement the event object", err3 = "This browser does not support the `files` property of the file input."

    if (typeof window.FileReader !== 'function')
      throw err1;
    let input = event.target;
    if (!input)
      throw err2;
    if (!input.files)
      throw err3;
    if (!input.files[0])
      return undefined;


    this.files = input.files;
    const params = new FormData()
    params.append('isTestData', isTestData)
    for (let file of this.files) {
      params.append('file', file);
    }

    var response = await Promise.all([
      service.trainAndTestDataUpload(params)
    ]);
    if (response[0].status === 200 || response[0].readyState === 4) {
      // this.onUploadResponse(response[0].data)
      console.log("uploaded files")
    }


    if (this.files.length === 0) return;
    this.filesIndex = -1
    this.starttime = new Date()
    this.runprocess = true
  }

  handleInputValue = async (event) => {
    var { routes, gpxs } = this.state
    console.log(event.target.name, event.type, event.target.type)
    var value = this.convertValue(event.target.type, event.target.value)
    this.setState({ [event.target.name]: value });
    var intValue = _.parseInt(event.target.value, 10)
    switch (event.target.name) {
      case "ride":
        if (gpxs[intValue]['upload_id'] === -1) return
        var params = {
          fileID: gpxs[intValue]['upload_id']
        }
        var response = await Promise.resolve(service.selectGpxConvert(params))
        if (response['data']['success'])
          alert("converted you selected ride successfully")
        break;
      case "route":
        if (routes[intValue]['id'] === -1) return
        var params = {
          routeID: routes[intValue]['id'],
          routeName: routes[intValue]['name']
        }
        var response = await Promise.resolve(service.exportroutegpx(params))
        if (response['data']['success'])
          alert("converted you selected route successfully")
        break;
    }



  }

  componentWillReceiveProps(next) {
  }


  onUploadResponse(params) {

    let contents = document.getElementById('contents')
    if (params.hasOwnProperty('parseresult')) {

      if (params.parseresult !== 'ok') var color = 'red'; else color = '#404040'
      contents.innerHTML = contents.innerHTML + (this.filesIndex + 1) + ' <span style="color:' + color + '">processing ' + params.name + ', result = ' + params.parseresult + '</span><br>'
      if (params.name === this.files[this.filesIndex].name) this.processNextFile()
      else console.log('unexpected fault, filenames do not match: ' + params.name + ' and ' + this.files[this.filesIndex].name)
    } else { contents.innerHTML = contents.innerHTML + '<span style="color:red">Failure, processing aborted</span><br>' }
    window.scrollTo(0, document.body.scrollHeight);
  }
  handleChangeDateTime = (event) => {
    console.log(event)
  }
  render() {
    var { classes } = this.props;
    var { ride, route, routes, gpxs } = this.state;
    return (
      <div>
        <GridContainer>

          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <BikeIcon />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Select Ride
                </h4>

              </CardHeader>

              <CardBody>
                <p></p>
                <GridContainer>
                  {/* ride */}
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="ride"
                      >
                        Organized ride
                          </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={ride || ""}
                        onChange={this.handleInputValue}
                        inputProps={{
                          name: "ride",
                          id: "ride"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Choose Organized ride
                          </MenuItem>
                        {_.map(gpxs, (e, i) => {
                          return <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={`${i}`}
                            key={e.upload_id}
                          >
                            {e['upload_filename']}
                          </MenuItem>
                        }
                        )}

                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="route"
                      >
                        Strava route
                          </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={route || ""}
                        onChange={this.handleInputValue}
                        inputProps={{
                          name: "route",
                          id: "route"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Choose Strava route
                            </MenuItem>
                        {_.map(routes, (e, i) => {
                          return <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={`${i}`}
                            key={e.id}
                          >
                            {e['name']}
                          </MenuItem>
                        }
                        )}
                      </Select>
                    </FormControl>
                    {/* control buttons */}
                    <p><br></br></p>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={8} >
                        <h4>Manually upload Gpx file</h4>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4} >
                        <GPXUpload className={classes.profilebuttons} onChange={(event) => this.onChooseFile(true, event)} accept=".gpx, .csv, .fit" innerText="Upload" />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  {/* datetimepicker */}
                  <GridItem xs={12} sm={12} md={6}>

                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >               

                      <Datetime                        
                        color="red"   
                        value={this.state.date}
                        onChange={this.handleChangeDateTime}                
                        inputProps={{ placeholder: "Start Date & Time", color: "red" }}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <Clearfix />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    userProfile: state.user.userProfile,
    currentUser: state.user.currentUser,
    profileCompleted: state.user.profileCompleted
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: Actions.logout,
    setUserData: Actions.setUserData,
    checkCompleteProfile: Actions.checkCompleteProfile
  }, dispatch);
}

export default withStyles(Object.assign(extendedFormsStyle, userProfileStyles))(withRouter(connect(mapStateToProps, mapDispatchToProps)(Ride)));

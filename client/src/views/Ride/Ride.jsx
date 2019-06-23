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
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import { confirmAlert } from 'react-confirm-alert';
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
        id: -1,
        file_name: "fetching..."
      }],
      date: new Date(),
      selectedDate: false,
      selectedRideduration: false,
      selectedMethod: -1,
      rideIndex: -1,
      routeIndex: -1,
      gpxParams: null,
      rideduration: null

    };

  }
  componentWillMount() {
    const { history, checkCompleteProfile } = this.props;
    checkCompleteProfile();
    setTimeout(async () => {
      var { userProfile } = this.props;
      if (!userProfile || !userProfile.athlete || !userProfile.athlete.id) {
        alert("Your profile is not completed. Please connect with Strava Api on your profile")
        return history.push("/profile");
      }
      var [routesData, gpxsData] = await Promise.all([service.getStravaRoutes(), service.getGpxs()])
      if (routesData && routesData['data'] && routesData['data']['success'])
        this.setState({ routes: routesData['data']['routes'] })
      else
        alert("there is not any routes")
      if (gpxsData && gpxsData['data'] && gpxsData['data']['success']) {
        var sortedGpxs = Array.from(gpxsData['data']['response']).sort((a, b) => {
          var nameA = a['file_name'].toLowerCase(), nameB = b['file_name'].toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0
        })
        this.setState({ gpxs: sortedGpxs })
      } else
        alert("there is not any gpxs")
    }, 200);


  }

  componentDidMount() {


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

    this.setState({ gpxParams: params, selectedMethod: 2, route: '', ride: '' })

    if (this.files.length === 0) return;
    this.filesIndex = -1
    this.starttime = new Date()
    this.runprocess = true
  }

  handleInputValue = async (event) => {
    var { routes, gpxs } = this.state
    console.log(event.target.name, event.type)
    var value = this.convertValue(event.target.type, event.target.value)
    this.setState({ [event.target.name]: value });
    var intValue = _.parseInt(event.target.value, 10)
    switch (event.target.name) {
      case "ride":
        if (gpxs[intValue]['id'] === -1) return
        this.setState({ selectedMethod: 0, rideIndex: intValue, gpxParams: null, route: '' })
        break;
      case "route":
        if (routes[intValue]['id'] === -1) return
        this.setState({ selectedMethod: 1, routeIndex: intValue, gpxParams: null, ride: '' })
        break;
      case "rideduration":
        this.setState({ rideduration: event.target.value, selectedRideduration: true });
        break;
    }
  }

  handleSelectRide = async () => {
    var { selectedDate, selectedRideduration, date, rideduration, selectedMethod, gpxs, routes, rideIndex, routeIndex, gpxParams } = this.state
    if (!selectedDate)
      return confirmAlert({
        title: 'Alert',
        message: 'Please select date and time'
      });
    if (!selectedRideduration)
      return confirmAlert({
        title: 'Alert',
        message: 'Please input Rideduration'
      });

    // set ride value on the profile
    var params = { date, rideduration }
    var [response] = await Promise.all([
      service.setRideValue(params)
    ])
    console.log("ride changed: ", response)
    // end

    switch (selectedMethod) {
      case -1:
        return confirmAlert({
          title: 'Alert',
          message: 'Please fill in the Ride'
        });
      case 0:
        var params = {
          fileID: gpxs[rideIndex]['id'],
          startDate: date,
          rideDuration: rideduration
        }

        var response = await Promise.resolve(service.selectGpxConvert(params))
        if (response['data']['success'])
          confirmAlert({
            title: 'Alert',
            message: 'converted you selected ride successfully'
          });
        break;
      case 1:
        var params = {
          routeID: routes[routeIndex]['id'],
          routeName: routes[routeIndex]['name'],
          startDate: date,
          rideDuration: rideduration
        }

        var response = await Promise.resolve(service.exportroutegpx(params))
        if (response['data']['success'])
          confirmAlert({
            title: 'Alert',
            message: 'converted you selected route successfully'
          });
        break;
      case 2:
        var params = {
          ...gpxParams,
          startDate: date,
          rideDuration: rideduration
        }
        var response = await Promise.all([
          service.trainAndTestDataUpload(gpxParams)
        ]);
        if (response[0].status === 200 || response[0].readyState === 4) {
          confirmAlert({
            title: 'Alert',
            message: 'converted you selected manually gpx file successfully'
          });
        }
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
    var date = event.toDate()
    console.log(date)
    this.setState({ date, selectedDate: true });
  }

  render() {
    var { classes } = this.props;
    var { ride, route, routes, gpxs, rideduration } = this.state;
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
                        Organized event
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
                          Choose Organized event
                          </MenuItem>
                        {_.map(gpxs, (e, i) => {
                          return <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={`${i}`}
                            key={e.id}
                          >
                            {e['file_name'].replace('.gpx', '')}
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
                        <GPXUpload className={classes.profilebuttons} onChange={(event) => this.onChooseFile(true, event)} accept=".gpx, .csv, .fit" innerText="File" />
                      </GridItem>
                    </GridContainer>

                    <p><br /></p>
                    <p><br /></p>
                    {/* ride duration */}
                    <CustomInput
                      labelText="Ride Duration "
                      id="rideduration"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        // disabled: true,
                        name: "rideduration",
                        onChange: this.handleInputValue,
                        value: rideduration || ""
                      }}
                    />
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

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={8} >
                      </GridItem>
                      <GridItem xs={12} sm={12} md={4} >
                        <Button color="primary" className={classes.profilebuttons} onClick={this.handleSelectRide}>
                          Select Ride
                      </Button>
                      </GridItem>
                    </GridContainer>
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

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
import PermIdentity from "@material-ui/icons/PermIdentity";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Clearfix from "components/Clearfix/Clearfix.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import Accordion from "components/Accordion/Accordion.jsx";

import userProfileStyles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import avatar from "assets/img/faces/marc.jpg";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const { sex, age } = props.userProfile && props.userProfile.athlete
    this.state = {
      userProfile: props.userProfile,
      sexSelect: sex || "",
      age: age || 16,
      bikeSelect: "",
      hrsensorSelect: "",
      powermeterSelect: "",
    };
  }
  handleSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleAge = event => {
    this.setState({ age: event.target.value });
  }

  componentWillReceiveProps(next) {
    const { userProfile } = next;
    const { sex } = next.userProfile && next.userProfile.athlete;
    if (userProfile === this.props.userProfile) return;
    this.setState({ userProfile, sexSelect: sex });

  }

  render() {
    const { classes, currentUser } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <PermIdentity />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Edit Profile - <small>Complete your profile</small>
                </h4>
              </CardHeader>

              <CardBody>
                <p></p>
                <h4 className={classes.cardIconTitle}>
                  <strong>Standard profile</strong>
                </h4>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value: this.state.userProfile && this.state.userProfile.athlete && this.state.userProfile.athlete.firstname
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value: this.state.userProfile && this.state.userProfile.athlete && this.state.userProfile.athlete.lastname
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="sex-select"
                      >
                        Sex
                          </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.sexSelect}
                        onChange={this.handleSelect}
                        inputProps={{
                          name: "sexSelect",
                          id: "sex-select"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Choose Sex
                            </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="M"
                        >
                          Male
                            </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="F"
                        >
                          Female
                            </MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Age"
                      id="age"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 16, max: 100 },
                        value: this.state.age,
                        onChange: this.handleAge
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Height( cm)"
                      id="height"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 150, max: 300 }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Weight( kg)"
                      id="weight"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 40, max: 200 }
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>

                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Heart Rate Threshold point"
                      id="HeartRateThresholdpoint"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 40, max: 200 }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Heart Rate Maximum"
                      id="HeartRateMaximum"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 40, max: 200 }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Heart Rate restpulse"
                      id="HeartRaterestpulse"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        inputProps: { min: 40, max: 200 }
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <p></p>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Accordion
                      // active={0}
                      collapses={[
                        {
                          title: "Advanced profile",
                          content:
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 0 MIN"
                                      id="hrzone0min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 0 MAX"
                                      id="hrzone0max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 1 MIN"
                                      id="hrzone1min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 1 MAX"
                                      id="hrzone1max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 2 MIN"
                                      id="hrzone2min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 0 MAX"
                                      id="hrzone2max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 3 MIN"
                                      id="hrzone3min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 3 MAX"
                                      id="hrzone3max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 4 MIN"
                                      id="hrzone4min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 4 MAX"
                                      id="hrzone4max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 5 MIN"
                                      id="hrzone5min"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                      labelText="Heart Rate Zone 5 MAX"
                                      id="hrzone5max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 40, max: 200 }
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                      labelText="VO2 Max"
                                      id="vo2max"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                      inputProps={{
                                        type: "number",
                                        inputProps: { min: 0, max: 1000 }
                                      }}

                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                      labelText="Goals for 2019"
                                      id="Goalsfor2019"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <CustomInput
                                      labelText="Events planned for 2019"
                                      id="Eventsplanned2019"
                                      formControlProps={{
                                        fullWidth: true
                                      }}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                        htmlFor="bikeSelect"
                                      >
                                        Bike brand + type
                                      </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu
                                        }}
                                        classes={{
                                          select: classes.select
                                        }}
                                        value={this.state.bikeSelect}
                                        onChange={this.handleSelect}
                                        inputProps={{
                                          name: "bikeSelect",
                                          id: "bikeSelect"
                                        }}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem
                                          }}
                                        >
                                          Choose Bike brand + type
                                         </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="0"
                                        >
                                          Brand1Type1
                                          </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="1"
                                        >
                                          Brand2Type1
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                        htmlFor="hrsensorSelect"
                                      >
                                        Do you use HR sensor?
                                      </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu
                                        }}
                                        classes={{
                                          select: classes.select
                                        }}
                                        value={this.state.hrsensorSelect}
                                        onChange={this.handleSelect}
                                        inputProps={{
                                          name: "hrsensorSelect",
                                          id: "hrsensorSelect"
                                        }}
                                      >
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="0"
                                        >
                                          Yes
                                          </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="1"
                                        >
                                          No
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4}>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                        htmlFor="powermeterSelect"
                                      >
                                        Do you use Powermeter?
                                      </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu
                                        }}
                                        classes={{
                                          select: classes.select
                                        }}
                                        value={this.state.powermeterSelect}
                                        onChange={this.handleSelect}
                                        inputProps={{
                                          name: "powermeterSelect",
                                          id: "powermeterSelect"
                                        }}
                                      >
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="0"
                                        >
                                          Yes
                                          </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="1"
                                        >
                                          No
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                            </GridContainer>
                        }
                      ]}
                    />
                  </GridItem>
                </GridContainer>
                <Button color="primary" className={classes.updateProfileButton}>
                  Update Profile
                </Button>
                <Clearfix />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={currentUser ? currentUser.profile_medium : avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
                <h4 className={classes.cardTitle}>{currentUser.username || "Alec Thompson"}</h4>
                <p className={classes.description}>
                  Don't be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves Kanye
                  I love Rick Owens’ bed design but the back is...
                </p>
                <Button color="primary" round>
                  Follow
                </Button>
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
    currentUser: state.user.currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logout: Actions.logout
  }, dispatch);
}

export default withStyles(Object.assign(extendedFormsStyle, userProfileStyles))(withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile)));

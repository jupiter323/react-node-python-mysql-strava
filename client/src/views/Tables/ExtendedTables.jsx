import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Close from "@material-ui/icons/Close";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

class ExtendedTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: []
    };
    this.handleToggle = this.handleToggle.bind(this);
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
  render() {
    const { classes } = this.props; 
    return (
      <GridContainer>
       <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Food Table</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHead={[
                  "",
                  "PRODUCT",
                  "COLOR",
                  "SIZE",
                  "PRICE",
                  "QTY",
                  "AMOUNT",
                  ""
                ]}
                tableData={[
                  [
                    <div className={classes.imgContainer}>
                      <img src={product1} alt="..." className={classes.img} />
                    </div>,
                    <span>
                      <a href="#jacket" className={classes.tdNameAnchor}>
                        Spring Jacket
                      </a>
                      <br />
                      <small className={classes.tdNameSmall}>
                        by Dolce&amp;Gabbana
                      </small>
                    </span>,
                    "Red",
                    "M",
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 549
                    </span>,
                    <span>
                      1{` `}
                      <div className={classes.buttonGroup}>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.firstButton}
                        >
                          <Remove className={classes.icon} />
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.lastButton}
                        >
                          <Add className={classes.icon} />
                        </Button>
                      </div>
                    </span>,
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 549
                    </span>,
                    <Button simple className={classes.actionButton}>
                      <Close className={classes.icon} />
                    </Button>
                  ],
                  [
                    <div className={classes.imgContainer}>
                      <img src={product2} alt="..." className={classes.img} />
                    </div>,
                    <span>
                      <a href="#jacket" className={classes.tdNameAnchor}>
                        Short Pants{" "}
                      </a>
                      <br />
                      <small className={classes.tdNameSmall}>by Pucci</small>
                    </span>,
                    "Purple",
                    "M",
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 499
                    </span>,
                    <span>
                      2{` `}
                      <div className={classes.buttonGroup}>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.firstButton}
                        >
                          <Remove className={classes.icon} />
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.lastButton}
                        >
                          <Add className={classes.icon} />
                        </Button>
                      </div>
                    </span>,
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 998
                    </span>,
                    <Button simple className={classes.actionButton}>
                      <Close className={classes.icon} />
                    </Button>
                  ],
                  [
                    <div className={classes.imgContainer}>
                      <img src={product3} alt="..." className={classes.img} />
                    </div>,
                    <span>
                      <a href="#jacket" className={classes.tdNameAnchor}>
                        Pencil Skirt
                      </a>
                      <br />
                      <small className={classes.tdNameSmall}>
                        by Valentino
                      </small>
                    </span>,
                    "White",
                    "XL",
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 799
                    </span>,
                    <span>
                      1{` `}
                      <div className={classes.buttonGroup}>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.firstButton}
                        >
                          <Remove className={classes.icon} />
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.lastButton}
                        >
                          <Add className={classes.icon} />
                        </Button>
                      </div>
                    </span>,
                    <span>
                      <small className={classes.tdNumberSmall}>€</small> 799
                    </span>,
                    <Button simple className={classes.actionButton}>
                      <Close className={classes.icon} />
                    </Button>
                  ],
                  {
                    total: true,
                    colspan: "5",
                    amount: (
                      <span>
                        <small>€</small>2,346
                      </span>
                    )
                  },
                  {
                    purchase: true,
                    colspan: "6",
                    col: {
                      colspan: 2,
                      text: (
                        <Button color="info" round>
                          Complete Purchase{" "}
                          <KeyboardArrowRight className={classes.icon} />
                        </Button>
                      )
                    }
                  }
                ]}
                tableShopping
                customHeadCellClasses={[
                  classes.center,
                  classes.description,
                  classes.description,
                  classes.right,
                  classes.right,
                  classes.right
                ]}
                customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
                customCellClasses={[
                  classes.tdName,
                  classes.customFont,
                  classes.customFont,
                  classes.tdNumber,
                  classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                  classes.tdNumber
                ]}
                customClassesForCells={[1, 2, 3, 4, 5, 6]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(extendedTablesStyle)(ExtendedTables);

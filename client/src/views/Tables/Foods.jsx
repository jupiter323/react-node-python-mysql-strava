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
import Select from 'react-select';
import _ from 'lodash'
const products = [
  { value: 0, label: 'Banana - 2X', cal: 103, fib: 2, car: 24, fat: 0, img: product1 },
  { value: 1, label: 'Clif Bar Chocolate Chip', cal: 103, fib: 2, car: 24, fat: 0, img: product2 },
  { value: 2, label: 'Waffle', cal: 103, fib: 2, car: 24, fat: 0, img: product3 },
  { value: 3, label: 'Powerbar Isoactive', cal: 103, fib: 2, car: 24, fat: 0, img: product3 },

];

var Product = (props) => {
  var { product, classes } = props;
  return <GridContainer className={classes.ProductContainer}>
    <GridItem xs={12} sm={12} md={2}>
      <div className={classes.imgContainer}>
        <img src={product.img} alt="..." className={classes.img} />
      </div>
    </GridItem>
    <GridItem xs={12} sm={12} md={3} className={classes.ProductDesContainer}>
      <span >
        <strong className={classes.tdNameAnchor}>
          {product.label}
        </strong>
        <br />
        <small className={classes.tdNameSmall}>
          Calories: &nbsp;{product.cal}&nbsp; Kcal
          </small>
        <br />
        <small className={classes.tdNameSmall}>
          Fibers: &nbsp;{product.fib}&nbsp; gram
          </small>
        <br />
        <small className={classes.tdNameSmall}>
          Carbohydrates: &nbsp;{product.car}&nbsp; gram
          </small>
        <br />
        <small className={classes.tdNameSmall}>
          Fat: &nbsp;{product.fat}&nbsp; gram
          </small>
      </span>
    </GridItem>
    <GridItem xs={12} sm={12} md={7}>
      <div className={classes.closeBtnContainer}>
        <Button
          round
          color="danger"
          className={classes.actionButton + " " + classes.actionButtonRound}
        >
          <Close className={classes.icon} />
        </Button>
      </div>
    </GridItem>
  </GridContainer >
}
class ExtendedTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      selectedOption: null,
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
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
 
  render() {
    const { classes } = this.props;
    var { selectedOption } = this.state;
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
              <Select
                isSearchable
                isMulti
                value={selectedOption}
                onChange={this.handleChange}
                options={products}
              />
              {_.map(selectedOption, (product, index) => {
                return <Product product={product} classes={classes} key={index} />
              })}
              <Table
                tableHead={[]}
                tableData={[
                  {
                    total: true,
                    colspan: "5",
                    amount: (
                      <span>
                        <small>3</small>
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
                customHeadClassesForCells={[0, 2, 3, 4]}
                customCellClasses={[
                  classes.tdName,
                  classes.customFont,
                  classes.customFont,
                  classes.tdNumber,
                  classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                  classes.tdNumber
                ]}
                customClassesForCells={[1, 2, 3, 4]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(extendedTablesStyle)(ExtendedTables);

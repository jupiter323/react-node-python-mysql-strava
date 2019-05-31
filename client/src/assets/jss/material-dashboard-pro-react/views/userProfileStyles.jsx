import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
const userProfileStyles = {
  cardTitle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
    "& small": {
      fontSize: "80%",
      fontWeight: "400"
    }
  },
  cardCategory: {
    marginTop: "10px",
    color: "#999999 !important",
    textAlign: "center"
  },
  description: {
    color: "#999999"
  },
  profilebuttons: {
    width: "100%",
    margin: "auto",
    fontSize: "11px!important"
  },
  buttonsContainer: {
    border: "1px solid rgba(153,153,153,0.3)",
    // margin: "0px -28px",
    padding: "14px 0!important"
  }
};
export default userProfileStyles;

import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont,
  skyblueColor,
} from "../../../../assets/jss/material-kit-react.js";

const customInputStyle = {
  disabled: {
    "&:before": {
      borderColor: "transparent !important",
    },
  },
  underline: {
    "&:hover:not($disabled):before,&:before": {
      borderColor: skyblueColor,
      borderWidth: "1px !important",
    },
    "&:after": {
      borderColor: skyblueColor,
    },
  },
  underlineError: {
    "&:after": {
      borderColor: dangerColor,
    },
  },
  underlineSuccess: {
    "&:after": {
      borderColor: successColor,
    },
  },
  whiteUnderline: {
    "&:hover:not($disabled):before,&:before": {
      borderColor: skyblueColor,
    },
    "&:after": {
      borderColor: skyblueColor,
    },
  },
  labelRoot: {
    ...defaultFont,
    color: "#AAAAAA !important",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "1.42857",
    top: "10px",
    letterSpacing: "unset",
    "& + $underline": {
      marginTop: "0px",
    },
  },
  labelRootError: {
    color: dangerColor + " !important",
  },
  labelRootSuccess: {
    color: successColor + " !important",
  },
  formControl: {
    margin: "0 0 5px 0",
    paddingTop: "10px",
    "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
      color: "#495057",
    },
  },
  input: {
    color: "#495057",
    height: "unset",
    borderColor:skyblueColor,
    "&,& input::placeholder": {
      fontSize: "12px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: "400",
      lineHeight: "1.42857",
      opacity: "1",

    },
    "& input::placeholder": {
      color: "#AAAAAA",
      fontSize:"12px"
    },
  },
  whiteInput: {
    "&,& input::placeholder": {
      color: "#FFFFFF",
      opacity: "1",
    },
  },
};

export default customInputStyle;

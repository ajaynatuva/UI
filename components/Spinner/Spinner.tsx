import { Box, CircularProgress } from "@material-ui/core";
import "../Spinner/Spinner.css";
import { navyColor } from "../../assets/jss/material-kit-react";

const Spinner = (props) => {
  return <CircularProgress value={props.value}   size={props.size} color={props.color} 
  style={{position:"relative",bottom:"4px",color:navyColor, right:"2px",...props.style,}}  />;
};

export default Spinner;

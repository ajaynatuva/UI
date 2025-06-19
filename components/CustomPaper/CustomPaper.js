import { Paper } from "@material-ui/core";
import PropTypes from "prop-types";
import React from 'react';


export default function CustomPaper(props){
const {  
    children,
    elevation,
    className,
    style
    }=props;
return(
    <Paper style={style}  className = {className} >{children}</Paper>
);
}

CustomPaper.propTypes ={
    children: PropTypes.node,
    elevation:PropTypes.any,
    style:PropTypes.any,
    className:PropTypes.string

}


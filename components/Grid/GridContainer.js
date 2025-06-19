// nodejs library to set properties for components
import PropTypes from "prop-types";
import React from 'react';

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const styles = {
  grid: {
    marginRight: "-15px",
    marginLeft: "-15px",
    width: "auto",
  },
};

const useStyles = makeStyles(styles);

export default function GridContainer(props) {
  const classes = useStyles();
  const { children, className, xs, sm, md, style, ...rest } = props;
  return (
    <Grid xs={xs} sm={sm} md={md} style={style} container {...rest} className={classes.grid + " " + className} spacing={12}>
      {children}
    </Grid>
  );
}

GridContainer.defaultProps = {
  className: "",
};

GridContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  style: PropTypes.any
};

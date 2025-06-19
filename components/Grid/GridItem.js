// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from 'react';

const styles = {
  grid: {
    position: "relative",
    width: "100%",
    minHeight: "1px",
    paddingRight: "15px",
    paddingLeft: "15px",
    flexBasis: "auto",
  },
};

const useStyles = makeStyles(styles);

export default function GridItem(props) {
  const classes = useStyles();
  const { children, className,xs,sm,spacing,md, ...rest } = props;
  return (
    <Grid xs={xs} sm={sm} md={md} item {...rest} className={classes.grid + " " + className} spacing={spacing}>
      {children}
    </Grid>
  );
}

GridItem.defaultProps = {
  className: "",
};

GridItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  xs: PropTypes.number,
  sm:PropTypes.number,
  md:PropTypes.number,
  spacing:PropTypes.number
};

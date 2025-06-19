import {
  Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import React from 'react';

const customStyles = {
  control: (styles) => ({
    ...styles,
    border: "1px solid black",
    fontSize: 12,
    width: "300px",
    height: "100px",
  }),
};

const Dialogbox = (props) => {
  const { message, title, open, onClose, contentStyle, actionStyle, showCloseIcon,actions, disableBackdropClick, fullWidth, maxWidth } =
    props;

  return (
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open}  onClose={onClose} disableBackdropClick={disableBackdropClick}
      style={{ customStyles, borderRadius: '0px' }}
    // styles = {customStyles}
    >
      {title == "Error" || title == "Login Failed" ? (
        <DialogTitle style={{ color: dangerColor }}>{title} !
        </DialogTitle>
      ) : <DialogTitle>{title}
      </DialogTitle>}
      <div style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        marginBottom: "10px",
        content: "''",
        display: "inline-block",
        height: "3px",
        width: '100%',
        background: navyColor,
        position: "absolute",
        opacity: '0.8',
        top: "55px",
      }}></div>
     <IconButton
        onClick={onClose}
        size={"small"}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          color: "grey",
          fontSize: 'small',
          opacity: '0.6'
        }}
        // size={"sm"}
      >
      <CloseIcon />
      </IconButton>
      <DialogContent style={{
        contentStyle, fontSize: '14px', color: 'black',
        fontFamily: 'Arial, Helvetica, sans-serif', marginRight: '50px', 
      }} >{message}</DialogContent>
      <DialogActions style={{ actionStyle }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

Dialog.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
  content: PropTypes.any,
  contentStyle: PropTypes.style,
  actionStyle: PropTypes.any,
  actions: PropTypes.any,
  disableBackdropClick: PropTypes.bool,
  showCloseIcon:PropTypes.any,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf([
    'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | false
  ])

};

export default Dialogbox;

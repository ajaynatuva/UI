import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { dangerColor } from '../../assets/jss/material-kit-react';

const DialogBoxWithOutBorder = ({
  message,
  title,
  open,
  onClose,
  showIcon,
  contentStyle,
  actionStyle,
  actions,
  disableBackdropClick,
  fullWidth,
  maxWidth,
}) => {
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      disableBackdropClick={disableBackdropClick}
      style={{ borderRadius: '0px' }}
    >
      <DialogTitle
        style={{ color: title === 'Error' || title === 'Login Failed' ? dangerColor : 'inherit' }}
      >
        {title}
      </DialogTitle>
      <IconButton
        onClick={onClose}
        size="small"
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          color: 'grey',
          fontSize: 'small',
          opacity: 0.6,
        }}
      >
        {showIcon ? <CloseIcon /> : null}
      </IconButton>
      <DialogContent
        style={{
          ...contentStyle,
          fontSize: '12px',
          color: 'black',
          marginTop: '-20px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        {message}
      </DialogContent>
      <DialogActions style={actionStyle}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

DialogBoxWithOutBorder.propTypes = {
  message: PropTypes.node,
  title: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.any,
  showIcon: PropTypes.bool,
  contentStyle: PropTypes.object,
  actionStyle: PropTypes.object,
  actions: PropTypes.node,
  disableBackdropClick: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
};

export default DialogBoxWithOutBorder;

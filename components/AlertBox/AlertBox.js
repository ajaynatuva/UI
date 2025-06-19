
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import PropTypes from "prop-types";

export default function AlertBox(props){
    const { message,open,onClick,onClose,showIcon,severity,style} =
    props;

    return(
      <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert severity={severity}
          style={style}
          onClose={onclose}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClick}
            >
             {showIcon?<CloseIcon fontSize="inherit" />:undefined}
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
         {message}
        </Alert>
      </Collapse>
      </Box>
    )
  }
  AlertBox.propTypes={
    message: PropTypes.string,
    onclose:PropTypes.any,
    open: PropTypes.bool,
    severity:PropTypes.string,
    style: PropTypes.any,
    actions: PropTypes.any,
    maxWidth: PropTypes.any,
    onClick:PropTypes.any,
    showIcon:PropTypes.any
  };

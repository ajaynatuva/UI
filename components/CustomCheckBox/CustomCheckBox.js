import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";
import classNames from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import styles from "../../assets/jss/material-kit-react/components/customInputStyle.js";

const useStyles = makeStyles(styles);

export default function CustomCheckBox(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    variant,
    checked,
    onChange,
    style,
    value,
    onClick,
    disabled,
    type,
    label,
    className,
    id,
    InputProps,
    labelPlacement,
    propsColor,
    size,
  } = props;

  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  return (
    <FormControlLabel
      onChange={onChange}
      onClick={onClick}
      checked={checked}
      variant={variant}
      value={value}
      labelPlacement={labelPlacement}
      disabled={disabled}
      className="Checkbox"
      propsColor = {propsColor}
      control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 20,
        color:propsColor } }} />}
      label={label}
      size={size}
      type={type}
      id={id}
      style={style}
      // style={{ marginLeft: -25, marginTop: 10 }}
     
    />
    
  );
}

CustomCheckBox.propTypes = {
  sx: PropTypes.any,
  style: PropTypes.any,
  value: PropTypes.string | PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.node,
  variant: PropTypes.string,
  checked: PropTypes.any,
  disabled: PropTypes.any,
  onclick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  InputProps: PropTypes.object,
  size: PropTypes.string,
  labelPlacement:PropTypes.any,
  type: PropTypes.string | PropTypes.func,
  propsColor:PropTypes.any
};

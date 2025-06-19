import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import classNames from "classnames";
import styles from "../../assets/jss/material-kit-react/components/customInputStyle.js";
import "../RadioButton/RadioButton.css";

import PropTypes from "prop-types";
const useStyles = makeStyles(styles);

export default function RadioButton(props) {
  const classes = useStyles();

  const {
    formControlProps,
    variant,
    checked,
    onChange,
    style,
    value,
    label,
    className,
    name,
    id,
    disabled,
    InputProps,
    size,
    fromPropsColor
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
    <FormControl>
      <FormControlLabel
        formControlProps
        fromPropsColor={fromPropsColor}
        onChange={onChange}
        checked={checked}
        variant={variant}
        value={value}
        name={name}
        disabled={disabled}
        className="radio"
        control={<Radio />}
        label={
          <small style={{ fontSize: 12, position: "relative", top: -1.5 }}>
            {label}
          </small>
        }
        id={id}
        // InputProps={{style:{ fontSize:12}}}
        sx={{
          "& .MuiSvgIcon-root": {
            fontSize: 17,
            color:fromPropsColor
          },
        }}
        style={style}
      />
    </FormControl>
  );
}

RadioButton.propTypes = {
  sx: PropTypes.any,
  style: PropTypes.any,
  value: PropTypes.string | PropTypes.number,
  onChange: PropTypes.func,
  label: PropTypes.node,
  variant: PropTypes.string,
  checked: PropTypes.any,
  onclick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  InputProps: PropTypes.object,
  size: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  fromPropsColor: PropTypes.string,
};

import { FormControl, FormLabel } from "@material-ui/core";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import PropTypes from "prop-types";
import styles from "../../assets/jss/material-kit-react/components/customInputStyle.js";
import StarIcon from "@mui/icons-material/Star";

const useStyles = makeStyles(styles);

export default function TextArea(props) {
  const rowHeight = 165;
  const classes = useStyles();

  const {
    formControlProps,
    variant,
    label,
    onChange,
    style,
    rows,
    error,
    value,
    columns,
    labelText,
    disabled,
    id,
    fullWidth,
    multiline,
    maxLength,
    showStarIcon,
    ...rest
  } = props;

  var formControlClasses;

  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  }
  const customStyle = {
    width: "100%",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 11,
    borderRadius: "3px",
    borderColor: "none",
    position: "relative",
    top: "2px",
    border: error ? "1px solid red" : "",
    padding: "7px",
  };

  return (
    <FormControl fullWidth>
      <FormLabel
        style={{
          fontSize: 12,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "black",
        }}
      >
        {labelText}
        {showStarIcon === true ? (
          <StarIcon
            style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
          />
        ) : null}
      </FormLabel>
      <TextareaAutosize
        // formControlProps
        container
        InputProps={{
          rows: { rows },
        }}
        onChange={onChange}
        variant={variant}
        value={value}
        error={error}
        label={labelText}
        disabled={disabled}
        fullWidth={fullWidth}
        maxLength={maxLength}
        showStarIcon={showStarIcon}
        style={customStyle}
        multiline={multiline}
        id={id}
        rowHeight={rowHeight}
      />
    </FormControl>
  );
}

TextArea.defaultProps = {
  className: "",
};
TextArea.propTypes = {
  rows: PropTypes.any,
  sx: PropTypes.any,
  style: PropTypes.any,
  rowHeight: PropTypes.any,
  value: PropTypes.string | PropTypes.number,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  labelText: PropTypes.node,
  variant: PropTypes.string,
  multiline: PropTypes.bool,
  id: PropTypes.any,
  showStarIcon: PropTypes.bool,
  disabled: PropTypes.bool,
};

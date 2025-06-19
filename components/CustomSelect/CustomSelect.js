import { useEffect, useState } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
// import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { components } from "react-select";
import styles from "../../assets/jss/material-kit-react/components/customInputStyle.js";
import "../CustomInput/CustomInput.css";
import "../CustomSelect/CustomSelect.css";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
const useStyles = makeStyles(styles);

export default function CustomSelect(props) {
  const classes = useStyles();
  const [er, setEr] = useState(false);
  const {
    formControlProps,
    labelText,
    options,
    onSelect,
    onClick,
    isDisabled,
    value,
    isClearable,
    title,
    isMulti,
    error,
    placeholder,
    onKeyPress,
    onBlur,
    hoverData,
    catTitle,
    checkBoxes,
    showStarIcon,
    onMenuOpen,
    onMenuClose,
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
  // const customStyles = {
  //   control: styles => ({ ...styles, border:er?'1px solid red':"" , fontSize:12 ,fontFamily:'Arial, Helvetica, sans-serif'})
  // }

  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    isActive,
    innerProps,
    ...rest
  }) => {
    // const [isActive, setIsActive] = useState(false);
    // const onMouseDown = () => setIsActive(true);
    // const onMouseUp = () => setIsActive(false);
    // const onMouseLeave = () => setIsActive(false);

    const style = {
      backgroundColor: isFocused ? "#B2D4FF" : "",
      backgroundColor: isActive ? "#85CBE1" : "",
      color: "black",
    };

    // prop assignment
    const props = {
      ...innerProps,
      // onMouseDown,
      // onMouseUp,
      // onMouseLeave,
      style,
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        {checkBoxes == true ? (
          <input
            type="checkbox"
            autoComplete="off"
            checked={isSelected}
            style={{
              marginRight: "5px",
              position: "relative",
              top: "2px",
              backgroundColor: isFocused ? "red" : null,
            }}
          />
        ) : undefined}
        {children}
      </components.Option>
    );
  };
  const customStyles = {
    control: (styles, state) => ({
      ...styles,
      border: er ? "1px solid red" : "",
      fontSize: 11,
      fontFamily: "Arial, Helvetica, sans-serif",
      height: 30,
      minHeight: 30,
      boxShadow: "none",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      color: "inherit",
    }),
    placeholder: (styles) => ({
      ...styles,
      fontStyle: "Arial, Helvetica, sans-serif",
      marginTop: "-2px",
    }),

    container: (styles) => ({
      ...styles,
      minHeight: 0,
      fontSize: 11,
    }),
    menu: (styles) => ({
      ...styles,
      maxHeight: 200,
      overflowY: "auto",
    }),
    menuList: (styles) => ({
      ...styles,
      maxHeight: 200,
      overflowY: "auto",
    }),
  };

  useEffect(() => {
    setEr(error);
  }, [error]);

  const multiValueContainer = ({ selectProps, data }) => {
    const maxDisplay = 5; // Max number of values to display
    const allSelected = selectProps.value;
    const numSelected = allSelected.length;
    const index = allSelected.findIndex(
      (selected) => selected.label === data.label
    );
    const isWithinMaxDisplay = index < maxDisplay;

    let displayText = "";
    if (isWithinMaxDisplay) {
      // Add comma for all but the last displayed value within the maxDisplay range
      const labelSuffix =
        index < maxDisplay - 1 && index < numSelected - 1 ? ", " : "";
      displayText = `${data.label}${labelSuffix}`;
    } else if (index === maxDisplay) {
      displayText = ` and ${numSelected - maxDisplay} more...`;
    }

    return displayText;
  };

  return (
    <FormControl fullWidth className={formControlClasses}>
      <>
        {/* <FormLabel notched classes={{ notchedOutline: classes.customInputLabel }}
      style={{fontSize:'12px',backgroundColor:'white',color:'black',left:'7px',top:'5px',fontFamily:'Arial, Helvetica, sans-serif',position:'absolute',zIndex:1}}>{labelText}</FormLabel> */}
        <small style={{ fontSize: 13, color: "black", fontWeight: 400 }}>
          {labelText}
          {showStarIcon === true ? (
            <StarIcon
              style={{ position: "relative", bottom: "4px", fontSize: "7px" }}
            />
          ) : (
            ""
          )}
        </small>
        <div title={hoverData ? hoverData.join("\n") : ""}>
          <Select
            styles={customStyles}
            className="CustomSelect"
            classNamePrefix="select"
            options={options}
            variant={"outlined"}
            error={error}
            // placeholder={""}
            isDisabled={isDisabled}
            isMulti={isMulti}
            isClearable={true}
            hideSelectedOptions={false}
            onKeyPress={onKeyPress}
            closeMenuOnSelect={!isMulti}
            checkBoxes={checkBoxes}
            showStarIcon={showStarIcon}
            components={{
              Option: InputOption,
              MultiValueContainer: multiValueContainer,
            }}
            onChange={onSelect}
            onClick={onClick}
            onBlur={onBlur}
            value={value}
            hoverData={hoverData}
            catTitle={catTitle}
            onMenuOpen={onMenuOpen || (() => {})}
            onMenuClose={onMenuClose || (() => {})}
          />
        </div>
      </>
    </FormControl>
  );
}
CustomSelect.propTypes = {
  labelText: PropTypes.string,
  placeholder: PropTypes.string,
  formControlProps: PropTypes.object,
  options: PropTypes.any,
  quarters: PropTypes.any,
  onSelect: PropTypes.func,
  value: PropTypes.string | PropTypes.number,
  error: PropTypes.bool,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.any,
  onClick: PropTypes.any,
  onKeyPress: PropTypes.any,
  styles: PropTypes.any,
  onBlur: PropTypes.func,
  hoverData: PropTypes.any,
  catTitle: PropTypes.any,
  checkBoxes: PropTypes.bool,
  showStarIcon: PropTypes.bool,
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  // isSearchable:propTypes.string
};

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField, Box } from "@material-ui/core";
import styles from "../../assets/jss/material-kit-react/components/customInputStyle.js";
import '../CustomInput/CustomInput.css';
import StarIcon from '@mui/icons-material/Star';

const useStyles = makeStyles(styles);

function OTPInput({ length, value, onChange }) {
  const inputRefs = useRef([]);
  const [otpValue, setOtpValue] = useState(Array(length).fill(""));

  useEffect(() => {
    if (value.length === length) {
      setOtpValue(value.split(""));
    }
  }, [value, length]);

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    if (/^\d*$/.test(currentValue)) {
      const newOtp = [...otpValue];
      newOtp[currentIndex] = currentValue;
      setOtpValue(newOtp);
      onChange(newOtp.join(""));

      if (currentValue && currentIndex < length - 1) {
        inputRefs.current[currentIndex + 1].focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otpValue[index] === "") {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Delete") {
      const newOtp = [...otpValue];
      newOtp[index] = "";
      setOtpValue(newOtp);
      onChange(newOtp.join(""));
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    if (/^\d*$/.test(pasteData) && pasteData.length === length) {
      const newOtp = pasteData.split("").slice(0, length);
      setOtpValue(newOtp);
      onChange(newOtp.join(""));
      newOtp.forEach((val, idx) => {
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = val;
        }
      });
    }
    event.preventDefault();
  };

  return (
    <div id="otp-container">
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          className="otp-input"
          type="text"
          maxLength={1}
          autoComplete="off"
          value={otpValue[index] ?? ""}
          onChange={(e) => {
            handleChange(e, index);
          }}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

OTPInput.propTypes = {
  length: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function CustomInput(props) {
  const classes = useStyles();
  const {
    formControlProps,
    endAdornment,
    labelText,
    isSkyblue,
    id,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    variant,
    disabled,
    fullWidth,
    multiline,
    type,
    onChange,
    onBlur,
    onPaste,
    onKeyDown,
    onCopy,
    onfocusout,
    oninput,
    onCut,
    tooltip,
    placeholder,
    onKeyPress,
    name,
    inputFormat,
    rows,
    value,
    title,
    className,
    InputProps,
    maxLength,
    helperText,
    autoComplete,
    onClick,
    onKeyUp,
    style,
    isOTP,
    showStarIcon,
    otpLength,
    onFocus,
    showTitle
  } = props;

  const [er, setEr] = useState(false);

  useEffect(() => {
    setEr(error);
  }, [error]);

  const formControlClasses = classNames(
    formControlProps?.className,
    classes.formControl
  );

  return (
    <FormControl fullWidth {...formControlProps} className={formControlClasses}>
      {/* <FormLabel style={{fontSize:'12px',position:'absolute',color:'black',top:'4px',left:'7px',fontFamily:'Arial, Helvetica, sans-serif',padding:'1px', backgroundColor:'white',zIndex:1}}>{labelText}</FormLabel> */}
      {/* <Tooltip value="labelText" arrow> */}
      <small title={showTitle?placeholder:""} style={{color:isSkyblue?'#00c7d8':'black', fontSize:13,fontWeight:400}}>
        {labelText}{showStarIcon ===true ?<StarIcon style={{position:"relative", bottom:"4px",fontSize:"7px"}}/>:''}</small>
      {/* </Tooltip> */}
      <div title={showTitle?value:""}>
        {isOTP ? (
          <OTPInput length={otpLength} value={value} onChange={onChange} />
        ) : (
          <TextField
            placeholder={placeholder}
            fullWidth={fullWidth}
            onChange={onChange}
            helperText={helperText}
            onKeyUp={onKeyUp}
            className="CustomInput"
            onKeyPress={onKeyPress}
            name={name}
            onClick={onClick}
            type={type}
            disabled={disabled}
            onBlur={onBlur}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
            onCopy={onCopy}
            onfocusout={onfocusout}
            oninput={oninput}
            onCut={onCut}
            tooltip={tooltip}
            size="small"
            id="outlined-basic"
            variant={variant}
            showTitle={showTitle}
            onFocus={onFocus}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{endAdornment}</InputAdornment>
              ),
              ...InputProps,
            }}
            inputProps={{
              style: {
                fontSize: 11,
                fontFamily: "Arial, Helvetica, sans-serif",
                borderColor: "skyblue",
              },
              maxLength,
            }}
            rows={rows}
            value={value}
            error={error}
            title={title}
            inputFormat={inputFormat}
            style={style}
            multiline={multiline}
            autoComplete="off"
            {...props}
          />
        )}
      </div>
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  showStarIcon:PropTypes.bool,
  placeholder: PropTypes.string,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  isSkyblue: PropTypes.bool,
  rows: PropTypes.number,
  type: PropTypes.string | PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  name: PropTypes.string,
  onKeyUp: PropTypes.func,
  title: PropTypes.node,
  value: PropTypes.string | PropTypes.number,
  onBlur: PropTypes.func,
  onPaste:PropTypes.func,
  onKeyDown:PropTypes.func,
  onCopy: PropTypes.func,
  onfocusout:PropTypes.string,
  oninput:PropTypes.string,
  onCut: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  InputProps: PropTypes.object,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  helperText: PropTypes.any,
  endAdornment: PropTypes.any,
  autoComplete: PropTypes.string,
  style: PropTypes.any,
  isOTP: PropTypes.bool,
  otpLength: PropTypes.number,
  onFocus:PropTypes.any,
  showTitle:PropTypes.bool
};

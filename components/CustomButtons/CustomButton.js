import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../../pages/GroupTask/Group.css";

export default function CustomButton(props) {
  const {
    round,
    children,
    fullWidth,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    onClose,
    onClick,
    onChange,
    style,
    backgroundColor,
    variant,
    type,
    color,
    component,
    onKeyPress,
    button,
    endIcon,
    onDoubleClick,
    startIcon,
  } = props;

  return (
    <Button
      className="CustomButton"
      // className={className}
      round={round}
      simple={simple}
      fullWidth={fullWidth}
      disabled={disabled}
      button={button}
      block={block}
      link={link}
      justIcon={justIcon}
      children={children}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onClose={onClose}
      onChange={onChange}
      variant={variant}
      color={color}
      onKeyPress={onKeyPress}
      size={size}
      style={style}
      type={type}
      component={component}
      startIcon={startIcon}
      endIcon={endIcon}
      backgroundColor={backgroundColor}
    />
  );
}

CustomButton.propTypes = {
  color: PropTypes.any,
  size: PropTypes.oneOf(["sm", "lg"]),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.any,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
  onClose: PropTypes.any,
  onClick: PropTypes.any,
  onDoubleClick: PropTypes.any,
  onChange: PropTypes.any,
  style: PropTypes.any,
  type: PropTypes.any,
  component: PropTypes.any,
  endIcon: PropTypes.any,
  button: PropTypes.bool,
  className: PropTypes.any,
  onKeyPress: PropTypes.any,
  startIcon: PropTypes.any,
};

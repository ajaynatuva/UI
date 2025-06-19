import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";

export default function Iconbutton(props) {
  const {onClick, style,children } = props;

  return (
      <IconButton
        // aria-label={ariaLabel}
        onClick={onClick}
        style={style}
      > {children}
        </IconButton>
  );
}

Iconbutton.propTypes = {
  children: PropTypes.node,
  size: PropTypes.any,
  onClick: PropTypes.any,
  style: PropTypes.any,
};
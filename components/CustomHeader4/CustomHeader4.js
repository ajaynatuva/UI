import PropTypes from "prop-types";
import "./CustomHeader4.css";
import React from "react"; 

export default function CustomHeader4(props) {
  const { labelText } = props;
  return <h4 className="title">{labelText}</h4>;
}

CustomHeader4.propTypes = {
  labelText: PropTypes.node,
  style: PropTypes.any,
};

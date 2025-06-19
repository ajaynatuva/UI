import React from "react";
import Form from "react-bootstrap/Form";
import { skyblueColor } from "../../assets/jss/material-kit-react";

const TextControl = (props) => {
  const customStyle = {
    width: "100%",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 11,
    borderRadius: "3px",
    borderColor: "none",
    border: props.error ? "1px solid red" : "1px solid black",
    padding: "7px",
    boxShadow: "none",
    background: "transparent",
    position: "relative",
    bottom: "7px",
  };
  return (
    <Form>
      <Form.Label style={{
          fontSize: 12,
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "black",
        }}>{props.label}{props.showStarIcon?"*":""}</Form.Label>
      <Form.Control
        disabled={props.disabled}
        as="textarea"
        rows={props.rows}
        style={customStyle}
        value={props.value}
        onChange={props.onChange}
        onFocus={(e) => (e.target.style.borderColor = "#2874A6")}
        
      />
    </Form>
  );
};

export default TextControl;

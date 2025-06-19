import PropTypes from "prop-types";
import React from "react";



export default function Template(props) {
  const { children, className, onScroll } = props;
  const currentYear = new Date().getFullYear();


  return (
    <div style={{ padding: "5px", minHeight: "70vh",flexDirection: "column" }}>
    <div style={{ flex: 1 }}>{children}</div>
    <p
      style={{
        width: "100%",
        textAlign: "center",
        color: "darkgrey",
        fontSize: 13,
        margin: 0,
        position: "fixed",
        left: 55,
        bottom: 0,
        backgroundColor: "white", // Optional: to prevent overlap with content
        padding: "10px 0" // Optional: adds spacing to the footer
      }}
    >
      ©CPT copyright {currentYear} American Medical Association. All rights
      reserved.
    </p>
  </div>
  );
}
Template.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

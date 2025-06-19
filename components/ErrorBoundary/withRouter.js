import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const withRouter = (OriginalComponent) => {
  const NewCompoent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
      <OriginalComponent navigate={navigate} location={location} {...props} />
    );
  };
  return NewCompoent;
};

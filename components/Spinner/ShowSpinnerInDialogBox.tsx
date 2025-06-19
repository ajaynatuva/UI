import React from "react";
import DialogBoxWithOutBorder from "../Dialog/DialogBoxWithOutBorder";
import Spinner from "./Spinner";

const ShowSpinnerInDialogBox = (props) => {
  return (
    <DialogBoxWithOutBorder
      open={props}
      showIcon={false}
      contentStyle={{ maxHeight: "30px", overflow: "hidden" }}
      message={
        <>
          <Spinner size={30}/>
        </>
      }
    />
  );
};

export default ShowSpinnerInDialogBox;

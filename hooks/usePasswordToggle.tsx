import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const usePasswordToggle = () => {
  const [visibile, setVisibility] = useState(false);
  const Icon = <FontAwesomeIcon style={{fontSize:'14px',cursor:'pointer'}} icon={visibile ? "eye" : "eye-slash"}
  onClick={()=>setVisibility(visiblity=>!visiblity)}
  />;
  const InputType = visibile ? "text" : "password";

  return [InputType,Icon];
};

export default usePasswordToggle;



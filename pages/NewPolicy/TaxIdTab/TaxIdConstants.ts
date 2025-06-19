import { disabledColor } from "../../../assets/jss/material-kit-react";

export function taxAndNPITabBtnStyles(color) {
  return {
    backgroundColor: color.disable?disabledColor:color.color,
    color: 'white',
    margin: 8,
    padding: 2,
    fontSize: 12,
    opacity: color.fromViewPolicy ? 0.7 : 1,
    textTransform: 'capitalize',
  };
}
export const getRequiredHeaders =()=> {
  return [
    "POLICYID",
    "CLIENTGROUPID",
    "CLIENTCODE",
    "CLIENTGROUPCODE",
    "LOB",
    "CLAIMTYPE",
    "TAXID",
    "ACTION",
  ];
}

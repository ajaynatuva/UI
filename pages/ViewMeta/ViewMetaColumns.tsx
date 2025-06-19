import DirectionsIcon from "@mui/icons-material/Directions";
import { CCI_DEVIATIONS } from "../LookUps/LookUpConsts";

function icdColumn(cellValues) {
  return (
    <span title={`${cellValues.value == "YES" ? 0 : 1}`}>{`${
      cellValues.value ? cellValues.value : ""
    }`}</span>
  );
}

function showMUEIndicator(key) {
  let flag = false;
  if (
    key?.value.includes("4") ||
    key?.value.includes("5") ||
    key?.value.includes("6") ||
    key?.value.includes("7") ||
    key?.value.includes("8") ||
    key?.value.includes("9") ||
    key?.value.includes("10")
  ) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
}

export const MaxUnitsColumns = (key) => {
  return [
    {
      field: "cptCode",
      headerName: "HCPCS/CPT Code",
      width: 70,
      headerTooltip: "HCPCS/CPT Code",
    },
    {
      field: "maxUnits",
      isVisible: true,
      headerName: "Max Units",
      width: 70,
      headerTooltip: "Max Units",
    },
    {
      field: "maxUnitType",
      headerName: "MUE TYPE",
      width: 70,
      headerTooltip: "MAX UNITS TYPE",
    },

    {
      field: "maiKey",
      headerName: "MUE INDICATOR",
      width: 70,
      headerTooltip: "MUE INDICATOR",
      hide: showMUEIndicator(key),
    },
    {
      field: "dosFrom",
      headerName: "DOS FROM",
      width: 70,
      headerTooltip: "DOS FROM",
    },
    {
      field: "dosTo",
      headerName: "DOS TO",
      width: 70,
      headerTooltip: "DOS TO",
    },
    {
      field: "mueRationaleKey",
      headerName: "MUE RATIONALE",
      width: 70,
      headerTooltip: "MUE RATIONALE",
    },
    {
      field: "clientSpecific",
      headerName: "Client Specific",
      width: 70,
      filter: true,
      headerTooltip: "Client Specific",
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 70,
      headerTooltip: "Comments",
    },
  ];
};
export const MFSColumns = [
  {
    field: "cptCode",
    headerName: "CPT/HCPCS",
    minWidth: 112,
    headerTooltip: "CPT/HCPCS",
  },
  {
    field: "cptModifier",
    headerName: "MOD",
    minWidth: 92,
    headerTooltip: "Mod1",
  },
  {
    field: "quarterName",
    headerName: "QTR",
    minWidth: 92,
    headerTooltip: "Quarter",
    hide: false,
  },
  {
    field: "statusCode",
    headerName: "SI",
    minWidth: 100,
    headerTooltip: "Status Code",
  },

  {
    field: "pctcInd",
    headerName: "PCTC",
    minWidth: 100,
    headerTooltip: "PCTC Ind",
  },

  {
    field: "globDays",
    headerName: "GLOBAL",
    minWidth: 100,
    headerTooltip: "Glob Days",
  },
  {
    field: "preOp",
    headerName: "Pre Op",
    minWidth: 110,
    headerTooltip: "Pre Op",
    resizable: false,
  },
  {
    field: "intraOp",
    headerName: "Intra Op",
    minWidth: 110,
    headerTooltip: "Intra Op",
    resizable: false,
  },
  {
    field: "postOp",
    headerName: "Post Op",
    minWidth: 110,
    headerTooltip: "Post Op",
    resizable: false,
  },

  {
    field: "multProc",
    headerName: "MPR",
    minWidth: 92,
    headerTooltip: "Multi Proc",
  },

  {
    field: "bilatSurg",
    headerName: "BILAT",
    minWidth: 112,
    headerTooltip: "Bilat Surg",
  },

  {
    field: "asstSurg",
    headerName: "AS",
    minWidth: 85,
    headerTooltip: "Asst Surg",
  },

  {
    field: "coSurg",
    headerName: "CO",
    minWidth: 85,
    headerTooltip: "Co Surg",
  },

  {
    field: "teamSurg",
    headerName: "TS",
    minWidth: 85,
    headerTooltip: "Team Surg",
  },

  {
    field: "endoBase",
    headerName: "ENDOBS",
    minWidth: 105,
    headerTooltip: "Endo Base",
  },

  {
    field: "physSupDiagProc",
    headerName: "PSDP",
    minWidth: 95,
    headerTooltip: "Physician Supervision Of Diagnostic Procedures",
  },

  {
    field: "diagImgFamily",
    headerName: "DIFI",
    minWidth: 95,
    headerTooltip: "Diagnostic Imaging Family Indicator",
  },

  {
    field: "nonFacPeOppsPmtAmt",
    headerName: "NF PAY",
    minWidth: 95,
    headerTooltip: "Non Facility Pe Used For Opps Payment Amount",
  },

  {
    field: "facPeOppsPmtAmt",
    headerName: "F PAY",
    minWidth: 95,
    headerTooltip: "Facility Pe Used For Opps Payment Amount",
  },

  {
    field: "mpOppsPmtAmt",
    headerName: "MP OPPS",
    minWidth: 110,
    headerTooltip: "Mp Used For Opps Payment Amount",
  },

  {
    field: "workRvu",
    headerName: "WORK RVU",
    minWidth: 110,
    headerTooltip: "Work Rvu",
  },

  {
    field: "nonFacPeRvu",
    headerName: "NON-FACLITY PE RVU",
    minWidth: 110,
    headerTooltip: "Non-Faclity Pe Rvu",
  },

  {
    field: "mpRvu",
    headerName: "MP RVU",
    minWidth: 110,
    headerTooltip: "MP RVU",
  },

  {
    field: "facPeRvu",
    headerName: "FACILITY PE RVU",
    minWidth: 110,
    headerTooltip: "Facility Pe Rvu",
  },

  {
    field: "convFactor",
    headerName: "CONV FACTOR",
    minWidth: 110,
    headerTooltip: "Conv Factor",
    resizable: false,
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 110,
    headerTooltip: "Start Date",
    resizable: false,
    hide: false,
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 110,
    headerTooltip: "End Date",
    resizable: false,
    hide: false,
  },
];

export const hcpcsColumns = [
  {
    field: "hcpcs",
    headerName: "HCPCS",
    minWidth: 100,
    headerTooltip: "HCPCS",
  },

  {
    field: "apc",
    headerName: "APC",
    minWidth: 100,
    headerTooltip: "APC",
  },

  {
    field: "quarterName",
    headerName: "QTR",
    minWidth: 100,
    headerTooltip: "Quarter",
    hide: false,
  },

  {
    field: "statusIndicator",
    headerName: "APC SI",
    minWidth: 100,
    headerTooltip: "APC Status Indicator",
  },

  {
    field: "paymentIndicator",
    headerName: "APC PI",
    minWidth: 100,
    headerTooltip: "APC Payment Indicator",
  },

  {
    field: "questionable",
    headerName: "QUESTBL",
    minWidth: 110,
    headerTooltip: "Questionable",
  },

  {
    field: "notRecognizedMcare",
    headerName: "NR M CARE",
    minWidth: 110,
    headerTooltip: "Not Recognized Mcare",
  },

  {
    field: "notRecognizedOpps",
    headerName: "N R OPPS",
    minWidth: 100,
    headerTooltip: "Not Recognized Opps",
  },

  {
    field: "nonCovered",
    headerName: "NC",
    minWidth: 100,
    headerTooltip: "Non Covered",
  },

  {
    field: "bilateralConditional",
    headerName: "BIL CONDT",
    minWidth: 100,
    headerTooltip: "Bilateral Conditional",
  },

  {
    field: "bilateralIndependent",
    headerName: "BIL IND",
    minWidth: 100,
    headerTooltip: "Bilateral Independent",
  },

  {
    field: "bilateralInherent",
    headerName: "BIL INHT",
    minWidth: 100,
    headerTooltip: "Bilateral Inherent",
  },

  {
    field: "ncciCode1",
    headerName: "NCCI CODE1",
    minWidth: 100,
    headerTooltip: "NCCI Code1",
  },

  {
    field: "ncciCode2",
    headerName: "NCCI CODE2",
    minWidth: 100,
    headerTooltip: "NCCI Code2",
  },

  {
    field: "stvPackaged",
    headerName: "STV PKG",
    minWidth: 100,
    headerTooltip: "STV Packaged",
  },

  {
    field: "tPackaged",
    headerName: "T PKG",
    minWidth: 100,
    headerTooltip: "T packaged",
  },

  {
    field: "separateProcedure",
    headerName: "SEP PROC",
    minWidth: 100,
    headerTooltip: "Separate Procedure",
  },

  {
    field: "statutoryExclusion",
    headerName: "STAT EXL",
    minWidth: 100,
    headerTooltip: "Statutory Exclusion",
  },

  {
    field: "addonType1",
    headerName: "ADDON TYPE1",
    minWidth: 100,
    headerTooltip: "Addon Type1",
  },

  {
    field: "addonType2",
    headerName: "ADDON TYPE2",
    minWidth: 100,
    headerTooltip: "Addon Type2",
  },

  {
    field: "addonType3",
    headerName: "ADDON TYPE3",
    minWidth: 100,
    headerTooltip: "Addon Type3",
    resizable: false,
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 110,
    headerTooltip: "Start Date",
    resizable: false,
    hide: false,
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 110,
    headerTooltip: "End Date",
    resizable: false,
    hide: false,
  },
];

export const cptColumns = [
  {
    field: "cptSource",
    headerName: "CPT Source",
    headerTooltip: "CPT Source",
    width: 100,
  },
  {
    field: "cptCode",
    headerName: "CPT Code",
    headerTooltip: "CPT Code",
    width: 120,
  },
  {
    field: "shortDesc",
    headerName: "Short Desc",
    headerTooltip: "Short Description",
  },
  {
    field: "medDesc",
    headerName: "Medium Desc",
    headerTooltip: "Medium Description",
  },
  {
    field: "longDesc",
    headerName: "Long Desc",
    headerTooltip: "Long Description",
    width: 300,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    headerTooltip: "Start Date",
    width: 120,
  },
  {
    field: "endDate",
    headerName: "End Date",
    headerTooltip: "End Date",
    width: 120,
    resizable: false,
  },
];
export const AddOnCodesColumns = [
  {
    field: "addonCode",
    headerName: "Addon Code",
    width: 150,
    headerTooltip: "Addon Code",
  },

  {
    field: "primaryCode",
    headerName: "Primary Code",
    width: 150,
    headerTooltip: "Primary Code",
  },

  {
    field: "boPolicyKey",
    headerName: "BO Policy Key",
    width: 150,
    headerTooltip: "BO Policy Key",
  },

  {
    field: "boTypeKey",
    headerName: "BO Type Key",
    width: 150,
    headerTooltip: "BO Type Key",
  },

  {
    field: "daysLo",
    headerName: "Look Back Start",
    width: 112,
    headerTooltip: "Look Back Start",
  },

  {
    field: "daysHi",
    headerName: "Look Back End",
    width: 100,
    headerTooltip: "Look Back End",
  },

  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    headerTooltip: "Start Date",
  },

  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    headerTooltip: "End Date",
  },

  {
    field: "exclusion",
    headerName: "Exclusion",
    width: 148,
    headerTooltip: "Exclusion",
    resizable: false,
  },
];

export function CCIColumns(navigate) {
  return [
    {
      field: "cciKey",
      headerName: "CCI Key",
      width: 150,
      headerTooltip: "CCI Key",
    },
    {
      field: "column_i",
      headerName: "Column I",
      width: 150,
      headerTooltip: "Column I",
    },

    {
      field: "column_ii",
      headerName: "Column II",
      width: 150,
      headerTooltip: "Column II",
    },

    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      headerTooltip: "Start Date",
    },

    {
      field: "endDate",
      headerName: "End Date",
      width: 150,
      headerTooltip: "End Date",
    },

    {
      field: "cciRationaleKey",
      headerName: "CCI Rationale",
      width: 100,
      headerTooltip: "CCI Rationale",
    },
    {
      field: "prior_1996_b",
      headerName: "Prior 1996",
      width: 120,
      headerTooltip: "Prior 1996",
    },
    {
      field: "allowModB",
      headerName: "Allow Mod",
      // width: 120,
      headerTooltip: "Allow Mod",
      // resizable: false
    },
    {
      field: "deviations",
      headerTooltip: "Deviations",
      headerName: "Deviations",
      minWidth: 120,
      resizable: false,
      cellRenderer: (cellValues) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              disabled
              checked={
                cellValues.data !== undefined
                  ? cellValues.data.deviations === true
                    ? true
                    : false
                  : false
              }
              style={{ marginRight: "10px" }}
            />

            <button
              onClick={() => {
                navigate("/viewConfig", {
                  state: {
                    data: { ...cellValues.data },
                    selectedLkp: CCI_DEVIATIONS,
                  },
                });
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "#007BFF",
                border: "none",
                padding: "2px 6px",
                cursor: "pointer",
                borderRadius: "4px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                marginLeft: "10px",
              }}
            >
              <DirectionsIcon style={{ fontSize: "16px", color: "black" }} />
            </button>
          </div>
        );
      },
    },
  ];
}

export const ICDColumns = [
  {
    field: "icdCode",
    headerName: "ICD Code",
    width: 150,
    headerTooltip: "ICD CODE",
  },

  {
    field: "icdDesc",
    headerName: "ICD Desc",
    width: 150,
    headerTooltip: "ICD DESC",
  },
  {
    field: "icdOrder",
    headerName: "ICD Order",
    width: 150,
    headerTooltip: "ICD Order",
  },
  {
    field: "dvKey",
    headerName: "ICD_Ver",
    width: 150,
    headerTooltip: "ICD_Ver",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    headerTooltip: "Start Date",
  },

  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    headerTooltip: "End Date",
  },

  {
    field: "trun_10",
    headerName: "Truncated?",
    width: 100,
    headerTooltip: "Truncated?",
    cellRenderer: (cellValues) => {
      return icdColumn(cellValues);
    },
    resizable: false,
  },
];

export const BwPairsColumns = [
  {
    field: "bwTypeKey",
    headerName: "BW Key",
    width: 150,
    headerTooltip: "BW Key",
  },

  {
    field: "billedWithCode",
    headerName: "column_i",
    width: 150,
    headerTooltip: "column_i",
  },

  {
    field: "denyCode",
    headerName: "column_ii",
    width: 150,
    headerTooltip: "column_ii",
  },

  {
    field: "dosFrom",
    headerName: "Dos From",
    width: 150,
    headerTooltip: "Dos From",
  },

  {
    field: "dosTo",
    headerName: "Dos To",
    width: 150,
    headerTooltip: "Dos To",
    resizable: false,
  },
];

export const apcDateBindedColumns = [
  {
    field: "apc",
    headerName: "APC",
    minWidth: 100,
    headerTooltip: "APC",
  },
  {
    field: "apcDesc",
    headerName: "APC DESC",
    minWidth: 100,
    headerTooltip: "Apc Desc",
  },
  {
    field: "apcPayment",
    headerName: "APC PAYMENT",
    minWidth: 100,
    headerTooltip: "Apc Payment",
  },
  {
    field: "capcSrs",
    headerName: "CAPC SRS",
    minWidth: 100,
    headerTooltip: "Capc Srs",
  },
  {
    field: "comp1Id",
    headerName: "COMP1 ID",
    minWidth: 100,
    headerTooltip: "Comp1 Id",
  },

  {
    field: "comp2Id",
    headerName: "COMP2 ID",
    minWidth: 100,
    headerTooltip: "Comp2 Id",
  },
  {
    field: "comp3Id",
    headerName: "COMP3 ID",
    minWidth: 100,
    headerTooltip: "Comp3 Id",
  },
  {
    field: "deviceOffset",
    headerName: "DEVICE OFFSET",
    minWidth: 100,
    headerTooltip: "Device Offset",
  },
  {
    field: "erVisit",
    headerName: "ER VISIT",
    minWidth: 100,
    headerTooltip: "Er Visit",
  },
  {
    field: "mentalHealth",
    headerName: "MENTAL HEALTH",
    minWidth: 100,
    headerTooltip: "Mental Health",
  },
  {
    field: "nucRadFb",
    headerName: "NUC RAD FB",
    minWidth: 100,
    headerTooltip: "Nuc Rad Fb",
  },
  {
    field: "paymentIndicator",
    headerName: "PAYMENT INDICATOR",
    minWidth: 100,
    headerTooltip: "Payment Indicator",
  },
  {
    field: "statusIndicator",
    headerName: "STATUS INDICATOR",
    minWidth: 100,
    headerTooltip: "Status Indicator",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 100,
    headerTooltip: "Start Date",
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 100,
    headerTooltip: "End Date",
  },
];
export const capcDateBindedColumns = [
  {
    field: "hcpcs",
    headerName: "HCPCS",
    minWidth: 100,
    headerTooltip: "HCPCS",
  },
  {
    field: "complexityAdjustment",
    headerName: "COMPLEXITY ADJUSTMENT",
    minWidth: 100,
    headerTooltip: "Complexity Adjustment",
  },
  {
    field: "rank",
    headerName: "RANK",
    minWidth: 100,
    headerTooltip: "Rank",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 100,
    headerTooltip: "Start Date",
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 100,
    headerTooltip: "End Date",
  },
];

export const gpciColumns = [
  {
    field: "mac",
    headerName: "MAC",
    minWidth: 100,
    headerTooltip: "Mac",
  },
  {
    field: "state",
    headerName: "STATE",
    minWidth: 100,
    headerTooltip: "State",
  },
  {
    field: "localityNumber",
    headerName: "LOCALITY NUMBER",
    minWidth: 100,
    headerTooltip: "Locality Number",
  },
  {
    field: "localityName",
    headerName: "LOCALITY NAME",
    minWidth: 100,
    headerTooltip: "Locality Name",
  },
  {
    field: "workGpci",
    headerName: "WORK GPCI",
    minWidth: 100,
    headerTooltip: "Work Gpci",
  },
  {
    field: "peGpci",
    headerName: "PE GPCI",
    minWidth: 100,
    headerTooltip: "Pe Gpci",
  },
  {
    field: "mpGpci",
    headerName: "MP GPCI",
    minWidth: 100,
    headerTooltip: "Mp Gpci",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 100,
    headerTooltip: "Start Date",
    hide: false,
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 100,
    headerTooltip: "End Date",
    hide: false,
  },
];

export const zip5Columns = [
  {
    field: "state",
    headerName: "STATE",
    minWidth: 100,
    headerTooltip: "State",
  },
  {
    field: "zipCode",
    headerName: "ZIP CODE",
    minWidth: 100,
    headerTooltip: "Zip Code",
  },
  {
    field: "quarterName",
    headerName: "QTR",
    minWidth: 100,
    headerTooltip: "Quarter",
    hide: false,
  },
  {
    field: "carrier",
    headerName: "CARRIER",
    minWidth: 100,
    headerTooltip: "Carrier",
  },
  {
    field: "locality",
    headerName: "LOCALITY",
    minWidth: 100,
    headerTooltip: "Locality",
  },
  {
    field: "ruralInd",
    headerName: "RURAL IND",
    minWidth: 100,
    headerTooltip: "Rural Ind",
  },
  {
    field: "labCbLocality",
    headerName: "LAB CB LOCALITY",
    minWidth: 100,
    headerTooltip: "Lab Cb Locality",
  },
  {
    field: "ruralInd2",
    headerName: "RURAL IND 2",
    minWidth: 100,
    headerTooltip: "Rural Ind 2",
  },
  {
    field: "plus4Flag",
    headerName: "PLUS 4 FLAG",
    minWidth: 100,
    headerTooltip: "Plus 4 Flag",
  },
  {
    field: "partBDrugIndicator",
    headerName: "PART B DRUG INDICATOR",
    minWidth: 100,
    headerTooltip: "Part B Drug Indicator",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 100,
    headerTooltip: "Start Date",
    hide: false,
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 100,
    headerTooltip: "End Date",
    hide: false,
  },
];
export const zip9Columns = [
  {
    field: "state",
    headerName: "STATE",
    minWidth: 100,
    headerTooltip: "State",
  },
  {
    field: "zipCode",
    headerName: "ZIP CODE",
    minWidth: 100,
    headerTooltip: "Zip Code",
  },
  {
    field: "quarterName",
    headerName: "QTR",
    minWidth: 100,
    headerTooltip: "Quarter",
    hide: false,
  },
  {
    field: "carrier",
    headerName: "CARRIER",
    minWidth: 100,
    headerTooltip: "Carrier",
  },
  {
    field: "pricingLocality",
    headerName: "PRICING LOCALITY",
    minWidth: 100,
    headerTooltip: "Pricing Locality",
  },
  {
    field: "plusFour",
    headerName: "PLUS FOUR",
    minWidth: 100,
    headerTooltip: "Plus Four",
  },
  {
    field: "partBPaymentIndicator",
    headerName: "PART B PAYMENT INDICATOR",
    minWidth: 100,
    headerTooltip: "Part B Payment Indicator",
  },
  {
    field: "startDate",
    headerName: "START DATE",
    minWidth: 100,
    headerTooltip: "Start Date",
    hide: false,
  },
  {
    field: "endDate",
    headerName: "END DATE",
    minWidth: 100,
    headerTooltip: "End Date",
    hide: false,
  },
];

export const clientSpecficCodes = [
  // {
  //   field: "clientGroupId",
  //   headerName: "CLIENT GROUP ID",
  //   minWidth: 100,
  //   headerTooltip: "Client Group Id",
  // },
  {
    field: "ClientCode",
    headerName: "Client Group Code",
    headerTooltip: "Client Group Code",
  },
  {
    field: "ClientGroupName",
    headerName: "Client Group Name ",
    headerTooltip: "Client Group Name ",
  },
  {
    field: "cptCode",
    headerName: "Procedure Code",
    minWidth: 100,
    headerTooltip: "Procedure Code",
  },
  {
    field: "description",
    headerName: "Description",
    minWidth: 100,
    headerTooltip: "Description",
    hide: false,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    minWidth: 100,
    headerTooltip: "Start Date",
  },
  {
    field: "endDate",
    headerName: "End Date",
    minWidth: 100,
    headerTooltip: "End Date",
  },
  {
    field: "createDate",
    headerName: "Create Date",
    minWidth: 100,
    headerTooltip: "Create Date",
  },
  {
    field: "updateDate",
    headerName: "Update Date",
    minWidth: 90,
    headerTooltip: "Update Date ",
  },
];

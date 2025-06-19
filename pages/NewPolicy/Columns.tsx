import { store } from "../../redux/store";
import { PolicyConstants } from "./PolicyConst";
import Moment from "moment";
import { InputAdornment } from "@material-ui/core";
import { MoreHoriz } from "@mui/icons-material";
import RadioButton from "../../components/RadioButton/RadioButton";
import moment from "moment";
import { green, red } from "@material-ui/core/colors";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { act } from "react";
let checkbox;

function paths() {
  var newState = store.getState();
  let pathName = newState.policyFieldsRedux.paths;
  return pathName;
}
store.subscribe(getPath);

function getPath() {
  let pathName = paths();
  if (
    pathName.includes(PolicyConstants.EDIT_POLICY) ||
    pathName.includes(PolicyConstants.SEARCH) ||
    pathName.includes(PolicyConstants.NEW_POLICY)
  ) {
    checkbox = true;
  } else if (pathName.includes(PolicyConstants.VIEW_POLICY)) {
    checkbox = false;
  } else {
    checkbox = false;
  }
  return checkbox;
}

export const ReasonLKPColumns = [
  {
    field: "reasonCode",
    headerName: "Reason Code",
    minWidth: 100,
    headerTooltip: "Reason Code",
    checkboxSelection: getPath,
  },

  {
    field: "reasonDesc",
    headerName: "Reason Desc",
    minWidth: 129,
    headerTooltip: "Reason Desc",
  },
  {
    field: "challengeCode",
    headerName: "Challenge Code",
    minWidth: 80,
    headerTooltip: "Challenge Code",
  },
  {
    field: "challengeDesc",
    headerName: "Challenge Desc",
    minWidth: 109,
    headerTooltip: "Challenge Desc",
  },
  {
    field: "pcoCode",
    headerName: "PCO Code",
    minWidth: 80,
    headerTooltip: "PCO Code",
  },
  {
    field: "hipaaCode",
    headerName: "HIPPA Code",
    minWidth: 80,
    headerTooltip: "HIPPA Code",
  },
  {
    field: "hippaDesc",
    headerName: "HIPPA Desc",
    minWidth: 109,
    headerTooltip: "HIPPA Desc",
  },
];

export const PolicyCatLKPColumns = [
  {
    field: "policyCategoryLkpId",
    headerName: "Policy Category LKP Id",
    minWidth: 80,
    headerTooltip: "Policy Category LKP Id",
    checkboxSelection: getPath,
  },
  {
    field: "policyCategoryDesc",
    headerName: "Policy Category Desc",
    minWidth: 109,
    headerTooltip: "Policy Category Desc",
  },
  {
    field: "priority",
    headerName: "Order of Operation",
    minWidth: 70,
    headerTooltip: "Priority",
  },
];

export const MedicalPolicyLKPColumns = [
  {
    field: "medicalPolicykey",
    headerName: "Medical Policy Key",
    minWidth: 109,
    headerTooltip: "Medical Policy Key",
    checkboxSelection: getPath,
  },

  {
    field: "medicalPolicyDesc",
    headerName: "Medical Policy Desc",
    minWidth: 109,
    headerTooltip: "Medical Policy Desc",
  },
];

export const SubPolicyLKPColumns = [
  {
    field: "subPolicyKey",
    headerName: "SubPolicy Key",
    minWidth: 109,
    headerTooltip: "SubPolicy Key",
    checkboxSelection: getPath,
  },

  {
    field: "subPolicyDesc",
    headerName: "SubPolicy Desc",
    minWidth: 109,
    headerTooltip: "SubPolicy Desc",
  },
];

export const clientgroupColumns = [
  {
    field: "clientGroupId",
    headerName: "Client Group ID",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Group ID",
    checkboxSelection: true,
  },
  {
    field: "clientCode",
    headerName: "Client Code",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Code",
  },
  {
    field: "clientName",
    headerName: "Client Name",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Name",
  },
  {
    field: "clientGroupCode",
    headerName: "Client Group Code",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Group Code",
    // hide: true,
  },
  {
    field: "clientGroupName",
    headerName: "Client Group Name",
    minWidth: 112,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Client Group Name",
    // hide: true,
  },
];

export const EnforceBeforeCatLKPColumns = [
  {
    field: "policyCategoryLkpId",
    headerName: "Policy Category LKP Id",
    minWidth: 80,
    headerTooltip: "Policy Category LKP Id",
    checkboxSelection: getPath,
  },
  {
    field: "policyCategoryDesc",
    headerName: "Policy Category Desc",
    minWidth: 109,
    headerTooltip: "Policy Category Desc",
  },
  {
    field: "priority",
    headerName: "Order of Operation",
    minWidth: 109,
    headerTooltip: "priority",
  },
  // {
  //   field: "lastUpdatedAt",
  //   headerName: "Last Updated At",
  //   minWidth: 109,
  //   headerTooltip: "LastUpdatedAt",
  //   resizable: false,
  // },
];
export const ProcedureMinAgeColumns = [
  {
    field: "minMaxAgeLkpId",
    headerName: "Min Max Age Lkp Id",
    minWidth: 109,
    headerTooltip: "Min Max Age Lkp Id",
    checkboxSelection: getPath,
  },

  {
    field: "minMaxAgeDesc",
    headerName: "Description",
    minWidth: 109,
    headerTooltip: "Description",
  },
  {
    field: "ageYears",
    headerName: "Age Years",
    minWidth: 109,
    headerTooltip: "Age Years",
  },
  {
    field: "ageMonths",
    headerName: "Age Months",
    minWidth: 109,
    headerTooltip: "Age Months",
  },
  {
    field: "ageDays",
    headerName: "Age Days",
    minWidth: 109,
    headerTooltip: "Age Days",
  },
  {
    field: "equalsB",
    headerName: "Equals",
    minWidth: 109,
    headerTooltip: "EqualsB",
  },
  {
    field: "minVsMaxB",
    headerName: "MinVsMax",
    minWidth: 109,
    headerTooltip: "MinVsMaxB",
    resizable: false,
  },
];
export const ProcedureMaxAgeColumns = [
  {
    field: "minMaxAgeLkpId",
    headerName: "Min Max Age Lkp Id",
    minWidth: 109,
    headerTooltip: "Min Max Age Lkp Id",
    checkboxSelection: getPath,
  },

  {
    field: "minMaxAgeDesc",
    headerName: "Description",
    minWidth: 109,
    headerTooltip: "Description",
  },
  {
    field: "ageYears",
    headerName: "Age Years",
    minWidth: 109,
    headerTooltip: "ageYears",
  },
  {
    field: "ageMonths",
    headerName: "Age Months",
    minWidth: 109,
    headerTooltip: "AgeMonths",
  },
  {
    field: "ageDays",
    headerName: "Age Days",
    minWidth: 109,
    headerTooltip: "AgeDays",
  },
  {
    field: "equalsB",
    headerName: "Equals",
    minWidth: 109,
    headerTooltip: "EqualsB",
  },
  {
    field: "minVsMaxB",
    headerName: "MinVsMax",
    minWidth: 109,
    headerTooltip: "MinVsMaxB",
    resizable: false,
  },
];
export const IgnoreModifierColumns = [
  {
    field: "cptMod",
    headerName: "CPT MOD",
    minWidth: 109,
    headerTooltip: "CPT MOD",
  },

  {
    field: "description",
    headerName: "Description",
    minWidth: 109,
    resizable: false,
    headerTooltip: "Description",
  },
];
export const CMSColumns = [
  {
    field: "cptMod",
    headerName: "CPT MOD",
    minWidth: 109,
    headerTooltip: "CPT MOD",
  },

  {
    field: "description",
    headerName: "Description",
    minWidth: 109,
    resizable: false,
    headerTooltip: "Description",
  },
];

export function ProcsColumns(actionHeader, customheader) {
  return [
    {
      field: "cptFrom",
      headerName: "CPT FROM",
      minWidth: 90,
      headerTooltip: "CPT FROM",
    },
    {
      field: "cptTo",
      headerName: "CPT To",
      minWidth: 90,
      headerTooltip: "CPT To",
    },
    {
      field: "mod1",
      headerName: "Mod1",
      minWidth: 83,
      headerTooltip: "Mod1",
    },
    {
      field: "mod2",
      headerName: "Mod2",
      minWidth: 83,
      headerTooltip: "Mod2",
    },
    {
      field: "mod3",
      headerName: "Mod3",
      minWidth: 83,
      headerTooltip: "Mod3",
    },
    {
      field: "daysLo",
      headerName: "Look Back Start",
      minWidth: 80,
      headerTooltip: "Look Back Start",
    },
    {
      field: "daysHi",
      headerName: "Look Back End",
      minWidth: 80,
      headerTooltip: "Look Back End",
    },
    {
      field: "revFrom",
      headerName: "Rev From",
      minWidth: 100,
      headerTooltip: "Rev From",
    },
    {
      field: "revTo",
      headerName: "Rev To",
      minWidth: 90,
      headerTooltip: "Rev To",
    },
    {
      field: "pos",
      headerName: "POS",
      minWidth: 80,
      headerTooltip: "POS",
    },
    {
      field: "dosFrom",
      headerName: "DOS From",
      minWidth: 100,
      headerTooltip: "DOS From",
      cellRenderer: (data) => {
        return data.value ? data.value : "";
      },
    },
    {
      field: "dosTo",
      headerName: "DOS To",
      minWidth: 100,
      headerTooltip: "DOS To",
      cellRenderer: (data) => {
        return data.value ? data.value : "";
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      minWidth: 90,
      headerTooltip: actionHeader(),
    },

    {
      field: "exclusion",
      headerTooltip: "Exclusion",
      headerName: "Exclusion",
      minWidth: 90,

      cellStyle: (isFlag) =>
        isFlag.value == "1"
          ? { "pointer-events": "none" }
          : { "pointer-events": "none" },

      cellRenderer: (data) => {
        return (
          <>
            {/* {data.value ? ( */}
            <input
              type="checkbox"
              disabled
              checked={data.value == 1 ? true : false}
            />
            {/* ) : undefined} */}
          </>
        );
      },
    },
    {
      field: "dxLink",
      headerTooltip: "Dx",
      headerName: "Dx",
      minWidth: 70,
      cellStyle: (isFlag) =>
        isFlag.value == "1"
          ? { "pointer-events": "none" }
          : { "pointer-events": "none" },

      cellRenderer: (data) => {
        return (
          <>
            {/* {data.value ? ( */}
            <input
              type="checkbox"
              disabled
              checked={data.value == 1 ? true : false}
            />
            {/* ) : undefined} */}
          </>
        );
      },
    },
    {
      field: "claimLink",
      headerName: "Clm Link",
      minWidth: 100,
      resizable: false,
      headerTooltip: customheader(),
      cellRenderer: (cellValues) => {
        return (
          <>
            {cellValues.data ? (
              <span
                title={`${
                  cellValues.data?.claimLinkKey +
                  " - " +
                  cellValues.data?.claimDesc
                }`}
              >{`${cellValues.data?.claimLink}`}</span>
            ) : undefined}
          </>
        );
      },
      tooltipValueGetter: (params) => {
        return params.data
          ? `${params.data?.claimLinkKey} - ${params.data?.claimDesc}`
          : "";
      },
    },
  ];
}

export const Changescolumns = [
  {
    field: "jiraId",
    headerName: "Jira Id",
    minWidth: 90,
    headerTooltip: "Jira Id",
  },
  {
    field: "jiraDesc",
    headerName: "Jira Desc",
    minWidth: 90,
    headerTooltip: "Jira Desc",
    cellRenderer: (cellValues) => {
      return (
        <span
          title={`${cellValues.data.jiraDesc}`}
        >{`${cellValues.data.jiraDesc}`}</span>
      );
    },
  },
  {
    field: "jiraLink",
    headerName: "Jira Link",
    minWidth: 90,
    headerTooltip: "Jira Link",
    cellRenderer: (cellValues) => {
      return (
        <span
          title={`${cellValues.data.jiraLink}`}
        >{`${cellValues.data.jiraLink}`}</span>
      );
    },
  },
  {
    field: "userId",
    headerName: "User Id",
    minWidth: 90,
    headerTooltip: "User Id",
    cellRenderer: (cellValues) => {
      return (
        <span
          title={`${cellValues.data.userId}`}
        >{`${cellValues.data.userId}`}</span>
      );
    },
  },
  {
    field: "updatedOn",
    headerName: "Updated On",
    minWidth: 90,
    headerTooltip: "Updated On",
    cellRenderer: (cellValues) =>
      Moment(cellValues.data.updatedOn).format("MM-DD-YYYY hh:mm:ss"),
  },
];

export const taxonomyColumnDefs = (params) => {
  return [
    {
      field: "taxonomyCode",
      headerName: "Taxonomy Code",
      minWidth: 100,
      headerTooltip: "Taxonomy Code",
      checkboxSelection: true,
      headerCheckboxSelection: params == 0 ? false : true,
    },
    {
      field: "specCode",
      headerName: "Spec Code",
      minWidth: 100,
      headerTooltip: "Spec Code",
    },
    {
      field: "subspecCode",
      headerName: "Sub Spec Code",
      minWidth: 100,
      headerTooltip: "Sub Spec Code",
    },
    {
      field: "subspecDesc",
      headerName: "Sub Spec Desc",
      minWidth: 100,
      headerTooltip: "Sub Spec Desc",
    },
  ];
};

export function taxonomyTabColumns(
  setAddPopUp,
  setIsEdit,
  taxonomy,
  setTaxonomy,
  fromViewPolicy,
  setIsAdd
) {
  return [
    {
      headerName: "Client Code",
      field: "clientCode",
      minWidth: 70,
      headerTooltip: "Client Code",
      checkboxSelection: setIsAdd === false? true:false,
    },
    {
      headerName: "Client Group Code",
      field: "clientGroupCode",
      minWidth: 70,
      headerTooltip: "Client Group Code",
    },
    {
      field: "specCode",
      headerName: "Spec Code",
      minWidth: 70,
      headerTooltip: "Spec Code",
    },
    {
      field: "subspecCode",
      headerName: "Sub Spec Code",
      minWidth: 70,
      headerTooltip: "Sub Spec Code",
    },
    {
      field: "taxonomyCode",
      headerName: "Taxonomy Code",
      minWidth: 100,
      headerTooltip: "Taxonomy Code",
    },
    {
      field: "function",
      headerName: "Function",
      minWidth: 100,
      headerTooltip: "Function",
    },
    {
      field: "createdDate",
      headerName: "Create Date",
      minWidth: 100,
      headerTooltip: "Create Date",
    },
    {
      field: "updatedDate",
      headerName: "Update Date",
      minWidth: 100,
      headerTooltip: "Update Date",
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      headerTooltip: "Action",
      cellRenderer: (row) => {
        return (
          <>
            <RadioButton
              checked={true}
              label={row.data.action === "Active" ? "Active" : "Deactivated"}
              fromPropsColor={row.data.action === "Active" ? "green" : "red"}
            />
            {row.data.action === "Active" &&
            row.data.function != "Applies To" ? (
              <MoreHorizIcon
                sx={{ fontSize: 20 }}
                onClick={() => {
                  setAddPopUp(true);
                  setIsEdit(true);
                  setIsAdd(false);
                  setTaxonomy({
                    ...taxonomy,
                    clientCode: row.data.clientCode,
                    clientGroupCode: {
                      label: row.data.clientGroupCode,
                      value: row.data.clientGroupCode,
                    },
                    specCode: row.data.specCode,
                    subSpecCode: row.data.subSpecCode,
                    taxonomyCode: row.data.taxonomyCode,
                    function: row.data.function,
                    taxonomyKey: row.data.taxonomyKey,
                    createdDate: row.data.createdDate,
                    updatedDate: row.data.updatedDate,
                    subSpecDesc: row.data.subSpecDesc,
                    action: row.data.action,
                    clientGroupId: row.data.clientGroupId,
                  });
                  // setTaxonomy(row.data)
                }}
                style={{
                  pointerEvents: fromViewPolicy ? "none" : "auto",
                }}
              />
            ) : undefined}
          </>
        );
      },
    },
  ];
}

const transformData = (data: any, transformType) => {
  const baseData =
    transformType == "npi"
      ? { npiKey: data.npiKey || "", npi: data.npi || "" }
      : { taxId: data.taxId || "" };
  return {
    ...baseData,
    clientCode: data.client || "",
    claimType: Array.isArray(data.claimType)
      ? data.claimType.map((item: any) => ({
          label: item.label || "",
          value: item.value || "",
        }))
      : typeof data.claimType === "string" && data.claimType.includes(",")
      ? data.claimType.split(",").map((item: string) => ({
          label: item.trim(),
          value: item.trim(),
        }))
      : [{ label: data.claimType, value: data.claimType }],
    clientGroupCode:
      typeof data.clientGroupCode === "string"
        ? { label: data.clientGroupCode, value: data.clientGroupId }
        : data.clientGroupCode,
    clientGroupId: data.clientGroupId,
    createdDate: moment(data.createdDate).format("YYYY-MM-DD"),
    deletedB: data.deletedB,
    lob: Array.isArray(data.lob)
      ? data.lob.map((item: any) => ({
          label: item.name || "",
          value: item.value || "",
        }))
      : [{ label: data.lob, value: data.lob }],

    updatedDate: moment(data.updatedDate).format("YYYY-MM-DD"),
  };
};

export const taxIdColumns = (
  setDeactivate: (value: boolean) => void,
  setTaxIdState: (value: any) => void,
  fromViewPolicy
) => [
  {
    field: "client",
    headerName: "Client Code",
    minWidth: 100,
    headerTooltip: "Client Code",
  },
  {
    field: "clientGroupId",
    headerName: "Client Group ID",
    minWidth: 100,
    headerTooltip: "Client Group ID",
  },
  {
    field: "lob",
    headerName: "LOB",
    minWidth: 60,
    headerTooltip: "LOB",
    cellRenderer: (cellValues) => {
      return (
        <span title={`${cellValues.data.lob}`}>{`${cellValues.data.lob}`}</span>
      );
    },
  },
  {
    field: "claimType",
    headerName: "Claim Type",
    minWidth: 70,
    headerTooltip: "Claim Type",
  },
  {
    field: "taxId",
    headerName: "Tax ID",
    minWidth: 100,
    headerTooltip: "Tax Id",
  },
  {
    field: "createdDate",
    headerName: " Create Date",
    minWidth: 100,
    headerTooltip: "Create Date",
  },
  {
    field: "updatedDate",
    headerName: " Update Date",
    minWidth: 100,
    headerTooltip: "Update Date",
  },
  {
    field: "deletedB",
    headerName: "Action",
    minWidth: 100,
    headerTooltip: "Action",
    cellRenderer: (row) => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <RadioButton
            checked={true}
            label={row.data.deletedB === "Active" ? "Active" : "Deactivated"}
            fromPropsColor={row.data.deletedB === "Active" ? "green" : "red"}
          />
          {row.data.deletedB !== "Deactivated" && (
            <InputAdornment
              position="end"
              onClick={() => {
                setDeactivate(true);
                const updatedData = {
                  ...row.data,
                  jiraId: undefined,
                  jiraDescription: undefined,
                };

                // Transform data to match taxIdState format
                const formattedData = transformData(updatedData, "taxId");

                // Update state with transformed data
                setTaxIdState(formattedData);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                pointerEvents: fromViewPolicy ? "none" : "auto",
              }}
            >
              <MoreHoriz
                style={{
                  fontSize: 15,
                  color: "black",
                }}
              />
            </InputAdornment>
          )}
        </div>
      );
    },
  },
];

export const NPIColumns = (
  setDeactivate: (value: boolean) => void,
  setNPIState: (value: any) => void,
  fromViewPolicy
) => [
  {
    field: "client",
    headerName: "Client Code",
    minWidth: 100,
    headerTooltip: "Client Code",
  },
  {
    field: "clientGroupId",
    headerName: "Client Group ID",
    minWidth: 100,
    headerTooltip: "Client Group ID",
  },
  {
    field: "lob",
    headerName: "LOB",
    minWidth: 60,
    headerTooltip: "LOB",
    cellRenderer: (cellValues) => {
      return (
        <span title={`${cellValues.data.lob}`}>{`${cellValues.data.lob}`}</span>
      );
    },
  },
  {
    field: "claimType",
    headerName: "Claim Type",
    minWidth: 70,
    headerTooltip: "Claim Type",
  },
  {
    field: "npi",
    headerName: "NPI",
    minWidth: 100,
    headerTooltip: "NPI",
  },
  {
    field: "createdDate",
    headerName: " Create Date",
    minWidth: 100,
    headerTooltip: "Create Date",
  },
  {
    field: "updatedDate",
    headerName: " Update Date",
    minWidth: 100,
    headerTooltip: "Update Date",
  },
  {
    field: "deletedB",
    headerName: "Action",
    minWidth: 100,
    headerTooltip: "Action",
    cellRenderer: (row) => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <RadioButton
            checked={true}
            label={row.data.deletedB === "Active" ? "Active" : "Deactivated"}
            fromPropsColor={row.data.deletedB === "Active" ? "green" : "red"}
          />
          {row.data.deletedB !== "Deactivated" && (
            <InputAdornment
              position="end"
              onClick={() => {
                setDeactivate(true);
                const updatedData = {
                  ...row.data,
                  jiraId: undefined,
                  jiraDescription: undefined,
                };

                // Transform data to match taxIdState format
                const formattedData = transformData(updatedData, "npi");

                // Update state with transformed data
                setNPIState(formattedData);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                pointerEvents: fromViewPolicy ? "none" : "auto",
              }}
            >
              <MoreHoriz
                style={{
                  fontSize: 15,
                  color: "black",
                }}
              />
            </InputAdornment>
          )}
        </div>
      );
    },
  },
];

import Moment from "moment";
import { batch, useDispatch, useSelector } from "react-redux";
import { navyColor } from "../../assets/jss/material-kit-react";
import { getAllClaimType } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";

import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { Dispatch } from "../../redux/store";
import StarIcon from "@mui/icons-material/Star";
import {
  MedicalPolicyLKPColumns,
  PolicyCatLKPColumns,
  ReasonLKPColumns,
  SubPolicyLKPColumns,
} from "./Columns";
import { PolicyConstants } from "./PolicyConst";
import {
  BILL_TYPE_RESET,
  CAT_RESET,
  CLIENT_ASSIGNMENT_FIELDS,
  GET_PROCS,
  POLICY_BILL_TYPE_DATA,
  POLICY_CONDITION_TYPE_DATA,
  RESET_CONDITION_CODE_FIELDS,
  RESET_DESCRIPTION_TAB_FIELDS,
  RESET_DETAILS_TAB_FIELDS,
  RESET_NPI_FIELDS,
  RESET_POLICY_FILEDS,
  RESET_STATE,
  RESET_TAX_ID_FIELDS,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  GET_ACTIVE_CLIENT_DATA,
  GET_CLIENT_ASSIGNMENT_DATA,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NEW_POLICY_CREATE_ARRAY } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NavigateFunction } from "react-router-dom";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { TabPanel } from "@material-ui/lab";
import { GET_TAXONOMY_DATA } from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpTypes";
import {
  DETAILS_TAB_FIELDS,
  POLICY_FIELDS,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import { validateNewPolicyForm } from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import {
  getCAT,
  getMedicalPolicy,
  getReasonCodes,
  getSubPolicy,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { DetailsTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DetailsTabFieldsReducer";
import { DescriptionTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import { changesTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { BillTypeState } from "../../redux/reducers/NewPolicyTabReducers/BillTypeReducer";
import { conditionCodeTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ConditionCodeTabFieldsReducer";
import { policy } from "../Claims/ClaimHeaderNames";
import { getClientAssignmentData } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { batchDispatch } from "../../redux/ApiCallAction/ApiCallAction";

const _ = require("lodash");

  export function populateCategoryFields(policyFields,catState) {
    const categoryFields = {};
    switch (policyFields.catCode) {
      case 32:
        categoryFields["units"] = catState.units;
        categoryFields["frequency"] = catState.frequency;
        categoryFields["duration"] = catState.duration;
        // categoryFields["ranking"] = catState.ranking;
        // categoryFields["payment"] = catState.payment;
        categoryFields["durationDropdown"] = catState.durationDropdown;
        break;
      case 25:
        categoryFields["bwTypeKey"] = catState.bwTypeKey;
        break;
      case 20:
        categoryFields["changeModifierKey"] = catState.changeModifierKey;
        categoryFields["modifierPayPercentage"] =
          catState.modifierPayPercentage;
        break;
      case 35:
        categoryFields["maxUnitsType"] = catState.maxUnitsType;
        categoryFields["modIntractionType"] = catState.modIntractionType;
        break;
      case 23:
        categoryFields["ccikey"] = catState.ccikey;
        categoryFields["byPassMod"] = catState.byPassMod;
        categoryFields["mutuallyExclusive"] = catState.mutuallyExclusive;
        categoryFields["denyType"] = catState.denyType;
        break;
      case 12:
        categoryFields["lineOrHeaderOrPrincipal"] =
          catState.lineOrHeaderOrPrincipal;
        break;
      case 38:
        categoryFields["billedWith"] = catState.billedWith;
        break;
        case 45:
        case 46:
          categoryFields["modifierPayPercentage"] = catState.modifierPayPercentage;
          break;
      case 49:
        categoryFields["modifierPriority"] = catState.modifierPriority?.value;
        break;
      default:
        break;
    }
    return categoryFields;
  }

export const updatePrevDescriptions = (
  policyFields: NewPolicyFormFieldState,
  updatedState: NewPolicyState,
  dispatch: Dispatch,
  selectedLkp
) => {
  const dispatchActions = [];

  const shouldDispatch = (type, payloadKey, value) => {
    if (value !== policyFields[payloadKey]) {
      dispatchActions.push({ type, payload: { [payloadKey]: value } });
    }
  };

  if (selectedLkp === PolicyConstants.POLICY_CAT_LKP) {
    const catIndex = updatedState.CAT?.findIndex(
      (c) => c.policyCategoryLkpId === policyFields.catCode
    );
    if (catIndex !== -1)
      shouldDispatch(POLICY_FIELDS, "catCodeCheck", catIndex);
  }

  if (selectedLkp === PolicyConstants.REASON_CODE_LKP) {
    const reasonIndex = updatedState.RSN?.findIndex(
      (rs) => rs.reasonCode === policyFields.reasonCode
    );
    if (reasonIndex !== -1)
      shouldDispatch(POLICY_FIELDS, "reasonCodeCheck", reasonIndex);
  }

  if (selectedLkp === PolicyConstants.MEDICAL_POLICY_LKP) {
    const medicalIndex = updatedState.MedicalPolicy?.findIndex(
      (c) => c.medicalPolicyKey === policyFields.medicalPolicyCode
    );
    if (medicalIndex !== -1)
      shouldDispatch(POLICY_FIELDS, "medicalPolicyCode", medicalIndex);
  }

  if (selectedLkp === PolicyConstants.SUB_POLICY_LKP) {
    const subPolicyIndex = updatedState.SubPolicy?.findIndex(
      (c) => c.subPolicyKey === policyFields.subPolicyCode
    );
    if (subPolicyIndex !== -1)
      shouldDispatch(POLICY_FIELDS, "subCodeCheck", subPolicyIndex);
  }
  if (dispatchActions.length > 0) {
    // batch(() => dispatchActions.forEach((action) => dispatch(action)));
    batchDispatch(dispatch,dispatchActions)
  }
};

export const updatePrevDescriptionsForDetailsTab = (
  detailsFields: DetailsTabFieldState,
  updatedState: NewPolicyState,
  dispatch: Dispatch,
  selectedLkp
) => {
  const shouldDispatch = (type, payloadKey, value) => {
    if (value !== detailsFields[payloadKey]) {
      dispatchActions.push({ type, payload: { [payloadKey]: value } });
    }
  };
  const dispatchActions = [];
  if (selectedLkp === PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
    const enfoCatIndex = updatedState.CAT?.findIndex(
      (c) => c.policyCategoryLkpId === detailsFields.enforceBeforeCategory
    );
    if (enfoCatIndex !== -1)
      shouldDispatch(DETAILS_TAB_FIELDS, "enfoCatCheck", enfoCatIndex);
  }
  if (selectedLkp === PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
    const minAgeIndex = updatedState.minAge?.findIndex(
      (c) => c.minMaxAgeLkpId === detailsFields.procedureMinAge
    );
    if (minAgeIndex !== -1)
      shouldDispatch(DETAILS_TAB_FIELDS, "procedureMinAgeIdCheck", minAgeIndex);
  }
  if (selectedLkp === PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
    const maxAgeIndex = updatedState.maxAge?.findIndex(
      (c) => c.minMaxAgeLkpId === detailsFields.procedureMaxAge
    );
    if (maxAgeIndex !== -1)
      shouldDispatch(DETAILS_TAB_FIELDS, "procedureMaxAgeIdCheck", maxAgeIndex);
  }
  if (dispatchActions.length > 0) {
    // batch(() => dispatchActions.forEach((action) => dispatch(action)));
    batchDispatch(dispatch,dispatchActions)

  }
};

function showError(message) {
  CustomSwal("error", message, navyColor, "OK", "");
}

function showInfo(message) {
  CustomSwal("info", message, navyColor, "OK", "");
}




export const fetchVersions = (
  updatedState: NewPolicyState,
  dispatch: Dispatch
) => {
  if (updatedState.RSN.length === 0) {
    getReasonCodes(dispatch);
  }
  if (updatedState.CAT.length === 0) {
    getCAT(dispatch);
  }
  if (updatedState.MedicalPolicy.length === 0) {
    getMedicalPolicy(dispatch);
  }
  if (updatedState.SubPolicy.length === 0) {
    getSubPolicy(dispatch);
  }
  if (updatedState.getClaimTypes.length === 0) {
    getAllClaimType(dispatch);
  }
};

export const handleNewPolicyTabErrors = (
  newPolicy: boolean,
  edit: boolean,
  policyFieldState: NewPolicyFormFieldState,
  DescFieldState: DescriptionTabFieldState,
  DetailsFieldState: DetailsTabFieldState,
  CategoryFieldState: CategoryState,
  ChangesFieldState: changesTabFieldState,
  BillTypeFieldState: BillTypeState,
  conditionCodeFieldState: conditionCodeTabFieldState,
  cat: number,
  setPolicyFieldErr: React.Dispatch<React.SetStateAction<boolean>>,
  setDescTabErr: React.Dispatch<React.SetStateAction<boolean>>,
  setPropErr: React.Dispatch<React.SetStateAction<boolean>>,
  setCatTabErr: React.Dispatch<React.SetStateAction<boolean>>,
  setChangeErr: React.Dispatch<React.SetStateAction<boolean>>,
  setBillTypeTabError: React.Dispatch<React.SetStateAction<boolean>>,
  setConditionTabError: React.Dispatch<React.SetStateAction<boolean>>,
  showAllErrors: boolean,

) => {
  const checkFields = (fields: string[], state: any) =>
    fields.some((field) => {
      const value = state[field];
      if (Array.isArray(value)) {
        return value.length === 0; // Check for empty arrays
      }
      if (typeof value === "string") {
        return !value.trim(); // Check for empty/whitespace-only strings
      }
      return value === null || value === undefined; // Check for null/undefined, but allow 0
    });

  const checkDescFieldsLength = () => {
    const fieldsToCheck = [
      { key: "notes", label: "Notes" },
      { key: "policySummary", label: "Policy Summary" },
      { key: "policyExplanation", label: "Policy Explanation" },
    ];

    for (const { key, label } of fieldsToCheck) {
      if (hasDescErrors || DescFieldState[key]?.trim().length > 4000) {
        showError(
          `Please check the length of ${label} (more than 4000 characters)`
        );
        return; // Stop checking further fields
      }
    }

    if (policyFieldState["policyDescription"]?.trim().length > 4000) {
      showError(
        `Please check the length of policyDescription (more than 4000 characters)`
      );
      return; // Stop checking further fields
    }
  };

  const hasPolicyErrors = checkFields(
    [
      "catCode",
      "reasonCode",
      "subPolicyCode",
      "reference",
      "medicalPolicyCode",
      "claimType",
      "policyDescription",
    ],
    policyFieldState
  );

  const hasDescErrors = checkFields(
    [
      "lob",
      "notes",
      "productType",
      "sourceIndicator",
      "policyExplanation",
      "policySummary",
      "referenceSourceDescription",
      "referenceSourceTitleDesc",
    ],
    DescFieldState
  );

  const hasDesclengthErrors = checkDescFieldsLength();

  const hasPropErrors = checkFields(
    [
      "gender",
      "enforceBeforeCategory",
      "priority",
      "procedureMinAge",
      "procedureMaxAge",
      "npi",
      "taxId",
      "taxonomy",
      "posLink",
      "revenueCodeClaimLink",
      "claimTypeLink",
      "cptLink",
    ],
    DetailsFieldState
  );

  const hasCatError = (() => {
    switch (cat) {
      case PolicyConstants.TWENTY_THREE:
        return !CategoryFieldState.ccikey;
      case PolicyConstants.THIRTY_EIGHT:
        return !CategoryFieldState.billedWith;
      case PolicyConstants.TWELVE:
        return !CategoryFieldState.lineOrHeaderOrPrincipal;
      case PolicyConstants.TWENTY_FIVE:
        return !CategoryFieldState.bwTypeKey;
      case PolicyConstants.TWENTY:
        return !CategoryFieldState.changeModifierKey;
      case PolicyConstants.FOURTY_FIVE:
      case PolicyConstants.FOURTY_SIX:
        return !CategoryFieldState.modifierPayPercentage;
      case PolicyConstants.FOURTY_NINE:
        return !CategoryFieldState.modifierPriority;
      case PolicyConstants.THIRTY_FIVE:
        return (
          !CategoryFieldState.maxUnitsType ||
          !CategoryFieldState.modIntractionType
        );
      case PolicyConstants.THIRTY_TWO:
        return (
          !CategoryFieldState.units ||
          !CategoryFieldState.duration ||
          !CategoryFieldState.durationDropdown
        );
      default:
        return false;
    }
  })();

  const hasChangeError = checkFields(
    ["jiraId", "jiraDesc"],
    ChangesFieldState
  );
  const hasBillTypeError = checkFields(
    ["billTypeAction", "billTypeLink"],
    BillTypeFieldState
  );
  const hasConditionError = checkFields(
    ["conditionCodeAction"],
    conditionCodeFieldState
  );

  setDescTabErr(hasDescErrors);
  setPropErr(hasPropErrors);
  setCatTabErr(hasCatError);
  setChangeErr(hasChangeError);
  setBillTypeTabError(hasBillTypeError);
  setConditionTabError(hasConditionError);
  setPolicyFieldErr(hasPolicyErrors);
  if (
    showAllErrors &&
    (hasPolicyErrors ||
      hasDescErrors ||
      hasDesclengthErrors ||
      hasPropErrors ||
      hasCatError ||
      hasBillTypeError ||
      hasConditionError)
  ) {
    CustomSwal("info", "Please fill required fields*", navyColor, "Ok", "");
  }else if(hasChangeError){
    CustomSwal("error", "Please create Jira Ticket.", navyColor, "OK", "");
  }
  else{
    return false;
  }
};

export const updateColumns = (
  lkp: string,
  reasonCodes,
  cats,
  medicalPolicy,
  subPolicy
) => {
  let currentLkpColumns = [];
  let currentRows = [];
  switch (lkp) {
    case PolicyConstants.REASON_CODE_LKP: {
      currentLkpColumns = ReasonLKPColumns;
      currentRows = reasonCodes.map((sp, i) => ({
        id: i,
        reasonCode: sp.reasonCode,
        reasonDesc: sp.reasonDesc,
        challengeCode: sp.challengeCode,
        challengeDesc: sp.challengeDesc,
        pcoCode: sp.pcoCode,
        hipaaCode: sp.hipaaCode,
        hippaDesc: sp.hippaDesc,
        deactivatedB: sp.deactivatedB,
        customB: sp.customB,
      }));
      break;
    }
    case PolicyConstants.POLICY_CAT_LKP: {
      currentLkpColumns = PolicyCatLKPColumns;
      currentRows = cats.map((sp, i) => ({
        id: i,
        policyCategoryLkpId: sp.policyCategoryLkpId,
        priority: sp.priority,
        policyCategoryDesc: sp.policyCategoryDesc,
        lastUpdatedAt: Moment(sp.lastUpdatedAt).format("MM-DD-YYYY hh:mm:ss"),
      }));
      break;
    }
    case PolicyConstants.MEDICAL_POLICY_LKP: {
      currentLkpColumns = MedicalPolicyLKPColumns;
      currentRows = medicalPolicy.map((sp, i) => ({
        id: i,
        medicalPolicykey: sp.medicalPolicyKey,
        medicalPolicyDesc: sp.medicalPolicyDesc,
        lastUpdatedTs: Moment(sp.lastUpdatedTs).format("MM-DD-YYYY hh:mm:ss"),
      }));
      break;
    }
    case PolicyConstants.SUB_POLICY_LKP: {
      currentLkpColumns = SubPolicyLKPColumns;
      currentRows = subPolicy.map((sp, i) => {
        return {
          id: i,
          subPolicyKey: sp.subPolicyKey,
          subPolicyDesc: sp.subPolicyDesc,
          lastUpdatedTs: Moment(sp.lastUpdatedTs).format("MM-DD-YYYY hh:mm:ss"),
        };
      });
      break;
    }
  }
  return [currentLkpColumns, currentRows];
};
export const getCatDesc = (catCode, catData) => {
  if (catCode === undefined || catCode === "" || catCode === null) return "";
  const matchedCategory = catData?.find(
    (c) => c.policyCategoryLkpId === catCode
  );
  return (
    catCode +
    " - " +
    (matchedCategory ? matchedCategory.policyCategoryDesc : "")
  );
};

export const getReasonDesc = (reasonCode, reasonData) => {
  if (reasonCode === undefined || reasonCode === "" || reasonCode === null) return "";
  const matchedReason = reasonData?.find((r) => r.reasonCode === reasonCode);
  return reasonCode + " - " + (matchedReason ? matchedReason.reasonDesc : "");
};

export const getSubPolicyDesc = (subPolicyCode, subPolicyData) => {
  if (subPolicyCode === undefined || subPolicyCode === "" || subPolicyCode === null) return "";
  const matchedSubPolicy = subPolicyData?.find(
    (s) => s.subPolicyKey === subPolicyCode
  );
  return (
    subPolicyCode +
    " - " +
    (matchedSubPolicy ? matchedSubPolicy.subPolicyDesc : "")
  );
};
export const minMaxAgeDesc = (minMaxCode, minMaxData) => {
  if (minMaxCode === undefined || minMaxCode === "" || minMaxCode === null)
    return "";
  const matchedMinMax = minMaxData.find((k) => minMaxCode === k.minMaxAgeLkpId);
  return matchedMinMax ? `${minMaxCode} - ${matchedMinMax.minMaxAgeDesc}` : "";
};

export const getMedicalDesc = (medicalCode, medicalData) => {
  if (medicalCode === undefined || medicalCode === "" || medicalCode === null) return "";
  const matchedMedical = medicalData?.find(
    (m) => m.medicalPolicyKey === medicalCode
  );
  return (
    medicalCode +
    " - " +
    (matchedMedical ? matchedMedical.medicalPolicyDesc : "")
  );
};

export const getProcedureAgeDesc = (procedureCode, procedureAgeData) => {
  if (procedureCode == undefined || procedureCode === "" || procedureCode === null) return;

  const matchedProcedure = procedureAgeData?.find(
    (c) => c.minMaxAgeLkpId === procedureCode
  );

  return (
    procedureCode +
    "-" +
    (matchedProcedure ? matchedProcedure.minMaxAgeDesc : "")
  );
};

export const setCheckboxValues = (
  selectedCheckboxValue,
  selectedLkp,
  edit,
  Fields,
  dispatch: Dispatch
) => {
  const a = _.cloneDeep(selectedCheckboxValue);
  const val = a.length ? a[0] : null;
  const id = val?.id ?? "";
  let dispatchActions = [];
  if (selectedLkp === PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
    const policyCategoryLkpId = val?.policyCategoryLkpId ?? "";
    dispatchActions = [
      { type: DETAILS_TAB_FIELDS, payload: { enfoCatCheck: id } },
      ...(!edit
        ? [
            {
              type: DETAILS_TAB_FIELDS,
              payload: {
                enforceBeforeCategory: policyCategoryLkpId,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.PROCEDURE_MAX_AGE_LKP) {
    const MaxAgeLkpId = val?.minMaxAgeLkpId ?? "";
    dispatchActions = [
      { type: DETAILS_TAB_FIELDS, payload: { procedureMaxAgeIdCheck: id } },
      ...(!edit
        ? [
            {
              type: DETAILS_TAB_FIELDS,
              payload: {
                procedureMaxAge: MaxAgeLkpId,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.PROCEDURE_MIN_AGE_LKP) {
    const minMaxAgeLkpId = val?.minMaxAgeLkpId ?? "";
    dispatchActions = [
      { type: DETAILS_TAB_FIELDS, payload: { procedureMinAgeIdCheck: id } },
      ...(!edit
        ? [
            {
              type: DETAILS_TAB_FIELDS,
              payload: {
                procedureMinAge: minMaxAgeLkpId,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.POLICY_CAT_LKP) {
    const policyCategoryLkpId = val?.policyCategoryLkpId ?? "";
    dispatchActions = [
      { type: POLICY_FIELDS, payload: { catCodeCheck: id } },
      ...(!edit
        ? [
            {
              type: POLICY_FIELDS,
              payload: {
                catCode: policyCategoryLkpId,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.REASON_CODE_LKP) {
    const reasonCode = val?.reasonCode ?? "";
    dispatchActions = [
      { type: POLICY_FIELDS, payload: { reasonCodeCheck: id } },
      ...(!edit
        ? [
            {
              type: POLICY_FIELDS,
              payload: {
                reasonCode: reasonCode,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.MEDICAL_POLICY_LKP) {
    const medicalPolicykey = val?.medicalPolicykey ?? "";
    dispatchActions = [
      { type: POLICY_FIELDS, payload: { medicalCodeCheck: id } },
      ...(!edit
        ? [
            {
              type: POLICY_FIELDS,
              payload: {
                medicalPolicyCode: medicalPolicykey,
              },
            },
          ]
        : []),
    ];
  } else if (selectedLkp === PolicyConstants.SUB_POLICY_LKP) {
    const subPolicyKey = val?.subPolicyKey ?? "";
    dispatchActions = [
      { type: POLICY_FIELDS, payload: { subCheckCode: id } },
      ...(!edit
        ? [
            {
              type: POLICY_FIELDS,
              payload: {
                subPolicyCode: subPolicyKey,
              },
            },
          ]
        : []),
    ];
  }

  // Dispatch all actions in batch
  // batch(() => dispatchActions.forEach((action) => dispatch(action)));
  batchDispatch(dispatch,dispatchActions)

};

export const displayCatTab = (cat: number) => {
  const validTabs = [
    PolicyConstants.TWENTY_THREE,
    PolicyConstants.THIRTY_EIGHT,
    PolicyConstants.TWELVE,
    PolicyConstants.TWENTY_FIVE,
    PolicyConstants.THIRTY_FIVE,
    PolicyConstants.TWENTY,
    PolicyConstants.FOURTY_FIVE,
    PolicyConstants.FOURTY_SIX,
    PolicyConstants.FOURTY_NINE,
    PolicyConstants.THIRTY_TWO,
  ];
  return validTabs.includes(cat);
};

export const checkCatTab = (cat: number) => {
  return displayCatTab(cat);
};

export const handleNewPolicyTabValidations = (
  cat: number,
  newPolicyTabs: string,
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
  dispatch: Dispatch
) => {
  const validTab = checkCatTab(cat);
  if (!validTab) {
    if (newPolicyTabs === PolicyConstants.CAT_OPT_TAB) {
      dispatch({
        type: POLICY_FIELDS,
        payload: { newPolicyTabs: PolicyConstants.DESC_TAB },
      });
    }
    else {
      setSelectedTab(newPolicyTabs);
    }
  
    const dispatchActions = [
      { type: CAT_RESET}   
    ];
    // batch(() => dispatchActions.forEach((action) => dispatch(action)));
    batchDispatch(dispatch,dispatchActions)

  }
};

export const handleNewPolicyTabChange = (
  cat: number,
  newPolicyTabs: string,
  paths: string,
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
  dispatch: Dispatch
) => {
  if (newPolicyTabs === "") {
    setSelectedTab(PolicyConstants.DESC_TAB);
    dispatch({
      type: POLICY_FIELDS,
      payload: { newPolicyTabs: PolicyConstants.DESC_TAB },
    });
  } else {
    setSelectedTab(newPolicyTabs);
  }
  if (paths === PolicyConstants.EDIT_POLICY) {
    if (newPolicyTabs === PolicyConstants.CAT_OPT_TAB) {
      const validTab = checkCatTab(cat);
      if (!validTab) {
        dispatch({
          type: POLICY_FIELDS,
          payload: { newPolicyTabs: PolicyConstants.DESC_TAB },
        });
        // setSelectedTab(PolicyConstants.DESC_TAB);
      }
    }
  }
};

export const leavePage = (
  showAlert: boolean,
  dispatch: Dispatch,
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>,
  setShowAllErrors:React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  if (showAlert) {
    const actions: any = [
      { type: GET_PROCS, payload: [] },
      { type: NEW_POLICY_CREATE_ARRAY, payload: [] },
      { type: GET_TAXONOMY_DATA, payload: [] },
      { type: RESET_POLICY_FILEDS},
      { type: RESET_DESCRIPTION_TAB_FIELDS },
      { type: RESET_DETAILS_TAB_FIELDS },
      { type: BILL_TYPE_RESET },
      { type: RESET_CONDITION_CODE_FIELDS },
      {type:CAT_RESET},
      {type:CLIENT_ASSIGNMENT_FIELDS,payload:{getClientAssignmentTableData:[]}},
      {type:CLIENT_ASSIGNMENT_FIELDS,payload:{getActiveClientData:[]}},
      {type:RESET_NPI_FIELDS},
      {type:RESET_TAX_ID_FIELDS},

    ];
    // batch(() => {
    //   actions.forEach((k) => dispatch(k));
    // });
    batchDispatch(dispatch,actions)

    setSelectedTab(PolicyConstants.DESC_TAB);
    setShowAlert(false);
    setShowAllErrors(false);
  } else {
    navigate("/");
  }
};

export const validationPrompt = () => {
  CustomSwal("error", "Please create Jira Ticket.", navyColor, "OK", "");
};
export const getTabClass = (isSelected) =>
  isSelected ? "tabStyle selectedTab" : "tabStyle";

export const getTabStyle = (isSelected, navyColor) => ({
  backgroundColor: isSelected ? "white" : navyColor,
  color: isSelected ? navyColor : "white", // Customize colors as needed
  minHeight: "3px",
  marginTop: "-4px",
  minWidth: "3px",
  fontSize: "12px",
  // textTransform:"capitalize"
});
export const getTabLabel = (label, hasError) =>
  hasError ? (
    <span>
      <StarIcon className="Starcon" style={{ fontSize: 9 }} />
      {label}
    </span>
  ) : (
    label
  );

export const TabPanelWrapper = ({ value, children }) => (
  <TabPanel value={value}>{children}</TabPanel>
);
export const isFieldInvalid = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
};

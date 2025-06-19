import { navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import mitKey from "./ViewConfig";
import PendingIcon from "@mui/icons-material/Pending";

import {
  BILL_TYPE_LKP,
  BO_TYPE_LKP,
  BW_TYPE_LKP,
  CCI_DEVIATIONS,
  CCI_LKP,
  CCI_RATIONALE_LKP,
  CONDITION_CODE_LKP,
  MAX_UNITS_LKP,
  MAX_UNITS_TYPES,
  MIN_MAX_AGE_LKP,
  MODIFIER_INTERACTION_LKP,
  MODIFIER_PAY_PERCENTAGE_LKP,
  MODIFIER_PRIORITY_LKP,
  MOD_LKP,
  MUE_RATIONALE_LKP,
  POLICY_CATEGORY_LKP,
  POS_LKP,
  REASON_CODE_LKP,
  REVENUE_CODE_LKP,
  SAME_OR_SIMILAR_CODE_LKP,
  SPECS_LKP,
  SUB_SPEC_LKP,
} from "./LookUpConsts";
import { IconButton } from "@material-ui/core";
import RadioButton from "../../components/RadioButton/RadioButton";
const _ = require("lodash");

export function LookUpColumns(
  selectedLKP,
  columnValues,
  objects,
  Role,
  setSelectedCCIDev,
  setSaveLkpValues,
  rowData
) {
  let columns = [];
  let adminIdx = Role?.toLowerCase().search("admin");

  function rowSpan(params) {
    if (!params?.api || !params.data) return 1; // Ensure API & data exist
    let clientCountMap = new Map();
    let rowData = [];
    // Get only the visible (filtered) rows
    params.api.forEachNodeAfterFilter((node) => rowData.push(node.data));
    // Ensure correct row grouping by maintaining unique keys
    rowData.forEach((row, index) => {
        const combinationKey = `${row.column_i ?? ""}-${row.column_ii ?? ""}-${row.cciKey ?? ""}-${row.cciRationaleKey ?? ""}-${row.allowModB ?? ""}-${row.startDate ?? ""}-${row.endDate ?? ""}`;

      if (!clientCountMap.has(combinationKey)) {
        // Count occurrences in visible (filtered) rows
        let count = rowData.filter(
          (r) =>
            r.column_i === row.column_i &&
            r.column_ii === row.column_ii &&
            r.cciKey === row.cciKey &&
            r.cciRationaleKey === row.cciRationaleKey &&
            r.allowModB === row.allowModB &&
            r.startDate === row.startDate &&
            r.endDate === row.endDate
        ).length;

        clientCountMap.set(combinationKey, { count, firstIndex: index });
      }
    });
    const key = `${params.data.column_i ?? ""}-${params.data.column_ii ?? ""}-${params.data.cciKey ?? ""}-${params.data.cciRationaleKey ?? ""}-${params.data.allowModB ?? ""}-${params.data.startDate ?? ""}-${params.data.endDate ?? ""}`;
    // Ensure only the first row in a group gets the full row span
    return clientCountMap.has(key) && rowData.indexOf(params.data) === clientCountMap.get(key).firstIndex
      ? clientCountMap.get(key).count
      : 1;
  }

  switch (selectedLKP) {
    case SPECS_LKP:
      {
        columns = [
          {
            field: "specCode",
            headerName: "Spec Code",
            minWidth: 109,
            headerTooltip: "Spec Code",
          },
          {
            field: "specDesc",
            headerName: "Spec Desc",
            minWidth: 83,
            headerTooltip: "Spec Desc",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    color: "white",
                    backgroundColor: navyColor,
                    marginTop: -6,
                  }}
                  onClick={(e) => {
                    let obj = _.cloneDeep(columnValues);
                    obj.specCode = row.data.specCode;
                    obj.specDesc = row.data.specDesc;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case SUB_SPEC_LKP:
      {
        columns = [
          {
            field: "specCode",
            headerName: "Spec code",
            minWidth: 109,
            headerTooltip: "Spec Code",
          },
          {
            field: "subSpecCode",
            headerName: "Sub Spec Code",
            minWidth: 83,
            headerTooltip: "Sub Spec Code",
          },
          {
            field: "subSpecDesc",
            headerName: "Sub Spec Desc",
            minWidth: 83,
            flex: 1,
            filter: true,
            sortable: true,
            headerTooltip: "Sub Spec Desc",
          },
          {
            field: "taxonomyCode",
            headerName: "Taxonomy Code",
            minWidth: 83,
            headerTooltip: "Taxonomy Code",
          },
          {
            field: "cmsSpecialityCode",
            headerName: "CMS Speciality Code",
            minWidth: 83,
            headerTooltip: "CMS Speciality Code",
          },
          {
            field: "miscB",
            headerName: "Misc",
            minWidth: 83,
            flex: 1,
            filter: true,
            sortable: true,
            headerTooltip: "Misc",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={(e) => {
                    let obj = _.cloneDeep(columnValues);
                    obj.specCode = row.data.specCode;
                    obj.subSpecCode = row.data.subSpecCode;
                    obj.subSpecDesc = row.data.subSpecDesc;
                    obj.taxonomyCode = row.data.taxonomyCode;
                    obj.cmsSpecialityCode = row.data.cmsSpecialityCode;
                    obj.deletedB = row.data.deletedB;
                    obj.miscB = row.data.miscB == "NO" ? 0 : 1;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MIN_MAX_AGE_LKP:
      {
        columns = [
          {
            field: "minMaxAgeDesc",
            headerName: "Min Max Age Desc",
            minWidth: 109,
            headerTooltip: "Min Max Age Desc",
          },
          {
            field: "ageYears",
            headerName: "Age Years",
            minWidth: 83,
            headerTooltip: "Age Years",
          },
          {
            field: "ageMonths",
            headerName: "Age Months",
            minWidth: 83,
            headerTooltip: "Age Months",
          },
          {
            field: "ageDays",
            headerName: "Age Days",
            minWidth: 83,
            headerTooltip: "Age Days",
          },
          {
            field: "equals",
            headerName: "Equals",
            minWidth: 83,
            headerTooltip: "Equals",
          },
          {
            field: "minVsMax",
            headerName: "Min Vs Max",
            minWidth: 83,
            headerTooltip: "Min Vs Max",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.minMaxAgeLkpId = row.data.minMaxAgeLkpId;
                    obj.minMaxAgeDesc = row.data.minMaxAgeDesc;
                    obj.ageYears = row.data.ageYears;
                    obj.ageMonths = row.data.ageMonths;
                    obj.ageDays = row.data.ageDays;
                    obj.equalsB = row.data.equals == "NO" ? 0 : 1;
                    obj.minVsMaxB = row.data.minVsMax == "NO" ? 0 : 1;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MODIFIER_INTERACTION_LKP:
      {
        columns = [
          {
            field: "mitKey",
            headerName: "MIT Key",
            minWidth: 109,
            headerTooltip: "MIT Key",
          },
          {
            field: "modifier",
            headerName: "Modifier",
            minWidth: 109,
            headerTooltip: "Modifier",
          },
          {
            field: "editsOffSameModifier",
            headerName: "Edits Off Same Modifier",
            minWidth: 109,
            headerTooltip: "Edits Off Same Modifier",
          },
          {
            field: "editsOffOtherModifier",
            headerName: "Edits Off Other Modifier",
            minWidth: 109,
            headerTooltip: "Edits Off Other Modifier",
          },
          {
            field: "editsOffBlankModifier",
            headerName: "Edits Off Blank Modifier",
            minWidth: 109,
            headerTooltip: "Edits Off Blank Modifier",
          },
          {
            field: "otherEditsOffThisModifier",
            headerName: "Other Edits Off This Modifier",
            minWidth: 109,
            headerTooltip: "Other Edits Off This Modifier",
          },
          {
            field: "blankEditsOffThisModifier",
            headerName: "Blank Edits Off This Modifier",
            minWidth: 109,
            headerTooltip: "Blank Edits Off This Modifier",
          },
          {
            field: "modifierException",
            headerName: "Modifier Exception",
            minWidth: 109,
            headerTooltip: "Modifier Exception",
          },
        ];
      }
      break;
    case REVENUE_CODE_LKP:
      {
        columns = [
          {
            field: "revCode",
            headerName: "Rev Code",
            minWidth: 109,
            headerTooltip: "Rev Code",
          },
          {
            field: "revDesc",
            headerName: "Rev Desc",
            minWidth: 83,
            headerTooltip: "Rev Desc",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.revCode = row.data.revCode;
                    obj.revDesc = row.data.revDesc;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case BILL_TYPE_LKP:
      {
        columns = [
          {
            field: "billType",
            headerName: "Bill Type",
            minWidth: 109,
            headerTooltip: "Bill Type",
          },
          {
            field: "billTypeDesc",
            headerName: "Bill Type Desc",
            minWidth: 83,
            headerTooltip: "Bill Type Desc",
          },
          {
            field: "Inpatient",
            headerName: "Inpatient",
            minWidth: 83,
            headerTooltip: "Inpatient",
          },
          {
            field: "startDate",
            headerName: "Start Date",
            minWidth: 83,
            headerTooltip: "Start Date",
          },
          {
            field: "endDate",
            headerName: "End Date",
            minWidth: 83,
            headerTooltip: "End Date",
          },
          {
            field: "claimTypeMatch",
            headerName: "Claim Type Match",
            minWidth: 83,
            headerTooltip: "Claim Type Match",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.billType = row.data.billType;
                    obj.billTypeDesc = row.data.billTypeDesc;
                    obj.inpatientB = row.data.Inpatient == "NO" ? 0 : 1;
                    obj.claimTypeMatch = row.data.claimTypeMatch;
                    obj.startDate = row.data.startDate;
                    obj.endDate = row.data.endDate;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case CONDITION_CODE_LKP:
      {
        columns = [
          {
            field: "condCode",
            headerName: "Cond Code",
            minWidth: 109,
            headerTooltip: "Cond Code",
          },
          {
            field: "condDesc",
            headerName: "Cond Desc",
            minWidth: 83,
            headerTooltip: "Cond Desc",
          },
          {
            field: "startDate",
            headerName: "Start Date",
            minWidth: 83,
            headerTooltip: "Start Date",
          },
          {
            field: "endDate",
            headerName: "End Date",
            minWidth: 83,
            headerTooltip: "End Date",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.condId = row.data.id;
                    obj.condCode = row.data.condCode;
                    obj.condDesc = row.data.condDesc;
                    obj.startDate = row.data.startDate;
                    obj.endDate = row.data.endDate;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MAX_UNITS_LKP:
      {
        columns = [
          {
            field: "maxUnitsLkpKey",
            headerName: "Max Unit Lookup Key ",
            minWidth: 109,
            headerTooltip: "Max Unit Lookup Key",
          },
          {
            field: "description",
            headerName: "Description",
            minWidth: 83,
            headerTooltip: "Description",
          },
          {
            field: "comments",
            headerName: "Comments",
            minWidth: 83,
            headerTooltip: "Comments",
          },
          {
            field: "maxUnitsTypeKey",
            headerName: "Max Unit Type Key",
            minWidth: 83,
            headerTooltip: "Max Unit Type Key",
          },
          {
            field: "custom",
            headerName: "Custom",
            minWidth: 83,
            headerTooltip: "Custom"
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.maxUnitsLkpKey = row.data.maxUnitsLkpKey;
                    obj.maxUnitsTypeKey = row.data.maxUnitsTypeKey;
                    obj.description = row.data.description;
                    obj.comments = row.data.comments;
                    obj.custom = row.data.custom == "No" ? 0 : 1;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MOD_LKP:
      {
        columns = [
          {
            field: "cptMod",
            headerName: "CPT MOD",
            minWidth: 109,
            headerTooltip: "CPT MOD",
          },
          {
            field: "description",
            headerName: "Description",
            minWidth: 83,
            headerTooltip: "Description",
          },
          {
            field: "ambulanceMod",
            headerName: "Ambulance MOD",
            minWidth: 83,
            headerTooltip: "Ambulance MOD",
          },
          {
            field: "isCci",
            headerName: "Is CCI ?",
            minWidth: 83,
            headerTooltip: "Is CCI ?",
          },
          {
            field: "is_59_group",
            headerName: "Is 59 Group ?",
            minWidth: 83,
            headerTooltip: "Is 59 Group ?",
          },
          {
            field: "startDate",
            headerName: "Start Date",
            minWidth: 83,
            headerTooltip: "Start Date",
          },
          {
            field: "endDate",
            headerName: "End Date",
            minWidth: 83,
            headerTooltip: "End Date",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.cptMod = row.data.cptMod;
                    obj.description = row.data.description;
                    obj.ambulanceModB = row.data.ambulanceMod == "NO" ? 0 : 1;
                    obj.isCci = row.data.isCci == "NO" ? 0 : 1;
                    obj.is_59_group = row.data.is_59_group == "NO" ? 0 : 1;
                    obj.startDate = row.data.startDate;
                    obj.endDate = row.data.endDate;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case POS_LKP:
      {
        columns = [
          {
            field: "posCode",
            headerName: "POS Code",
            minWidth: 109,
            headerTooltip: "POS Code",
          },
          {
            field: "posName",
            headerName: "POS Name",
            minWidth: 83,
            headerTooltip: "POS Name",
          },
          {
            field: "posDesc",
            headerName: "POS Desc",
            minWidth: 83,
            headerTooltip: "POS Desc",
          },
          {
            field: "facility",
            headerName: " Facility",
            minWidth: 83,
            headerTooltip: "Facility",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.posCode = row.data.posCode;
                    obj.posName = row.data.posName;
                    obj.posDesc = row.data.posDesc;
                    obj.facilityB = row.data.facility == "NO" ? 0 : 1;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case POLICY_CATEGORY_LKP:
      {
        columns = [
          {
            field: "policyCategoryDesc",
            headerName: "Policy Category Desc",
            minWidth: 109,
            headerTooltip: "Policy Category Desc",
          },
          {
            field: "priority",
            headerName: "Order of Operation",
            minWidth: 83,
            headerTooltip: "Priority",
          },
          {
            field: "lastUpdatedAt",
            headerName: " Last Updated At",
            minWidth: 83,
            headerTooltip: "Last Updated At",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.policyCategoryLkpId = row.data.policyCategoryLkpId;
                    obj.policyCategoryDesc = row.data.policyCategoryDesc;
                    obj.priority = row.data.priority;
                    obj.hardDenialB = row.data.hardDenial == "NO" ? 0 : 1;
                    obj.lastUpdatedAt = row.data.lastUpdatedAt;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case REASON_CODE_LKP:
      {
        columns = [
          {
            field: "reasonCode",
            headerName: "Reason Code",
            minWidth: 109,
            headerTooltip: "Reason Code",
          },
          {
            field: "reasonDesc",
            headerName: "Reason Desc",
            minWidth: 83,
            headerTooltip: "Reason Desc",
          },
          {
            field: "ChallengeCode",
            headerName: "Challenge Code",
            minWidth: 83,
            headerTooltip: "Challenge Code",
          },
          {
            field: "ChallengeDesc",
            headerName: "Challenge Desc",
            minWidth: 83,
            headerTooltip: "Challenge Desc",
          },
          {
            field: "PCOCode",
            headerName: "PCO Code",
            minWidth: 83,
            headerTooltip: "PCO Code",
          },
          {
            field: "HIPAACode",
            headerName: "HIPAA Code",
            minWidth: 83,
            headerTooltip: "HIPAA Code",
          },
          {
            field: "HIPAADesc",
            headerName: "HIPAA Desc",
            minWidth: 83,
            headerTooltip: "HIPAA Desc",
          },
          {
            field: "deactivated",
            headerName: "Deactivated",
            minWidth: 83,
            headerTooltip: "Deactivated",
          },
          {
            field: "custom",
            headerName: "Custom",
            minWidth: 83,
            headerTooltip: "Custom",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.reasonCode = row.data.reasonCode;
                    obj.reasonDesc = row.data.reasonDesc;
                    obj.pcoCode = row.data.PCOCode;
                    obj.hipaaCode = row.data.HIPAACode;
                    obj.hippaDesc = row.data.HIPAADesc;
                    obj.challengeCode = row.data.ChallengeCode;
                    obj.challengeDesc = row.data.ChallengeDesc;
                    obj.deactivatedb = row.data.deactivated == "NO" ? 0 : 1;
                    obj.customb = row.data.custom == "NO" ? 0 : 1;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case CCI_RATIONALE_LKP:
      {
        columns = [
          {
            field: "cciRationaleKey",
            headerName: "CCI Rationale Key",
            minWidth: 109,
            headerTooltip: "CCI Rationale Key",
          },
          {
            field: "cmsCciRationale",
            headerName: "CMS CCI Rationale",
            minWidth: 83,
            headerTooltip: "CMS CCI Rationale",
          },
          {
            field: "cciRationaleDesc",
            headerName: "CCI Rationale Desc",
            minWidth: 83,
            headerTooltip: "CCI Rationale Desc",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.cciRationaleKey = row.data.cciRationaleKey;
                    obj.cmsCciRationale = row.data.cmsCciRationale;
                    obj.cciRationaleDesc = row.data.cciRationaleDesc;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case CCI_LKP:
      {
        columns = [
          {
            field: "cciKey",
            headerName: "CCI Key",
            minWidth: 109,
            headerTooltip: "CCI Key",
          },
          {
            field: "cciDesc",
            headerName: "CCI Desc",
            minWidth: 83,
            headerTooltip: "CCI Desc",
          },
          {
            field: "cciNotes",
            headerName: "CCI Notes",
            minWidth: 83,
            headerTooltip: "CCI Notes",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.cciKey = row.data.cciKey;
                    obj.cciDesc = row.data.cciDesc;
                    obj.cciNotes = row.data.cciNotes;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MUE_RATIONALE_LKP:
      {
        columns = [
          {
            field: "mueRationalKey",
            headerName: "MUE Rationale Key",
            minWidth: 109,
            headerTooltip: "MUE Rationale Key",
          },
          {
            field: "description",
            headerName: "Description",
            minWidth: 83,
            headerTooltip: "Description",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.mueRationalKey = row.data.mueRationalKey;
                    obj.description = row.data.description;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case BO_TYPE_LKP:
      {
        columns = [
          {
            field: "boKey",
            headerName: "BO Key",
            minWidth: 109,
            headerTooltip: "BO Key",
          },
          {
            field: "boDesc",
            headerName: "BO Desc",
            minWidth: 83,
            headerTooltip: "BO Desc",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.boKey = row.data.boKey;
                    obj.boDesc = row.data.boDesc;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case BW_TYPE_LKP:
      {
        columns = [
          {
            field: "bwTypeKey",
            headerName: "BW Type Key",
            minWidth: 109,
            headerTooltip: "BW Type Key",
          },
          {
            field: "description",
            headerName: "Description",
            minWidth: 83,
            headerTooltip: "Description",
          },
          {
            field: "action",
            headerName: "Action",
            minWidth: 90,
            resizable: false,
            hide: adminIdx < 0 ? true : false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.bwTypeKey = row.data.bwTypeKey;
                    obj.description = row.data.description;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MAX_UNITS_TYPES:
      {
        columns = [
          {
            field: "maxUnitsTypeKey",
            headerName: "Max Units Type Key",
            minWidth: 109,
            headerTooltip: "Max Units Type Key",
          },
          {
            field: "maxUnitsTypeDesc",
            headerName: "Max Unit Type Description",
            minWidth: 83,
            headerTooltip: "Max Unit Type Description",
          },
          {
            field: "action",
            headerName: "Action",
            minWitdh: 90,
            hide: adminIdx < 0 ? true : false,
            resizable: false,
            cellRenderer: (row) => {
              return (
                <CustomButton
                  variant="contained"
                  style={{
                    height: 18,
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor: navyColor,
                    color: "white",
                    marginTop: -6,
                  }}
                  onClick={() => {
                    let obj = _.cloneDeep(columnValues);
                    obj.maxUnitsTypeKey = row.data.maxUnitsTypeKey;
                    obj.maxUnitsTypeDesc = row.data.maxUnitsTypeDesc;
                    let isEdit = true;
                    objects(obj, isEdit);
                  }}
                >
                  Edit
                </CustomButton>
              );
            },
          },
        ];
      }
      break;
    case MODIFIER_PRIORITY_LKP:
      {
        columns = [
          {
            field: "modifier",
            headerName: "Modifier",
            minWidth: 109,
            headerTooltip: "Modifier",
          },
          {
            field: "priority",
            headerName: "Priority",
            minWidth: 83,
            headerTooltip: "Priority",
          },
        ];
      }
      break;
    case MODIFIER_PAY_PERCENTAGE_LKP:
      {
        columns = [
          {
            field: "mppKey",
            headerName: "MPP Key",
            minWidth: 90,
            headerTooltip: "MPP Key",
          },
          {
            field: "modifier",
            headerName: "Modifier",
            minWidth: 90,
            headerTooltip: "Modifier",
          },
          {
            field: "allowedPercentage",
            headerName: "Allowed Percentage",
            minWidth: 109,
            headerTooltip: "Allowed Percentage",
          },
          {
            field: "preOp",
            headerName: "Pre Op",
            minWidth: 60,
            headerTooltip: "Pre Op",
          },
          {
            field: "intraOp",
            headerName: "Intra Op",
            minWidth: 60,
            headerTooltip: "Intra Op",
          },

          {
            field: "postOp",
            headerName: "Post Op",
            minWidth: 60,
            headerTooltip: "Post Op",
          },
        ];
      }
      break;
    // eslint-disable-next-line no-lone-blocks
    case CCI_DEVIATIONS:
      {
        columns = [
          {
            field: "Client",
            headerName: "Client",
            minWidth: 60,
            headerTooltip: "Client",
          },
          {
            field: "ClientGroup",
            headerName: "Client Group",
            minWidth: 40,
            headerTooltip: "Client Group",
          },
          {
            field: "state",
            headerName: "State",
            minWidth: 30,
            headerTooltip: "State",
          },
          {
            field: "lobKey",
            headerName: "LOB",
            minWidth: 60,
            headerTooltip: "LOB",
            cellRenderer: (row) => {
              return Array.isArray(row.data.lobKey)
                ? row.data.lobKey.map((item) => item.value).join(", ")
                : row.data.lobKey;
            },
          },
          {
            field: "claimType",
            headerName: "Claim Type",
            minWidth: 30,
            headerTooltip: "Claim Type",
          },
          {
            field: "cciKey",
            headerName: "CCI Key",
            minWidth: 60,
            headerTooltip: "CCI Key",
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params);
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
            // cellStyle: (params) => {
            //   if (params.data.count > 1) {
            //     return {
            //       backgroundColor: "white",
            //       borderBottom: "1px solid  rgb(212, 220, 228)",
            //     };
            //   }
            //   return {};
            // },
            sortable: true,
          },
          {
            field: "column_i",
            headerName: "Column I",
            minWidth: 40,
            headerTooltip: "Column I",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
          },
          {
            field: "column_ii",
            headerName: "Column II",
            minWidth: 40,
            headerTooltip: "Column II",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
          },
          {
            field: "startDate",
            headerName: "Start Date",
            minWidth: 60,
            headerTooltip: "Start Date",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
          },
          {
            field: "endDate",
            headerName: "End Date",
            minWidth: 60,
            headerTooltip: "End Date",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
          },
          {
            field: "cciRationaleKey",
            headerName: "CCI Rationale",
            minWidth: 60,
            headerTooltip: "CCI Rationale",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1
                ? {
                    backgroundColor: "white",
                    borderBottom: "1px solid rgb(212, 220, 228)",
                  }
                : {};
            },
          },
          {
            field: "allowModB",
            headerName: "Allow Modifier",
            minWidth: 40,
            headerTooltip: "Allow Modifier",
            sortable: true,
            rowSpan: rowSpan,
            cellStyle: (params) => {
              let rowSpanValue = rowSpan(params); // Ensure row span is used
              return rowSpanValue > 1 ? { backgroundColor: "white", borderBottom: "1px solid rgb(212, 220, 228)" } : {};
            },
          },
          {
            field: "devStartDate",
            headerName: "Dev Start Date",
            minWidth: 60,
            headerTooltip: "Dev Start Date",
          },
          {
            field: "devEndDate",
            headerName: "Dev End Date",
            minWidth: 60,
            headerTooltip: "Dev End Date",
          },
          {
            field: "jiraId",
            headerName: "Jira ID",
            minWidth: 60,
            headerTooltip: "Jira ID",
          },
          {
            field: "jiraDesc",
            headerName: "Jira Desc",
            minWidth: 60,
            headerTooltip: "Jira Desc",
          },
          {
            field: "comments",
            headerName: "Comments",
            minWidth: 60,
            headerTooltip: "Comments",
          },
          {
            field: "userId",
            headerName: "User ID",
            minWidth: 60,
            headerTooltip: "User ID",
          },
          {
            field: "Status",
            headerName: "Status",
            minWidth: 135,
            headerTooltip: "Status",
            filter: "agSetColumnFilter", // Set filter
            valueGetter: (params) => {
              const deletedB = params.data?.deletedB ?? false; // Handle undefined values
              return deletedB ? "Disabled" : "Active"; // Return status
            },
            filterParams: {
              values: ["Active", "Disabled"], // Explicit filter options
              caseSensitive: false, // Ignore case
            },
            cellRenderer: (row) => {
              return (
                <>
               <RadioButton checked={true} fromPropsColor={row.data.deletedB === false?"green":"red"}
                style={{ marginRight: "-6px" }}
               />
                  <span>
                    {row.data.deletedB ? "Disabled" : <span className="active-text">Active</span>}
                  </span>
                  <IconButton style={{
                    padding: 0
                  }} onClick={(_e) => {
                      setSelectedCCIDev(true);
                      setSaveLkpValues({
                        ...row.data,
                        jiraId: "",
                        jiraDesc: "",
                        comments: "",
                        isEdit: true,
                        flag: true,
                      });
                    }}
                  >
                    <PendingIcon
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  </IconButton>
                </>
                // <>xyz</>
              );
            },
          },
        ];
      }
      break;
    case SAME_OR_SIMILAR_CODE_LKP: {
      columns = [
        {
          field: "cptCode",
          headerName: "Cpt Code",
          minWidth: 109,
          headerTooltip: "Cpt Code",
        },

        {
          field: "sameOrSimCode",
          headerName: "Same Or Similar Code",
          minWidth: 83,
          headerTooltip: "Same Or Similar Code",
        },
        {
          field: "dosFrom",
          headerName: "Dos From",
          minWidth: 83,
          headerTooltip: "Dos From",
        },
        {
          field: "dosTo",
          headerName: "Dos To",
          minWidth: 83,
          headerTooltip: "Dos To",
        },
      ];
    }
  }
  return columns;
}

import { Stack } from "@mui/material";
import moment from "moment-timezone";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Template from "../../components/Template/Template";
import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import {
  getDrgnChallengeCode,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import "./Claims.css";
import AgGrids from "../../components/TableGrid/AgGrids";
import { DIALOG, SEARCH_CLAIM } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  getClaimDataSize,
  getDragonClaimId,
  getPolicyClaim,
  searchClaimData,
} from "../../redux/ApiCalls/ClaimApis/ClaimApis";
import { TEMP_CLAIM_ID } from "../../redux/ApiCalls/ClaimApis/ClaimApiType";
import { GET_TOTAL_NUMBER_OF_ROWS } from "../../redux/ApiCalls/TaskApis/TaskApiType";
import { GridState } from "../../redux/reducers/AgGridReducer/AggridReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import { claimColumns } from "./claimsColums";
import ClaimView from "./ClaimView";
import {
  AllowedRevenueCode,
  ConditionCode,
  DxClmLevel,
  IpuChgCode,
  ItemizedBillLineID,
  LineLevelPos,
  POSBillType,
  RevCode,
  admitDx,
  allowedMod1,
  allowedMod2,
  allowedMod3,
  allowedMod4,
  allowedProcedureCode,
  allowedQuantity,
  allowedUnits,
  billingProviderId,
  billingProviderPostalCode,
  claimId,
  clientCode,
  clientGroup,
  clmFormType,
  dosFrom,
  dosTo,
  dxCode1,
  dxCode2,
  dxCode3,
  dxCode4,
  extDx,
  ipuChallengeAmount,
  ipuClmType,
  lineAllowedAmount,
  lineLevelNpi,
  lineLevelTaxnomy,
  medPolicy,
  policy,
  principalDx,
  processedDate,
  reasonCode,
  refClmId,
  refSlId,
  renderingProviderNpi,
  renderingTaxnomy,
  rvuPrice,
  slId,
  socProviderId,
  socProviderPostalCode,
  subQuantity,
  submittedChargeAmt,
  submittedCpt,
  submittedMod1,
  submittedMod2,
  submittedMod3,
  submittedMod4,
  taxIdentifier,
} from "./ClaimHeaderNames";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { getMedicalPolicy, getReasonCodes } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { diagsStringMethod, dragonClaimIdStringMethod, StringMethod, validateNumberMethod } from "../../redux/ApiCallAction/Validations/StringValidation";



const _ = require("lodash");

const clmtype = [
  { value: "A", label: "A" },
  { value: "F", label: "F" },
  { value: "I", label: "I" },
  { value: "O", label: "O" },
  { value: "P", label: "P" },
  { value: "S", label: "S" },
];

const intialSearchState = {
  policyNumber: "",
  policyVersion: undefined,
  reasonCode: undefined,
  claimType: undefined,
  medicalPolicyKeyFk: undefined,
  posOrBillType: undefined,
  clientgroupTypeCode: undefined,
  drgnClaimId: "",
  claimSlId: undefined,
  processedFrom: undefined,
  processedTo: undefined,
  diags: "",
};

const currentYear = new Date().getFullYear();

const Claim = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [reasonCodes, setReasonCodes] = useState([]);
  const [medicalPolicy, setMedicalPolicy] = useState([]);
  const [searchState, setSearchState] = useState(intialSearchState);
  const [claimTypeData, setClaimTypeData] = useState([]);
  const [challengeCode, setChallengeCode] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [outOfRange, setOutOfRange] = useState(false);
  const [isPolicyNumberValid, setIsPolicyNumberValid] = useState(false);
  const [isDrgnClaimIdValid, setIsDrgnClaimIdValid] = useState(false);
  const [isDiagsValid, setIsDiagsValid] = useState(false);
  const [isExport, setIsExport] = useState(false);
  const [drgnId, setDrgnId] = useState("");
  const [hcpc, setHcpc] = useState("");
  const [ipuClaimType, setIpuClaimType] = useState("");
  const [filteredInput, setFilteredInput] = useState(undefined);
  const [filterData, setFilterData] = React.useState([]);
  const [reference, setReference] = useState(false);

  const [selectedoptions, setSelectedOptions] = useState({
    reasonCode: undefined,
    medicalPolicyKeyFk: undefined,
    claimType: undefined,
  });
  const [processedFrom, setProcessedFrom] = React.useState(null);
  const [processedTo, setProcessedTo] = React.useState(null);
  ModuleRegistry.registerModules(AllCommunityModules);
  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "67px",
      float: "right",
      right: "190px",
      display: "inline",
    }),
    []
  );
  const fullWidth = true;
  const maxWidth = "xl";
  const handleChange = (newValue: Date | null) => {
    setProcessedFrom(newValue);
  };
  const handleChange1 = (newValue: Date | null) => {
    setProcessedTo(newValue);
  };

  const listInnerRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    getReasonCodes(dispatch);
    getMedicalPolicy(dispatch);
    getDrgnChallengeCode(dispatch);
  }, []);
  const updatedState = useSelector((state: any) => state.newPolicy);
  const taskStates: TaskState = useSelector((state: any) => state.taskReducer);
  const gridState: GridState = useSelector((state: any) => state.gridState);

  const [onSelectionClicked, setOnSelectionClicked] = useState(false);

  useEffect(() => {
    setReasonCodes(updatedState.RSN);
    setMedicalPolicy(updatedState.MedicalPolicy);
    setChallengeCode(updatedState.getChallengeCode);
    setData(updatedState.claims);
    setOnSelectionClicked(false);
  }, [
    updatedState.RSN,
    updatedState.MedicalPolicy,
    updatedState.getChallengeCode,
    updatedState.claims,
  ]);

  const onRowDoubleClicked = async (event) => {
    let dragonId = event.data;
    let obj = {
      drgnClaimId: dragonId.drgnClaimId,
      processedFrom: moment(dragonId.processedOn).format("YYYY-MM-DD hh:mm"),
    };
    setDrgnId(dragonId.drgnClaimId);
    setIpuClaimType(dragonId.ipuClmType);
    setHcpc(dragonId.submittedProcedureCode);
    setOnSelectionClicked(true);
    await Promise.all([
      getDragonClaimId(dispatch, dragonId.drgnClaimId),
      getPolicyClaim(dispatch, dragonId.drgnClaimId),
    ]);
  };

  let passClaimViewParams = {
    onSelectionClicked: onSelectionClicked,
    drgnId: drgnId,
    ipuClaimType: ipuClaimType,
  };

  const reasonCodesCM = updatedState.RSN?.map((rs) => {
    return { label: rs.reasonDesc, value: rs.reasonCode };
  });
  const medicalPolicyCM = updatedState.MedicalPolicy.map((m) => {
    return { label: m.medicalPolicyTitle, value: m.medicalPolicyKey };
  });

  let clearPolicyNumber = false;
  let clearDragonClaimId = false;
  let clearDiags = false;

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  function handleClaimType(e) {
    let claimData = e?.map((data) => {
      data.id = data.value;
      return data.value;
    });
    claimData.sort();
    setClaimTypeData(claimData);
  }

  const getChallengeCodeById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.id == id);
    if (d != undefined) {
      code = d.code;
    }
    return code;
  };

  const getMedicalPolicyById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.medicalPolicyKey == id);
    if (d != undefined) {
      code = d.medicalPolicyTitle;
    }
    return code;
  };

  const getReasonCodeById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.reasonCode == id);

    if (d != undefined) {
      code = d.reasonCode;
    }
    return code;
  };

  function stringToDateFormat(date) {
    let formattedDate = "";
    const newDate = new Date(date);
    if (
      newDate.getFullYear != undefined &&
      newDate.getDate != undefined &&
      newDate.getMonth != undefined
    ) {
      formattedDate = moment(newDate).format("YYYY-MM-DD");
    }
    return formattedDate;
  }

  function searchClaim() {
    dispatch({ type: SEARCH_CLAIM, payload: [] });
    setIsSearched(true);
  }
  useEffect(() => {
    if (!isExport) {
      setNumberOfRows(taskStates.getTotalNUmberOfRows);
    }
  }, [taskStates.getTotalNUmberOfRows]);

  let tablegridData = [];
  let tableData = [];

  const onGridReady = (params) => {
    gridRef.current = params.api;
    const dataSource = {
      rowCount: null,
      getRows: async (params) => {
        setIsExport(false);
        let errorText = "Policy Number or Policy ID is out of range ";
        if (isPolicyNumberValid) {
          CustomSwal(
            "info",
            "Please Enter Comma Separated Policy Numbers or Policy Numbers with Version. (Eg:- 100,120,101 or 100.0,101.0)",
            navyColor,
            "Ok",
            ""
          );
        } else if (isDrgnClaimIdValid) {
          CustomSwal(
            "info",
            "Please Enter Comma Separated Dragon Claim ID. (Eg:- 1173028,1173029,1173020)",
            navyColor,
            "Ok",
            ""
          );
        } else if (isDiagsValid) {
          CustomSwal(
            "info",
            "Please Enter Comma Separated Diags. (Eg:- 1173028,1173029,1173020)",
            navyColor,
            "Ok",
            ""
          );
        } else if (outOfRange) {
          dispatch({
            type: DIALOG,
            payload: {isDialog:true,
            title: "Error",
            message: errorText}
          });
        } else {
          let obj = {} as any;
          obj.startRow = params.startRow; // Start row for pagination
          obj.endRow = params.endRow - 1000; // End row for pagination
          searchState.claimType = claimTypeData.sort();
          if (processedFrom == "") {
            searchState.processedFrom = null;
          } else if (processedFrom != "" && processedFrom != null) {
            const tmForProcessedFromandTo = moment(processedFrom);
            tmForProcessedFromandTo.tz("UTC");
            let formattedDate =
              tmForProcessedFromandTo.format("YYYY-MM-DD HH:mm");
            searchState.processedFrom = formattedDate;
          }
          if (processedTo == "") {
            searchState.processedTo = null;
          } else if (processedTo != "" && processedTo != null) {
            const tmForProcessedFromandTo = moment(processedTo);
            tmForProcessedFromandTo.tz("UTC");
            let formattedDate =
              tmForProcessedFromandTo.format("YYYY-MM-DD HH:mm");
            searchState.processedTo = formattedDate;
          }
          // let rows = [];
          let mp = "";
          let emptyObj = {};
          if (params.filterModel != emptyObj) {
            mp = params.filterModel.medicalPolicy
              ? params.filterModel.medicalPolicy.filter
              : "";
          }
          const one = medicalPolicy?.find((d) => d.medicalPolicyTitle == mp);
          if (one != undefined) {
            mp = one.medicalPolicyKey;
          }
          let sortType = "";
          let sortableColumn = "";
          if (Object.keys(params.sortModel).length > 0) {
            sortType = params.sortModel[0].sort;
            switch (params.sortModel[0].colId) {
              case "drgnClaimId": {
                sortableColumn = "drgn_claim_id";
                break;
              }
              case "ipuClaimLineId": {
                sortableColumn = "drg_claim_sl_id";
                break;
              }
              case "itemizedBillLineId": {
                sortableColumn = "itemized_bill_line_id";
                break;
              }
              case "refDrgnClaimId": {
                sortableColumn = "ref_drgn_claim_id";
                break;
              }
              case "policyNumber": {
                sortableColumn = "policy_number";
                break;
              }
              case "policyVersion": {
                sortableColumn = "policy_version";
                break;
              }
              case "submittedProcedureCode": {
                sortableColumn = "submitted_procedure_code";
                break;
              }
              case "submitted_modifier_1": {
                sortableColumn = "submitted_modifier_1";
                break;
              }
              case "submitted_modifier_2": {
                sortableColumn = "submitted_modifier_2";
                break;
              }
              case "submitted_modifier_3": {
                sortableColumn = "submitted_modifier_3";
                break;
              }
              case "submitted_modifier_4": {
                sortableColumn = "submitted_modifier_4";
                break;
              }
              case "dosFrom": {
                sortableColumn = "dos_from";
                break;
              }
              case "dosTo": {
                sortableColumn = "dos_to";
                break;
              }
              case "submittedChargeAmount": {
                sortableColumn = "submitted_charge_amount";
                break;
              }
              case "drgnChallengeCode": {
                sortableColumn = "drgn_challenge_code";
                break;
              }
              case "ipuChallengeCode": {
                sortableColumn = "challenge_code";
                break;
              }
              case "drgnChallengeAmt": {
                sortableColumn = "drgn_challenge_amt";
                break;
              }
              case "ipuChallengeAmt": {
                sortableColumn = "ipu_challenge_amt";
                break;
              }
              case "refDrgnClaimSlId": {
                sortableColumn = "ref_drgn_claim_sl_id";
                break;
              }
              case "conditionCodes": {
                sortableColumn = "conditionCodes";
                break;
              }
              case "reasonCode": {
                sortableColumn = "reason_code";
                break;
              }
              case "medicalPolicy": {
                sortableColumn = "medical_policy_key_fk";
                break;
              }
              case "processedOn": {
                sortableColumn = "created_date";
                break;
              }
              case "diags": {
                sortableColumn = "diags";
                break;
              }
              case "admittingDiags": {
                sortableColumn = "admitting_diags";
                break;
              }
              case "externalCauseOfInjuryDiags": {
                sortableColumn = "external_cause_of_injury_diags";
                break;
              }
              case "principalDiags": {
                sortableColumn = "principal_diags";
                break;
              }
              case "posOrBillType": {
                sortableColumn = "pos_or_bill_type";
                break;
              }
              case "clientGroup": {
                sortableColumn = "client_group";
                break;
              }
              case "clmFormType": {
                sortableColumn = "clm_form_type";
                break;
              }
              case "ipuClmType": {
                sortableColumn = "ipu_clm_type";
                break;
              }
              case "billingProviderId": {
                sortableColumn = "billing_provider_id";
                break;
              }
              case "clientCode": {
                sortableColumn = "client_Code";
                break;
              }
              case "renderingTaxonomy": {
                sortableColumn = "rendering_taxonomy";
                break;
              }
              case "lineLevelTaxonomy": {
                sortableColumn = "line_level_taxonomy";
                break;
              }
              case "taxIdentifier": {
                sortableColumn = "tax_identifier";
                break;
              }
              case "renderingProviderNpi": {
                sortableColumn = "rendering_provider_npi";
                break;
              }
              case "dx_code_1": {
                sortableColumn = "dx_code_1";
                break;
              }
              case "dx_code_2": {
                sortableColumn = "dx_code_2";
                break;
              }
              case "dx_code_3": {
                sortableColumn = "dx_code_3";
                break;
              }
              case "dx_code_4": {
                sortableColumn = "dx_code_4";
                break;
              }
              case "diagnosisCodes": {
                sortableColumn = "diagnosis_codes";
                break;
              }
              case "revenueCode": {
                sortableColumn = "revenue_code";
                break;
              }
              case "payerAllowedRevenueCode": {
                sortableColumn = "payer_allowed_revenue_code";
                break;
              }
              case "submittedUnits": {
                sortableColumn = "submitted_units";
                break;
              }
              case "allowedQuantity": {
                sortableColumn = "allowed_quantity";
                break;
              }
              case "payerAllowedAmount": {
                sortableColumn = "payer_allowed_amount";
                break;
              }
              case "payerAllowedUnits": {
                sortableColumn = "payer_allowed_units";
                break;
              }
              case "placeOfService": {
                sortableColumn = "pos";
                break;
              }
              case "renderingProviderNpiLineLevel": {
                sortableColumn = "rendering_provider_npi_line_level";
                break;
              }
              case "payerAllowedModifier1": {
                sortableColumn = "payer_allowed_modifier_1";
                break;
              }
              case "payerAllowedModifier2": {
                sortableColumn = "payer_allowed_modifier_2";
                break;
              }
              case "payerAllowedModifier3": {
                sortableColumn = "payer_allowed_modifier_3";
                break;
              }
              case "payerAllowedModifier4": {
                sortableColumn = "payer_allowed_modifier_4";
                break;
              }
              case "payerAllowedProcedureCode": {
                sortableColumn = "payer_allowed_procedure_code";
                break;
              }
              case "rvuPrice": {
                sortableColumn = "rvu_price";
                break;
              }
              case "socPostalCode": {
                sortableColumn = "soc_postal_code";
                break;
              }
              case "billingPostalCode": {
                sortableColumn = "billing_postal_code";
                break;
              }
              case "socProviderId": {
                sortableColumn = "soc_provider_id";
                break;
              }
              default:
                break;
            }
          }
          if (Object.keys(params.filterModel).length > 0) {
            obj = {
              startRow: params.startRow,
              endRow: params.endRow - 1000,
              drgnClaimIdF: params.filterModel.drgnClaimId
                ? params.filterModel.drgnClaimId.filter
                : "",
              ipuClaimLineId: params.filterModel.ipuClaimLineId
                ? params.filterModel.ipuClaimLineId.filter
                : "",
              itemizedBillLineId: params.filterModel.itemizedBillLineId
                ? params.filterModel.itemizedBillLineId.filter
                : "",
              refDrgnClaimIdF: params.filterModel.refDrgnClaimId
                ? params.filterModel.refDrgnClaimId.filter
                : "",
              policyNumberF: params.filterModel.policyNumber
                ? params.filterModel.policyNumber.filter
                : "",
              policyVersionF: params.filterModel.policyVersion
                ? params.filterModel.policyVersion.filter
                : "",
              submittedProcedureCode: params.filterModel.submittedProcedureCode
                ? params.filterModel.submittedProcedureCode.filter
                : "",
              submitted_modifier_1: params.filterModel.submitted_modifier_1
                ? params.filterModel.submitted_modifier_1.filter
                : "",
              submitted_modifier_2: params.filterModel.submitted_modifier_2
                ? params.filterModel.submitted_modifier_2.filter
                : "",
              submitted_modifier_3: params.filterModel.submitted_modifier_3
                ? params.filterModel.submitted_modifier_3.filter
                : "",
              submitted_modifier_4: params.filterModel.submitted_modifier_4
                ? params.filterModel.submitted_modifier_4.filter
                : "",
              dosFrom: params.filterModel.dosFrom
                ? stringToDateFormat(params.filterModel.dosFrom.filter)
                : "",
              dosTo: params.filterModel.dosTo
                ? stringToDateFormat(params.filterModel.dosTo.filter)
                : "",
              submittedChargeAmount: params.filterModel.submittedChargeAmount
                ? params.filterModel.submittedChargeAmount.filter
                : "",
              drgnChallengeCode: params.filterModel.drgnChallengeCode
                ? params.filterModel.drgnChallengeCode.filter
                : "",
              ipuChallengeCode: params.filterModel.ipuChallengeCode
                ? params.filterModel.ipuChallengeCode.filter
                : "",
              drgnChallengeAmt: params.filterModel.drgnChallengeAmt
                ? params.filterModel.drgnChallengeAmt.filter
                : "",
              ipuChallengeAmt: params.filterModel.ipuChallengeAmt
                ? params.filterModel.ipuChallengeAmt.filter
                : "",
              refDrgnClaimSlId: params.filterModel.refDrgnClaimSlId
                ? params.filterModel.refDrgnClaimSlId.filter
                : "",
              reasonCodeF: params.filterModel.reasonCode
                ? params.filterModel.reasonCode.filter
                : "",
              medicalPolicyF: mp,
              processedOn: params.filterModel.processedOn
                ? stringToDateFormat(params.filterModel.processedOn.filter)
                : "",
              diagsF: params.filterModel.diags
                ? params.filterModel.diags.filter
                : "",
              ipuClmType: params.filterModel.ipuClmType
                ? params.filterModel.ipuClmType.filter
                : "",
              principalDiagsF: params.filterModel.principalDiags
                ? params.filterModel.principalDiags.filter.replaceAll(".", "")
                : "",
              admittingDiagsF: params.filterModel.admittingDiags
                ? params.filterModel.admittingDiags.filter.replaceAll(".", "")
                : "",
              externalCauseOfInjuryDiagsF: params.filterModel
                .externalCauseOfInjuryDiags
                ? params.filterModel.externalCauseOfInjuryDiags.filter.replaceAll(
                  ".",
                  ""
                )
                : "",
              posOrBillTypeF: params.filterModel.posOrBillType
                ? params.filterModel.posOrBillType.filter
                : "",
              clientGroup: params.filterModel.clientGroup
                ? params.filterModel.clientGroup.filter
                : "",
              clmFormType: params.filterModel.clmFormType
                ? params.filterModel.clmFormType.filter
                : "",
              billingProviderId: params.filterModel.billingProviderId
                ? params.filterModel.billingProviderId.filter
                : "",
              clientCode: params.filterModel.clientCode
                ? params.filterModel.clientCode.filter
                : "",
              renderingTaxonomy: params.filterModel.renderingTaxonomy
                ? params.filterModel.renderingTaxonomy.filter
                : "",
              lineLevelTaxonomy: params.filterModel.lineLevelTaxonomy
                ? params.filterModel.lineLevelTaxonomy.filter
                : "",
              taxIdentifier: params.filterModel.taxIdentifier
                ? params.filterModel.taxIdentifier.filter
                : "",
              renderingProviderNpi: params.filterModel.renderingProviderNpi
                ? params.filterModel.renderingProviderNpi.filter
                : "",
              dx_code_1: params.filterModel.dx_code_1
                ? params.filterModel.dx_code_1.filter
                : "",
              submittedUnits: params.filterModel.submittedUnits
                ? params.filterModel.submittedUnits.filter
                : "",
              allowedQuantity: params.filterModel.allowedQuantity
                ? params.filterModel.allowedQuantity.filter
                : "",
              dx_code_2: params.filterModel.dx_code_2
                ? params.filterModel.dx_code_2.filter
                : "",
              dx_code_3: params.filterModel.dx_code_3
                ? params.filterModel.dx_code_3.filter
                : "",
              dx_code_4: params.filterModel.dx_code_4
                ? params.filterModel.dx_code_4.filter
                : "",
              diagnosisCodes: params.filterModel.diagnosisCodes
                ? params.filterModel.diagnosisCodes.filter
                : "",
              conditionCodes: params.filterModel.conditionCodes
                ? params.filterModel.conditionCodes.filter
                : "",
              payerAllowedAmount: params.filterModel.payerAllowedAmount
                ? params.filterModel.payerAllowedAmount.filter
                : "",
              payerAllowedUnits: params.filterModel.payerAllowedUnits
                ? params.filterModel.payerAllowedUnits.filter
                : "",
              placeOfService: params.filterModel.placeOfService
                ? params.filterModel.placeOfService.filter
                : "",
              renderingProviderNpiLineLevel: params.filterModel
                .renderingProviderNpiLineLevel
                ? params.filterModel.renderingProviderNpiLineLevel.filter
                : "",
              payerAllowedProcedureCode: params.filterModel
                .payerAllowedProcedureCode
                ? params.filterModel.payerAllowedProcedureCode.filter
                : "",
              payerAllowedModifier1: params.filterModel.payerAllowedModifier1
                ? params.filterModel.payerAllowedModifier1.filter
                : "",
              payerAllowedModifier2: params.filterModel.payerAllowedModifier2
                ? params.filterModel.payerAllowedModifier2.filter
                : "",
              payerAllowedModifier3: params.filterModel.payerAllowedModifier3
                ? params.filterModel.payerAllowedModifier3.filter
                : "",
              payerAllowedModifier4: params.filterModel.payerAllowedModifier4
                ? params.filterModel.payerAllowedModifier4.filter
                : "",
              revenueCode: params.filterModel.revenueCode
                ? params.filterModel.revenueCode.filter
                : "",
              payerAllowedRevenueCode: params.filterModel
                .payerAllowedRevenueCode
                ? params.filterModel.payerAllowedRevenueCode.filter
                : "",
              rvuPrice: params.filterModel.rvuPrice
                ? params.filterModel.rvuPrice.filter
                : "",
              socProviderId: params.filterModel.socProviderId
                ? params.filterModel.socProviderId.filter
                : "",
              billingPostalCode: params.filterModel.billingPostalCode
                ? params.filterModel.billingPostalCode.filter
                : "",
              socPostalCode: params.filterModel.socPostalCode
                ? params.filterModel.socPostalCode.filter
                : "",
              isExport: false,
            };
          }
          let isSortKey = "isSort";
          let sortColumnKey = "sortColumn";
          obj[isSortKey] = sortType != "" ? sortType : "";
          obj[sortColumnKey] = sortableColumn != "" ? sortableColumn : "";
          Object.entries(searchState).forEach(
            ([key, val]) => (obj[key] = val?.toString())
          );
          setFilteredInput(obj);

          const [rows, dataSize] = await Promise.all([
            searchClaimData(dispatch, obj),
            getClaimDataSize(dispatch, obj),
          ]);
          tableData = rows?.map((d: any, i) => {
            const tm = moment(d.createdDate);
            tm.tz("America/New_York");
            return {
              policyNumber:
                d.policyNumber || d.policyVersion
                  ? d.policyNumber + "." + d.policyVersion
                  : "",
              reasonCode: d.reasonCode ? d.reasonCode : "",
              refDrgnClaimId: d.refDrgnClaimId,
              drgnClaimId: d.drgnClaimId,
              ipuClaimLineId: d.claimSlId,
              itemizedBillLineId: d.itemizedBillLineId,
              submittedProcedureCode: d.submittedProcedureCode,
              clientCode: d.clientCode,
              renderingTaxonomy: d.renderingTaxonomy,
              lineLevelTaxonomy: d.lineLevelTaxonomy,
              taxIdentifier: d.taxIdentifier,
              renderingProviderNpi: d.renderingProviderNpi,
              dx_code_1:
                d.dx_code_1?.length > 3
                  ? d.dx_code_1?.substring(0, 3) +
                  "." +
                  d.dx_code_1?.substring(3)
                  : d.dx_code_1,
              dx_code_2:
                d.dx_code_2?.length > 3
                  ? d.dx_code_2?.substring(0, 3) +
                  "." +
                  d.dx_code_2?.substring(3)
                  : d.dx_code_2,
              dx_code_3:
                d.dx_code_3?.length > 3
                  ? d.dx_code_3?.substring(0, 3) +
                  "." +
                  d.dx_code_3?.substring(3)
                  : d.dx_code_3,
              dx_code_4:
                d.dx_code_4?.length > 3
                  ? d.dx_code_4?.substring(0, 3) +
                  "." +
                  d.dx_code_4?.substring(3)
                  : d.dx_code_4,
              diagnosisCodes: d.diags
                ? DXClmLevelPeriod(d.diags)
                : undefined,
              submitted_modifier_1: d.submitted_modifier_1,
              submitted_modifier_2: d.submitted_modifier_2,
              submitted_modifier_3: d.submitted_modifier_3,
              submitted_modifier_4: d.submitted_modifier_4,
              clmFormType: d.clmFormType,
              billingProviderId: d.billingProviderId,
              ipuClmType: d.ipuClmType,
              dosFrom:
                d.dosFrom != null
                  ? moment(d.dosFrom).format("MM-DD-YYYY")
                  : null,
              dosTo:
                d.dosTo != null ? moment(d.dosTo).format("MM-DD-YYYY") : null,
              drgnChallengeCode: getChallengeCodeById(
                challengeCode,
                d.drgnChallengeCode
              ),
              ipuChallengeCode: getChallengeCodeById(
                challengeCode,
                d.ipuChallengeCode
              ),
              clientGroup: d.clientGroup,
              ipuChallengeAmt: d.ipuChallengeAmt,
              refipuClaimLineId: d.refipuClaimLineId,
              refDrgnClaimSlId: d.refDrgnClaimSlId,
              conditionCodes: d.conditionCodes,
              submittedUnits: d.submittedUnits,
              allowedQuantity: d.allowedQuantity,
              payerAllowedAmount: d.payerAllowedAmount,
              payerAllowedUnits: d.payerAllowedUnits,
              placeOfService: d.placeOfService,
              renderingProviderNpiLineLevel: d.renderingProviderNpiLineLevel,
              payerAllowedProcedureCode: d.payerAllowedProcedureCode,
              payerAllowedModifier1: d.payerAllowedModifier1,
              payerAllowedModifier2: d.payerAllowedModifier2,
              payerAllowedModifier3: d.payerAllowedModifier3,
              payerAllowedModifier4: d.payerAllowedModifier4,
              medicalPolicy: getMedicalPolicyById(
                medicalPolicy,
                d.medicalPolicyKeyFk
              ),
              principalDiags: d.principalDiags
                ? principalDiagsPeriod(d.principalDiags)
                : undefined,
              diags: d.diags ? diagsPeriod(d.diags) : undefined,
              admittingDiags: d.admittingDiags
                ? admittingDiagsPeriod(d.admittingDiags)
                : undefined,
              externalCauseOfInjuryDiags: d.externalCauseOfInjuryDiags
                ? externalCauseOfInjuryDiagsPeriod(d.externalCauseOfInjuryDiags)
                : undefined,
              submittedChargeAmount: d.submittedChargeAmount,
              posOrBillType: d.posOrBillType,
              processedOn: d.createdDate ? tm.format("MM/DD/YYYY HH:mm") : "",
              revenueCode: d.revenueCode,
              payerAllowedRevenueCode: d.payerAllowedRevenueCode,
              socPostalCode: d.socPostalCode,
              billingPostalCode: d.billingPostalCode,
              socProviderId: d.socProviderId,
              rvuPrice: d.rvuPrice,
            };
          });
          if (!(params.filterModel == null || undefined)) {
            if (tableData.length < 1000) {
              tablegridData = tableData;
            } else {
              tablegridData = tablegridData.concat(tableData);
            }
          } else {
            tablegridData = tablegridData.concat(tableData);
          }
          if (!(tablegridData.length > 0)) {
            CustomSwal("info", "No data found", navyColor, "Ok", "");
          }
          let lastRow = -1;
          if (tablegridData.length < params.endRow) {
            lastRow = tablegridData.length;
          }
          params.successCallback(tableData, lastRow);
        }
      },
    };
    params.api.setDatasource(dataSource);
  };

  const headers = [
    { label: policy, key: "policyNumber" },
    { label: reasonCode, key: "reasonCode" },
    { label: claimId, key: "drgnClaimId" },
    { label: refClmId, key: "refDrgnClaimId" },
    { label: slId, key: "ipuClaimLineId" },
    { label: ItemizedBillLineID, key: "itemizedBillLineId" },
    { label: submittedCpt, key: "submittedProcedureCode" },
    { label: submittedMod1, key: "submitted_modifier_1" },
    { label: allowedMod1, key: "payerAllowedModifier1" },
    { label: submittedMod2, key: "submitted_modifier_2" },
    { label: allowedMod2, key: "payerAllowedModifier2" },
    { label: submittedMod3, key: "submitted_modifier_3" },
    { label: allowedMod3, key: "payerAllowedModifier3" },
    { label: submittedMod4, key: "submitted_modifier_4" },
    { label: allowedMod4, key: "payerAllowedModifier4" },
    { label: dosFrom, key: "dosFrom" },
    { label: dosTo, key: "dosTo" },
    { label: POSBillType, key: "posOrBillType" },
    { label: LineLevelPos, key: "placeOfService" },
    { label: IpuChgCode, key: "ipuChallengeCode" },
    { label: ipuChallengeAmount, key: "ipuChallengeAmt" },
    { label: refSlId, key: "refDrgnClaimSlId" },
    { label: medPolicy, key: "medicalPolicy" },
    { label: principalDx, key: "principalDiags" },
    { label: clientGroup, key: "clientGroup" },
    { label: admitDx, key: "admittingDiags" },
    { label: clmFormType, key: "clmFormType" },
    { label: ipuClmType, key: "ipuClmType" },
    { label: extDx, key: "externalCauseOfInjuryDiags" },
    { label: submittedChargeAmt, key: "submittedChargeAmount" },
    { label: lineAllowedAmount, key: "payerAllowedAmount" },
    { label: allowedProcedureCode, key: "payerAllowedProcedureCode" },
    { label: rvuPrice, key: "rvuPrice" },
    { label: socProviderId, key: "socProviderId" },
    { label: socProviderPostalCode, key: "socPostalCode" },
    { label: billingProviderPostalCode, key: "billingPostalCode" },
    { label: billingProviderId, key: "billingProviderId" },
    { label: clientCode, key: "clientCode" },
    { label: renderingTaxnomy, key: "renderingTaxonomy" },
    { label: lineLevelTaxnomy, key: "lineLevelTaxonomy" },
    { label: taxIdentifier, key: "taxIdentifier" },
    { label: renderingProviderNpi, key: "renderingProviderNpi" },
    { label: lineLevelNpi, key: "renderingProviderNpiLineLevel" },
    { label: processedDate, key: "processedOn" },
    { label: dxCode1, key: "dx_code_1" },
    { label: dxCode2, key: "dx_code_2" },
    { label: dxCode3, key: "dx_code_3" },
    { label: dxCode4, key: "dx_code_4" },
    { label: DxClmLevel, key: "diagnosisCodes" },
    { label: ConditionCode, key: "conditionCodes" },
    { label: RevCode, key: "revenueCode" },
    { label: AllowedRevenueCode, key: "payerAllowedRevenueCode" },
    { label: ConditionCode, key: "conditionCodes" },
    { label: subQuantity, key: "submittedUnits" },
    { label: allowedQuantity, key: "allowedQuantity" },
    { label: allowedUnits, key: "payerAllowedUnits" },
  ];

  async function exportClaims() {
    filteredInput.isExport = true;
    if (numberOfRows < 60000) {
      let d = await searchClaimData(dispatch, filteredInput);
      let totalExportData = d?.map((d: any, i) => {
        const tm = moment(d.createdDate);
        tm.tz("America/New_York");
        // tm.tz("Asia/Calcutta")
        return {
          policyNumber:
          (d.policyNumber != null && d.policyNumber != undefined) && d.policyNumber != 0
            ? `${d.policyNumber}.${d.policyVersion}\u200B`
            : "",

          reasonCode: getReasonCodeById(reasonCodes, d.reasonCode),
          drgnClaimId: d.drgnClaimId,
          ipuClaimLineId: d.claimSlId,
          itemizedBillLineId: d.itemizedBillLineId,
          refDrgnClaimId: d.refDrgnClaimId,
          submittedProcedureCode: d.submittedProcedureCode,
          submitted_modifier_1: d.submitted_modifier_1,
          submitted_modifier_2: d.submitted_modifier_2,
          submitted_modifier_3: d.submitted_modifier_3,
          submitted_modifier_4: d.submitted_modifier_4,
          dosFrom:
            d.dosFrom != null ? moment(d.dosFrom).format("MM-DD-YYYY") : null,
          dosTo: d.dosTo != null ? moment(d.dosTo).format("MM-DD-YYYY") : null,
          ipuChallengeCode: getChallengeCodeById(
            challengeCode,
            d.ipuChallengeCode
          ),
          rvuPrice: d.rvuPrice,
          drgnChallengeAmt: d.drgnChallengeAmt,
          ipuChallengeAmt: d.ipuChallengeAmt,
          socProviderId: d.socProviderId,
          socPostalCode: d.socPostalCode,
          billingProviderId: d.billingProviderId,
          billingPostalCode: d.billingPostalCode,
          clientCode: d.clientCode,
          renderingTaxonomy: d.renderingTaxonomy,
          lineLevelTaxonomy: d.lineLevelTaxonomy,
          taxIdentifier: d.taxIdentifier,
          renderingProviderNpi: d.renderingProviderNpi,
          dx_code_1: d.dx_code_1,
          dx_code_2: d.dx_code_2,
          dx_code_3: d.dx_code_3,
          dx_code_4: d.dx_code_4,
          diagnosisCodes: d.diags,
          clmFormType: d.clmFormType,
          ipuClmType: d.ipuClmType,
          principalDiags: d.principalDiags,
          posOrBillType: d.posOrBillType,
          clientGroup: d.clientGroup  ? `${d.clientGroup}\u200B` : "",
          diags: d.diags,
          admittingDiags: d.admittingDiags,
          externalCauseOfInjuryDiags: d.externalCauseOfInjuryDiags,
          refipuClaimLineId: d.refipuClaimLineId,
          refDrgnClaimSlId: d.refDrgnClaimSlId,
          conditionCodes: d.conditionCodes,
          submittedUnits: d.submittedUnits,
          allowedQuantity: d.allowedQuantity,
          payerAllowedAmount: d.payerAllowedAmount,
          payerAllowedUnits: d.payerAllowedUnits,
          placeOfService: d.placeOfService,
          renderingProviderNpiLineLevel: d.renderingProviderNpiLineLevel,
          payerAllowedProcedureCode: d.payerAllowedProcedureCode,
          payerAllowedModifier1: d.payerAllowedModifier1,
          payerAllowedModifier2: d.payerAllowedModifier2,
          payerAllowedModifier3: d.payerAllowedModifier3,
          payerAllowedModifier4: d.payerAllowedModifier4,
          medicalPolicy: getMedicalPolicyById(
            medicalPolicy,
            d.medicalPolicyKeyFk
          ),
          submittedChargeAmount: d.submittedChargeAmount,
          processedOn: d.createdDate ? `${tm.format("MM/DD/YYYY HH:mm")}\u200B` : "",
          revenueCode: d.revenueCode ? `${d.revenueCode}\u200B` : "",
          payerAllowedRevenueCode: d.payerAllowedRevenueCode ? `${d.payerAllowedRevenueCode}\u200B` : "",
        };
      });
      let col = [];
      gridState.getGridColumns?.forEach((a) => {
        headers.map((h) => {
          if (h.label === a.headerName) {
            col.push(h);
          }
        });
      });
      makeCsv(getTableDataForExport(totalExportData, col));
    } else {
      CustomSwal(
        "info",
        "Note : Max Records that can be exported is 60K records.",
        navyColor,
        "Ok",
        ""
      );
    }
  }

  const getTableDataForExport = (data: any[], columns: any[]) =>
    data?.map((record: any) =>
      columns.reduce(
        (recordToDownload, column) => ({
          ...recordToDownload,
          [column.label]: record[column.key],
        }),
        {}
      )
    );

  const splittingCommaSeparatedValues = (id) => {
    let data = id?.split(",");
    let fields = "";
    data?.map((d, l) => {
      fields += d + ", ";
    });

    let lastCommaIndex = fields.lastIndexOf(",");
    let resultString = "";
    if (lastCommaIndex !== -1) {
      resultString =
        fields.substring(0, lastCommaIndex) +
        " " +
        fields.substring(lastCommaIndex + 1);
    }
    return resultString;
  };

 

  const makeCsv = async (rows: any[]) => {
    rows?.map((c) => {
      let a = c.CPT ? c.CPT : undefined;
      let refClmId = c["Ref Clm ID"] ? c["Ref Clm ID"] : "";
      let refSlId = c["Ref SL ID"] ? c["Ref SL ID"] : "";
      if (refClmId != "") {
        c["Ref Clm ID"] = splittingCommaSeparatedValues(refClmId);
      }
      if (refSlId != "") {
        c["Ref SL ID"] = splittingCommaSeparatedValues(refSlId);
      }
      if (a != undefined) {
        c.CPT = '="' + a + '"';
      }
    });
    const keys: string[] = Object.keys(rows[0]);
    const csvContent = `${keys.join()}\n${rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');

            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })

          .join()
      )
      .join("\n")}`;

      var data = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      var csvURL = window.URL.createObjectURL(data);
    let tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "ClaimsData.csv");
    tempLink.click();
  };

  const checkDragonClaimIdIsValid = (drgnClaimId) => {
    let flag = false;
    if (drgnClaimId != "") {
      let drgnClaimIdArray = drgnClaimId.split(",");
      for (let i = 0; i < drgnClaimIdArray.length; i++) {
        if (drgnClaimIdArray[i] == "") {
          flag = true;
        }
      }
    }
    clearDragonClaimId = true;
    setIsDrgnClaimIdValid(flag);
  };

  const checkDiagsIsValid = (diags) => {
    let flag = false;
    if (diags != "") {
      let diagsArray = diags.split(",");
      for (let i = 0; i < diagsArray.length; i++) {
        if (diagsArray[i] == "") {
          flag = true;
        }
      }
    }
    clearDiags = true;
    setIsDiagsValid(flag);
  };

  const DXClmLevelPeriod = (diagnosisCodes) => {
    let diagnosisCodes2 = "";
    if (diagnosisCodes !== "") {
      const diagnosisCodesArray = diagnosisCodes.split(",");
      for (let i = 0; i < diagnosisCodesArray.length; i++) {
        const diagnosisCode = diagnosisCodesArray[i];
        const formattedCode =
          diagnosisCode.length > 3
            ? diagnosisCode.substring(0, 3) + "." + diagnosisCode.substring(3)
            : diagnosisCode;

        diagnosisCodes2 += (diagnosisCodes2 ? "," : "") + formattedCode;
      }
    }
    return diagnosisCodes2;
  };


  const diagsPeriod = (diags) => {
    let diags1;
    let diags2 = "";
    if (diags != "") {
      let diagsArray = diags.split(",");
      for (let i = 0; i < diagsArray.length; i++) {
        diags1 =
          diagsArray[i].length > 3
            ? diagsArray[i].substring(0, 3) + "." + diagsArray[i].substring(3)
            : diagsArray[i];
        diags2 = diags1 + (diags2 ? "," : "") + diags2;
      }
    }
    return diags2;
  };

  const admittingDiagsPeriod = (admittingDiags) => {
    let admittingDiags1;
    let admittingDiags2 = "";
    let admittingDiagsArray;
    if (admittingDiags != "") {
      admittingDiagsArray = admittingDiags.split(",");
      for (let i = 0; i < admittingDiagsArray.length; i++) {
        admittingDiags1 =
          admittingDiagsArray[i].length > 3
            ? admittingDiagsArray[i].substring(0, 3) +
            "." +
            admittingDiagsArray[i].substring(3)
            : admittingDiagsArray[i];
        admittingDiags2 =
          admittingDiags1 + (admittingDiags2 ? "," : "") + admittingDiags2;
      }
    }
    return admittingDiags2;
  };

  const principalDiagsPeriod = (principalDiags) => {
    let principalDiags1;
    let principalDiags2 = "";
    let principalDiagsArray;
    if (principalDiags != "") {
      principalDiagsArray = principalDiags.split(",");
      for (let i = 0; i < principalDiagsArray.length; i++) {
        principalDiags1 =
          principalDiagsArray[i].length > 3
            ? principalDiagsArray[i].substring(0, 3) +
            "." +
            principalDiagsArray[i].substring(3)
            : principalDiagsArray[i];
        principalDiags2 =
          principalDiags1 + (principalDiags2 ? "," : "") + principalDiags2;
      }
    }
    return principalDiags2;
  };

  const externalCauseOfInjuryDiagsPeriod = (externalCauseOfInjuryDiags) => {
    let externalCauseOfInjuryDiags1;
    let externalCauseOfInjuryDiags2 = "";
    let externalCauseOfInjuryDiagsArray;
    if (externalCauseOfInjuryDiags != "") {
      externalCauseOfInjuryDiagsArray = externalCauseOfInjuryDiags.split(",");
      for (let i = 0; i < externalCauseOfInjuryDiagsArray.length; i++) {
        externalCauseOfInjuryDiags1 =
          externalCauseOfInjuryDiagsArray[i].length > 3
            ? externalCauseOfInjuryDiagsArray[i].substring(0, 3) +
            "." +
            externalCauseOfInjuryDiagsArray[i].substring(3)
            : externalCauseOfInjuryDiagsArray[i];
        externalCauseOfInjuryDiags2 =
          externalCauseOfInjuryDiags1 +
          (externalCauseOfInjuryDiags2 ? "," : "") +
          externalCauseOfInjuryDiags2;
      }
    }
    return externalCauseOfInjuryDiags2;
  };

  const checkLimit = (policyNumber, labelText) => {
    let flag = false;
    if (policyNumber != "") {
      let policyNumberArray = policyNumber.split(",");
      let policyNumberArr = policyNumber.split(".");
      if (policyNumberArr.length > 1) {
        for (let i = 0; i < policyNumberArr.length; i++) {
          if (policyNumberArr[i] == "") {
            flag = true;
          }
        }
      }
      if (policyNumberArray.length > 1) {
        for (let i = 0; i < policyNumberArray.length; i++) {
          if (policyNumberArray[i] == "") {
            flag = true;
          }
          if (policyNumberArray[i] > 2147483647) {
            setOutOfRange(true);
            const errorText = labelText + " is Out Of Range";
            dispatch({
              type: DIALOG,
              payload: {isDialog:true,
                title: "Error",
              message: errorText}
            });
          }
        }
      } else {
        setOutOfRange(false);
      }
    }
    clearPolicyNumber = flag;
    setIsPolicyNumberValid(flag);
  };

  const checkDiags = (diags, labelText) => {
    let flag = false;
    if (diags != "") {
      let diagsArr = diags.split(".");
      if (diagsArr.length > 1) {
        for (let i = 0; i < diagsArr.length; i++) {
          if (diagsArr[i] == "") {
            flag = true;
          }
        }
      }
    }
    setIsDiagsValid(flag);
  };
  const location = useLocation();
  const path = location.pathname.replaceAll("/", "");

  useEffect(() => {
    if (path == PolicyConstants.CLAIM) {
      resetInputField();
    }
  }, [path]);

  const resetInputField = () => {
    let state = {
      policyNumber: "",
      policyVersion: "",
      reasonCode: null,
      claimType: null,
      medicalPolicyKeyFk: null,
      posOrBillType: "",
      clientgroupTypeCode: "",
      drgnClaimId: "",
      claimSlId: "",
      processedFrom: "",
      processedTo: "",
      diags: "",
    };
    setSearchState(state);
    let obj = {
      reasonCode: null,
      medicalPolicyKeyFk: null,
      claimType: null,
    };
    setSelectedOptions(obj);
    setProcessedFrom("");
    setProcessedTo("");
    setIsSearched(false);
    setData([]);
    setIsPolicyNumberValid(false);
    setIsDrgnClaimIdValid(false);
    setIsDiagsValid(false);
    clearDragonClaimId = false;
    clearPolicyNumber = false;
    clearDiags = false;
    dispatch({ type: GET_TOTAL_NUMBER_OF_ROWS, payload: 0 });
    dispatch({ type: TEMP_CLAIM_ID, payload: "" });
    setFilterData([]);
    setReference(false);
    setClaimTypeData([]);
    setOnSelectionClicked(false);
  };

  const clearValues = (event) => {
    if (
      clearPolicyNumber == true ||
      clearDragonClaimId == true ||
      clearDiags == true
    ) {
      dispatch({ type: GET_TOTAL_NUMBER_OF_ROWS, payload: 0 });
    }
  };

  return (
    <Template>
      <div>
        <GridContainer>
          <GridItem sm={10} md={10} xs={10}>
            <CustomHeader labelText={"Claims"} />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <CustomButton
              type="reset"
              variant={"contained"}
              onClick={resetInputField}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                textTransform: "capitalize",
                fontSize: 12,
                padding: 4,
                float: "right",
              }}
            >
              Reset
            </CustomButton>
            <CustomButton
              onClick={() => searchClaim()}
              variant={"contained"}
              style={{
                backgroundColor: navyColor,
                marginRight: 10,
                float: "right",
                color: "white",
                fontSize: 12,
                padding: 4,
                textTransform: "capitalize",
              }}
            >
              Search
            </CustomButton>
          </GridItem>
        </GridContainer>
        <CustomPaper
          style={{
            border: "1px solid #D6D8DA",
            boxShadow: "none",
            marginTop: "3px",
          }}
        >
          <GridContainer
            style={{ marginTop: "-15px", padding: 8, fontSize: 12 }}
          >
            <GridItem sm={2} md={1} xs={2}>
              <div className="claimNum">
                <CustomInput
                  fullWidth={true}
                  labelText={"Policy.Version"}
                  variant={"outlined"}
                  type={"text"}
                  onKeyPress={(e) => validateNumberMethod(e)}
                  value={searchState?.policyNumber}
                  onChange={(event) => {
                    setIsSearched(false);
                    let obj = _.cloneDeep(searchState);
                    obj.policyNumber = event.target.value;
                    setSearchState(obj);
                    checkLimit(obj.policyNumber, "Policy Number");
                    clearValues(event.target.value);
                  }}
                />
              </div>
            </GridItem>
            <GridItem sm={2} md={2} xs={2}>
              <CustomSelect
                onSelect={(event) => {
                  setIsSearched(false);
                  if (event != null) {
                    let obj = _.cloneDeep(searchState);
                    obj.reasonCode = event.value;
                    setSearchState(obj);
                  } else {
                    let obj = _.cloneDeep(searchState);
                    obj.reasonCode = undefined;
                    setSearchState(obj);
                  }
                  let obj2 = _.cloneDeep(selectedoptions);
                  obj2.reasonCode = event;
                  setSelectedOptions(obj2);
                }}
                options={reasonCodesCM}
                labelText={"Reason"}
                value={selectedoptions.reasonCode}
              />
            </GridItem>
            <GridItem sm={3} md={3} xs={3}>
              <CustomSelect
                labelText={"Claim Type"}
                isMulti
                onSelect={(event) => {
                  setIsSearched(false);
                  if (event != null) {
                    let obj = _.cloneDeep(searchState);
                    obj.claimType = event.value;
                    setSearchState(obj);
                  }
                  let obj2 = _.cloneDeep(selectedoptions);
                  obj2.claimType = event;
                  setSelectedOptions(obj2);
                  handleClaimType(obj2.claimType);
                }}
                value={selectedoptions.claimType}
                options={clmtype}
              />
            </GridItem>
            <GridItem sm={2} md={2} xs={2}>
              <CustomSelect
                onSelect={(event) => {
                  setIsSearched(false);
                  if (event != null) {
                    let obj = _.cloneDeep(searchState);
                    obj.medicalPolicyKeyFk = event.value;
                    setSearchState(obj);
                  } else {
                    let obj = _.cloneDeep(searchState);
                    obj.medicalPolicyKeyFk = undefined;
                    setSearchState(obj);
                  }
                  let obj2 = _.cloneDeep(selectedoptions);
                  obj2.medicalPolicyKeyFk = event;
                  setSelectedOptions(obj2);
                }}
                options={medicalPolicyCM}
                labelText={"Medical Policy"}
                value={selectedoptions.medicalPolicyKeyFk}
              />
            </GridItem>
            <GridItem sm={2} md={2} xs={2}>
              <CustomInput
                fullWidth={true}
                type={"text"}
                labelText={"Group Type"}
                variant={"outlined"}
                value={searchState?.clientgroupTypeCode}
                onChange={(event) => {
                  setIsSearched(false);
                  let obj = _.cloneDeep(searchState);
                  obj.clientgroupTypeCode = event.target.value;
                  setSearchState(obj);
                }}
              />
            </GridItem>

            <GridItem sm={2} md={2} xs={2}>
              <CustomInput
                fullWidth={true}
                onKeyPress={(e) => {
                  dragonClaimIdStringMethod(e);
                }}
                type={"text"}
                labelText={"Dragon Claim ID"}
                variant={"outlined"}
                value={searchState?.drgnClaimId}
                onChange={(event) => {
                  setIsSearched(false);
                  let obj = _.cloneDeep(searchState);
                  obj.drgnClaimId = event.target.value;
                  setSearchState(obj);
                  checkDragonClaimIdIsValid(event.target.value);
                  clearValues(event);
                }}
              />
            </GridItem>
            <GridItem sm={2} md={2} xs={4}>
              <CustomInput
                fullWidth={true}
                type={"text"}
                labelText={" Service Line Id"}
                variant={"outlined"}
                onKeyPress={(e) => StringMethod(e)}
                value={searchState?.claimSlId}
                onChange={(event) => {
                  setIsSearched(false);
                  let obj = _.cloneDeep(searchState);
                  obj.claimSlId = event.target.value;
                  setSearchState(obj);
                }}
              />
            </GridItem>

            <GridItem sm={2} md={2} xs={2}>
              <Stack component="form" noValidate spacing={3}>
                <CustomInput
                  id="date"
                  type="datetime-local"
                  variant={"outlined"}
                  labelText={"IPU Processed From"}
                  value={processedFrom}
                  onChange={(event) => {
                    setIsSearched(false);
                    setProcessedFrom(event.target.value);
                  }}
                  InputProps={{
                    style: {
                      height: 24,
                      width: "100%",
                    },
                  }}
                />
              </Stack>
            </GridItem>

            <GridItem sm={2} md={2} xs={2}>
              <Stack component="form" noValidate spacing={3}>
                <CustomInput
                  id="date"
                  type="datetime-local"
                  variant={"outlined"}
                  labelText={"IPU Processed To"}
                  value={processedTo}
                  onChange={(event) => {
                    setIsSearched(false);
                    setProcessedTo(event.target.value);
                  }}
                  InputProps={{
                    style: {
                      height: 24,
                      width: "100%",
                    },
                  }}
                />
              </Stack>
            </GridItem>
            <GridItem sm={2} md={2} xs={2}>
              <CustomInput
                fullWidth={true}
                type={"text"}
                labelText={"Bill Type"}
                variant={"outlined"}
                onKeyPress={(e) => StringMethod(e)}
                value={searchState?.posOrBillType}
                onChange={(event) => {
                  setIsSearched(false);
                  let obj = _.cloneDeep(searchState);
                  obj.posOrBillType = event.target.value;
                  setSearchState(obj);
                }}
              />
            </GridItem>

            <GridItem sm={2} md={2} xs={2}>
              <CustomInput
                fullWidth={true}
                onKeyPress={(e) => diagsStringMethod(e)}
                type={"text"}
                labelText={"Dx"}
                variant={"outlined"}
                value={searchState?.diags}
                onChange={(event) => {
                  setIsSearched(false);
                  let obj = _.cloneDeep(searchState);
                  obj.diags = event.target.value.toUpperCase();
                  setSearchState(obj);
                  checkDiagsIsValid(event.target.value);
                  checkDiags(obj.diags, "Diags");
                  clearValues(event);
                }}
              />
            </GridItem>
          </GridContainer>
        </CustomPaper>
        <div style={{ height: 10 }} />
        <div>
          <h6 className="headerClass">Claim Line Details</h6>
          {isSearched ? (
            <>
              <div
                className="claimsGrid"
                style={{ height: window.innerHeight / 1.8 }}
              >
                <AgGrids
                  columnDefs={claimColumns}
                  onGridReady={onGridReady}
                  debug={true}
                  rowBuffer={0}
                  rowSelection="single"
                  rowModelType={"infinite"}
                  rowDeselection={true}
                  pageinationPerSize={500}
                  cacheOverflowSize={1}
                  maxConcurrentDatasourceRequests={1}
                  infiniteInitialRowCount={1}
                  maxBlocksInCache={1}
                  modules={AllCommunityModules}
                  gridIconStyle={gridIconStyle}
                  onRowDoubleClicked={onRowDoubleClicked}
                />
                {onSelectionClicked == true ? (
                  <ClaimView {...passClaimViewParams} />
                ) : undefined}
              </div>
              <small
                style={{ position: "relative", top: "-25px", fontSize: "12px" }}
              >
                Number of rows : {numberOfRows}
              </small>
            </>
          ) : (
            ""
          )}
          {isSearched ? (
            <CustomButton
              onClick={() => {
                exportClaims();
              }}
              variant={"contained"}
              style={{
                backgroundColor: navyColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
                marginTop: -8,
                float: "right",
              }}
            >
              Export
            </CustomButton>
          ) : undefined}
        </div>
      </div>
    </Template>
  );
};

export default Claim;

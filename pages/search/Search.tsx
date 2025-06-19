import { ButtonGroup, InputAdornment } from "@material-ui/core";
import { MoreHoriz } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { batch, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert2";

import {
  black,
  dangerColor,
  navyColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import { exportedExcelFileData } from "../../components/ExportExcel/ExportExcelFile";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";

import { AccessForExport } from "../../redux/ApiCallAction/Validations/AccessForExport";
import {
  CLIENT_ASSIGNMENT_FIELDS,
  DIAGNOSIS_FIELDS,
  DIALOG_CAT_RESET_STATE,
  DIALOG_REASON_RESET_STATE,
  GET_DIAGNOSIS_DATA,
  PATHS,
  POLICY_BILL_TYPE_DATA,
  POLICY_FIELDS,
  RESET_CHANGES_TAB_FIELDS,
  RESET_CHANGES_TAB_TABLE,
  RESET_DESCRIPTION_TAB_FIELDS,
  RESET_DETAILS_TAB_FIELDS,
  RESET_POLICY_FILEDS,
  RESET_STATE,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  BILL_TYPE,
  CATEGORY_VALUE,
  CLAIM_TYPE_VALUE,
  CLIENT_GROUP_VALUE,
  CPT_CODE,
  EBC_VALUE,
  LOB_VALUE,
  MEDICAL_POLICY_VALUE,
  POS,
  PRODUCT_TYPE_VALUE,
  REASON_CODE_VALUE,
  RESET,
  SEARCH_CATEGORY,
  SEARCH_CLIENT_GROUP_ID,
  SEARCH_CLIENT_GROUP_ID_VAL,
  SEARCH_CREATED_DATE,
  SEARCH_DEACTIVATED,
  SEARCH_DESCRIPTION,
  SEARCH_DISABLED,
  SEARCH_EBC,
  SEARCH_LOB,
  SEARCH_MEDICAL_POLICY,
  SEARCH_POLICY_ID,
  SEARCH_POLICY_NUMBER,
  SEARCH_PRIORITY,
  SEARCH_PRODUCT_TYPE,
  SEARCH_REASON_CODE,
  SEARCH_REFERENCE,
  SEARCH_SUB_POLICY,
  SUB_POLICY_VALUE,
} from "../../redux/ApiCalls/SearchPolicyApis/SearchPolicyConstants";
import {
  DIALOG,
  GET_PROCS,
  SEARCH_POLICY,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import {
  clientgroupColumns,
  MedicalPolicyLKPColumns,
  PolicyCatLKPColumns,
  ReasonLKPColumns,
  SubPolicyLKPColumns,
} from "../NewPolicy/Columns";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import "../search/Search.css";
import { NEW_POLICY_CREATE_ARRAY } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { GET_CLIENT_ASSIGNMENT_DATA } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { TestingReportState } from "../../redux/reducers/TestingReportReducer/TestingReportReducer";
import { getClientgroupData } from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import { GET_TAXONOMY_DATA } from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpTypes";
import { getClientAssignmentData } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { getCAT, getLOB, getMedicalPolicy, getProductType, getReasonCodes, getSubPolicy } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { searchPolicy } from "../../redux/ApiCalls/SearchPolicyApis/SearchApis";
import { getPolicyById } from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import { getChangesById } from "../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { getAllClaimType } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
import { DiagnosisFieldState } from "../../redux/reducers/NewPolicyTabReducers/DiagnosisReducer";
import { batchDispatch } from "../../redux/ApiCallAction/ApiCallAction";
import { getTaxIDDataPolicy } from "../../redux/ApiCalls/NewPolicyTabApis/TaxIdApis";
import { getTaxonomyOfPolicy } from "../../redux/ApiCalls/NewPolicyTabApis/TaxonomyApis";
import { getNPIDataPolicy } from "../../redux/ApiCalls/NewPolicyTabApis/NpiApis";

const _ = require("lodash");
const colStyle = {
  backgroundColor: navyColor,
  color: "white",
  fontWeight: "400px",
  fontFamily: "Arial, Helvetica, sans-serif",
};
const fullWidth = true;
const maxWidth = "md";

const columnDefs = [
  {
    field: "id",
    headerName: "Policy.Version",
    width: 120,
    filter: true,
    sortable: true,
    headerTooltip: "Policy.Version",
    valueParser: (params) => Number(params.value), // Ensures values are numeric
    comparator: (valueA, valueB) => {
      // Split the version strings into their major and minor parts
      const splitA = valueA.split(".").map(Number);
      const splitB = valueB.split(".").map(Number);
      // Compare the major versions first (e.g., 100 in 100.1)
      const majorComparison = splitA[0] - splitB[0];
      if (majorComparison !== 0) {
        return majorComparison;
      }
      // If major versions are the same, compare the minor versions (e.g., 1 in 100.1)
      return splitA[1] - splitB[1];
    },
  },
  {
    field: "policyId",
    headerName: "Policy ID",
    width: 120,
    // flex: 1,
    hide: true,
    filter: true,
    sortable: true,
    headerTooltip: "Policy ID",
  },
  {
    field: "custom",
    headerName: "Custom",
    width: 80,
    // flex: 1,
    filter: true,
    sortable: true,
    headerTooltip: "Custom",
  },
  {
    field: "medicalPolicy",
    headerName: "Medical Policy",
    minWidth: 200,
    flex: 1,
    filter: true,
    sortable: true,
    headerTooltip: "Medical Policy",
  },
  {
    field: "subPolicy",
    headerName: "Sub Policy",
    minWidth: 200,
    flex: 1,
    filter: true,
    sortable: true,
    headerTooltip: "Sub Policy",
  },
  {
    field: "description",
    headerName: "Description",
    minWidth: 600,
    flex: 1,
    filter: true,
    sortable: true,
    resizable: false,
    headerTooltip: "Description",
  },
];

const intialSearchState = {
  policyNumber: "",
  category: undefined,
  reason: undefined,
  description: "",
  policyId: "",
  lob: undefined,
  productType: undefined,
  ebc: undefined,
  claimType: undefined,
  deactivated: null,
  disabled: null,
  medicalPolicy: undefined,
  subPolicy: undefined,
  reference: "",
  priority: "",
  createDate: undefined,
};

const Search = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [reasonCodes, setReasonCodes] = useState([]);
  const [cats, setCats] = useState([]);
  const [medicalPolicy, setMedicalPolicy] = useState([]);
  const [subPolicy, setSubPolicy] = useState([]);
  const [lob, setLob] = useState([]);
  const [productType, setProductType] = useState([]);
  const [searchState, setSearchState] = useState(intialSearchState);
  const [claimData, setClaimData] = useState([]);
  const [clientGroupType, setClientGroupType] = useState([]);
  const [isDeactivatedChecked, setIsDeactivatedChecked] = useState(false);
  const [isDisabledChecked, setIsDisabledChecked] = useState(false);
  const [outOfRange, setOutOfRange] = useState(false);
  const [selectedLkp, setSelectedLkp] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedLkpColumns, setselectedLkpColumns] = useState([]);
  const [openLkp, setOpenLkp] = React.useState(false);
  const [claimType, setClaimType] = useState([]);
  const [policyIdRange, setPolicyIdRange] = useState(false);
  const [isPolicyNumberValid, setIsPolicyNumberValid] = useState(false);
  const [clientGroupValue, setClientGroupValue] = React.useState("");
  const [selectedoptions, setSelectedOptions] = useState({
    category: undefined,
    reason: undefined,
    lob: undefined,
    producttype: undefined,
    ebc: undefined,
    claimtype: [],
    medicalpolicy: undefined,
    subpolicy: undefined,
  });

  const [dos, setdos] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [reasonCode, setReasonCode] = useState([]);
  const [catCode, setCatCode] = useState([]);
  const [medicalCode, setmedicalCode] = useState([]);
  const [subPolCode, setsubPolCode] = useState([]);
  const [clientGroup, setClientGroup] = useState([]);
  const [enfoCode, setEnfoCode] = useState([]);
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState("");
  const [numberOfRows, setNumberOfRows] = useState(0);
  const taskStates: TaskState = useSelector((state: any) => state.taskReducer);

  const roleState: UserState = useSelector((state: any) => state.userReducer);

  const hello = "SdSharp";

  const location1 = useLocation();


  let Role = JSON.stringify(roleState.roleName);
  let adminIdx = Role.toLocaleLowerCase().search("admin");

  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "67px",
      float: "right",
      right: "180px",
      display: "inline",
    }),
    []
  );
  const lkpGridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "15px",
      float: "right",
      right: "75px",
      display: "inline",
    }),
    []
  );
  const handleToClose = () => {
    setOpen(false);
    setOpenLkp(false);
  };

  const updatedState = useSelector((state: any) => state.newPolicy);
  const searchPolicyState = useSelector(
    (state: any) => state.searchPolicyReducer
  );

  const updatedState1: TestingReportState = useSelector(
    (state: any) => state.testingReportReducer
  );

  const clientState = useSelector((state: any) => state.clientPolicy);

  const claimTypeOptions = updatedState.getClaimTypes?.map((p) => {
    return { label: p.claimType + "-" + p.description, value: p.claimType };
  });
  const claimTypeValues =
    searchPolicyState.claimTypeValue != undefined
      ? searchPolicyState.claimTypeValue?.map((p) => {
          return { label: p.label.charAt(0), value: p.value };
        })
      : "";

  const clientGrpTypes = searchPolicyState.productTypeValue
    ? searchPolicyState.productTypeValue?.map((p) => {
        return { label: p.label, value: p.value };
      })
    : "";

  useEffect(() => {
    setReasonCode(searchPolicyState.searchReasonCode);
    setCatCode(searchPolicyState.searchCategory);
    setmedicalCode(searchPolicyState.searchMedicalPolicy);
    setsubPolCode(searchPolicyState.searchSubPolicy);
    setEnfoCode(searchPolicyState.searchEbc);
    setClientGroup(searchPolicyState.clientGroupValue);
  }, []);

  const onGridReady = (data) => {
    data.api.forEachLeafNode((s) => {
      if (selectedLkp == PolicyConstants.REASON_CODE_LKP) {
        for (let i = 0; i < reasonCode.length; i++) {
          if (s.data?.reasonCode === reasonCode[i]) {
            s.setSelected(true);
          }
        }
      }
      if (selectedLkp == PolicyConstants.POLICY_CAT_LKP) {
        for (let i = 0; i < catCode.length; i++) {
          if (s.data?.policyCategoryLkpId === catCode[i]) {
            s.setSelected(true);
          }
        }
      }
      if (selectedLkp == PolicyConstants.MEDICAL_POLICY_LKP) {
        for (let i = 0; i < medicalCode.length; i++) {
          if (s.data?.medicalPolicykey === medicalCode[i]) {
            s.setSelected(true);
          }
        }
      }
      if (selectedLkp == PolicyConstants.SUB_POLICY_LKP) {
        for (let i = 0; i < subPolCode.length; i++) {
          if (s.data?.subPolicyKey === subPolCode[i]) {
            s.setSelected(true);
          }
        }
      }
      if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
        for (let i = 0; i < enfoCode.length; i++) {
          if (s.data?.policyCategoryLkpId === enfoCode[i]) {
            s.setSelected(true);
          }
        }
      }
      if (selectedLkp == PolicyConstants.CLIENT_GROUP) {
        for (let i = 0; i < clientGroup.length; i++) {
          if (s.data?.clientGroupId === clientGroup[i]) {
            s.setSelected(true);
          }
        }
      }
    });
  };
  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();
    if (selectedLkp == PolicyConstants.REASON_CODE_LKP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }
    if (selectedLkp == PolicyConstants.POLICY_CAT_LKP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }
    if (selectedLkp == PolicyConstants.MEDICAL_POLICY_LKP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }
    if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }

    if (selectedLkp == PolicyConstants.SUB_POLICY_LKP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }
    if (selectedLkp == PolicyConstants.CLIENT_GROUP) {
      let a = event.api.getSelectedRows();
      setSelectedCheckboxValue(a);
    }
  };
  useEffect(() => {
    if (selectedLkp == "Reason Code LookUp") {
      let col = Object.assign({}, selectedLkpColumns);
      col = ReasonLKPColumns;
      setselectedLkpColumns(col);
      const reasonCodeLkp = reasonCodes.map((sp, i) => {
        return {
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
        };
      });
      setRows(reasonCodeLkp);
    }
    if (
      selectedLkp == "Policy Category LookUp" ||
      selectedLkp == "Enforce Before Category LookUp"
    ) {
      let col = Object.assign({}, selectedLkpColumns);
      col = PolicyCatLKPColumns;
      setselectedLkpColumns(col);
      const cate = cats.map((sp, i) => {
        return {
          id: i,
          policyCategoryLkpId: sp.policyCategoryLkpId,
          priority: sp.priority,
          policyCategoryDesc: sp.policyCategoryDesc,
          lastUpdatedAt: Moment(sp.lastUpdatedAt).format("MM-DD-YYYY hh:mm:ss"),
        };
      });
      setRows(cate);
    }
    if (selectedLkp == "Medical Policy LookUp") {
      let col = Object.assign({}, selectedLkpColumns);
      col = MedicalPolicyLKPColumns;
      setselectedLkpColumns(col);
      const medical = medicalPolicy.map((sp, i) => {
        return {
          id: i,
          medicalPolicykey: sp.medicalPolicyKey,
          medicalPolicyDesc: sp.medicalPolicyDesc,
          // lastUpdatedTs: Moment(sp.lastUpdatedTs).format("MM-DD-YYYY hh:mm:ss"),
        };
      });
      setRows(medical);
    }
    if (selectedLkp == "SubPolicy LookUp") {
      let col = Object.assign({}, selectedLkpColumns);
      col = SubPolicyLKPColumns;
      setselectedLkpColumns(col);
      const subpolicy = subPolicy.map((sp, i) => {
        return {
          id: i,
          subPolicyKey: sp.subPolicyKey,
          subPolicyDesc: sp.subPolicyDesc,
          // lastUpdatedTs: Moment(sp.lastUpdatedTs).format("MM-DD-YYYY hh:mm:ss"),
        };
      });
      setRows(subpolicy);
    }
    if (selectedLkp == "Client Group") {
      let col = Object.assign({}, selectedLkpColumns);
      col = clientgroupColumns;
      setselectedLkpColumns(col);
      const clientExclusion = clientState.getClientExclusion.map((k) => {
        return {
          clientGroupId: k.clientGroupId,
          clientCode: k.clientCode,
          clientGroupName: k.clientGroupName,
          clientGroupCode: k.clientGroupCode,
          clientName: k.clientName,
        };
      });
      setRows(clientExclusion);
    }
  }, [selectedLkp]);

  const location = useLocation();
  const paths = location.pathname.replaceAll("/", "");

  useEffect(() => {
    dispatch({ type: POLICY_FIELDS, payload: {paths:paths} });

    if (paths === PolicyConstants.SEARCH) {
      const actions = [
        {
          type: DIALOG_REASON_RESET_STATE,
        },
        { type: DIALOG_CAT_RESET_STATE },
        // {type:RESET_STATE}
      ];
      // batch(() => {
      //   actions.forEach((action) => dispatch(action));
      // });
          batchDispatch(dispatch,actions)
      
    }
  }, []);

  const setCheckboxValues = () => {
    if (selectedLkp == PolicyConstants.POLICY_CAT_LKP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let id = [];
      let catValue = "";
      for (let i = 0; i < a.length; i++) {
        id.push(a[i].policyCategoryLkpId);
        catValue = catValue.concat(
          a[i].policyCategoryLkpId + "-" + a[i].policyCategoryDesc
        );
        if (!(i == a.length - 1)) {
          catValue += ",";
        }
      }
      setCatCode(id);
      dispatch({ type: SEARCH_CATEGORY, payload: id });
      dispatch({ type: CATEGORY_VALUE, payload: catValue });
    }
    if (selectedLkp == PolicyConstants.REASON_CODE_LKP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let reason = [];
      let reasonValue = "";
      for (let i = 0; i < a.length; i++) {
        reason.push(a[i].reasonCode);
        reasonValue = reasonValue.concat(
          a[i].reasonCode + "-" + a[i].reasonDesc
        );
        if (!(i == a.length - 1)) {
          reasonValue += ",";
        }
      }
      dispatch({ type: REASON_CODE_VALUE, payload: reasonValue });
      dispatch({ type: SEARCH_REASON_CODE, payload: reason });
      setReasonCode(reason);
    }
    if (selectedLkp == PolicyConstants.MEDICAL_POLICY_LKP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let key = [];
      let medicalValue = "";
      for (let i = 0; i < a.length; i++) {
        key.push(a[i].medicalPolicykey);
        medicalValue = medicalValue.concat(
          a[i].medicalPolicykey + "-" + a[i].medicalPolicyDesc
        );
        if (!(i == a.length - 1)) {
          medicalValue = medicalValue + " , ";
        }
      }
      dispatch({ type: MEDICAL_POLICY_VALUE, payload: medicalValue });
      dispatch({ type: SEARCH_MEDICAL_POLICY, payload: key });
      setmedicalCode(key);
    }
    if (selectedLkp == PolicyConstants.ENFORCE_BEFORE_CAT_LKP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let id = [];
      let ebcValue = "";
      for (let i = 0; i < a.length; i++) {
        id.push(a[i].policyCategoryLkpId);
        ebcValue = ebcValue.concat(
          a[i].policyCategoryLkpId + "-" + a[i].policyCategoryDesc
        );
        if (!(i == a.length - 1)) {
          ebcValue += ",";
        }
      }
      setEnfoCode(id);
      dispatch({ type: SEARCH_EBC, payload: id });
      dispatch({ type: EBC_VALUE, payload: ebcValue });
    }
    if (selectedLkp == PolicyConstants.SUB_POLICY_LKP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let key = [];
      let subValue = "";
      for (let i = 0; i < a.length; i++) {
        key.push(a[i].subPolicyKey);
        subValue = subValue.concat(
          a[i].subPolicyKey + "-" + a[i].subPolicyDesc
        );
        if (!(i == a.length - 1)) {
          subValue = subValue + " , ";
        }
      }
      dispatch({ type: SEARCH_SUB_POLICY, payload: key });
      dispatch({ type: SUB_POLICY_VALUE, payload: subValue });
      setsubPolCode(key);
    }
    if (selectedLkp === PolicyConstants.CLIENT_GROUP) {
      let a = _.cloneDeep(selectedCheckboxValue);
      let key = [];
      let subValue = "";
      for (let i = 0; i < a.length; i++) {
        key.push(a[i].clientGroupId);
        subValue = subValue.concat(a[i].clientGroupCode);
        if (!(i == a.length - 1)) {
          subValue = subValue + " , ";
        }
      }
      setClientGroupValue(subValue);
      dispatch({ type: SEARCH_CLIENT_GROUP_ID, payload: key });
      dispatch({ type: CLIENT_GROUP_VALUE, payload: subValue });
      setClientGroup(key);
    }
  };

  useEffect(() => {
    const promises = [];
    if (updatedState.RSN.length === 0) {
      promises.push(getReasonCodes(dispatch));
    }
    if (updatedState.CAT.length === 0) {
      promises.push(getCAT(dispatch));
    }
    if (updatedState.MedicalPolicy.length === 0) {
      promises.push(getMedicalPolicy(dispatch));
    }
    if (updatedState.SubPolicy.length === 0) {
      promises.push(getSubPolicy(dispatch));
    }
    if (updatedState.LOB.length === 0) {
      promises.push(getLOB(dispatch));
    }
    if (updatedState.ProductType.length === 0) {
      promises.push(getProductType(dispatch));
    }
    if (updatedState.getClaimTypes.length === 0) {
      promises.push(getAllClaimType(dispatch));
    }
    if (clientState.getClientExclusion.length === 0) {
      promises.push(getClientgroupData(dispatch));
    }
    Promise.all(promises).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);

  const [showResults, setShowResults] = React.useState(true);

  useEffect(() => {
    setReasonCodes(updatedState.RSN);
    setCats(updatedState.CAT);
    setMedicalPolicy(updatedState.MedicalPolicy);
    setSubPolicy(updatedState.SubPolicy);
    setData(updatedState.policies);
    setLob(updatedState.LOB);
    setProductType(updatedState.ProductType);
    setClaimType(updatedState.getClaimTypes);
    setNumberOfRows(updatedState.policies.length);
  }, [updatedState]);

  useEffect(() => {
    setData(updatedState.policies);
  }, []);

  const resetInputField = () => {
    dispatch({ type: RESET });
    dispatch({ type: SEARCH_POLICY, payload: [] });
    setIsDeactivatedChecked(false);
    setIsDisabledChecked(false);
    setData([]);
    setCatCode([]);
    setmedicalCode([]);
    setEnfoCode([]);
    setReasonCode([]);
    setsubPolCode([]);
    setClientGroup([]);
    setdos("");
    setClientGroupValue("");
    setClaimData([]);
    setClientGroupType([]);
    setNumberOfRows(0);
    setIsPolicyNumberValid(false);
    setFilterFlag(false);
  };
  const LotCM = lob?.map((l) => {
    return { label: l.lobTitle, value: l.lobKey };
  });
  const productTypeCM = productType.map((p) => {
    return { label: p.productTitle, value: p.productKey };
  });
  const catCM = cats.map((c) => {
    return { label: c.policyCategoryDesc, value: c.policyCategoryLkpId };
  });
  const medicalPolicyCM = medicalPolicy.map((m) => {
    return { label: m.medicalPolicyTitle, value: m.medicalPolicyKey };
  });
  const subPolicyCM = subPolicy.map((sb) => {
    return { label: sb.subPolicyTitle, value: sb.subPolicyKey };
  });

  const newPolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const checkPolicyIdLimit = (number, lableText) => {
    if (number > 2147483647) {
      setPolicyIdRange(true);
      const errorText = lableText + " is Out Of Range";
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: errorText}
      });
    } else {
      setPolicyIdRange(false);
    }
  };

  const [checkCommaSeparatedValue, setCheckCommaSeparatedValue] =
    useState(false);
  const checkCommaSeparated = (value) => {
    let flag = false;
    if (value != "") {
      let codes = value.split(",");
      for (let i = 0; i < codes.length; i++) {
        if (codes[i] == "") {
          flag = true;
        }
      }
    }
    setCheckCommaSeparatedValue(flag);
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
          } else {
            setOutOfRange(false);
          }
        }
      } else {
        if (policyNumber > 2147483647) {
          setOutOfRange(true);
          const errorText = labelText + " is Out Of Range";
          dispatch({
            type: DIALOG,
            payload: {isDialog:true,
              title: "Error",
            message: errorText}
          });
        } else {
          setOutOfRange(false);
        }
      }
    }
    setIsPolicyNumberValid(flag);
  };

  function onSearchData() {
    dispatch({ type: SEARCH_POLICY, payload: [] });
    setData([]);
    setFilterFlag(false);
    let errorText = "Policy number or Policy ID is out of range ";

    if (isPolicyNumberValid) {
      CustomSwal(
        "info",
        "Please Enter Comma Separated Policy Numbers or Policy Numbers with Version. (Eg:- 100,120,101 or 100.0,101.0)",
        navyColor,
        "Ok",
        ""
      );
    } else if (checkCommaSeparatedValue) {
      CustomSwal(
        "info",
        "Please Enter Comma Separated Values.(Ex:3253,2111)",
        navyColor,
        "Ok",
        ""
      );
    } else if (outOfRange || policyIdRange) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: errorText}
      });
    } else {
      // Create a new object for searchPolicyState without directly mutating the original state
      let updatedSearchPolicyState = {
        ...searchPolicyState,
        claimType: claimData ? claimData.join(",") : "",
        searchProductType: clientGroupType ? clientGroupType.join(",") : "",
        createdDate: dos ? Moment(dos).format("yyyy-MM-DD") : "",
      };

      let searchedData = {
        policyNumber: updatedSearchPolicyState.searchPolicyNumber,
        category: updatedSearchPolicyState.searchCategory,
        reason: updatedSearchPolicyState.searchReasonCode,
        description: updatedSearchPolicyState.searchDescription,
        policyId: updatedSearchPolicyState.searchPolicyId,
        lob: updatedSearchPolicyState.searchLob,
        productType: updatedSearchPolicyState.searchProductType,
        ebc: updatedSearchPolicyState.searchEbc,
        claimType: claimData,
        deactivated:
          searchPolicyState.searchDeactivated === 0 ||
          searchPolicyState.searchDeactivated === ""
            ? ""
            : 1,
        disabled:
          searchPolicyState.searchDisabled === 0 ||
          searchPolicyState.searchDisabled === ""
            ? ""
            : 1,
        medicalPolicy: updatedSearchPolicyState.searchMedicalPolicy,
        subPolicy: updatedSearchPolicyState.searchSubPolicy,
        reference: updatedSearchPolicyState.searchReference,
        priority: updatedSearchPolicyState.searchPriority,
        createDate: updatedSearchPolicyState.searchCreatedDate,
        cptCode: updatedSearchPolicyState.cptCode,
        pos: updatedSearchPolicyState.searchPos,
        billType: updatedSearchPolicyState.billType,
        clientGroup: updatedSearchPolicyState.searchClientGroupId,
      };
      let obj: { [key: string]: string } = {};
      Object.entries(searchedData).forEach(
        ([key, val]) => (obj[key] = val?.toString())
      );

      searchPolicy(dispatch, obj);
      setShowResults(true);
    }
  }
  function handleClaimType(e) {
    let claimData = e?.map((data) => {
      data.id = data.value;
      return data.value;
    });
    claimData.sort();
    setClaimData(claimData);
  }

  function handleClientGroupType(e) {
    let clientGrpType = e?.map((data) => {
      return data.value;
    });
    clientGrpType.sort();
    setClientGroupType(clientGrpType);
  }

  function policyStringMethod(e) {
    const re = /^[.,0-9\b]+$/;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }
  function policyAlphabetAndNumberMethod(e) {
    const ee = /[a-z.,0-9 ]/i;
    if (!ee.test(e.key)) {
      e.preventDefault();
    }
  }
  function PosStrictMethod(e) {
    const ee = /[a-z.,*0-9 ]/i;
    if (!ee.test(e.key)) {
      e.preventDefault();
    }
  }

  const getMedicalPolicyById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.medicalPolicyKey == id);
    if (d != undefined) {
      code = d.medicalPolicyTitle;
    }
    return code;
  };
  const getSubPolicyById = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.subPolicyKey == id);
    if (d != undefined) {
      code = d.subPolicyTitle;
    }
    return code;
  };
  const getPolicyCatDesc = (arr, id) => {
    let code = "";
    const d = arr?.find((a) => a.policyCategoryLkpId == id);
    if (d != undefined) {
      code = d.policyCategoryDesc;
    }
    return code;
  };

  const tableData = data
    ? data?.map((d: any) => {
        return {
          id:
            d.policyNumber || d.policyVersion
              ? d.policyNumber + "." + d.policyVersion
              : "",
          policyId: d.policyId,
          custom: d.custom == false ? "No" : "Yes",
          medicalPolicy: getMedicalPolicyById(
            medicalPolicy,
            d.medicalPolicyKeyFk
          ),
          subPolicy: getSubPolicyById(subPolicy, d.subPolicyKeyFk),
          description: d.policyDesc,
          policy: d,
        };
      })
    : [];
  let tempData = [];
  const [rowsData, setRowsData] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const onFilterChanged = (params) => {
    params.api.rowModel.rowsToDisplay?.forEach((c) => {
      tempData.push(c.data);
    });
    setRowsData(tempData);
    setFilterFlag(true);
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  const exportedData = () => {
    let exportTableData = [];
    if (filterFlag === true) {
      exportTableData = rowsData.map((d) => {
        return {
          "Policy.Version": d.id,
          custom: d.custom === false ? "No" : "Yes",
          MedicalPolicy: getMedicalPolicyById(
            medicalPolicy,
            d.policy.medicalPolicyKeyFk
          ),
          SubPolicy: getSubPolicyById(subPolicy, d.policy.subPolicyKeyFk),
          Description: d.description,
        };
      });
    } else {
      exportTableData = newPolicyState.policies.map((d) => {
        return {
          "Policy.Version":
            d.policyNumber || d.policyVersion
              ? d.policyNumber + "." + d.policyVersion
              : "",
          custom: d.custom === false ? "No" : "Yes",
          MedicalPolicy: getMedicalPolicyById(
            medicalPolicy,
            d.medicalPolicyKeyFk
          ),
          SubPolicy: getSubPolicyById(subPolicy, d.subPolicyKeyFk),
          Description: d.policyDesc,
        };
      });
    }
    exportedExcelFileData(
      exportTableData,
      clientGroupValue ? "Policies_" + clientGroupValue : "Policies",
      "Policies"
    );
  };

  async function onRowClicked(event) {
    const actions: any = [
      { type: RESET_STATE },
      { type: GET_PROCS, payload: [] },
      // { type: GET_CLIENT_ASSIGNMENT_DATA, payload: [] },
      { type: NEW_POLICY_CREATE_ARRAY, payload: [] },
      // { type: GET_DIAGNOSIS_DATA, payload: [] },
      { type: POLICY_BILL_TYPE_DATA, payload: [] },
      { type: GET_TAXONOMY_DATA, payload: [] },
      {type:RESET_POLICY_FILEDS},
      {type:RESET_DESCRIPTION_TAB_FIELDS},
      {type:RESET_DETAILS_TAB_FIELDS},
      {type:DIAGNOSIS_FIELDS,payload: {getDiagnosisTableData:[]}},
      {type:RESET_CHANGES_TAB_FIELDS},
      {type:RESET_CHANGES_TAB_TABLE},
      {type:CLIENT_ASSIGNMENT_FIELDS},
    ];
    batch(() => {
      actions.forEach((k) => dispatch(k));
    });
    batchDispatch(dispatch,actions);
    let policyId = event.data.policyId
    await Promise.all([
      getPolicyById(dispatch, policyId),
      getChangesById(dispatch, policyId),
      getClientAssignmentData(dispatch, policyId),
      getTaxIDDataPolicy(dispatch,policyId),
      getTaxonomyOfPolicy(dispatch,policyId),
      getNPIDataPolicy(dispatch,policyId)
    ]);
  }

  return (
    <Template>
      <div>
        <div>
          <GridContainer>
            <GridItem sm={10} md={10} xs={10}>
              <CustomHeader labelText={"Search"} />
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
              <CustomButton className={"fade-in"}
                onClick={() => onSearchData()}
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
              boxShadow: "none",
              border: "1px solid #D6D8DA",
              marginTop: "5px",
            }}
          >
            <div className="gridAlignment1">
              <GridContainer>
                <GridItem sm={1} md={1} xs={1}>
                  <CustomInput
                    onKeyPress={(e) => policyStringMethod(e)}
                    fullWidth={true}
                    labelText={"Policy.Version"}
                    variant={"outlined"}
                    type={"text"}
                    value={searchPolicyState.searchPolicyNumber}
                    onChange={(event) => {
                      let obj = _.cloneDeep(searchState);
                      obj.policyNumber = event.target.value;
                      setSearchState(obj);
                      checkLimit(obj.policyNumber, "Policy Number");
                      dispatch({
                        type: SEARCH_POLICY_NUMBER,
                        payload: event.target.value,
                      });
                    }}
                  />
                  {/* </div> */}
                </GridItem>
                <GridItem sm={1} md={1} xs={1}>
                  <CustomInput
                    onKeyPress={(e) => StringMethod(e)}
                    fullWidth={true}
                    labelText={"Policy ID"}
                    variant={"outlined"}
                    type={"text"}
                    value={searchPolicyState.searchPolicyId}
                    onChange={(event) => {
                      let obj = _.cloneDeep(searchState);
                      obj.policyId = event.target.value.replace(",", "");
                      setSearchState(obj);
                      checkPolicyIdLimit(obj.policyId, "Policy ID");
                      dispatch({
                        type: SEARCH_POLICY_ID,
                        payload: event.target.value,
                      });
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    onKeyPress={(e) => policyAlphabetAndNumberMethod(e)}
                    labelText={"CPT Code"}
                    type={"text"}
                    variant={"outlined"}
                    value={searchPolicyState.cptCode}
                    onChange={(event) => {
                      dispatch({ type: CPT_CODE, payload: event.target.value });
                      checkCommaSeparated(event.target.value);
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Category"}
                    variant={"outlined"}
                    value={searchPolicyState.categoryValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setOpenLkp(true);
                          setSelectedLkp("Policy Category LookUp");
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
                <GridItem sm={1} md={2} xs={1}>
                  <CustomInput
                    fullWidth={true}
                    type={"text"}
                    labelText={"Reason Code"}
                    variant={"outlined"}
                    value={searchPolicyState.reasonCodeValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setSelectedLkp("Reason Code LookUp");
                          setOpenLkp(true);
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    onKeyPress={(e) => policyAlphabetAndNumberMethod(e)}
                    labelText={"Bill Type"}
                    type={"text"}
                    variant={"outlined"}
                    value={searchPolicyState.billType}
                    onChange={(event) => {
                      dispatch({
                        type: BILL_TYPE,
                        payload: event.target.value,
                      });
                      checkCommaSeparated(event.target.value);
                    }}
                  />
                </GridItem>
                <GridItem sm={1} md={1} xs={1}>
                  <div style={{ marginTop: 22 }}>
                    <CustomCheckBox
                      checked={isDeactivatedChecked}
                      label={
                        <span
                          style={{
                            fontSize: "12px",
                            color: "black",
                            position: "relative",
                            bottom: "2px",
                          }}
                        >
                          Deactivated
                        </span>
                      }
                      onChange={(event) => {
                        setIsDeactivatedChecked(event.target.checked);
                        dispatch({
                          type: SEARCH_DEACTIVATED,
                          payload: event.target.checked ? 1 : 0,
                        });
                      }}
                    />
                  </div>
                </GridItem>
                <GridItem sm={1} md={1} xs={1}>
                  <div style={{ marginTop: 22 }}>
                    <CustomCheckBox
                      checked={isDisabledChecked}
                      onChange={(event) => {
                        setIsDisabledChecked(event.target.checked);
                        dispatch({
                          type: SEARCH_DISABLED,
                          payload: event.target.checked ? 1 : 0,
                        });
                      }}
                      label={
                        <span
                          style={{
                            fontSize: "12px",
                            color: "black",
                            position: "relative",
                            bottom: "2px",
                          }}
                        >
                          Disabled
                        </span>
                      }
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </div>
            <div className="gridAlignment2">
              <GridContainer>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomSelect
                    onSelect={(event) => {
                      if (event != null) {
                        dispatch({ type: SEARCH_LOB, payload: event.value });
                        dispatch({ type: LOB_VALUE, payload: event });
                      } else {
                        dispatch({ type: SEARCH_LOB, payload: "" });
                        dispatch({ type: LOB_VALUE, payload: "" });
                      }
                    }}
                    options={LotCM}
                    labelText={"LOB"}
                    value={searchPolicyState.lobValue}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomSelect
                    labelText={"Client Group Type"}
                    isMulti
                    checkBoxes={true}
                    onSelect={(event) => {
                      if (event != null) {
                        handleClientGroupType(event);
                        dispatch({ type: PRODUCT_TYPE_VALUE, payload: event });
                        dispatch({
                          type: SEARCH_PRODUCT_TYPE,
                          payload: event.value,
                        });
                      }
                    }}
                    value={clientGrpTypes}
                    options={productTypeCM}
                    // onSelect={(event) => {
                    //   if (event != null) {
                    //     dispatch({ type: PRODUCT_TYPE_VALUE, payload: event })
                    //     dispatch({ type: SEARCH_PRODUCT_TYPE, payload: event.value })
                    //   } else {
                    //     dispatch({ type: PRODUCT_TYPE_VALUE, payload: "" })
                    //     dispatch({ type: SEARCH_PRODUCT_TYPE, payload: "" })
                    //   }
                    // }}
                    // options={productTypeCM}
                    // labelText={"Client Group Type"}
                    // value={searchPolicyState.productTypeValue}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Enforce Before Category"}
                    variant={"outlined"}
                    value={searchPolicyState.ebcValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setOpenLkp(true);
                          setSelectedLkp("Enforce Before Category LookUp");
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomSelect
                    labelText={"Claim Type"}
                    isMulti
                    checkBoxes={true}
                    onSelect={(event) => {
                      if (event != null) {
                        handleClaimType(event);
                        dispatch({ type: CLAIM_TYPE_VALUE, payload: event });
                      }
                    }}
                    value={claimTypeValues}
                    options={claimTypeOptions}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Medical Policy"}
                    variant={"outlined"}
                    value={searchPolicyState.medicalPolicyValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setOpenLkp(true);
                          setSelectedLkp("Medical Policy LookUp");
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Sub Policy"}
                    variant={"outlined"}
                    value={searchPolicyState.subPolicyValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setOpenLkp(true);
                          setSelectedLkp("SubPolicy LookUp");
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
              </GridContainer>
            </div>
            <div className="gridAlignment3">
              <GridContainer>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Reference"}
                    variant={"outlined"}
                    value={searchPolicyState.searchReference}
                    onChange={(event) => {
                      dispatch({
                        type: SEARCH_REFERENCE,
                        payload: event.target.value,
                      });
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Priority in Category"}
                    variant={"outlined"}
                    onKeyPress={(e) => StringMethod(e)}
                    value={searchPolicyState.searchPriority}
                    onChange={(event) => {
                      dispatch({
                        type: SEARCH_PRIORITY,
                        payload: event.target.value,
                      });
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    labelText={"Description"}
                    variant={"outlined"}
                    value={searchPolicyState.searchDescription}
                    onChange={(event) => {
                      dispatch({
                        type: SEARCH_DESCRIPTION,
                        payload: event.target.value,
                      });
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <CustomInput
                    fullWidth={true}
                    onKeyPress={(e) => PosStrictMethod(e)}
                    labelText={"POS"}
                    variant={"outlined"}
                    value={searchPolicyState.searchPos}
                    onChange={(event) => {
                      dispatch({ type: POS, payload: event.target.value });
                      // checkCommaSeparated(event.target.value)
                    }}
                  />
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <Stack component="form" noValidate>
                    <CustomInput
                      id="date"
                      type="date"
                      variant={"outlined"}
                      labelText={"Created Date"}
                      value={dos}
                      onChange={(event) => {
                        dispatch({
                          type: SEARCH_CREATED_DATE,
                          payload: event.target.value,
                        });
                        setdos(event.target.value);
                        dispatch({
                          type: SEARCH_CREATED_DATE,
                          payload: event.target.value,
                        });
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
                    labelText={"Client Group"}
                    variant={"outlined"}
                    value={searchPolicyState.clientGroupValue}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setOpenLkp(true);
                          setSelectedLkp("Client Group");
                        }}
                      >
                        <MoreHoriz
                          style={{
                            cursor: "pointer",
                            fontSize: 15,
                            color: black,
                          }}
                        />
                      </InputAdornment>
                    }
                  />
                </GridItem>
              </GridContainer>
            </div>
          </CustomPaper>
        </div>
        <div>
          <div
            className="searchGrid"
            style={{ height: window.innerHeight / 1.86 }}
          >
            {tableData.length > 0 && showResults ? (
              <>
                <AgGrids
                  rowData={tableData}
                  columnDefs={columnDefs}
                  gridIconStyle={gridIconStyle}
                  onFilterChanged={onFilterChanged}
                  onRowDoubleClicked={async (event: any) => {
                    onRowClicked(event);
                    navigate("/viewPolicy");
                  }}
                />
                <small
                  style={{ position: "relative", top: "5px", fontSize: "12px" }}
                >
                  Number of rows : {numberOfRows}
                </small>
              </>
            ) : (
              <span style={{}}>No data found</span>
            )}
          </div>
        </div>
        <div>
          {AccessForExport(tableData, adminIdx) ? (
            <CustomButton
              onClick={exportedData}
              variant={"contained"}
              style={{
                backgroundColor: navyColor,
                color: "white",
                padding: 3,
                fontSize: 12,
                float: "right",
                textTransform: "capitalize",
                // marginLeft: 10,
                marginBottom: 10,
              }}
            >
              Export
            </CustomButton>
          ) : undefined}
        </div>
      </div>

      <Dialogbox
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        disableBackdropClick={true}
        open={openLkp}
        onClose={handleToClose}
        title={selectedLkp}
        message={
          <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
            <AgGrids
              rowData={rows}
              columnDefs={selectedLkpColumns}
              rowSelection={
                selectedLkp == "Client Group" ? "single" : "multiple"
              }
              onSelectionChanged={onSelectionChanged}
              onGridReady={onGridReady}
              gridIconStyle={lkpGridIconStyle}
            />
          </div>
        }
        actions={
          <ButtonGroup style={{ marginTop: "-50px" }}>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                handleToClose();
                setCheckboxValues();
              }}
              onChange={(event) => {}}
              style={{
                backgroundColor: navyColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleToClose();
                // clearDialogValues();
              }}
              variant={"contained"}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              No
            </CustomButton>
          </ButtonGroup>
        }
      />
    </Template>
  );
};

export default Search;

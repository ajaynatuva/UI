import { ButtonGroup, InputAdornment, Tab, Tabs } from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";
import { MoreHoriz } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/system";
import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
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
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import { getChangesById } from "../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import {
  BILL_TYPE_RESET,
  ERROR_RESET_STATE,
  GET_CLIENT_ASSIGNMENT_DATA,
  RESET_CONDITION_CODE_FIELDS,
  RESET_DESCRIPTION_TAB_FIELDS,
  RESET_DETAILS_TAB_FIELDS,
  RESET_POLICY_FILEDS,
  VALIDATE_NEW_POLICY,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "../NewPolicy/NewPolicy.css";
import Changes from "./ChangesTab/Changes";
import "./NewPolicy.css";
import NewPolicyPopUp from "./NewPolicyPopUp";
import { PolicyConstants } from "./PolicyConst";
import {
  // clearDialogValues,
  displayCatTab,
  fetchVersions,
  getCatDesc,
  getMedicalDesc,
  getReasonDesc,
  getSubPolicyDesc,
  getTabClass,
  getTabLabel,
  getTabStyle,
  handleNewPolicyTabChange,
  // handleCategoryError,
  // handleClickToOpen,
  // handleNewPolicyErrors,
  // handleNewPolicyTabChange,
  handleNewPolicyTabErrors,
  handleNewPolicyTabValidations,
  isFieldInvalid,
  // handleNewPolicyTabValidations,
  leavePage,
  populateCategoryFields,
  setCheckboxValues,
  TabPanelWrapper,
  updateColumns,
  updatePrevDescriptions,
} from "./newPolicyUtils";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import ClassicLoader from "../../components/Spinner/ClassicLoader";
import Taxonomy from "./TaxonomyTab/Taxonomy";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { POLICY_FIELDS } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NewPolicyPopState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyPopReducer";
import { ValidatePolicyState } from "../../redux/reducers/NewPolicyTabReducers/ValidateFieldsReducer";
import { CategoryState } from "../../redux/reducers/NewPolicyTabReducers/CategoryReducer";
import TextControl from "../../components/TextArea/TextControl";
import {
  getPolicyById,
  onSaveNewPolicy,
  onUpdateNewPolicy,
} from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import { DescriptionTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { DetailsTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/DetailsTabFieldsReducer";
import { BillTypeState } from "../../redux/reducers/NewPolicyTabReducers/BillTypeReducer";
import { conditionCodeTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ConditionCodeTabFieldsReducer";
import { changesTabFieldState } from "../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { Dispatch, AnyAction } from "redux";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
// import { NewPolicyValidation } from "../../redux/ApiCallAction/Validations/PolicyValidation";
// import Taxonomy from './Taxonomy';
import { DiagnosisFieldState } from "../../redux/reducers/NewPolicyTabReducers/DiagnosisReducer";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { set } from "date-fns";
import { ca } from "date-fns/locale";

const Desc = lazy(() => import("./DescTab/Desc"));
const Props = lazy(() => import("./DetailsTab/Details"));
const Procs = lazy(() => import("./CPT_HCPCS_Tab/CPT_HCPCS"));
const CatOpt = lazy(() => import("./CategoryTab/CatOpt"));
const BillType = lazy(() => import("./BillTypeTab/BillType"));
const ClientAssignment = lazy(
  () => import("./ClientAssignmentTab/ClientAssignment")
);
const ConditionCode = lazy(() => import("./ConditionCodeTab/ConditionCode"));
const Diagnosis = lazy(() => import("./DaignosisTab/Diagnosis"));
const TaxID = lazy(() => import("./TaxIdTab/TaxId"));
const NPI = lazy(() => import("./NPITab/NPI"));

const NewPolicy = ({
  edit,
  fromViewPolicy,
  showImportButton,
  customCreatedB,
}) => {
  const { state } = useLocation();
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const policyCreateState: NewPolicyPopState = useSelector(
    (state: any) => state.policyCreation
  );
  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const descTabFields: DescriptionTabFieldState = useSelector(
    (state: any) => state.DescTabFieldsRedux
  );
  const detailsTabFields: DetailsTabFieldState = useSelector(
    (state: any) => state.DetailsTabFieldsRedux
  );
  const billTypeTabFields: BillTypeState = useSelector(
    (state: any) => state.billTypeTabFieldsRedux
  );
  const conditonTabFields: conditionCodeTabFieldState = useSelector(
    (state: any) => state.conditionCodeTabFieldsRedux
  );
  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  const catState: CategoryState = useSelector(
    (state: any) => state.catTabFieldsRedux
  );
  const DiagnosisTabFields: DiagnosisFieldState = useSelector(
    (state: any) => state.DiagnosisFieldsRedux
  );

  const validateFields: ValidatePolicyState = useSelector(
    (state: any) => state.validatePolicyFieldsRedux
  );
  const claimTypeValues = policyFields.claimType?.map((p) => {
    return { label: p.label.charAt(0), value: p.value };
  });
  //@ts-ignore
  const newPolicy = state?.new;
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [reasonCodes, setReasonCodes] = useState([]);
  const [cats, setCats] = useState([]);
  const [medicalPolicy, setMedicalPolicy] = useState([]);
  const [openLkp, setOpenLkp] = React.useState(false);
  const [subPolicy, setSubPolicy] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [selectedLkpColumns, setSelectedLkpColumns] = useState([]);
  const [selectedLkp, setSelectedLkp] = useState("");
  const [rows, setRows] = useState([]);
  const [descTabErr, setDescTabErr] = useState(false);
  const [propErr, setPropErr] = useState(false);
  const [billTypeTabErr, setBillTypeTabError] = useState(false);
  const [conditionTabErr, setConditionTabError] = useState(false);
  const [policyFieldsErr, setPolicyFieldsErr] = useState(false);

  const [ChangeErr, setChangeErr] = useState(false);
  const [catTabErr, setCatTabErr] = useState(false);
  const [openPolicyCreationPopUp, setOpenPolicyCreationPopUp] = useState(false);
  const [clickOnBrowserBackButton, setClickOnBrowserBackButton] =
    useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [forClientTabPolicyId, setForClientTabPolicyId] = useState("");
  const [newPolicyId, setSaveNewPolicId] = useState("");
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState("");
  const [showAllErrors, setShowAllErrors] = useState(false);
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
  const fullWidth = true;
  const maxWidth = "sm";
  const goToViewPolicy = () => {
    getPolicyById(dispatch, policyFields.policyId);
    getChangesById(dispatch, policyFields.policyId);
    dispatch({ type: ERROR_RESET_STATE });
    setShowAllErrors(false);
    navigate("/viewPolicy");
  };

  const location = useLocation();
  const paths = location.pathname.replaceAll("/", "");

  const updatedState = useSelector((state: any) => state.newPolicy);
  const isDisabled = edit && fromViewPolicy;
  const handleToClose = () => {
    setOpen(false);
    setOpenLkp(false);
  };
  const tabData = [
    {
      label: "Description",
      value: "Description",
      error: descTabErr,
    },
    {
      label: "Details",
      value: "Details",
      error: propErr,
    },
    {
      label: "CPT/HCPCS",
      value: "CPT/HCPCS",
    },
    {
      label: "Changes",
      value: "Changes",
      error: ChangeErr,
    },
    {
      label: "Diagnosis",
      value: "Diagnosis",
    },
    {
      label: "Bill Type",
      value: "BillType",
      error: billTypeTabErr,
    },
    {
      label: "Condition Code",
      value: "ConditionCode",
      error: conditionTabErr,
    },
    {
      label: "Client Assignment",
      value: "ClientAssignment",
    },
    {
      label: "Taxonomy",
      value: "Taxonomy",
    },
    {
      label: "Tax ID",
      value: "TaxID",
    },
    {
      label: "NPI",
      value: "NPI",
    },
  ];
  const [updatedTabData, setUpdatedTabData] = useState(tabData);
  useEffect(() => {
    const newTabData = tabData.map((tab) => {
      if (tab.value === "Description") {
        return { ...tab, error: descTabErr };
      } else if (tab.value === "Details") {
        return { ...tab, error: propErr };
      } else if (tab.value === "Changes") {
        return { ...tab, error: ChangeErr };
      } else if (tab.value === "BillType") {
        return { ...tab, error: billTypeTabErr };
      } else if (tab.value === "ConditionCode") {
        return { ...tab, error: conditionTabErr };
      }
      return tab;
    });
    const catTab = {
      label: "CAT OPT",
      value: "catOpt",
      error: catTabErr,
    };

    if (displayCatTab(policyFields.catCode)) {
      newTabData.splice(3, 0, catTab); // Insert CAT OPT tab at position 3
    }
    setUpdatedTabData(newTabData);
  }, [
    descTabErr,
    propErr,
    ChangeErr,
    catTabErr,
    billTypeTabErr,
    conditionTabErr,
    policyFields.catCode,
  ]); // Include all dependencies

  // useEffect(() => {
  //   if (paths === PolicyConstants.VIEW_POLICY) {
  //     // getPolicyById(dispatch, formState.policyId);
  //     viewPolicyPage(policyFields, dispatch);
  //   }
  // }, []);


  useEffect(() => {
    dispatch({ type: POLICY_FIELDS, payload: { paths: paths } });
  }, [policyFields.paths]);

  const memoizedPolicyFields = useMemo(
    () => policyFields,
    [
      policyFields.catCode,
      policyFields.reasonCode,
      policyFields.medicalPolicyCode,
      policyFields.subPolicyCode,
    ]
  );
  const memoizedUpdatedState = useMemo(
    () => updatedState,
    [
      updatedState.CAT.length,
      updatedState.RSN.length,
      updatedState.SubPolicy.length,
      updatedState.MedicalPolicy.length,
    ]
  );

  useEffect(() => {
    updatePrevDescriptions(
      memoizedPolicyFields,
      memoizedUpdatedState,
      dispatch,
      selectedLkp
    );
  }, [dispatch, memoizedPolicyFields, memoizedUpdatedState, selectedLkp]);

  function checkCustomCheckBox(check) {
    if (policyFields.version === 0 && check === true) {
      CustomSwal(
        "error",
        "Base policy should not been created has a custom policy",
        navyColor,
        "Ok",
        ""
      );
    }
  }

  const checkTextSize = (event, fieldName, expectedLength) => {
    if (event.length > expectedLength) {
      CustomSwal(
        "error",
        `Please check the length of ${fieldName} (more than ${expectedLength} characters)`,
        navyColor,
        "Ok",
        ""
      );
    }
  };

  const claimTypeOptions = updatedState.getClaimTypes?.map((p) => {
    return { label: p.claimType + "-" + p.description, value: p.claimType };
  });

  useEffect(() => {
    fetchVersions(updatedState, dispatch);
    if (policyFields.policyId == null) {
      dispatch({ type: GET_CLIENT_ASSIGNMENT_DATA, payload: [] });
    }
  }, []);
  useEffect(() => {
    handleNewPolicyTabChange(
      policyFields.catCode,
      policyFields.newPolicyTabs,
      paths,
      setSelectedTab,
      dispatch
    );
  }, [policyFields.newPolicyTabs]);

  useEffect(() => {
    handleNewPolicyTabValidations(
      policyFields.catCode,
      policyFields.newPolicyTabs,
      setSelectedTab,
      dispatch
    );
  }, [policyFields.catCode]);

  // useEffect(() => {
  //   handleNewPolicyErrors(
  //     newPolicy,
  //     edit,
  //     policyFields.catCode,
  //     null,
  //     setTabErr,
  //     setPropErr,
  //     setChangeErr,
  //     setCatTabErr,
  //     setBillTypeTabError,
  //     setConditionTabError
  //   );
  // }, [edit, null, policyFields.catCode, newPolicy]);
  // const descTabFieldsMemo = useMemo(() => JSON.stringify(descTabFields), [descTabFields]);

  // useEffect(() => {
  //   handleNewPolicyTabErros(newPolicy, edit, descTabFields, setTabErr, showAllErrors);
  // }, [edit,newPolicy, showAllErrors, descTabFieldsMemo]); // Using memoized string to track changes

  // const handleSave = () =>
  //   handleClickToOpen(
  //     formStateData,
  //     fromViewPolicy,
  //     setOpen,
  //     catError,
  //     dispatch
  //   );

  useEffect(() => {
    const [currentLkpColumns, currentRows] = updateColumns(
      selectedLkp,
      reasonCodes,
      cats,
      medicalPolicy,
      subPolicy
    );
    setSelectedLkpColumns(currentLkpColumns);
    setRows(currentRows);
  }, [cats, medicalPolicy, reasonCodes, selectedLkp, subPolicy]);

  const resetInputField = () => {
    setShowAlert(true);
  };
  const resetAllTabErrors = () => {
    setShowAllErrors(false);
    setDescTabErr(false);
    setPropErr(false);
    setCatTabErr(false);
    setBillTypeTabError(false);
    setConditionTabError(false);
    setChangeErr(false);
  };

  const onSelectionChanged = (event) => {
    if (edit) return;
    const a = event.api.getSelectedRows();
    setSelectedCheckboxValue(a);
  };
  const onGridReady = (data) => {
    data.api.forEachLeafNode((s) => {
      if (selectedLkp == PolicyConstants.POLICY_CAT_LKP) {
        if (s.data?.id === policyFields.catCodeCheck) {
          s.setSelected(true);
        }
      }

      if (selectedLkp == PolicyConstants.REASON_CODE_LKP) {
        if (s.data?.id === policyFields.reasonCodeCheck) {
          s.setSelected(true);
        }
      }
      if (selectedLkp == PolicyConstants.MEDICAL_POLICY_LKP) {
        if (s.data?.id === policyFields.medicalCodeCheck) {
          s.setSelected(true);
        }
      }
      if (selectedLkp == PolicyConstants.SUB_POLICY_LKP) {
        if (s.data?.id === policyFields.subCodeCheck) {
          s.setSelected(true);
        }
      }
    });
  };

  useEffect(() => {
    setReasonCodes(updatedState.RSN);
    setCats(updatedState.CAT);
    setMedicalPolicy(updatedState.MedicalPolicy);
    setSubPolicy(updatedState.SubPolicy);
  }, [
    updatedState.CAT,
    updatedState.MedicalPolicy,
    updatedState.RSN,
    updatedState.SubPolicy,
  ]);

  const roleState: UserState = useSelector((state: any) => state.userReducer);

  const navigate = useNavigate();

  function getHeader() {
    if (fromViewPolicy) {
      if (!edit) {
        return (
          <div className="newPolicyHeader1">
            <CustomHeader labelText={"Edit Policy"} />
          </div>
        );
      } else {
        return (
          <div className="viewPolicyHeader">
            <CustomHeader labelText={"View Policy"} />
          </div>
        );
      }
    } else {
      return (
        <div className="newPolicyHeader">
          <CustomHeader labelText={"New Policy"} />
        </div>
      );
    }
  }

  const renderTab = (label, value, error, selectedTab) => (
    <Tab
      key={value}
      className="desc"
      style={{
        backgroundColor: selectedTab === value ? "white" : navyColor,
        color: selectedTab === value ? navyColor : "white",
        minHeight: "3px",
        marginTop: "-4px",
        minWidth: "3px",
        fontSize: "12px",
        textTransform: "capitalize",
      }}
      label={error ? getTabLabel(label, error) : label}
      value={value}
    />
  );

  async function onSave() {
    let allStates = {
      policyFields: policyFields,
      descTabFields: descTabFields,
      detailsTabFields: detailsTabFields,
      changesTabFields: changesTabFields,
      billTypeTabFields: billTypeTabFields,
      conditonTabFields: conditonTabFields,
      catTabFields: populateCategoryFields(policyFields,catState),
      DiagnosisTabFields: DiagnosisTabFields,
    };
    setOpen(false);
    if (fromViewPolicy) {
      await onUpdateNewPolicy(
        dispatch,
        fromViewPolicy,
        allStates,
        navigate,
        roleState
      );
    } else {
      await onSaveNewPolicy(
        dispatch,
        fromViewPolicy,
        allStates,
        navigate,
        policyCreateState.newpolicyCreateArray,
        forClientTabPolicyId,
        newPolicyId
      );
    }
  }

  const hiddenInputRef = useRef(null);

  const enterValuesInHiddenInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.click();
    }
  };

  const urlChangeHandler = (url, replace = false) => {
    const historyMethod = replace ? "replaceState" : "pushState";
    window.history[historyMethod]({}, "", url);
  };

  useEffect(() => {
    urlChangeHandler(window.location.href);
    enterValuesInHiddenInput();
    return () => {
      if (!fromViewPolicy && openPolicyCreationPopUp)
        setClickOnBrowserBackButton(true);
    };
  }, []);

  useEffect(() => {
    enterValuesInHiddenInput();

    const handlePopState = (event) => {
      event.preventDefault();
      if (!fromViewPolicy && openPolicyCreationPopUp) {
        setClickOnBrowserBackButton(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.history.pushState({ clickOnBrowserBackButton: false }, "");

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hiddenInputRef, urlChangeHandler]);

  function showPopUpTitle() {
    let title = "";
    if (clickOnBrowserBackButton || showAlert) {
      title = "Alert";
    }
    if (openLkp) {
      title = selectedLkp;
    }
    return title;
  }
  function showContentInPoPup() {
    if (clickOnBrowserBackButton || showAlert) {
      return "You might loose your data if not saved";
    }

    if (openLkp) {
      return (
        <>
          <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
            <AgGrids
              rowData={rows}
              columnDefs={selectedLkpColumns}
              rowSelection={"single"}
              onSelectionChanged={onSelectionChanged}
              onGridReady={onGridReady}
              gridIconStyle={lkpGridIconStyle}
            />
          </div>
        </>
      );
    }
  }
  useEffect(() => {
    setCheckboxValues(
      selectedCheckboxValue,
      selectedLkp,
      edit,
      policyFields,
      dispatch
    );
  }, [
    policyFields.catCode,
    policyFields.reasonCode,
    policyFields.medicalPolicyCode,
    policyFields.subPolicyCode,
  ]);

  function showButtonsInPopUp() {
    return (
      <>
        <ButtonGroup style={{ marginTop: "-50px" }}>
          <CustomButton
            variant={"contained"}
            onClick={(data) => {
              if (openLkp) {
                handleToClose();
                setCheckboxValues(
                  selectedCheckboxValue,
                  selectedLkp,
                  edit,
                  validateFields,
                  dispatch
                );
              } else {
                resetAllTabErrors();
                setSelectedCheckboxValue("");
                leavePage(
                  showAlert,
                  dispatch,
                  setSelectedTab,
                  setShowAlert,
                  setShowAllErrors,
                  navigate
                );
              }
            }}
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
              if (openLkp) {
                handleToClose();
                // clearDialogValues(fromViewPolicy, policyFields, dispatch);
              } else {
                setClickOnBrowserBackButton(false);
                setShowAlert(false);
              }
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
            Cancel
          </CustomButton>
        </ButtonGroup>
      </>
    );
  }

  function openPop() {
    if (openLkp) {
      return openLkp;
    }
    if (clickOnBrowserBackButton) {
      return clickOnBrowserBackButton;
    }
    if (showAlert) {
      return showAlert;
    }
    return false;
  }

  function TabErrors(error) {
    let result = handleNewPolicyTabErrors(
      newPolicy,
      edit,
      policyFields,
      descTabFields,
      detailsTabFields,
      catState,
      changesTabFields,
      billTypeTabFields,
      conditonTabFields,
      policyFields.catCode,
      setPolicyFieldsErr,
      setDescTabErr,
      setPropErr,
      setCatTabErr,
      setChangeErr,
      setBillTypeTabError,
      setConditionTabError,
      error
    );
    if (result === false) {
      setOpen(true);
    }
  }
  return (
    <Template>
      <>
        {!openPolicyCreationPopUp && !fromViewPolicy ? (
          <NewPolicyPopUp
            value={{
              setOpenPolicyCreationPopUp,
              setForClientTabPolicyId,
              setSaveNewPolicId,
              resetAllTabErrors
            }}
          />
        ) : (
          <div>
            <div
              style={{
                pointerEvents: edit ? "none" : "visible",
                opacity: edit ? 0.7 : 1,
              }}
            >
              <GridContainer>
                <GridItem sm={10} md={10} xs={10}>
                  {getHeader()}
                </GridItem>
                {!edit ? (
                  <GridItem sm={2} md={2} xs={2}>
                    {!edit && !fromViewPolicy ? (
                      <CustomButton
                        variant={"contained"}
                        onClick={() => {
                          resetInputField();
                        }}
                        style={{
                          backgroundColor: dangerColor,
                          float: "right",
                          color: "white",
                          padding: 4,
                          fontSize: 12,
                          marginLeft: 10,
                          textTransform: "capitalize",
                        }}
                      >
                        Reset
                      </CustomButton>
                    ) : undefined}

                    {fromViewPolicy ? (
                      <CustomButton
                        variant={"contained"}
                        onClick={() => {
                          goToViewPolicy();
                        }}
                        style={{
                          backgroundColor: dangerColor,
                          float: "right",
                          color: "white",
                          marginLeft: 10,
                          textTransform: "capitalize",
                          fontSize: 12,
                          padding: 4,
                        }}
                      >
                        Cancel
                      </CustomButton>
                    ) : undefined}
                    <CustomButton
                      variant={"contained"}
                      onClick={
                        () => {
                          setShowAllErrors(true);
                          TabErrors(true);
                        }
                        // handleSave
                      }
                      style={{
                        backgroundColor: navyColor,
                        float: "right",
                        color: "white",
                        fontSize: 12,
                        padding: 4,
                        textTransform: "capitalize",
                      }}
                    >
                      Save
                    </CustomButton>
                  </GridItem>
                ) : undefined}
              </GridContainer>
            </div>
            <GridContainer className="newpolicy">
              <div>
                <CustomPaper
                  style={{
                    paddingLeft: 15,
                    paddingRight: 25,
                    boxShadow: "none",
                    border: "1px solid #D6D8DA",
                    marginRight: "10px",
                  }}
                >
                  <GridContainer>
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="pNum">
                        <CustomInput
                          fullWidth={true}
                          maxLength={10}
                          type={"text"}
                          value={
                            fromViewPolicy ? policyFields.policyNumber : ""
                          }
                          labelText={"Policy#"}
                          onKeyPress={(e) => StringMethod(e)}
                          disabled
                          variant={"outlined"}
                        />
                      </div>
                    </GridItem>
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="vers">
                        <CustomInput
                          fullWidth={true}
                          labelText={"Version"}
                          disabled
                          value={fromViewPolicy ? policyFields.version : ""}
                          type={"text"}
                          variant={"outlined"}
                        />
                      </div>
                    </GridItem>
                    <GridItem sm={1} md={1} xs={1}>
                      <CustomCheckBox
                        size="small"
                        // checked={customCreatedB == true?true:false}
                        checked={policyFields.custom == true}
                        value={policyFields.custom}
                        labelPlacement={"top"}
                        className="checkboxes"
                        // disabled={isDisabled}
                        disabled
                        label={
                          <span
                            style={{
                              fontSize: "13px",
                              position: "relative",
                              top: "10px",
                            }}
                          >
                            Custom
                          </span>
                        }
                        onChange={(event) => {
                          dispatch({
                            type: POLICY_FIELDS,
                            payload: { custom: event.target.checked },
                          });
                          checkCustomCheckBox(event.target.checked);
                        }}
                      />
                    </GridItem>
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="pId">
                        <CustomInput
                          fullWidth={true}
                          disabled
                          labelText={"Policy ID"}
                          variant={"outlined"}
                          value={fromViewPolicy ? policyFields.policyId : ""}
                        />
                      </div>
                    </GridItem>
                    <GridItem sm={2} md={2} xs={2}>
                      <CustomInput
                        error={
                          showAllErrors
                            ? isFieldInvalid(policyFields.catCode)
                            : false
                        }
                        showStarIcon={true}
                        fullWidth={true}
                        labelText={"Category"}
                        variant={"outlined"}
                        value={getCatDesc(policyFields.catCode, cats)}
                        endAdornment={
                          <InputAdornment
                            position="end"
                            onClick={() => {
                              setOpenLkp(true);
                              setSelectedLkp(PolicyConstants.POLICY_CAT_LKP);
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
                    <GridItem sm={3} md={3} xs={3}>
                      <CustomInput
                        fullWidth={true}
                        type={"text"}
                        labelText={"Reason Code"}
                        showStarIcon={true}
                        variant={"outlined"}
                        error={
                          showAllErrors
                            ? isFieldInvalid(policyFields.reasonCode)
                            : false
                        }
                        value={getReasonDesc(
                          policyFields.reasonCode,
                          reasonCodes
                        )}
                        endAdornment={
                          <InputAdornment
                            position="end"
                            onClick={() => {
                              setSelectedLkp(PolicyConstants.REASON_CODE_LKP);
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
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="checkbox">
                        <CustomCheckBox
                          checked={policyFields.prod == 1}
                          value={policyFields.prod}
                          size="small"
                          className="checkboxes"
                          propsColor={navyColor}
                          disabled={isDisabled}
                          label={
                            <span
                              style={{
                                fontSize: "12px",
                                position: "relative",
                                bottom: "2px",
                              }}
                            >
                              Prod
                            </span>
                          }
                          onChange={(event) => {
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: { prod: event.target.checked },
                            });
                          }}
                        />
                      </div>
                    </GridItem>
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="checkbox">
                        <CustomCheckBox
                          checked={policyFields.deactivated == 1}
                          value={policyFields.deactivated}
                          className="deactivated"
                          disabled={isDisabled}
                          propsColor={navyColor}
                          label={
                            <span
                              style={{
                                fontSize: "12px",
                                position: "relative",
                                bottom: "2px",
                              }}
                            >
                              Deactivated
                            </span>
                          }
                          onChange={(event) => {
                            // formState.deactivated = event.target.checked ? 1 : 0;
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: { deactivated: event.target.checked },
                            });
                          }}
                        />
                      </div>
                    </GridItem>
                    <GridItem sm={1} md={1} xs={1}>
                      <div className="checkbox">
                        <CustomCheckBox
                          checked={policyFields.disabled == 1}
                          value={policyFields.disabled}
                          disabled={isDisabled}
                          size="small"
                          propsColor={navyColor}
                          className="checkboxes"
                          label={
                            <span
                              style={{
                                fontSize: "12px",
                                position: "relative",
                                bottom: "2px",
                              }}
                            >
                              Disabled
                            </span>
                          }
                          onChange={(event) => {
                            // formState.disabled ? 1 : 0;
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: { disabled: event.target.checked },
                            });
                          }}
                        />
                      </div>
                    </GridItem>
                    <GridContainer
                      style={{ width: "100%", marginLeft: 0, marginTop: -10 }}
                    >
                      <GridItem sm={3} md={3} xs={3}>
                        <CustomInput
                          // error={formState.errors?.medicalPolicy}
                          error={
                            showAllErrors
                              ? isFieldInvalid(policyFields.medicalPolicyCode)
                              : false
                          }
                          fullWidth={true}
                          labelText={"Medical Policy"}
                          showStarIcon={true}
                          variant={"outlined"}
                          value={getMedicalDesc(
                            policyFields.medicalPolicyCode,
                            medicalPolicy
                          )}
                          endAdornment={
                            <InputAdornment
                              position="end"
                              onClick={() => {
                                setOpenLkp(true);
                                setSelectedLkp(
                                  PolicyConstants.MEDICAL_POLICY_LKP
                                );
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
                      <GridItem sm={3} md={3} xs={3}>
                        <CustomInput
                          // error={formState.errors?.subPolicy}
                          error={
                            showAllErrors
                              ? isFieldInvalid(policyFields.subPolicyCode)
                              : false
                          }
                          fullWidth={true}
                          labelText={"Sub Policy"}
                          showStarIcon={true}
                          variant={"outlined"}
                          value={getSubPolicyDesc(
                            policyFields.subPolicyCode,
                            subPolicy
                          )}
                          endAdornment={
                            <InputAdornment
                              position="end"
                              onClick={() => {
                                setOpenLkp(true);
                                setSelectedLkp(PolicyConstants.SUB_POLICY_LKP);
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
                      <GridItem sm={4} md={3} xs={4}>
                        <CustomInput
                          disabled={isDisabled}
                          error={
                            showAllErrors
                              ? isFieldInvalid(policyFields.reference)
                              : false
                          }
                          value={policyFields.reference}
                          onChange={(event) => {
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: {
                                reference: event.target.value,
                                errors: {
                                  ...policyFields?.errors,
                                  reference: false,
                                },
                              },
                            });
                          }}
                          maxLength={500}
                          fullWidth={true}
                          labelText={"Reference"}
                          showStarIcon={true}
                          variant={"outlined"}
                        />
                      </GridItem>
                      <GridItem sm={2} md={3} xs={2}>
                        <CustomSelect
                          isMulti
                          checkBoxes={true}
                          isDisabled={isDisabled}
                          error={
                            showAllErrors
                              ? isFieldInvalid(policyFields.claimType)
                              : false
                          }
                          onSelect={(event) => {
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: {
                                claimType: event,
                                errors: {
                                  ...policyFields?.errors,
                                  claimType: false,
                                },
                              },
                            });
                          }}
                          value={claimTypeValues}
                          options={claimTypeOptions}
                          labelText={"Claim Type"}
                          showStarIcon={true}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextControl
                        label={"Description"}
                        rows={2}
                        disabled={!edit ? undefined : fromViewPolicy}
                        value={policyFields.policyDescription}
                        onChange={(event) => {
                          checkTextSize(
                            event.target.value,
                            "Description",
                            4000
                          );
                          if (event.target.value.length > 4000) {
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: undefined,
                              errors: {
                                ...policyFields?.errors,
                                policyDescription: false,
                              },
                            });
                          } else {
                            dispatch({
                              type: POLICY_FIELDS,
                              payload: {
                                policyDescription: event.target.value,
                              },
                            });
                          }
                        }}
                        showStarIcon={true}
                        error={
                          showAllErrors
                            ? isFieldInvalid(policyFields.policyDescription)
                            : false
                        }
                      />
                    </GridItem>
                  </GridContainer>
                </CustomPaper>
              </div>
              <Box sx={{ width: "100%" }}>
                <TabContext value={selectedTab}>
                  <Tabs
                    onChange={(value, newValue) => {
                      setSelectedTab(newValue);
                      dispatch({
                        type: POLICY_FIELDS,
                        payload: { newPolicyTabs: newValue },
                      });
                      // dispatch({ type: NEW_POLICY_TABS, payload: newValue });
                    }}
                    style={{
                      backgroundColor: navyColor,
                      minHeight: "5px",
                      height: "26px",
                      marginTop: "3px",
                    }}
                    // disableRipple
                    value={selectedTab}
                    aria-label="policy tabs"
                  >
                    {updatedTabData.map((k, l) =>
                      renderTab(k.label, k.value, k.error, selectedTab)
                    )}
                  </Tabs>

                  {/* Lazy loaded Tab Panels */}
                  <Suspense fallback={<ClassicLoader />}>
                    <TabPanelWrapper value="Description">
                      <Desc
                        fromViewPolicy={fromViewPolicy}
                        edit={edit}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="Details">
                      <Props
                        fromViewPolicy={fromViewPolicy}
                        edit={edit}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="CPT/HCPCS">
                      <Procs
                        edit={true}
                        policyId={policyFields.policyId}
                        showImportButton={showImportButton}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="catOpt">
                      <CatOpt
                        edit={fromViewPolicy}
                        viewMode={edit}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="Changes">
                      <Changes
                        edit={fromViewPolicy}
                        viewMode={edit}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="Diagnosis">
                      <Diagnosis
                        edit={true}
                        policyId={policyFields.policyId}
                        showImportButton={showImportButton}
                        fromViewPolicy={edit}
                        jiraId={changesTabFields.jiraId}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="BillType">
                      <BillType
                        edit={true}
                        showImportButton={showImportButton}
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        jiraId={changesTabFields.jiraId}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="ConditionCode">
                      <ConditionCode
                        edit={true}
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        jiraId={changesTabFields.jiraId}
                        showAllErrors={showAllErrors}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="ClientAssignment">
                      <ClientAssignment
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        edit={fromViewPolicy}
                        forClientTabPolicyId={forClientTabPolicyId}
                        // jiraId={changesTabFields.jiraId}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="Taxonomy">
                      <Taxonomy
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        edit={fromViewPolicy}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="TaxID">
                      <TaxID
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        edit={fromViewPolicy}
                      />
                    </TabPanelWrapper>
                    <TabPanelWrapper value="NPI">
                      <NPI
                        fromViewPolicy={edit}
                        policyId={policyFields.policyId}
                        edit={fromViewPolicy}
                      />
                    </TabPanelWrapper>
                  </Suspense>
                </TabContext>
              </Box>
            </GridContainer>
          </div>
        )}
      </>
      <Dialogbox
        onClose={handleToClose}
        disableBackdropClick={true}
        open={open}
        title={"Confirm"}
        message={"Do you want to save ?"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={() => {
                onSave();
                // saveDialogValues(formState, dispatch);
              }}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                textTransform: "capitalize",
                fontSize: 12,
                padding: 4,
              }}
            >
              Ok
            </CustomButton>
            <CustomButton
              onClick={handleToClose}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                textTransform: "capitalize",
                fontSize: 12,
                padding: 4,
              }}
            >
              Cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
      {/* {openLkp ? ( */}
      <Dialogbox
        fullWidth={fullWidth}
        maxWidth={openLkp ? "md" : "xs"}
        disableBackdropClick={true}
        open={openPop()}
        onClose={handleToClose}
        title={showPopUpTitle()}
        message={<>{showContentInPoPup()}</>}
        actions={<>{showButtonsInPopUp()}</>}
      />
      {/* ) : undefined} */}
    </Template>
  );
};
export default NewPolicy;

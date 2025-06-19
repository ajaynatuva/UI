import { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dangerColor, successColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../components/CustomInput/CustomInput";
import Dialogbox from "../../components/Dialog/DialogBox";
// import { getPolicyById } from "../../redux/actions";
import {
  BILL_TYPE_RESET,
  DIALOG,
  GET_PROCS,
  RESET_CONDITION_CODE_FIELDS,
  RESET_DIAGNOSIS_FIELDS,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import {
//   JIRA_DESCRIPTION,
//   JIRA_ID,
//   JIRA_ISOPEN,
//   JIRA_LINK,
//   RESET_STATE,
//   USER_ID,
// } from "../../redux/actions/NewPolicyFormActionTypes";
import {
  getPolicyNumberAndVersionChecking,
  validatePolicyCreationFields,
} from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import { NEW_POLICY_CREATE_ARRAY } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { TAB_PATHS } from "../../redux/ApiCalls/UserApis/UserApiActionType";
// import { NewPolicyFormState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { PolicyConstants, intialPolicyCreationFileds } from "./PolicyConst";
import {
  CHANGES_TAB_FIELDS,
  RESET_DESCRIPTION_TAB_FIELDS,
  RESET_DETAILS_TAB_FIELDS,
  RESET_POLICY_FILEDS,
} from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getPolicyById } from "../../redux/ApiCalls/NewPolicyTabApis/NewPolicyApis";
import { RESET_STATE } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { NewPolicyFormFieldState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { batchDispatch } from "../../redux/ApiCallAction/ApiCallAction";
import { validateNumberMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
const _ = require("lodash");

const fullWidth = true;
const maxWidth = "sm";
const NewPolicyPopUp = (props) => {
  const dispatch = useDispatch();
  const [showPopInNewPolicy, setShowPopInNewPolicy] = useState(true);
  const [openSecondPopUp, setOpenSecondPopUp] = useState(false);
  const [openThirdPopUp, setOpenThirdPopUp] = useState(false);

  const [checkFiledsErro, setCheckFiledsError] = useState(false);
  const [exsistingPolicyId, setExsistingPolicyId] = useState("");

  const [localPolicyState, setLocalPolicyState] = useState(
    intialPolicyCreationFileds
  );
  const navigate = useNavigate();

  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );
  const formState: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  function closePolicyPopUp() {
    setShowPopInNewPolicy(false);
  }
  useEffect(() => {
    const action = [
      { type: RESET_POLICY_FILEDS },
      { type: GET_PROCS, payload: [] },
      { type: RESET_DESCRIPTION_TAB_FIELDS },
      { type: RESET_DETAILS_TAB_FIELDS },
      { type: RESET_CONDITION_CODE_FIELDS },
      { type: RESET_DIAGNOSIS_FIELDS },
      { type: BILL_TYPE_RESET },
    ];
    batchDispatch(dispatch, action);
    props.value.resetAllTabErrors();
  }, []);

  useEffect(() => {
    if (!localPolicyState.newPolicyStartDate) {
      let obj = _.cloneDeep(localPolicyState);
      obj.newPolicyStartDate = "1990-01-01";
      setLocalPolicyState(obj);
    }
  }, [localPolicyState.newPolicyStartDate]);

  function showPolicyNumberFiled(label) {
    return (
      <>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
             onKeyPress={(e) => validateNumberMethod(e)}
              fullWidth={true}
              error={
                localPolicyState.cloneClientAssignmentTab
                  ? !localPolicyState.forClonedPolicyAndVersion
                  : false
              }
              maxLength={10}
              type={"text"}
              value={
                label === PolicyConstants.Create_From_Policy_Version
                  ? localPolicyState.policyAndVersion
                  : localPolicyState.forClonedPolicyAndVersion
              }
              labelText={label}
              onChange={(event) => {
                let obj = _.cloneDeep(localPolicyState);
                if (label === PolicyConstants.Create_From_Policy_Version) {
                  obj.policyAndVersion = event.target.value;
                } else {
                  obj.forClonedPolicyAndVersion = event.target.value;
                }
                if (!event.target.value) {
                  setExsistingPolicyId("");
                }

                setLocalPolicyState(obj);
              }}
              variant={"outlined"}
            />
          </div>
        </div>
      </>
    );
  }
  useEffect(() => {
    let obj = _.cloneDeep(localPolicyState);
    obj.newPolicyStartDate = "1990-01-01";
    setLocalPolicyState(obj);
  }, []);
  function ShowExsistingOrNewPolicyPopUpFileds() {
    return (
      <>
        <div>
          <>
            {!openSecondPopUp ? (
              <>
                <div className="row">
                  <div className="col-sm-6">
                    <CustomInput
                      showStarIcon={true}
                      fullWidth={true}
                      labelText={"Jira ID"}
                      error={checkFiledsErro ? !localPolicyState.jiraId : false}
                      value={localPolicyState.jiraId}
                      onChange={(event) => {
                        let obj = _.cloneDeep(localPolicyState);
                        obj.jiraId = event.target.value.trim();
                        setLocalPolicyState(obj);
                      }}
                      variant={"outlined"}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <CustomInput
                      fullWidth={true}
                      showStarIcon={true}
                      error={
                        checkFiledsErro ? !localPolicyState?.jiraDesc : false
                      }
                      value={localPolicyState?.jiraDesc}
                      labelText={"Jira Description"}
                      onChange={(event) => {
                        let obj = _.cloneDeep(localPolicyState);
                        obj.jiraDesc = event.target.value.trim();
                        setLocalPolicyState(obj);
                      }}
                      variant={"outlined"}
                    />
                  </div>
                </div>
                {showPolicyNumberFiled("Create From Base Policy.Version")}
              </>
            ) : undefined}
          </>

          <>
            {openSecondPopUp ? (
              <>
                <div className="row">
                  <CustomCheckBox
                    size="small"
                    disabled={localPolicyState.cloneClientAssignmentTab}
                    onChange={(event) => {
                      let obj = _.cloneDeep(localPolicyState);
                      obj.addAllActiveClients = event.target.checked;
                      obj.cloneClientAssignmentTab = false;
                      obj.forClonedPolicyAndVersion = undefined;
                      // if (!event.target.checked) {
                      //   obj.newPolicyStartDate = "";
                      // }
                      setLocalPolicyState(obj);
                    }}
                    checked={localPolicyState.addAllActiveClients}
                    label={
                      <span
                        style={{
                          fontSize: "13px",
                          position: "relative",
                          fontWeight: "400",
                          bottom: "2px",
                        }}
                      >
                        Add All Active Client Groups (Standard TPAs Only)
                      </span>
                    }
                  />
                </div>
                <div className="row">
                  <CustomCheckBox
                    size="small"
                    disabled={localPolicyState.addAllActiveClients}
                    checked={localPolicyState.cloneClientAssignmentTab}
                    onChange={(event) => {
                      let obj = _.cloneDeep(localPolicyState);
                      obj.cloneClientAssignmentTab = event.target.checked;
                      // if (!event.target.checked) {
                      //   obj.newPolicyStartDate = "";
                      // }
                      setLocalPolicyState(obj);
                    }}
                    label={
                      <span
                        style={{
                          fontSize: "13px",
                          position: "relative",
                          fontWeight: "400",
                          bottom: "2px",
                        }}
                      >
                        Clone Client Assignment Tab
                      </span>
                    }
                  />
                </div>
                <div className="row" style={{ marginLeft: "6%" }}>
                  {localPolicyState.cloneClientAssignmentTab
                    ? showPolicyNumberFiled("Enter Policy.Version")
                    : undefined}
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <CustomInput
                      labelText={"Process Start Date"}
                      type="date"
                      disabled={
                        localPolicyState.addAllActiveClients ||
                        localPolicyState.cloneClientAssignmentTab
                          ? false
                          : true
                      }
                      variant={"outlined"}
                      error={
                        checkFiledsErro
                          ? !localPolicyState.newPolicyStartDate
                          : false
                      }
                      value={localPolicyState.newPolicyStartDate}
                      onChange={(event) => {
                        let obj = _.cloneDeep(localPolicyState);
                        obj.newPolicyStartDate = event.target.value;
                        obj.cloneClientAssignmentTab = null;
                        setLocalPolicyState(obj);
                      }}
                    />
                  </div>
                </div>
              </>
            ) : undefined}
          </>
        </div>
      </>
    );
  }
  function showContentInThirdPopUp() {
    if (
      localPolicyState.policyAndVersion &&
      localPolicyState.cloneClientAssignmentTab
    ) {
      return (
        "Create A New Policy from exsisting Policy.Version: " +
        localPolicyState.policyAndVersion +
        " and by cloning client Assignment Tab from the Policy.Version: " +
        localPolicyState.forClonedPolicyAndVersion
      );
    } else if (
      localPolicyState.policyAndVersion &&
      localPolicyState.addAllActiveClients
    ) {
      return (
        "Create A New Policy from exsisting Policy.Version: " +
        localPolicyState.policyAndVersion +
        " and adding all Active Client Groups"
      );
    } else if (localPolicyState.policyAndVersion) {
      return (
        "Create A New Policy from exsisting Policy.Version :" +
        localPolicyState.policyAndVersion
      );
    } else if (localPolicyState.addAllActiveClients) {
      return "Create A New Policy by adding all Active Client Groups(Standard TPAs Only)";
    } else if (localPolicyState.cloneClientAssignmentTab) {
      return (
        "Create A New Policy by cloning Assignment Tab from the Policy.Version:" +
        localPolicyState.forClonedPolicyAndVersion
      );
    } else {
      return "Create a New Policy";
    }
  }
  function showPolicyNumberIsValid(message) {
    dispatch({
      type: DIALOG,
      payload: { isDialog: true, title: "Error", message: message },
    });
  }
  function showContentInPopUp() {
    if (openThirdPopUp) {
      return showContentInThirdPopUp();
    } else {
      return ShowExsistingOrNewPolicyPopUpFileds();
    }
  }
  function showTitleInPopUp() {
    let title = "";
    if (showPopInNewPolicy) {
      title = "Create New Policy";
    }
    if (openSecondPopUp && showPopInNewPolicy) {
      title = "Add Client Groups To New Policy";
    }
    if (openSecondPopUp && showPopInNewPolicy && openThirdPopUp) {
      title = "Confirm";
    }
    return title;
  }
  function saveNewPolicyValues() {
    const action = [
      {
        type: CHANGES_TAB_FIELDS,
        payload: { jiraId: localPolicyState.jiraId },
      },
      {
        type: CHANGES_TAB_FIELDS,
        payload: { jiraDesc: localPolicyState.jiraDesc },
      },
      {
        type: CHANGES_TAB_FIELDS,
        payload: {
          jiraLink:
            "https://advancedpricing.atlassian.net/browse/" +
            localPolicyState.jiraId,
        },
      },
      { type: CHANGES_TAB_FIELDS, payload: { jiraIsOpen: 1 } },
      {
        type: CHANGES_TAB_FIELDS,
        payload: { userId: localStorage.getItem("emailId") },
      },
      { type: NEW_POLICY_CREATE_ARRAY, payload: localPolicyState },
    ];
    batchDispatch(dispatch, action);
  }
  function activateSecondPopUpFiledsError(error) {
    if (!error) {
      setOpenThirdPopUp(true);
      let create = localPolicyState.newPolicyStartDate;
      let obj = _.cloneDeep(localPolicyState);
      obj.newPolicyStartDate = create;
      setLocalPolicyState(obj);
    }
  }
  function showFirstPopFieldsError(error) {
    setCheckFiledsError(true);
    if (!error) {
      setOpenSecondPopUp(true);
      setCheckFiledsError(false);
    }
  }

  async function validateFileds() {
    let error = validatePolicyCreationFields(
      localPolicyState,
      formState,
      dispatch
    );
    let validForFirstPopId;
    let validForSecondPopId;
    if (localPolicyState.policyAndVersion) {
      const [policyNumber, version] = localPolicyState?.policyAndVersion
        .toString()
        .split(".");
      validForFirstPopId = await getPolicyNumberAndVersionChecking(
        dispatch,
        policyNumber,
        version
      );
      if (
        validForFirstPopId?.length === 0 ||
        validForFirstPopId === undefined
      ) {
        showPolicyNumberIsValid("Please enter the Valid Policy.version");
        showFirstPopFieldsError(error);
        setOpenSecondPopUp(false);
      } else if (validForFirstPopId[0].custom === true) {
        showFirstPopFieldsError(error);
        showPolicyNumberIsValid("Please enter the valid Base Policy.Version");
        setOpenSecondPopUp(false);
      } else {
        setExsistingPolicyId(validForFirstPopId[0]?.policyId);
        props.value.setSaveNewPolicId(validForFirstPopId[0]?.policyId);
        showFirstPopFieldsError(error);
      }
    } else {
      showFirstPopFieldsError(error);
    }
    if (openSecondPopUp) {
      if (localPolicyState.cloneClientAssignmentTab) {
        if (localPolicyState.forClonedPolicyAndVersion) {
          const [policyNumber, version] =
            localPolicyState?.forClonedPolicyAndVersion?.toString()?.split(".");
          validForSecondPopId = await getPolicyNumberAndVersionChecking(
            dispatch,
            policyNumber,
            version
          );
        }
        if (validForSecondPopId === undefined) {
          showPolicyNumberIsValid("Please enter the Valid Policy.version");
        } else {
          props.value.setForClientTabPolicyId(validForSecondPopId[0]?.policyId);
          activateSecondPopUpFiledsError(error);
        }
      } else {
        activateSecondPopUpFiledsError(error);
      }
    }
    if (openThirdPopUp) {
      saveNewPolicyValues();
      if (exsistingPolicyId) {
        getPolicyById(dispatch, exsistingPolicyId);
      }
      props.value.setOpenPolicyCreationPopUp(true);
    }
  }

  return (
    <>
      <Dialogbox
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        disableBackdropClick={true}
        open={showPopInNewPolicy}
        onClose={closePolicyPopUp}
        title={showTitleInPopUp()}
        message={<>{showContentInPopUp()}</>}
        actions={
          <>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                validateFileds();
              }}
              style={{
                backgroundColor: successColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {openThirdPopUp ? "Save" : "Continue"}
            </CustomButton>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                if (showPopInNewPolicy && !openSecondPopUp && !openThirdPopUp) {
                  const action = [
                    { type: TAB_PATHS, payload: "search" },
                    { type: NEW_POLICY_CREATE_ARRAY, payload: [] },
                  ];
                  batchDispatch(dispatch, action);

                  navigate("/");
                }

                if (openThirdPopUp) {
                  setOpenThirdPopUp(false);
                }
                if (!openThirdPopUp && openSecondPopUp) {
                  let obj = _.cloneDeep(localPolicyState);
                  obj.addAllActiveClients = undefined;
                  obj.cloneClientAssignmentTab = undefined;
                  // obj.newPolicyStartDate = undefined;
                  obj.forClonedPolicyAndVersion = undefined;
                  setLocalPolicyState(obj);
                  setOpenSecondPopUp(false);
                  // setValidPolicyNumber(false);
                }
              }}
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
          </>
        }
      />
    </>
  );
};

export default NewPolicyPopUp;

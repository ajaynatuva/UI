import { ButtonGroup, DialogContent } from "@mui/material";
import Moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import AlertBox from "../../components/AlertBox/AlertBox";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../components/Dialog/DialogBox";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import RadioButton from "../../components/RadioButton/RadioButton";
import Template from "../../components/Template/Template";
import { DIALOG } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getActiveClientGroups } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import {
  getAllChangesData,
  getClientAssignmentPolicyIds,
  getTotalClientAssignmentData,
} from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpApis";
import {
  CLIENTCODE,
  CLIENTGROUPCODE,
  CLIENTSTARTDATE,
  JIRADESCRIPTION,
  JIRAID,
  POLICYCLIENTGROUPCODE,
  POLICYCLIENTGROUPCODEDETAILS,
} from "../../redux/ApiCalls/NewClientSetUpApis/NewClientSetUpTypes";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "../NewClientSetUp/clientSetUp.css";
import { newClientSetUpFields } from "./newClientSetUpContants";
import { NewClientSetUpState } from "../../redux/reducers/NewClientSetUpReducer/NewClientSetUpReducer";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { batchDispatch } from "../../redux/ApiCallAction/ApiCallAction";

const NewClientSetUp = () => {
  const newClientFormState: NewClientSetUpState = useSelector(
    (state: any) => state.newClientSetUp
  );
  let checkFileds = false;
  const [fieldError, setFiledError] = useState(false);
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [policyClientSuggestions, setPolicyClientSuggestions] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [clientCheck, setClientCheck] = React.useState(undefined);

  const [activeClientCode, setActiveClientCode] = useState("");
  const [activePolicyClientCode, setActivePolicyClientCode] = useState("");
  useState([]);

  const [newClientSetUpState, setNewClientSetUpState] =
    React.useState(newClientSetUpFields);

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

    const clientAssignmentTabFields: ClientAssignmentState = useSelector(
      (state: any) => state.clientAssignmentTabFieldsRedux
    );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const minDate = Moment().format("YYYY-MM-DD");
  const inputPropsWithMin = { min: minDate };

  useEffect(() => {
    if (clientAssignmentTabFields.getActiveClientData.length == 0) {
      getActiveClientGroups(dispatch);
    }
    if (newClientFormState.clientAssignmentData.length == 0) {
      getTotalClientAssignmentData(dispatch);
    }
  }, [newClientFormState.clientAssignmentData]);

  useEffect(() => {
    if (newClientFormState.allChangesData.length === 0) {
      getAllChangesData(dispatch);
    }
  }, [newClientFormState.allChangesData]);

  const [jiraIdExists, setJiraIdExists] = useState(false);
  // function checkJiraId(jiraId) {
  //   // getAllChangesData(dispatch);
  //   const uniqueData = [];
  //   const uniqueJiraIds = new Set();
  //   newClientFormState.allChangesData.forEach((item) => {
  //     if (!uniqueJiraIds.has(item.jiraId)) {
  //       uniqueJiraIds.add(item.jiraId);
  //       uniqueData.push(item);
  //     }
  //   });
  //   newClientFormState.allChangesData = uniqueData;
  //   let exists = newClientFormState.allChangesData.some(
  //     (k) => k.jiraId === jiraId
  //   );
  //   if (exists) {
  //     setJiraIdExists(exists);
  //   } else {
  //     setJiraIdExists(false);
  //   }
  // }
  function checkJiraId(jiraId) {
    // Create a copy of the current allChangesData to ensure immutability
    const uniqueData = [];
    const uniqueJiraIds = new Set();

    // Iterate through the data and collect unique Jira IDs
    newClientFormState.allChangesData.forEach((item) => {
      if (!uniqueJiraIds.has(item.jiraId)) {
        uniqueJiraIds.add(item.jiraId);
        uniqueData.push(item);
      }
    });
    // Create a new state update instead of mutating the original state
    const updatedChangesData = [...uniqueData];
    // Check if the Jira ID exists in the updated data
    let exists = updatedChangesData.some((k) => k.jiraId === jiraId);
    // Set the state accordingly
    setJiraIdExists(exists);
  }
  function check() {
    if (
      newClientSetUpState.jiraId == undefined ||
      newClientSetUpState.jiraId == "" ||
      jiraIdExists == true
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      newClientSetUpState.jiraDescription == undefined ||
      newClientSetUpState.jiraDescription == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      newClientSetUpState.clientCode == undefined ||
      newClientSetUpState.clientCode == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      newClientSetUpState.clientGroupCode == undefined ||
      newClientSetUpState.clientGroupCode.length == 0
    ) {
      checkFileds = true;
      setFiledError(true);
    } else if (
      newClientSetUpState.clientStartDate == undefined ||
      newClientSetUpState.clientStartDate == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    return checkFileds;
  }
  let clientAssignmentData = [];
  let seen = new Set();

  newClientFormState.clientAssignmentData.forEach((n) => {
    clientAssignmentTabFields.getActiveClientData.forEach((k) => {
      if (n.clientGroupId === k.clientGroupId) {
        clientAssignmentData.push({
          clientCode: k.clientCode,
          clientGroupCode: k.clientGroupCode,
          clientGroupId: k.clientGroupId,
          clientStartDate: n.clientStartDate,
          clientEndDate: n.clientEndDate,
        });
      }
    });
  });

  const ActiveDrgnClientData = (event) => {
    let value = event.target.value;
    setActiveClientCode(value);
    let obj = _.cloneDeep(newClientSetUpState);
    newClientSetUpState.clientCode = value;
    setNewClientSetUpState(obj);
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = clientAssignmentTabFields.getActiveClientData
        .filter((k) => {
          const clientCodeLower = k.clientCode.toLowerCase();
          if (
            clientCodeLower.includes(value.toLowerCase()) &&
            !seen.has(clientCodeLower)
          ) {
            seen.add(clientCodeLower);
            return true;
          }
          return false;
        })
        .map((k) => ({ label: k.clientCode, value: k.clientCode }));
      setClientSuggestions(filteredSuggestions);
    } else {
      setClientSuggestions([]);
      let obj = _.cloneDeep(newClientSetUpState);
      newClientSetUpState.clientCode = "";
      newClientSetUpState.clientGroupCode = [];
      obj.clientCode = "";
      obj.clientGroupCode = [];
      setNewClientSetUpState(obj);
    }
  };

  const ActivePolicyClientData = (event) => {
    let value = event.target.value;
    setActivePolicyClientCode(value);
    let obj = _.cloneDeep(newClientSetUpState);
    newClientSetUpState.policyClientCode = value;
    setNewClientSetUpState(obj);
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = clientAssignmentData
        .filter((k) => {
          const clientCodeLower = k.clientCode.toLowerCase();
          if (
            clientCodeLower.includes(value.toLowerCase()) &&
            !seen.has(clientCodeLower)
          ) {
            seen.add(clientCodeLower);
            return true;
          }
          return false;
        })
        .map((k) => ({ label: k.clientCode, value: k.clientCode }));
      setPolicyClientSuggestions(filteredSuggestions);
    } else {
      setPolicyClientSuggestions([]);
      let obj = _.cloneDeep(newClientSetUpState);
      obj.policyClientCode = "";
      obj.policyClientGroupCode = [];
      setNewClientSetUpState(obj);
    }
  };
  const handleSuggestionClick = (value) => {
    // clientAssignment.clientCode = value;
    setActiveClientCode(value);
    newClientSetUpState.clientCode = value;
    setClientSuggestions([]);
  };

  const handlePolicySuggestionClick = (value) => {
    setActivePolicyClientCode(value);
    newClientSetUpState.policyClientCode = value;
    setPolicyClientSuggestions([]);
  };

  const handleToClose = () => {
    setOpen(false);
    setNewClientSetUpState(newClientSetUpFields);
    setActiveClientCode("");
    setActivePolicyClientCode("");
    setFiledError(false);
    newClientSetUpFields.clientCode = undefined;
    setClientSuggestions([]);
    setPolicyClientSuggestions([]);
  };
  const navigatetoPolicyView = async () => {
    newClientSetUpState.policyClientGroupDetails1.map((k, l) => {
      k.clientStartDate = newClientSetUpState.clientStartDate;
    });
    let error = check();
    if (error) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
        title: "Error",
        message: "Please fill in required fields"}
      });
    } else {
      const action = [
        { type: JIRAID, payload: newClientSetUpState.jiraId },
        { type: JIRADESCRIPTION, payload: newClientSetUpState.jiraDescription },
        { type: CLIENTCODE, payload: newClientSetUpState.clientCode },
        { type: CLIENTGROUPCODE, payload: newClientSetUpState.clientGroupCode },
        {
          type: POLICYCLIENTGROUPCODE,
          payload: newClientSetUpState.policyClientGroupCode,
        },
        { type: CLIENTSTARTDATE, payload: newClientSetUpState.clientStartDate },
        {
          type: POLICYCLIENTGROUPCODEDETAILS,
          payload: newClientSetUpState.policyClientGroupDetails,
        },
      ];
      batchDispatch(dispatch,action)
      let payload = {
        dto: newClientSetUpState.policyClientGroupDetails,
        dto1: newClientSetUpState.policyClientGroupDetails1,
      };

      let data = await getClientAssignmentPolicyIds(dispatch, payload);
      let clientSetUp = "newClient";
      navigate("/policyViewExport", { state: { newClient: clientSetUp } });
    }
  };

  let clientGroupExclusion = clientAssignmentTabFields.getActiveClientData
    .filter((k) => k.clientCode === activeClientCode)
    .map((k) => {
      return {
        label: k.clientGroupCode,
        value: k.clientGroupCode,
        clientGroupId: k.clientGroupId,
      };
    });

  let clientPolicyGroupExclusion = Array.from(
    new Set(
      clientAssignmentData
        .filter((k) => k.clientCode === activePolicyClientCode)
        .map((k) =>
          JSON.stringify({
            clientGroupCode: k.clientGroupCode,
            clientGroupId: k.clientGroupId,
          })
        )
    )
  ).map((jsonStr) => {
    let obj = JSON.parse(jsonStr);
    return {
      label: obj.clientGroupCode,
      value: obj.clientGroupCode,
      clientGroupId: obj.clientGroupId,
    };
  });

  const fullWidth = true;
  const maxWidth = "sm";

  const handleClientSelectChange = (selectedOptions) => {
    let obj = _.cloneDeep(newClientSetUpState);

    //  newClientSetUpState.clientGroupCode = selectedOptions.value
    let clientObjectData1 = [];

    clientAssignmentTabFields.getActiveClientData.forEach((k) => {
      selectedOptions.forEach((l) => {
        if (l.clientGroupId === k.clientGroupId) {
          clientObjectData1.push({
            clientGroupId: k.clientGroupId,
            clientStartDate: newClientSetUpState.clientStartDate,
          });
        }
      });
    });
    obj.policyClientGroupDetails1 = clientObjectData1;
    obj.clientGroupCode = selectedOptions;
    setNewClientSetUpState(obj);
  };

  const handlePolicyClientSelectChange = (selectedOptions) => {
    let obj = _.cloneDeep(newClientSetUpState);
    let clientObjectData = [];
    newClientFormState.clientAssignmentData.forEach((k) => {
      selectedOptions.forEach((l) => {
        if (l.clientGroupId === k.clientGroupId) {
          clientObjectData.push({
            clientGroupId: k.clientGroupId,
          });
        }
      });
    });
    obj.policyClientGroupDetails = clientObjectData;
    obj.policyClientGroupCode = selectedOptions;
    setNewClientSetUpState(obj);
  };

  const renderClientForm = (
    value,
    onChangeHandler,
    suggestions,
    suggesionClick,
    selectedOptions,
    selectHandler,
    checkError,
    showIcon
  ) => {
    return (
      <>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              // error={checkError !== "Copy" ? fieldError : false}
              error={
                checkError !== "Copy"
                  ? newClientSetUpState.clientCode == undefined ||
                    newClientSetUpState.clientCode == ""
                    ? fieldError
                    : false
                  : false
              }
              type="text"
              labelText={"Client Code"}
              showStarIcon={showIcon}
              variant={"outlined"}
              value={value}
              onChange={onChangeHandler}
              aria-autocomplete="list"
              aria-controls="autocomplete-list"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list" id="suggestionList">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => suggesionClick(suggestion.label)}
                    role="option"
                  >
                    {suggestion.label ? suggestion.label : suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomSelect
              isMulti
              checkBoxes={true}
              options={selectedOptions}
              labelText={"Client Group Code"}
              showStarIcon={showIcon}
              onSelect={selectHandler}
              value={
                checkError !== "Copy"
                  ? newClientSetUpState.clientGroupCode
                  : newClientSetUpState.policyClientGroupCode
              }
              error={
                checkError !== "Copy"
                  ? newClientSetUpState.clientGroupCode == undefined ||
                    newClientSetUpState.clientGroupCode.length == 0
                    ? fieldError
                    : false
                  : false
              }
            />
          </div>
        </div>
      </>
    );
  };

  const _ = require("lodash");

  function dispalyNewClientSetUp() {
    return (
      <>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              error={
                newClientSetUpState.jiraId == undefined ||
                newClientSetUpState.jiraId == "" ||
                jiraIdExists == true
                  ? fieldError
                  : false
              }
              type="text"
              labelText={"Jira Id"}
              showStarIcon={true}
              variant={"outlined"}
              value={newClientSetUpState.jiraId}
              onChange={(event) => {
                let obj = _.cloneDeep(newClientSetUpState);
                obj.jiraId = event.target.value.trim();
                setNewClientSetUpState(obj);
                checkJiraId(event.target.value.trim());
              }}
            />
          </div>
        </div>
        <GridContainer>
          <GridItem sm={9} md={9} xs={9}>
            <AlertBox
              open={jiraIdExists}
              severity="error"
              message="Jira Id already exists"
            />
          </GridItem>
        </GridContainer>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              error={
                newClientSetUpState.jiraDescription == undefined ||
                newClientSetUpState.jiraDescription == ""
                  ? fieldError
                  : false
              }
              type="text"
              labelText={"Jira Description"}
              showStarIcon={true}
              variant={"outlined"}
              value={newClientSetUpState.jiraDescription}
              onChange={(event) => {
                let obj = _.cloneDeep(newClientSetUpState);
                obj.jiraDescription = event.target.value.trim();
                setNewClientSetUpState(obj);
              }}
            />
          </div>
        </div>

        {renderClientForm(
          activeClientCode,
          ActiveDrgnClientData,
          clientSuggestions,
          handleSuggestionClick,
          clientGroupExclusion,
          handleClientSelectChange,
          "",
          true
        )}
        {clientCheck === "newGroup" ? (
          <div style={{ position: "relative", top: "5px" }}>
            Copy Active Policies From
          </div>
        ) : undefined}

        {clientCheck === "newGroup" &&
          renderClientForm(
            activePolicyClientCode,
            ActivePolicyClientData,
            policyClientSuggestions,
            handlePolicySuggestionClick,
            clientPolicyGroupExclusion,
            handlePolicyClientSelectChange,
            "Copy",
            false
          )}
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              error={
                newClientSetUpState.clientStartDate == undefined ||
                newClientSetUpState.clientStartDate == ""
                  ? fieldError
                  : false
              }
              type="date"
              labelText={"Process Start Date"}
              showStarIcon={true}
              variant={"outlined"}
              inputProps={inputPropsWithMin}
              value={newClientSetUpState.clientStartDate}
              onChange={(event) => {
                let obj = _.cloneDeep(newClientSetUpState);
                obj.clientStartDate = event.target.value;
                setNewClientSetUpState(obj);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    setOpen(true);
  }, [clientCheck]);

  return (
    <Template>
      <GridContainer>
        <h5>New Client Set Up</h5>
      </GridContainer>
      <GridContainer>
        <GridItem sm={3} md={3} xs={3} />
        <GridItem sm={2} md={2} xs={2}>
          <RadioButton
            label={"Add New Client"}
            checked={clientCheck == "newGroup" ? false : true}
            onChange={() => setClientCheck("new")}
          />
        </GridItem>

        <GridItem sm={2} md={2} xs={2}>
          <RadioButton
            label={"Add New Client Group"}
            checked={clientCheck === "newGroup"}
            onChange={() => setClientCheck("newGroup")}
          />
        </GridItem>
      </GridContainer>

      <Dialogbox
        disableBackdropClick={true}
        title={
          clientCheck != "newGroup" ? "Add New Client" : "Add New Client Group"
        }
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        onClose={handleToClose}
        message={
          <DialogContent style={{ maxHeight: "300px", overflowY: "scroll" }}>
            {dispalyNewClientSetUp()}
          </DialogContent>
        }
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={navigatetoPolicyView}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Continue
            </CustomButton>

            <CustomButton
              onClick={handleToClose}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
    </Template>
  );
};
export default NewClientSetUp;

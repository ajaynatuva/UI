import { ButtonGroup, DialogContent } from "@material-ui/core";
import { default as moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dangerColor,
  navyColor,
  successColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import Dialogbox from "../../components/Dialog/DialogBox";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { getAllClaimType } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { DIALOG } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getActiveClientGroups } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import {
  getStatesData,
  postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { TAB_PATHS } from "../../redux/ApiCalls/UserApis/UserApiActionType";
import { CCI_DEVIATIONS, CCI_DEVIATIONS_EDIT } from "./LookUpConsts";
import { CciDeviationInitialState } from "./LookUpInitialState";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { getLOB } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import JiraComponent from "../NewPolicy/JiraComponent";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";

const CciDeviationEditPopUp = (props) => {
  const newPolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const lookUpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const clientAssignmentState: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );

  const dispatch = useDispatch();
  const [fieldError, setFieldError] = useState(false);
  const [saveLkpValues, setSaveLkpValues] = useState(
    props?.saveLkpValues ?? CciDeviationInitialState
  );
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  let checkFileds = false;
  const [isActive, setIsActive] = useState(!saveLkpValues.deletedB);
  const [jiraId, setJiraId] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");
  const [jiraIdExists, setJiraIdExists] = useState(false);

  useEffect(() => {
    if (props.setSelectedCCIDev) {
      setIsPopUpOpen(true);
    }
    dispatch({ type: TAB_PATHS, value: saveLkpValues });
  }, [props.setSelectedCCIDev]);

  const mapOptions = (stringValue, lookupArray, labelKey, valueKey) => {
    if (typeof stringValue !== "string") return [];
    let res = stringValue.split(",");
    if (labelKey == "lobTitle") {
      let flag = res.some((part) => /\s/.test(part));
      if (flag) {
        res = [stringValue];
      }
    }
    return res
      .map((value) => {
        const found = lookupArray.find((item) => item[labelKey] === value);
        return found
          ? { label: found[labelKey], value: found[valueKey] }
          : null;
      })
      .filter(Boolean);
  };

  const mapLOBOptions = (stringValue, lookupArray) => {
    if (!Array.isArray(stringValue)) {
      return [];
    }
    return stringValue
      .map((value) => {
        const found = lookupArray.find((item) => item.lobKey === value.label);
        return found ? { label: found.lobTitle, value: found.lobKey } : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (newPolicyState.LOB.length === 0) getLOB(dispatch);
    if (clientAssignmentState.getActiveClientData.length === 0)
      getActiveClientGroups(dispatch);
    if (newPolicyState.getClaimTypes.length === 0) getAllClaimType(dispatch);
    if (lookUpState.getStates.length === 0) getStatesData(dispatch);

    // if (typeof saveLkpValues.lobKey === "string") {
    const lobOptions = mapLOBOptions(
      saveLkpValues.lobKey || [],
      newPolicyState.LOB
    );
    if (lobOptions.length > 0) {
      setSaveLkpValues((prev) => ({ ...prev, lobKey: lobOptions }));
    }
    // }

    if (typeof saveLkpValues.claimType === "string") {
      const claimTypeOptions = mapOptions(
        saveLkpValues.claimType,
        newPolicyState.getClaimTypes,
        "claimType",
        "claimType"
      ).map((option) => ({ ...option, id: option.value }));

      if (claimTypeOptions.length > 0) {
        setSaveLkpValues((prev) => ({ ...prev, claimType: claimTypeOptions }));
      }
    }
    if (typeof saveLkpValues.state === "string") {
      let stateOptions = mapOptions(
        saveLkpValues.state,
        lookUpState.getStates,
        "abbr",
        "state"
      ).map((option) => ({
        ...option,
        label: option.label + "-" + option.value,
        value: option.label,
      }));
      if (saveLkpValues.state === "0" || saveLkpValues.state === "ALL") {
        // If "0" is received, add "All" to the options list
        stateOptions = [{ label: "ALL", value: "0" }];
      }

      if (stateOptions.length > 0) {
        setSaveLkpValues((prev) => ({ ...prev, state: stateOptions }));
      }
    }

    if (saveLkpValues.Client && clientAssignmentState.getActiveClientData.length > 0) {
      const clientGroupExclusion = clientAssignmentState.getActiveClientData.find(
        (data) => data.clientName === saveLkpValues.Client
      );
      if (clientGroupExclusion) {
        setSaveLkpValues((prev) => ({
          ...prev,
          clientCode: clientGroupExclusion.clientCode,
        }));
      }
    }

    if (
      saveLkpValues.ClientGroup &&
      clientAssignmentState.getActiveClientData.length > 0
    ) {
      const matchedClient = clientAssignmentState.getActiveClientData.find(
        (data) => data.clientGroupName === saveLkpValues.ClientGroup
      );
      if (matchedClient) {
        setSaveLkpValues((prev) => ({
          ...prev,
          clientGroupCode: [
            {
              label: matchedClient.clientGroupCode,
              value: matchedClient.clientGroupId,
            },
          ],
        }));
      }
    }
  }, [
    newPolicyState.LOB,
    clientAssignmentState.getActiveClientData,
    newPolicyState.getClaimTypes,
    lookUpState.getStates,
    dispatch,
  ]);

  const handleSuggestions = (event) => {
    let value = event.target.value;
    setSaveLkpValues((prev) => ({
      ...prev,
      clientCode: value,
    }));
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = clientAssignmentState.getActiveClientData
        .filter((k) => {
          const clientCodeLower = k.clientCode?.toLowerCase();
          if (
            clientCodeLower.includes(value?.toLowerCase()) &&
            !seen.has(clientCodeLower)
          ) {
            seen.add(clientCodeLower);
            return true;
          }
          return false;
        })
        .map((k) => ({ label: k.clientCode, value: k.clientGroupId }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
      setSaveLkpValues((prev) => ({
        ...prev,
        clientCode: "",
        clientGroupCode: [],
      }));
      clientGroupExclusion = [];
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    setSuggestions([]);
    setSaveLkpValues({ ...saveLkpValues, clientCode: value });
  };

  let clientGroupExclusion = clientAssignmentState.getActiveClientData
    .filter(
      (k) =>
        k.clientCode === inputValue || k.clientCode === saveLkpValues.clientCode
    )
    .map((k) => {
      return { label: k.clientGroupCode, value: k.clientGroupId };
    });

  const [handleSwal, setHandleSwal] = useState(false);
  //check for entered fields in create cci deviation pop up
  let extraKeys;

  if (!props.isEdit) {
    const validKeys = [
      "cciKey",
      "column_i",
      "column_ii",
      "startDate",
      "endDate",
      "cciRationaleKey",
      "prior_1996_b",
      "allowModB",
      "deviations",
    ];
    extraKeys = Object.keys(saveLkpValues).filter(
      (key) => !validKeys.includes(key)
    );
  }

  const resetFields = () => {
    setSaveLkpValues(CciDeviationInitialState);
    setFieldError(false);
    setIsPopUpOpen(false);
    props.setSelectedCCIDev(false);
    if (!props.isEdit) {
      props.navigate("/viewConfig", { state: { refresh: true } });
    }
    const validateEdited = props.isEdit ? updatedValues() : extraKeys;
    if (validateEdited?.length > 0 || handleSwal) {
      CustomSwal(
        "error",
        "Changes you have made are not saved",
        navyColor,
        "Ok",
        ""
      );
    }
    setHandleSwal(false);
    setJiraId("");
    setJiraDescription("");
    setJiraIdExists(false);
  };

  const LotCM = newPolicyState.LOB?.map((l) => {
    return {
      label: l.lobTitle,
      value: l.lobKey,
    };
  });

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");

  const saveLkpFields = () => {
    const lkpName = props.isEdit ? CCI_DEVIATIONS_EDIT : CCI_DEVIATIONS;
    const lob = saveLkpValues.lobKey.map((lob) => lob.value);
    const claimType = saveLkpValues.claimType.map(
      (claimType) => claimType.value
    );
    const isAllSelected = saveLkpValues.state.some(
      (value) => value.label === "ALL"
    );
    const states = isAllSelected
      ? ["0"]
      : saveLkpValues.state.map((value) => value.label.slice(0, 2));
    let deviationData = [];
    saveLkpValues.clientGroupCode.forEach((data) => {
      deviationData.push({
        clientGroupId: data.value,
        lobKey: lob.join(","),
        claimType: claimType.join(","),
        state: states.join(","),
        cciKey: parseInt(saveLkpValues.cciKey[0]),
        columnI: saveLkpValues.column_i,
        columnII: saveLkpValues.column_ii,
        startDate: formatDate(saveLkpValues.startDate),
        endDate: formatDate(saveLkpValues.endDate),
        cciRationaleKey: parseInt(saveLkpValues.cciRationaleKey[0]),
        allowModB: saveLkpValues.allowModB == "NO" ? 0 : 1,
        devStartDate: formatDate(saveLkpValues.devStartDate),
        devEndDate: formatDate(saveLkpValues.devEndDate),
        comments: saveLkpValues.comments,
        deletedB: saveLkpValues.deletedB || false,
        jiraId: jiraId,
        jiraDesc: jiraDescription,
        userId: localStorage.getItem("emailId"),
        deviationsKey: saveLkpValues.deviationsKey,
      });
    });
    postLookupData(dispatch, deviationData, props.isEdit, lkpName);
    // Post-actions
    setIsPopUpOpen(false);
    setIsConfirm(false);
    setFieldError(false);
    if (!props.isEdit) {
      props.navigate("/viewConfig", { state: { refresh: true } });
    }

    // Custom alert
    const actionType = props.isEdit
      ? saveLkpValues.deletedB
        ? "Disabled"
        : "Edited"
      : "Created";

    CustomSwal(
      "success",
      `CCI Deviation is ${actionType} Successfully`,
      navyColor,
      "Ok",
      ""
    );
    props.setSelectedCCIDev(false);
    setJiraId("");
    setJiraDescription("");
    setJiraIdExists(false);
  };

  const claimTypeOptions = newPolicyState.getClaimTypes?.map((p) => {
    return { label: p.claimType + "-" + p.description, value: p.claimType };
  });

  const states = lookUpState.getStates?.map((s) => {
    return { label: s.abbr + "-" + s.state, value: s.abbr };
  });

  const check = () => {
    const fields = [
      "clientCode",
      "clientGroupCode",
      "lobKey",
      "claimType",
      "devStartDate",
      "devEndDate",
      "comments",
      "state",
    ];
    const missingFields = fields.filter(
      (field) =>
        !saveLkpValues[field] ||
        (Array.isArray(saveLkpValues[field]) &&
          saveLkpValues[field].length === 0)
    );
    if (!jiraId) {
      missingFields.push("jiraId");
    }
    if (!jiraDescription) {
      missingFields.push("jiraDescription");
    }

    checkFileds = !!missingFields.length;
    setFieldError(checkFileds);
    return checkFileds;
  };

  const handleContinue = () => {
    let error = check();
    if (error) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: "Please fill in required fields"}
      });
      return;
    }
    if (
      formatDate(saveLkpValues.devEndDate) <
      formatDate(saveLkpValues.devStartDate)
    ) {
      dispatch({
        type: DIALOG,
        payload: {isDialog:true,
          title: "Error",
        message: "Please Enter the Valid Date Range"}
      });
      return;
    }
    setIsPopUpOpen(false);
    setIsConfirm(true);
    setHandleSwal(true);
  };

  let cciDevData = props?.saveLkpValues ?? CciDeviationInitialState;

  const updatedValues = () => {
    let differentFields = [];
    if (Array.isArray(saveLkpValues?.clientGroupCode)) {
      saveLkpValues?.clientGroupCode.some((data) => {
        if (data?.value !== cciDevData.ClientGroupId) {
          differentFields.push(" Client Group Code");
          return true;
        }
        return false;
      });
    }
    if (Array.isArray(saveLkpValues.claimType)) {
      const claimTypes = cciDevData?.claimType?.split(",") || [];
      const claimTypeValues = saveLkpValues.claimType.map((data) => data.value);
      const hasDifferentLength = claimTypes.length !== claimTypeValues.length;
      const hasElementMismatch = claimTypeValues.some(
        (value) => !claimTypes.includes(value)
      );
      if (hasDifferentLength || hasElementMismatch) {
        differentFields.push(" Claim Type");
      }
    }

    if (Array.isArray(saveLkpValues.lobKey)) {
      const hasDifferentLength =
        saveLkpValues.lobKey.length !== cciDevData.lobKey.length;
      const hasElementMismatch = saveLkpValues.lobKey.some((item, index) => {
        const cciItem = cciDevData.lobKey[index];
        return item.value !== cciItem.value || item.label !== cciItem.label;
      });
      if (hasDifferentLength || hasElementMismatch) {
        differentFields.push("LOB");
      }
    }
    if (Array.isArray(saveLkpValues.state)) {
      const states = cciDevData?.state?.split(",") || [];
      const stateValues = saveLkpValues.state.map((data) => data.value);
      const hasDifferentLength = states.length !== stateValues.length;
      const hasElementMismatch = stateValues.some(
        (value) => !states.includes(value)
      );
      if (hasDifferentLength || hasElementMismatch) {
        differentFields.push(" States");
      }
    }
    if (saveLkpValues.devStartDate !== cciDevData.devStartDate) {
      differentFields.push(" Dev Start Date");
    }
    if (saveLkpValues.devEndDate !== cciDevData.devEndDate) {
      differentFields.push(" Dev End Date");
    }
    if (saveLkpValues.deletedB != cciDevData.deletedB) {
      differentFields.push(" Active");
    }
    return differentFields;
  };

  const createCustomInput = (
    type,
    label,
    value,
    handleMethod,
    disabled,
    showStarIcon
  ) => {
    return (
      <CustomInput
        type={type}
        labelText={label}
        error={!value ? fieldError : false}
        showStarIcon={showStarIcon}
        variant={"outlined"}
        value={value}
        onChange={handleMethod}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        disabled={disabled}
      />
    );
  };

  const createCustomSelect = (
    isMulti,
    checkBoxes,
    options,
    labelText,
    onSelect,
    value,
    isDisabled,
    onMenuOpen = null,
    onMenuClose = null
  ) => {
    return (
      <div
        style={{
          display: "flex",
          width: "40%",
          maxWidth: "60%",
        }}
      >
        <CustomSelect
          isMulti={isMulti}
          checkBoxes={checkBoxes}
          error={
            !value || (Array.isArray(value) && value.length === 0)
              ? fieldError
              : false
          }
          options={options}
          labelText={labelText}
          onSelect={onSelect}
          value={value}
          isDisabled={isDisabled}
          showStarIcon={true}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
        />
      </div>
    );
  };

  const claimTypeValues =
    saveLkpValues.claimType != undefined &&
    typeof saveLkpValues.claimType !== "string"
      ? saveLkpValues.claimType?.map((p) => {
          return { label: p.label.charAt(0), value: p.value };
        })
      : "";

  const isAllSelected = useCallback(
    () =>
      Array.isArray(saveLkpValues?.state) &&
      saveLkpValues?.state?.some((v) => v.label === "ALL"),
    [saveLkpValues]
  );

  const stateValues = useMemo(() => {
    return Array.isArray(saveLkpValues?.state) && saveLkpValues.state.length > 0
      ? saveLkpValues.state.map((p) => ({
          label: isAllSelected()
            ? p.label === "ALL"
              ? "ALL"
              : p.label.split("-")[0]
            : p.label.split("-")[0],
          value: p.value,
        }))
      : [];
  }, [isAllSelected, saveLkpValues.state]);

  const toggleButton = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <>
      <Dialogbox
        disableBackdropClick={true}
        open={isPopUpOpen}
        onClose={resetFields}
        title={
          !saveLkpValues.isEdit ? "Create CCI Deviation" : "Edit CCI Deviation"
        }
        message={
          <DialogContent style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <JiraComponent
                  jiraId={jiraId}
                  jiraDescription={jiraDescription}
                  fieldError={fieldError}
                  setJiraId={setJiraId}
                  setJiraDescription={setJiraDescription}
                  existingJiraIds={props.TotalData.map((obj) => obj.jiraId)}
                  setJiraIdExist={setJiraIdExists}
                />
                {props.isEdit ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexFlow: "row",
                      justifyContent: "flex-start",
                      alignItems: "start",
                    }}
                  >
                    <small
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      {"Active"}
                    </small>
                    <CustomCheckBox
                      style={{
                        display: "flex",
                        borderRadius: "50%",
                        marginLeft: "3px",
                      }}
                      onChange={(e) => {
                        toggleButton();
                        setSaveLkpValues((prev) => {
                          return { ...prev, deletedB: !prev.deletedB };
                        });
                      }}
                      checked={isActive}
                      propsColor={successColor}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {createCustomInput(
              "text",
              "Client Code",
              saveLkpValues.clientCode,
              handleSuggestions,
              saveLkpValues.deletedB || props.isEdit,
              true
            )}
            {suggestions.length > 0 && (
              <ul className="suggestions-list" id="suggestionList">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.label)}
                    role="option"
                  >
                    {suggestion.label ? suggestion.label : suggestion}
                  </li>
                ))}
              </ul>
            )}
            {createCustomSelect(
              true,
              true,
              clientGroupExclusion,
              "Client Group Code",
              (value) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  clientGroupCode: value,
                }));
              },
              saveLkpValues.clientGroupCode,
              saveLkpValues.deletedB
            )}
            {createCustomSelect(
              true,
              true,
              [{ label: "ALL", value: "0" }, ...states],
              "States",
              (e, meta) => {
                if (!e || e?.length === 0) {
                  setSaveLkpValues((prev) => ({
                    ...prev,
                    state: [],
                  }));
                  return;
                }
                const { action, option } = meta;
                const finalState = (() => {
                  if (option.label === "ALL") {
                    if (action === "select-option") {
                      return [{ label: "ALL", value: "0" }, ...states]; // Select all
                    }
                    return []; // Deselect all
                  }
                  const filteredSelection = e.filter((v) => v.label !== "ALL");

                  return filteredSelection.length === states.length
                    ? [{ label: "ALL", value: "0" }, ...states] // Select all when all options are selected
                    : filteredSelection; // Otherwise, show only selected values
                })();

                setSaveLkpValues((prev) => ({
                  ...prev,
                  state: finalState,
                }));
              },

              stateValues,
              saveLkpValues.deletedB,

              () => {
                if (isAllSelected()) {
                  setSaveLkpValues((prev) => ({
                    ...prev,
                    state: [{ label: "ALL", value: "0" }, ...states],
                  }));
                }
              },
              () => {
                if (isAllSelected()) {
                  setSaveLkpValues((prev) => ({
                    ...prev,
                    state: [{ label: "ALL", value: "0" }],
                  }));
                }
              }
            )}
            {createCustomSelect(
              true,
              true,
              LotCM,
              "Line Of Business",
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  lobKey: e,
                }));
              },
              saveLkpValues.lobKey,
              saveLkpValues.deletedB
            )}
            {createCustomSelect(
              true,
              true,
              claimTypeOptions,
              "Claim Type",
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  claimType: e,
                }));
              },
              claimTypeValues,
              saveLkpValues.deletedB
            )}
            {createCustomInput(
              "text",
              "CCI Key",
              saveLkpValues.cciKey,
              null,
              true,
              false
            )}
            {createCustomInput(
              "text",
              "Column I",
              saveLkpValues.column_i,
              null,
              true,
              false
            )}
            {createCustomInput(
              "text",
              "Column II",
              saveLkpValues.column_ii,
              null,
              true,
              false
            )}
            {createCustomInput(
              "date",
              "Start Date",
              saveLkpValues.startDate
                ? formatDate(saveLkpValues.startDate)
                : undefined,
              null,
              true,
              false
            )}
            {createCustomInput(
              "date",
              "End Date",
              saveLkpValues.endDate
                ? formatDate(saveLkpValues.endDate)
                : undefined,
              null,
              true,
              false
            )}
            {createCustomInput(
              "text",
              "CCI Rationale",
              saveLkpValues.cciRationaleKey || [],
              null,
              true,
              false
            )}
            {createCustomInput(
              "text",
              "Allow Mod",
              saveLkpValues.allowModB,
              null,
              true,
              false
            )}
            {createCustomInput(
              "date",
              "Dev Start Date",
              saveLkpValues.devStartDate
                ? formatDate(saveLkpValues.devStartDate)
                : undefined,
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  devStartDate: e.target.value,
                }));
              },
              saveLkpValues.deletedB,
              true
            )}
            {createCustomInput(
              "date",
              "Dev End Date",
              saveLkpValues.devEndDate
                ? formatDate(saveLkpValues.devEndDate)
                : undefined,
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  devEndDate: e.target.value,
                }));
              },
              saveLkpValues.deletedB,
              true
            )}
            {createCustomInput(
              "text",
              "Comments",
              saveLkpValues.comments,
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  comments: e.target.value,
                }));
              },
              false,
              true
            )}
            {createCustomInput(
              "text",
              "User ID",
              localStorage.getItem("emailId"),
              (e) => {
                setSaveLkpValues((prev) => ({
                  ...prev,
                  userId: e.target.value,
                }));
              },
              true,
              true
            )}
          </DialogContent>
        }
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={handleContinue}
              disabled={jiraIdExists}
              style={{
                backgroundColor: navyColor,
                color: "white",
                margin: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
                opacity: jiraIdExists ? 0.7 : 1,
              }}
            >
              Continue
            </CustomButton>
            <CustomButton
              onClick={() => {
                resetFields();
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
              cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
      <Dialogbox
        open={isConfirm}
        onClose={resetFields}
        disableBackdropClick={true}
        title={"Confirm"}
        message={`${
          !props.isEdit
            ? "CCI Deviation to the "
            : !saveLkpValues.deletedB
            ? "To the"
            : "The"
        } Code Pair ${saveLkpValues.column_i} and ${saveLkpValues.column_ii} ${
          props.isEdit
            ? saveLkpValues.deletedB
              ? " is DISABLED"
              : `${updatedValues()} is updated`
            : " is created"
        }`}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={() => saveLkpFields()}
              style={{
                backgroundColor: successColor,
                color: "white",
                marginRight: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              save
            </CustomButton>
            <CustomButton
              onClick={resetFields}
              style={{
                backgroundColor: dangerColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
    </>
  );
};
export default CciDeviationEditPopUp;

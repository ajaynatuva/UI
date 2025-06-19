import React, { useEffect, useMemo, useState } from "react";
import {
  ButtonGroup,
  DialogContent,
  IconButton,
  Link,
} from "@material-ui/core";
import {
  dangerColor,
  navyColor,
  successColor,
} from "../../../assets/jss/material-kit-react";
import { Add, Height } from "@mui/icons-material";
import AgGrids from "../../../components/TableGrid/AgGrids";
import { getRequiredHeaders, taxAndNPITabBtnStyles } from "./TaxIdConstants";
import { useDispatch, useSelector } from "react-redux";
import Dialogbox from "../../../components/Dialog/DialogBox";
import { TaxIdState } from "../../../redux/reducers/NewPolicyTabReducers/TaxIdReducer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import moment from "moment";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import * as XLSX from "xlsx";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import {
  createExcelFile,
  exportedExcelFileData,
} from "../../../components/ExportExcel/ExportExcelFile";

import "../TaxIdTab/TaxId.css";
import DialogBoxWithOutBorder from "../../../components/Dialog/DialogBoxWithOutBorder";
import { CircularProgressWithLabel } from "../../../components/Spinner/CircularProgressWithLabel";
import { UseProgressValue } from "../../../components/Spinner/UseProgressValue";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import {
  addTaxIdChangesData,
  addTaxIdData,
  DeactivateTaxIdData,
  getTaxIDDataPolicy,
  uploadTaxIdToStage,
  UploadTaxIdToTarget,
} from "../../../redux/ApiCalls/NewPolicyTabApis/TaxIdApis";
import { DescriptionTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { ClientAssignmentState } from "../../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import {
  DIALOG,
  RESET_TAX_ID_FIELDS,
  TAX_ID_FIELDS,
} from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getActiveClientGroups } from "../../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import {
  checkCodeIsPresent,
  checkLengthCode,
  determineImportPolicyId,
  readFile,
  showImportError,
  validateFile,
  validateFileHeaders,
} from "../../../redux/ApiCallAction/FileValidations/FileReadAndValidations";
import {
  JiraStringMethod,
  validateNumberMethod,
} from "../../../redux/ApiCallAction/Validations/StringValidation";
import JiraComponent from "../JiraComponent";
import { addChangesData } from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { getLOB } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { taxIdColumns } from "../Columns";
const TaxId = ({ fromViewPolicy, policyId, edit }) => {
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [activeClientCode, setActiveClientCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [Deactivate, setDeactivate] = useState(false);
  const [jiraIdExists, setJiraIdExists] = useState(false);
  const [TaxIdData, setTaxIdData] = useState([]);
  const [proceed, setProceed] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [importClicked, setImportClicked] = useState(false);
  const [taxIdImportFile, setTaxIdImportFile] = useState(undefined);
  const [disableButtons, setDisableButtons] = useState(false);
  const { showProgress, progress, showProgressValues, hideProgress } =
    UseProgressValue();
  const [jiraId, setJiraId] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const taxIdFieldState: TaxIdState = useSelector(
    (state: any) => state.TaxIdFieldsRedux
  );

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const policyFieldState: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );

  const clientAssignmentState: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );
  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );
  const dispatch = useDispatch();

  const handleToCloseDialog = () => {
    setOpenDialog(false);
    dispatch({ type: RESET_TAX_ID_FIELDS });
    dispatch({ type: TAX_ID_FIELDS, payload: "" });
    setDeactivate(false);
    setImportClicked(false);
    setProceed(false);
    setJiraIdExists(false);
    setDisableButtons(false);
    setClientSuggestions([]);
    setActiveClientCode("");
    refreshJiraDetails();
    setFieldError(false);
  };

  const refreshJiraDetails = () => {
    setJiraId("");
    setJiraDescription("");
    setJiraIdExists(false);
  };
  // useEffect(() => {
  //   if (policyId != null) {
  //     getTaxIDDataPolicy(dispatch, policyId);
  //   }
  // }, []);

    useEffect(() => {
      if (newpolicyState.LOB.length == 0) {
        getLOB(dispatch);
      }
    }, []);

  useEffect(() => {
    if (clientAssignmentState.getActiveClientData.length == 0) {
      getActiveClientGroups(dispatch);
    }
  }, []);

  function getClientCode(clientGroupId) {
    const client = clientAssignmentState.getActiveClientData.find(
      (k) => k.clientGroupId == clientGroupId
    );
    return client ? client.clientCode : null;
  }

  function getClientGroupCode(clientGroupId) {
    const client = clientAssignmentState.getActiveClientData.find(
      (k) => k.clientGroupId == clientGroupId
    );
    return client ? client.clientGroupCode : null;
  }

  function DisplayLobDescription(lobKey) {
    const lob = LobOptions.find((k) => k.value == lobKey);
    return lob ? lob.label : null;
  }


  useEffect(() => {
    if (clientAssignmentState.getActiveClientData.length > 0 && taxIdFieldState.getTaxIdTabledata.length>0) {
      const TaxIdData = taxIdFieldState.getTaxIdTabledata?.map((k) => {
        return {
          clientGroupId: k.clientGroupId,
          client: getClientCode(k.clientGroupId),
          clientGroupCode: getClientGroupCode(k.clientGroupId),
          lob: DisplayLobDescription(k.lob),
          claimType: k.claimType,
          taxId: k.taxId,
          deletedB: k.deletedB === 0 ? "Active" : "Deactivated",
          createdDate: moment(k.createdDate).format("MM-DD-YYYY"),
          updatedDate: moment(k.updatedDate).format("MM-DD-YYYY"),
        };
      });
      setTaxIdData(TaxIdData);
      setNumberOfRows(TaxIdData.length);
    }
  }, [
    taxIdFieldState.getTaxIdTabledata,
    clientAssignmentState.getActiveClientData.length,
  ]);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  const _ = require("lodash");

  const set = new Set(
    clientAssignmentState.getClientAssignmentTableData?.map(
      (data) => data.clientGroupId
    )
  );
  const filteredClientAssignmentData =
  clientAssignmentState.getActiveClientData?.filter((data) =>
      set.has(data.clientGroupId)
    );

  const clientCodeSelection = (event) => {
    let value = event.target.value;
    if (event.target.value.length < 3) {
      dispatch({ type: TAX_ID_FIELDS, payload: { clientGroupCode: "" } });
    }
    setActiveClientCode(value);
    // setTaxIdState({ ...TaxIdState, clientCode: value });
    dispatch({ type: TAX_ID_FIELDS, payload: { clientCode: value } });
    if (value.length > 0) {
      const seen = new Set();
      const filteredSuggestions = filteredClientAssignmentData
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
      dispatch({
        type: TAX_ID_FIELDS,
        payload: { clientCode: "", clientGroupCode: "" },
      });
    }
  };

  const handleSuggestionClick = (value) => {
    // clientAssignment.clientCode = value;
    setActiveClientCode(value);
    dispatch({
      type: TAX_ID_FIELDS,
      payload: {
        clientCode: value,
        errors: {
          ...taxIdFieldState?.errors, // Preserve existing errors
          clientCode: false, // Clear only the taxId error
        },
      },
    });
    // TaxIdState.clientCode = value;
    setClientSuggestions([]);
  };

  let clientGroupExclusion = filteredClientAssignmentData
    .filter((k) => k.clientCode === activeClientCode)
    .map((k) => {
      return {
        label: k.clientGroupCode,
        value: k.clientGroupId,
      };
    });

    const claimTypeOptions = policyFieldState.claimType?.map((p) => {
      if (p.value != null || p.value != undefined) {
      const matchingClaim = newpolicyState.getClaimTypes?.find(
        (k) => k.claimType === p.value
      );
      return {
        label: `${p.label}-${matchingClaim?.description || ""}`,
        value: p.value,
      };
    }
    });

  const claimTypeValues = taxIdFieldState.claimType?.map((p) => {
    return { label: p.label.charAt(0), value: p.value };
  });

  // const lobOptions =
  // descTabFieldState.lob?.value != null && descTabFieldState.lob?.value != undefined
  //     ? [
  //         {
  //           label: `${descTabFieldState.lob?.label}`,
  //           value: `${descTabFieldState.lob?.value}`,
  //         },
  //       ]
  //     : [];
  // const lobOptions = formState.lob?.value != null && formState.lob?.value != undefined ? [
  //   {
  //     label: `${formState.lob?.label}`,
  //     value: `${formState.lob?.value}`,
  //   }
  // ] : [];

  const LobOptions = newpolicyState.LOB?.map((l) => {
    return { label: l.lobTitle, value: l.lobKey };
  });

  const changesTaxIdData = {
    jiraId: jiraId,
    jiraDesc: jiraDescription,
    jiraLink: `https://advancedpricing.atlassian.net/browse/${jiraId}`,
    userId: localStorage.getItem("emailId"),
    policyId: policyId,
    isOpenb: 0,
  };
  async function taxIdFileUpload() {
    const validation = validateFile(taxIdImportFile);
    if (!validation) {
      setImportClicked(false);
      return;
    }

    try {
      const { array, headers } = await readFile({
        file: taxIdImportFile,
        valid: validation,
      });
      if (!validateFileHeaders(headers, getRequiredHeaders())) {
        showImportError(`Import Failed.<br>Please Upload a valid File.`);
        setImportClicked(false);
        return;
      }
      let uniqueCodes = [];
      let error = false;
      array.forEach((o, i) => {
        if (
          !o.TAXID ||
          !o.CLIENTGROUPID ||
          !o.POLICYID ||
          !o.CLAIMTYPE ||
          !o.LOB ||
          !o.ACTION
        ) {
          error = true;
          setImportClicked(false);
          CustomSwal(
            "error",
            `Excel sheet contains empty cell Row at  ${i + 2}`,
            navyColor,
            "Ok",
            "Error"
          );
          return; // Skip this iteration
        }
        if (
          o.CLAIMTYPE.replace(/\s/g, "")
            .split(",")
            .some(
              (claim) =>
                !policyFieldState.claimType.map((claimType) => claimType.value).includes(claim)
            )
        ) {
          error = true;
          setImportClicked(false);
          CustomSwal("error", "Invalid Claim Type", navyColor, "OK", "Error");
          return; // Skip this iteration
        } else if (
          !checkCodeIsPresent(
            uniqueCodes,
            o.TAXID +
              "-" +
              o.CLIENTGROUPID +
              "-" +
              o.POLICYID +
              "-" +
              o.CLAIMTYPE +
              "-" +
              o.LOB +
              "-" +
              o.ACTION
          )
        ) {
          uniqueCodes.push(
            o.TAXID +
              "-" +
              o.CLIENTGROUPID +
              "-" +
              o.POLICYID +
              "-" +
              o.CLAIMTYPE +
              "-" +
              o.LOB +
              "-" +
              o.ACTION
          );
        } else {
          error = true;
          setImportClicked(false);
          CustomSwal(
            "error",
            "Duplicate Row at " +
              (i + 2) +
              " - " +
              "TAXID CODE is : " +
              o.TAXID +
              " and " +
              "CLIENT GROUP ID is : " +
              o.CLIENTGROUPID,
            navyColor,
            "Ok",
            "Error"
          );
        }
      });

      let transformedData: any[] = [];
      // Process data to split `claimType` into multiple rows
      array.forEach((row: any) => {
        if (row["CLAIMTYPE"]) {
          let claimTypes = row["CLAIMTYPE"].split(",");
          claimTypes.forEach((type: string) => {
            transformedData.push({
              ...row,
              CLAIMTYPE: type.trim(),
            });
          });
        } else {
          transformedData.push(row);
        }
      });
      let taxIdLengthCheck;
      const importPolicyId = determineImportPolicyId(array, policyId);
      for (const row of array) {
        const taxIdStr = String(row.TAXID); // Convert to string
        taxIdLengthCheck = checkLengthCode(taxIdStr, 9);

        if (taxIdLengthCheck) {
          break; // Exit the loop when an invalid TAXID is found
        }
      }

      // Convert processed data back to Excel file
      const TaxIdFile: File = await createExcelFile(transformedData);

      // Create FormData and append updated file
      const formData = new FormData();
      formData.append("uploadfile", TaxIdFile);
      let user = localStorage.getItem("emailId");
      formData.append("email", user);
      if (error) return;
      if (importPolicyId === -1) {
        showImportError("Policy ID is blank.");
        setImportClicked(false);
        return;
      } else if (importPolicyId !== policyId) {
        showImportError("Policy ID not matched.");
        setImportClicked(false);
        return;
      } else if (taxIdLengthCheck) {
        showImportError("Tax Id must be 9 digits and only Numeric");
        setImportClicked(false);
      } else {
        const progressInterval = showProgressValues();
       await uploadTaxIdToStage(dispatch, formData, progressInterval,hideProgress);
        setImportClicked(false);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  function mapAndSort(arr) {
    if (!arr) return ""; // Handle undefined/null
    if (!Array.isArray(arr)) arr = [arr]; // Convert single object to array

    return (
      arr
        .map((c) => {
          const lob = LobOptions.find(
            (option) => option.label === c.value || option.value === c.value
          );
          return lob ? lob.value : c.value;
        })
        .sort()
        .join(",") || ""
    );
  }

  const importJiraFields = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <JiraComponent
            jiraId={jiraId}
            jiraDescription={jiraDescription}
            fieldError={fieldError}
            setJiraId={setJiraId}
            setJiraDescription={setJiraDescription}
            existingJiraIds={[
              ...changesTabFields.changesTableData?.map((data) => data.jiraId),
              changesTabFields.jiraId,
            ]}
            setJiraIdExist={setJiraIdExists}
          />
          {Deactivate ? (
            <CustomCheckBox
              label={"Active"}
              checked={taxIdFieldState.deletedB}
              propsColor={successColor}
              onChange={(event) => {
                dispatch({
                  type: TAX_ID_FIELDS,
                  payload: { deletedB: event.target?.checked },
                });
              }}
              value={taxIdFieldState.deletedB}
            />
          ) : undefined}
        </div>
      </>
    );
  };

  function displayTaxIdFields() {
    return (
      <>
        {importJiraFields()}
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              type={"text"}
              labelText={"Client Code"}
              variant={"outlined"}
              // error={!taxonomy.clientCode ? fieldError : false}
              error={taxIdFieldState?.errors?.clientCode}
              showStarIcon={true}
              value={taxIdFieldState.clientCode}
              onChange={clientCodeSelection}
              aria-autocomplete="list"
              aria-controls="autocomplete-list"
              disabled={Deactivate}
            />
            {clientSuggestions.length > 0 && (
              <ul className="suggestions-list" id="suggestionList">
                {clientSuggestions.map((suggestion, index) => (
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
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomSelect
              options={clientGroupExclusion}
              labelText={"Client Group Code"}
              isDisabled={Deactivate}
              error={taxIdFieldState?.errors?.clientGroupCode}
              showStarIcon={true}
              styles={{ overflowY: "auto" }}
              onSelect={(e) => {
                if (!e) {
                  // Handle clearing selection
                  dispatch({
                    type: TAX_ID_FIELDS,
                    payload: {
                      clientGroupCode: null, // or empty object {}
                      clientGroupId: null, // Reset the ID as well
                      errors: {
                        ...taxIdFieldState?.errors,
                        clientGroupCode: false,
                      },
                    },
                  });
                  return;
                }
                // Handle normal selection
                dispatch({
                  type: TAX_ID_FIELDS,
                  payload: {
                    clientGroupCode: clientGroupExclusion.find(
                      (option) => option.label === e.label
                    ),
                    clientGroupId: e.value,
                    errors: {
                      ...taxIdFieldState?.errors,
                      clientGroupCode: false,
                    },
                  },
                });
              }}
              value={taxIdFieldState.clientGroupCode}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomSelect
              // isMulti
              // checkBoxes={true}
              isDisabled={Deactivate}
              error={taxIdFieldState?.errors?.lob}
              onSelect={(event) => {
                dispatch({
                  type: TAX_ID_FIELDS,
                  payload: {
                    lob: event,
                    errors: {
                      ...taxIdFieldState?.errors,
                      lob: false,
                    },
                  },
                });
              }}
              value={taxIdFieldState.lob}
              options={LobOptions}
              labelText={"LOB"}
              showStarIcon={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomSelect
              isMulti
              checkBoxes={true}
              isDisabled={Deactivate}
              error={taxIdFieldState?.errors?.claimType}
              onSelect={(event) => {
                dispatch({
                  type: TAX_ID_FIELDS,
                  payload: {
                    claimType: event,
                    errors: {
                      ...taxIdFieldState?.errors,
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
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              labelText={"Tax ID"}
              showStarIcon={true}
              variant={"outlined"}
              error={taxIdFieldState?.errors?.taxId}
              disabled={Deactivate}
              value={taxIdFieldState.taxId}
              maxLength={9}
              type={Number}
              placeholder="Numeric(9 digits)"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                if (value.length == 9 && !jiraIdExists) setDisableButtons(false);
                dispatch({
                  type: TAX_ID_FIELDS,
                  payload: {
                    taxId: value,
                    errors: {
                      ...taxIdFieldState?.errors,
                      taxId: false,
                    },
                  },
                });
              }}
              onKeyPress={(e) => validateNumberMethod(e)}
            />
            {taxIdFieldState?.taxId.length > 0 &&
              taxIdFieldState?.taxId.length < 9 && (
                <small style={{ color: "red", display: "block" }}>
                  Tax Id must be 9 digits
                </small>
              )}
          </div>
        </div>
      </>
    );
  }

  function displaySucessAndFailurePopUps() {
    return (
      <>
        <Dialogbox
          open={proceed}
          title={"Confirm"}
          disableBackdropClick={true}
          fullWidth={false}
          onClose={handleToCloseDialog}
          message={
            <>
              {proceed && taxIdFieldState.deletedB === true
                ? "Would you like to Add this Record ?"
                : proceed && taxIdFieldState.deletedB === false
                ? "Tax ID " + taxIdFieldState.taxId + "  is DEACTIVATED"
                : ""}
            </>
          }
          actions={
            <ButtonGroup>
              <CustomButton
                onClick={() => {
                  addAndDeactivateRecord();
                  setProceed(false);
                  handleToCloseDialog();
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
                {proceed && taxIdFieldState.deletedB === true ? "Yes" : "Save"}
              </CustomButton>
              <CustomButton
                onClick={() => {
                  setOpenDialog(false);
                  setImportClicked(false);
                  setTaxIdImportFile(undefined);
                  setProceed(false);
                  dispatch({ type: RESET_TAX_ID_FIELDS });
                  refreshJiraDetails();
                  handleToCloseDialog();
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
                {proceed && taxIdFieldState.deletedB === true ? "No" : "Cancel"}
              </CustomButton>
            </ButtonGroup>
          }
        />
      </>
    );
  }
  async function addAndDeactivateRecord() {
    const TaxIdData = taxIdFieldState?.claimType?.map((k) => {
      return {
        policyIdFk: policyId,
        clientGroupId: taxIdFieldState.clientGroupId,
        lob: mapAndSort(taxIdFieldState.lob),
        claimType: k?.value,
        taxId: taxIdFieldState.taxId,
        deletedB: taxIdFieldState.deletedB === false ? 1 : 0,
      };
    });

    if (taxIdFieldState.deletedB === true) {
      await Promise.all([
        addTaxIdData(dispatch, TaxIdData),
        addChangesData(dispatch, policyId, jiraId, jiraDescription),
        getTaxIDDataPolicy(dispatch,policyId)
      ]);
      dispatch({ type: RESET_TAX_ID_FIELDS });
      refreshJiraDetails();
      setClientSuggestions([]);
      setActiveClientCode("");
    }
    if (taxIdFieldState.deletedB === false) {
      await Promise.all([
        DeactivateTaxIdData(dispatch, TaxIdData),
        addChangesData(dispatch, policyId, jiraId, jiraDescription),
        getTaxIDDataPolicy(dispatch,policyId)
      ]);
      dispatch({ type: RESET_TAX_ID_FIELDS });
      refreshJiraDetails();
      setClientSuggestions([]);
      setActiveClientCode("");
    }
  }

  function showDialogTitle() {
    if (importClicked) return "Upload Tax ID File";
    if (openDialog) return "Add Tax Id Exclusion";
    if (Deactivate) return "Deactivate Tax ID Exclusion";
    if (taxIdFieldState.taxIdTargetData) return "Confirm";
  }

  function disableBtns() {
    if (importClicked && !jiraIdExists) return false;
    if (taxIdFieldState.taxIdTargetData) return false;
    if (disableButtons) return true;
    if (jiraIdExists) return true;
  }

  const fillRequiredFields = (value) => {
    return dispatch({
      type: DIALOG,
      payload: {isDialog:true,
        title: "Error",
      message:
        value == "exists"
          ? "This Record Already Exists"
          : "Please fill in required fields"}
    });
  };

  const validateFields = () => {
    const requiredFields = [
      "clientCode",
      "clientGroupCode", // Object { label, value }
      "clientGroupId",
      "lob", // Array of objects [{ label, value }]
      "claimType", // Array of objects [{ label, value }]
      "taxId",
    ];
    let errors = {};
    let existingRecord = false;
    if (!Deactivate) {
      existingRecord = taxIdFieldState.getTaxIdTabledata?.find((k) => {
        const clientCodeMatch =
          taxIdFieldState.clientCode === getClientCode(k.clientGroupId);
        const clientGroupIdMatch =
          taxIdFieldState.clientGroupId === k.clientGroupId;
        const lobMatch =
          Number(mapAndSort(taxIdFieldState.lob)) === Number(k.lob);
        const claimTypeMatch = taxIdFieldState.claimType.some((claim) =>
          k.claimType
            .split(",")
            .map((c) => c.trim())
            .includes(claim.value)
        );
        const taxIdMatch = String(taxIdFieldState.taxId) === String(k.taxId);
        let deletedB = taxIdFieldState.deletedB ? 0 : 1;
        const deletedMatch = deletedB === k.deletedB;
        if (
          clientCodeMatch &&
          clientGroupIdMatch &&
          lobMatch &&
          claimTypeMatch &&
          taxIdMatch &&
          deletedMatch
        ) {
          return true;
        }
        return false;
      });
    }
    requiredFields.forEach((key) => {
      const value = taxIdFieldState[key];
      const isInvalid =
        !value ||
        (Array.isArray(value) &&
          (value.length === 0 || value.every((item) => !item.value))) ||
        (typeof value === "object" && !Array.isArray(value) && !value?.value);

      if (isInvalid) errors[key] = true;
    });
    // Handle Jira condition
    const jiraError = !jiraId || !jiraDescription;
    setFieldError(jiraError);
    // Handle deletedB condition
    if (Deactivate && taxIdFieldState.deletedB) {
      errors["deletedB"] = true;
    }
    if (Object.keys(errors).length > 0 || jiraError) {
      dispatch({ type: TAX_ID_FIELDS, payload: { errors } });
      fillRequiredFields("not_exists");
    } else if (existingRecord) {
      fillRequiredFields("exists");
    } else if (taxIdFieldState.taxId.toString().length != 9) {
      setDisableButtons(true);
    } else {
      setProceed(true);
      setDeactivate(false);
      setOpenDialog(false);
    }
  };

  function showFileContent() {
    return (
      <>
        <div className="row">{importJiraFields()}</div>
        <div className="row" style={{ marginTop: 10 }}>
          <input
            type="file"
            accept=".xlsx"
            disabled={!jiraId || !jiraDescription}
            onChange={(event) => {
              let file = event.target.files[0];
              setTaxIdImportFile(file);
            }}
          />
        </div>
        <div
          style={{
            fontSize: "10px",
            marginTop: 30,
            fontFamily: "sans-serif",
          }}
        >
          Note : Client Group ID will derive the Client Code and <br />
          Client Group Code regardless of the input value
        </div>
      </>
    );
  }
  async function exportTaxIdData() {
    let taxIdExport = taxIdFieldState.getTaxIdTabledata?.map((k) => {
      return {
        PolicyId: policyFieldState.policyId,
        ClientGroupId: k.clientGroupId,
        ClientCode: getClientCode(k.clientGroupId),
        ClientGroupCode: getClientGroupCode(k.clientGroupId),
        LOB: k.lob,
        ClaimType: k.claimType,
        TAXID: k.taxId,
        Action: k.deletedB === 1 ? "Deactivated" : "Active",
      };
    });
    if (TaxIdData.length > 0) {
      await exportedExcelFileData(
        taxIdExport,
        `${policyFieldState.policyNumber}/${
          policyFieldState.version + "_TAX_ID"
        }`,
        "taxID"
      );
    }
  }
  function showTargetTaxIdContent() {
    return (
      <p>
        Delta Path:{" "}
        <Link target="_blank" href={`${taxIdFieldState.taxIdDeltaLink}`}>
          Delta Link
        </Link>{" "}
        <br></br>
        Would you like to Send Stage data to Target?
      </p>
    );
  }
  function showTaxIdDiaglogContent() {
    if (importClicked) return showFileContent();
    if (openDialog || Deactivate)
      return (
        <DialogContent style={{ maxHeight: "400px", overflowY: "scroll" }}>
          {displayTaxIdFields()}
        </DialogContent>
      );
    if (taxIdFieldState.taxIdTargetData) return showTargetTaxIdContent();
  }
  function showTaxIdBtnLabel() {
    if (importClicked && taxIdImportFile) return "Upload";
    if (openDialog || Deactivate) return "Continue";
    if (taxIdFieldState.taxIdTargetData) return "Yes";
  }

  const taxIdColumnsDefs = useMemo(
    () =>
      taxIdColumns(
        setDeactivate,
        (value) => dispatch({ type: TAX_ID_FIELDS, payload: value }),
        fromViewPolicy
      ),
    []
  );
  return (
    <>
      {edit ? (
        <div className="row">
          <div className="taxIdContainer">
            <div className="row">
              <div className="col-sm-4">
                <h6>Tax ID Exclusions</h6>
              </div>
              <div className="col-sm-4" />
              <div className="col-sm-4">
                <IconButton
                  onClick={() => {
                    dispatch({ type: RESET_TAX_ID_FIELDS });
                    refreshJiraDetails();
                    setOpenDialog(true);
                  }}
                  style={{
                    backgroundColor: navyColor,
                    color: "white",
                    padding: 5,
                    marginTop: 2,
                    opacity: fromViewPolicy ? 0.7 : 1,
                    float: "right",
                  }}
                  disabled={fromViewPolicy}
                >
                  <Add />
                </IconButton>
              </div>
            </div>
            <div className="row">
              <div
                style={{
                  minHeight: "260px",
                  height: "auto !important",
                }}
              >
                <AgGrids
                  columnDefs={taxIdColumnsDefs}
                  // columnDefs={taxIdColumns(
                  //   setDeactivate,
                  //   (value) =>
                  //     dispatch({ type: TAX_ID_FIELDS, payload: value }),
                  //   fromViewPolicy
                  // )}
                  animateRows={true}
                  rowData={TaxIdData}
                  onFilterChanged={onFilterChanged}
                />
              </div>
            </div>
          </div>
          <div className="row" style={{ position: "relative", top: "2px" }}>
            <div className="col-sm-8">
              <small>Number of rows : {numberOfRows}</small>
            </div>
            <div className="col-sm-4 d-flex justify-content-end">
              <ButtonGroup>
                <CustomButton
                  disabled={fromViewPolicy && edit}
                  onClick={() => {
                    dispatch({ type: RESET_TAX_ID_FIELDS });
                    refreshJiraDetails();
                    setImportClicked(true);
                    setTaxIdImportFile(undefined);
                  }}
                  style={taxAndNPITabBtnStyles({
                    color: navyColor,
                    disable: false,
                    fromViewPolicy: fromViewPolicy,
                  })}
                >
                  Import
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    exportTaxIdData();
                  }}
                  disabled={TaxIdData.length <= 0}
                  style={taxAndNPITabBtnStyles({
                    color: navyColor,
                    disable: false,
                  })}
                >
                  Export
                </CustomButton>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ) : undefined}
      <>
        {importClicked ||
        openDialog ||
        Deactivate ||
        taxIdFieldState?.taxIdTargetData ? (
          <Dialogbox
            disableBackdropClick
            title={showDialogTitle()}
            open={
              openDialog ||
              Deactivate ||
              importClicked ||
              taxIdFieldState?.taxIdTargetData
            }
            fullWidth={
              importClicked || taxIdFieldState.taxIdTargetData ? false : true
            }
            maxWidth={
              importClicked || taxIdFieldState?.taxIdTargetData ? "" : "sm"
            }
            onClose={handleToCloseDialog}
            message={<>{showTaxIdDiaglogContent()}</>}
            actions={
              <ButtonGroup>
                {taxIdImportFile ||
                openDialog ||
                Deactivate ||
                taxIdFieldState.taxIdTargetData ? (
                  <CustomButton
                    disabled={disableBtns()}
                    onClick={async () => {
                      if (importClicked) {
                        await taxIdFileUpload();
                      } else if (taxIdFieldState?.taxIdTargetData) {
                        await UploadTaxIdToTarget(
                          dispatch,
                          policyId,
                          changesTaxIdData
                        );
                        dispatch({
                          type: TAX_ID_FIELDS,
                          payload: { taxIdTargetData: undefined },
                        });
                      } else {
                        validateFields();
                        // setOpenDialog(false);
                      }
                    }}
                    style={taxAndNPITabBtnStyles({
                      color: navyColor,
                      disable: jiraIdExists,
                    })}
                  >
                    {showTaxIdBtnLabel()}
                  </CustomButton>
                ) : undefined}
                <CustomButton
                  onClick={handleToCloseDialog}
                  style={taxAndNPITabBtnStyles({
                    color: dangerColor,
                    disable: false,
                  })}
                >
                  {taxIdFieldState.taxIdTargetData ? "No" : "cancel"}
                </CustomButton>
              </ButtonGroup>
            }
          />
        ) : undefined}
      </>
      
      <DialogBoxWithOutBorder
        open={showProgress}
        showIcon={false}
        contentStyle={{ maxHeight: "30px", overflow: "hidden" }}
        message={
          <>
            <CircularProgressWithLabel value={progress} />
          </>
        }
      />
      {proceed && displaySucessAndFailurePopUps()}
    </>
  );
};
export default TaxId;

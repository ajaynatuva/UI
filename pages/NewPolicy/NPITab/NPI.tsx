import {
  ButtonGroup,
  DialogContent,
  IconButton,
  Link,
} from "@material-ui/core";
import { Add } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dangerColor,
  navyColor,
  successColor,
} from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Dialogbox from "../../../components/Dialog/DialogBox";
import DialogBoxWithOutBorder from "../../../components/Dialog/DialogBoxWithOutBorder";
import { CircularProgressWithLabel } from "../../../components/Spinner/CircularProgressWithLabel";
import { UseProgressValue } from "../../../components/Spinner/UseProgressValue";
import AgGrids from "../../../components/TableGrid/AgGrids";
import { NPIState } from "../../../redux/reducers/NewPolicyTabReducers/NPIReducer";
import { NPIColumns } from "../Columns";
import { taxAndNPITabBtnStyles } from "../TaxIdTab/TaxIdConstants";
import "./NPI.css";
import { createExcelFile, exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import * as XLSX from "xlsx";
import { DIALOG, NPI_FIELDS, RESET_NPI_FIELDS } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { addNPIChangesData, addNPIData, DeactivateNPIData, getNPIDataPolicy, uploadNPIToStage, UploadNPIToTarget } from "../../../redux/ApiCalls/NewPolicyTabApis/NpiApis";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { DescriptionTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/DescriptionTabFieldsReducer";
import { ClientAssignmentState } from "../../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { getActiveClientGroups } from "../../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { JiraStringMethod, validateNumberMethod } from "../../../redux/ApiCallAction/Validations/StringValidation";
import { checkCodeIsPresent, checkLengthCode, determineImportPolicyId, readFile, showImportError, validateFile, validateFileHeaders } from "../../../redux/ApiCallAction/FileValidations/FileReadAndValidations";
import JiraComponent from "../JiraComponent";
import { addChangesData } from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { getLOB } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";


const NPI = ({ fromViewPolicy, policyId, edit }) => {
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [activeClientCode, setActiveClientCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [Deactivate, setDeactivate] = useState(false);
  const [jiraIdExists, setJiraIdExists] = useState(false);
  const [NPIData, setNPIData] = useState([]);
  const [proceed, setProceed] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [importClicked, setImportClicked] = useState(false);
  const [NPIImportFile, setNPIImportFile] = useState(undefined);
  const [disableButtons, setDisableButtons] = useState(false);
  const { showProgress, progress, showProgressValues, hideProgress } =
    UseProgressValue();
  const [jiraId, setJiraId] = useState("");
  const [jiraDescription, setJiraDescription] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const NPIFieldState: NPIState = useSelector(
    (state: any) => state.NPIFieldsRedux
  );

   const newpolicyState: NewPolicyState = useSelector(
      (state: any) => state.newPolicy
    );
    const policyFieldState: NewPolicyFormFieldState = useSelector(
      (state: any) => state.policyFieldsRedux
    );
    const descTabFieldState: DescriptionTabFieldState = useSelector(
      (state: any) => state.DescTabFieldsRedux
    );
    const clientAssignmentState: ClientAssignmentState = useSelector(
      (state: any) => state.clientAssignmentTabFieldsRedux
    );
    const changesTabFields: changesTabFieldState = useSelector(
      (state: any) => state.ChangesTabFieldsRedux
    )
  const dispatch = useDispatch();

  const handleToCloseDialog = () => {
    setOpenDialog(false);
    setDeactivate(false);
    setImportClicked(false);
    setProceed(false);
    dispatch({ type: RESET_NPI_FIELDS });
    setDisableButtons(false);
    dispatch({ type: NPI_FIELDS, payload: "" });
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


  useEffect(() => {
    if (clientAssignmentState.getActiveClientData.length == 0) {
      getActiveClientGroups(dispatch);
    }
    if (newpolicyState.LOB.length === 0) {
      getLOB(dispatch);
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
    return lob ? lob?.label : null;
  }
  useEffect(() => {
    if (clientAssignmentState.getActiveClientData?.length > 0) {
      const NPIData = NPIFieldState.getNPITabledata?.map((k) => {
        return {
          clientGroupId: k.clientGroupId,
          client: getClientCode(k.clientGroupId),
          clientGroupCode: getClientGroupCode(k.clientGroupId),
          lob: DisplayLobDescription(k.lob),
          claimType: k.claimType,
          npi: k.npi,
          deletedB: k.deletedB === 0 ? "Active" : "Deactivated",
          createdDate: moment(k.createdDate).format("MM-DD-YYYY"),
          updatedDate: moment(k.updatedDate).format("MM-DD-YYYY"),
        };
      });
      setNPIData(NPIData);
      setNumberOfRows(NPIData.length);
    }
  }, [
    NPIFieldState.getNPITabledata,
    clientAssignmentState.getActiveClientData?.length,
  ]);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  const _ = require("lodash");

  const set = new Set(
    clientAssignmentState.getClientAssignmentTableData?.map((data) => data.clientGroupId)
  );
  const filteredClientAssignmentData =
  clientAssignmentState.getActiveClientData?.filter((data) =>
      set.has(data.clientGroupId)
    );

  const clientCodeSelection = (event) => {
    let value = event.target.value;
    if (event.target.value.length < 3) {
      dispatch({ type: NPI_FIELDS, payload: { clientGroupCode: "" } });
    }
    setActiveClientCode(value);
    // setNPIState({ ...NPIState, clientCode: value });
    dispatch({ type: NPI_FIELDS, payload: { clientCode: value } });
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
        type: NPI_FIELDS,
        payload: { clientCode: "", clientGroupCode: "" },
      });
    }
  };

  const handleSuggestionClick = (value) => {
    // clientAssignment.clientCode = value;
    setActiveClientCode(value);
    dispatch({
      type: NPI_FIELDS,
      payload: {
        clientCode: value,
        errors: {
          ...NPIFieldState?.errors, // Preserve existing errors
          clientCode: false, // Clear only the NPI error
        },
      },
    });
    // NPIState.clientCode = value;
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

  const claimTypeValues = NPIFieldState.claimType?.map((p) => {
    return { label: p.label.charAt(0), value: p.value };
  });

  // const lobOptions =
  //   formState.lob?.value != null && formState.lob?.value != undefined
  //     ? [
  //         {
  //           label: `${formState.lob?.label}`,
  //           value: `${formState.lob?.value}`,
  //         },
  //       ]
  //     : [];

      const LobOptions = newpolicyState.LOB?.map((l) => {
        return { label: l.lobTitle, value: l.lobKey };
      });

  const changesNPIData = {
    jiraId: jiraId,
    jiraDesc: jiraDescription,
    jiraLink: `https://advancedpricing.atlassian.net/browse/${jiraId}`,
    userId: localStorage.getItem("emailId"),
    policyId: policyId,
    isOpenb: 0,
  };

  function mapAndSort(arr) {
    if (!arr) return ""; // Handle undefined/null
    if (!Array.isArray(arr)) arr = [arr]; // Convert single object to array

    return (
      arr
        .map((c) => {
          const lob = LobOptions.find(
            (option) => option.label === c.value || option.value === c.value
          );
          return lob ? lob?.value : c.value;
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
              checked={NPIFieldState.deletedB}
              propsColor={successColor}
              onChange={(event) => {
                dispatch({
                  type: NPI_FIELDS,
                  payload: { deletedB: event.target?.checked },
                });
              }}
              value={NPIFieldState.deletedB}
            />
          ) : undefined}
        </div>
      </>
    );
  };

  function displayNPIFields() {
    return (
      <>
        {importJiraFields()}
        <div className="row">
          <div className="col-sm-6">
            <CustomInput
              type={"text"}
              labelText={"Client Code"}
              variant={"outlined"}
              error={NPIFieldState?.errors?.clientCode}
              showStarIcon={true}
              value={NPIFieldState.clientCode}
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
              error={NPIFieldState?.errors?.clientGroupCode}
              showStarIcon={true}
              styles={{ overflowY: "auto" }}
              onSelect={(e) => {
                if (!e) {
                  // Handle clearing selection
                  dispatch({
                    type: NPI_FIELDS,
                    payload: {
                      clientGroupCode: null, // or empty object {}
                      clientGroupId: null, // Reset the ID as well
                      errors: {
                        ...NPIFieldState?.errors,
                        clientGroupCode: false,
                      },
                    },
                  });
                  return;
                }
                // Handle normal selection
                dispatch({
                  type: NPI_FIELDS,
                  payload: {
                    clientGroupCode: clientGroupExclusion.find(
                      (option) => option.label === e.label
                    ),
                    clientGroupId: e.value,
                    errors: {
                      ...NPIFieldState?.errors,
                      clientGroupCode: false,
                    },
                  },
                });
              }}
              value={NPIFieldState.clientGroupCode}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <CustomSelect
              // isMulti
              // checkBoxes={true}
              isDisabled={Deactivate}
              error={NPIFieldState?.errors?.lob}
              onSelect={(event) => {
                dispatch({
                  type: NPI_FIELDS,
                  payload: {
                    lob: event,
                    errors: {
                      ...NPIFieldState?.errors,
                      lob: false,
                    },
                  },
                });
              }}
              value={NPIFieldState.lob}
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
              error={NPIFieldState?.errors?.claimType}
              onSelect={(event) => {
                dispatch({
                  type: NPI_FIELDS,
                  payload: {
                    claimType: event,
                    errors: {
                      ...NPIFieldState?.errors,
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
              labelText={"NPI"}
              showStarIcon={true}
              variant={"outlined"}
              error={NPIFieldState?.errors?.npi}
              disabled={Deactivate}
              value={NPIFieldState.npi}
              maxLength={10}
              placeholder="Numeric(10 digits)"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                if (value.length == 10 && !jiraIdExists)
                  setDisableButtons(false);
                dispatch({
                  type: NPI_FIELDS,
                  payload: {
                    npi: value,
                    errors: {
                      ...NPIFieldState?.errors,
                      npi: false,
                    },
                  },
                });
              }}
              onKeyPress={(e) => validateNumberMethod(e)}
            />
            {NPIFieldState?.npi.length > 0 &&
              NPIFieldState?.npi.length < 10 && (
                <small style={{ color: "red", display: "block" }}>
                  NPI must be 10 digits
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
              {proceed && NPIFieldState.deletedB === true
                ? "Would you like to Add this Record ?"
                : proceed && NPIFieldState.deletedB === false
                ? "NPI " + NPIFieldState.npi + "  is DEACTIVATED"
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
                {proceed && NPIFieldState.deletedB === true ? "Yes" : "Save"}
              </CustomButton>
              <CustomButton
                onClick={() => {
                  setOpenDialog(false);
                  setProceed(false);
                  dispatch({ type: RESET_NPI_FIELDS });
                  setImportClicked(false);
                  setNPIImportFile(undefined);
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
                {proceed && NPIFieldState.deletedB === true ? "No" : "Cancel"}
              </CustomButton>
            </ButtonGroup>
          }
        />
      </>
    );
  }
  async function addAndDeactivateRecord() {
    const NPIData = NPIFieldState?.claimType?.map((k) => {
      return {
        policyIdFk: policyId,
        clientGroupId: NPIFieldState.clientGroupId,
        lob: mapAndSort(NPIFieldState.lob),
        claimType: k?.value,
        npi: NPIFieldState.npi,
        deletedB: NPIFieldState.deletedB === false ? 1 : 0,
      };
    });

    if (NPIFieldState.deletedB === true) {
      await Promise.all([
        addNPIData(dispatch, NPIData),
        addChangesData(dispatch, policyId, jiraId, jiraDescription),
        getNPIDataPolicy(dispatch, policyId)
      ]);
      dispatch({ type: RESET_NPI_FIELDS });
      refreshJiraDetails();
      setClientSuggestions([]);
      setActiveClientCode("");
    }
    if (NPIFieldState.deletedB === false) {
      await Promise.all([
        DeactivateNPIData(dispatch, NPIData),
        addChangesData(dispatch, policyId, jiraId, jiraDescription),
        getNPIDataPolicy(dispatch, policyId)
      ]);
      dispatch({ type: RESET_NPI_FIELDS });
      refreshJiraDetails();
      setClientSuggestions([]);
      setActiveClientCode("");
    }
  }

  function showDialogTitle() {
    if (importClicked) return "Upload NPI File";
    if (openDialog) return "Add NPI Exclusion";
    if (Deactivate) return "Deactivate NPI Exclusion";
    if (NPIFieldState.NPITargetData) return "Confirm";
  }

  function disableBtns() {
    if (importClicked && !jiraIdExists) return false;
    if (NPIFieldState.NPITargetData) return false;
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
      "npi",
    ];
    let errors = {};


    let existingRecord = false;
    if (!Deactivate) {
      existingRecord = NPIFieldState.getNPITabledata?.find((k) => {
        const clientCodeMatch =
          NPIFieldState.clientCode === getClientCode(k.clientGroupId);
        const clientGroupIdMatch =
          NPIFieldState.clientGroupId === k.clientGroupId;
        // Ensure both `lob` values are compared correctly as numbers
        const lobMatch =
          Number(mapAndSort(NPIFieldState.lob)) === Number(k.lob);
        const claimTypeMatch = NPIFieldState.claimType.some((claim) =>
          k.claimType
            .split(",")
            .map((c) => c.trim())
            .includes(claim.value)
        );
        const NPIMatch = String(NPIFieldState.npi) === String(k.npi);
        let deletedB = NPIFieldState.deletedB ? 0 : 1;
        const deletedMatch = deletedB === k.deletedB;
        if (
          clientCodeMatch &&
          clientGroupIdMatch &&
          lobMatch &&
          claimTypeMatch &&
          NPIMatch &&
          deletedMatch
        ) {
          return true;
        }
        return false;
      });
    }
    requiredFields.forEach((key) => {
      const value = NPIFieldState[key];
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
    if (Deactivate && NPIFieldState.deletedB) {
      errors["deletedB"] = true;
    }
    if (Object.keys(errors).length > 0 || jiraError) {
      dispatch({ type: NPI_FIELDS, payload: { errors } });
      fillRequiredFields("not_exists");
    } else if (existingRecord) {
      fillRequiredFields("exists");
    } else if (NPIFieldState.npi.toString().length != 10) {
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
              setNPIImportFile(file);
            }}
          />
        </div>
        <p
          style={{ fontSize: "10px", marginTop: 30, fontFamily: "sans-serif" }}
        >
          Note : Client Group ID will derive the Client Code and <br />
          Client Group Code regardless of the input value
        </p>
      </>
    );
  }

  function showTargetNPIContent() {
    return (
      <p>
        Delta Path:{" "}
        <Link target="_blank" href={`${NPIFieldState.NPIDeltaLink}`}>
          Delta Link
        </Link>{" "}
        <br></br>
        Would you like to Send Stage data to Target?
      </p>
    );
  }
  function showNPIDiaglogContent() {
    if (importClicked) return showFileContent();
    if (openDialog || Deactivate)
      return (
        <DialogContent style={{ maxHeight: "400px", overflowY: "scroll" }}>
          {displayNPIFields()}
        </DialogContent>
      );
    if (NPIFieldState.NPITargetData) return showTargetNPIContent();
  }
  function showNPIBtnLabel() {
    if (importClicked && NPIImportFile) return "Upload";
    if (openDialog || Deactivate) return "Continue";
    if (NPIFieldState.NPITargetData) return "Yes";
  }

  const getRequiredHeaders = () => {
    return [
      "POLICYID",
      "CLIENTGROUPID",
      "CLIENTCODE",
      "CLIENTGROUPCODE",
      "LOB",
      "CLAIMTYPE",
      "NPI",
      "ACTION",
    ];
  };

  async function NPIFileUpload() {
    const validation = validateFile(NPIImportFile);
    if (!validation) {
      setImportClicked(false);
      return;
    }

    try {
      const { array, headers } = await readFile({
        file: NPIImportFile,
        valid: validation,
      });
      if (!validateFileHeaders(headers, getRequiredHeaders())) {
        showImportError("Import Failed.<br>Please Upload a valid File.");
        setImportClicked(false);
        return;
      }
      let uniqueCodes = [];
      let error = false;
      array.forEach((o, i) => {
        if (
          !o.NPI ||
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
          return;  // Skip this iteration
        }
        else if (
          !checkCodeIsPresent(
            uniqueCodes,
            o.NPI +
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
            o.NPI +
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
              "NPI CODE is : " +
              o.NPI +
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

      let NpiLengthCheck;
      const importPolicyId = determineImportPolicyId(array, policyId);

      for (const row of array) {
        const NPIStr = String(row.NPI); // Convert to string
        NpiLengthCheck = checkLengthCode(NPIStr, 10);

        if (NpiLengthCheck) {
          break; // Exit the loop when an invalid TAXID is found
        }
      }

      // Convert processed data back to Excel file
      const NPIFile: File = await createExcelFile(transformedData);

      // Create FormData and append updated file
      const formData = new FormData();
      formData.append("uploadfile", NPIFile);
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
      } else if (NpiLengthCheck) {
        showImportError("NPI must be 10 digits and only Numeric");
        setImportClicked(false);
      } else {
        const progressInterval = showProgressValues();
        await uploadNPIToStage(
          dispatch,
          formData,
          progressInterval,
          hideProgress
        );
        setImportClicked(false);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }

  async function exportNPIData() {
    let NPIExport = NPIFieldState.getNPITabledata.map((k) => {
      return {
        PolicyId: policyFieldState.policyId,
        ClientGroupId: k.clientGroupId,
        ClientCode: getClientCode(k.clientGroupId),
        ClientGroupCode: getClientGroupCode(k.clientGroupId),
        LOB: k.lob,
        ClaimType: k.claimType,
        Npi: k.npi,
        Action: k.deletedB === 1 ? "Deactivated" : "Active",
      };
    });
    if (NPIData.length > 0) {
      await exportedExcelFileData(
        NPIExport,
        `${policyFieldState.policyNumber}/${policyFieldState.version + "_NPI"}`,
        "NPI"
      );
    }
  }

  return (
    <>
      {edit ? (
        <div className="row">
          <div className="NPIContainer">
            <div className="row">
              <div className="col-sm-4">
                <h6>NPI Exclusions</h6>
              </div>
              <div className="col-sm-4" />
              <div className="col-sm-4">
                <IconButton
                  onClick={() => {
                    dispatch({ type: RESET_NPI_FIELDS });
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
                  columnDefs={NPIColumns(
                    setDeactivate,
                    (value) => dispatch({ type: NPI_FIELDS, payload: value }),
                    fromViewPolicy
                  )}
                  animateRows={true}
                  rowData={NPIData}
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
                    dispatch({ type: RESET_NPI_FIELDS });
                    refreshJiraDetails();
                    setImportClicked(true);
                    setNPIImportFile(undefined);
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
                    exportNPIData();
                  }}
                  disabled={NPIData.length <= 0}
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
        NPIFieldState?.NPITargetData ? (
          <Dialogbox
            disableBackdropClick
            title={showDialogTitle()}
            open={
              openDialog ||
              Deactivate ||
              importClicked ||
              NPIFieldState?.NPITargetData
            }
            fullWidth={
              importClicked || NPIFieldState.NPITargetData ? false : true
            }
            maxWidth={importClicked || NPIFieldState?.NPITargetData ? "" : "sm"}
            onClose={handleToCloseDialog}
            message={<>{showNPIDiaglogContent()}</>}
            actions={
              <ButtonGroup>
                {NPIImportFile ||
                openDialog ||
                Deactivate ||
                NPIFieldState.NPITargetData ? (
                  <CustomButton
                    disabled={disableBtns() || false}
                    onClick={async () => {
                      if (importClicked) {
                        await NPIFileUpload();
                      } else if (NPIFieldState?.NPITargetData) {
                        await UploadNPIToTarget(
                          dispatch,
                          policyId,
                          changesNPIData
                        );
                        dispatch({
                          type: NPI_FIELDS,
                          payload: { NPITargetData: undefined },
                        });
                      } else {
                        validateFields();
                      }
                    }}
                    style={taxAndNPITabBtnStyles({
                      color: navyColor,
                      disable: jiraIdExists,
                    })}
                  >
                    {showNPIBtnLabel()}
                  </CustomButton>
                ) : undefined}
                <CustomButton
                  onClick={handleToCloseDialog}
                  style={taxAndNPITabBtnStyles({
                    color: dangerColor,
                    disable: false,
                  })}
                >
                  {NPIFieldState.NPITargetData ? "No" : "cancel"}
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
export default NPI;

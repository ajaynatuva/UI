import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import { ButtonGroup, DialogContent, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { default as Moment, default as moment } from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { LookUpState } from "../../../redux/reducers/LookUpReducer/LookUpReducer";
import {
  getChangesById,
  getChangesId,
} from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { validationPrompt } from "../newPolicyUtils";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import {
  dangerColor,
  disabledColor,
  navyColor,
} from "../../../assets/jss/material-kit-react";
import { uploadDiagnosisData } from "../../../redux/ApiCalls/NewPolicyTabApis/DiagnosisTabApis";
import {
  deleteDiagnosisDetails,
  editDiagnosisDetails,
  saveDiagDetails,
  getDiagnosisData,
} from "../../../redux/ApiCalls/NewPolicyTabApis/DiagnosisTabApis";
import { getBWORAndBOAnLKP } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import {
  DIAGNOSIS_FIELDS,
  DIALOG,
  RESET_DIAGNOSIS_FIELDS,
} from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import AgGrids from "../../../components/TableGrid/AgGrids";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import { exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import Dialogbox from "../../../components/Dialog/DialogBox";
import GridItem from "../../../components/Grid/GridItem";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import RadioButton from "../../../components/RadioButton/RadioButton";
import { DiagnosisFieldState } from "../../../redux/reducers/NewPolicyTabReducers/DiagnosisReducer";
import CustomCheckBox from "../../../components/CustomCheckBox/CustomCheckBox";
import GridContainer from "../../../components/Grid/GridContainer";
import { policy } from "../../Claims/ClaimHeaderNames";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";

const _ = require("lodash");
export interface Diagnosis {
  diagFrom: String;
  diagTo: String;
  dosFrom: Date;
  dosTo: Date;
  action: any;
  exclusion: any;
  headerLevel: any;
  principalDx: any;
  onlyDx: any;
  actionKeyValue: any;
}
const Diagnosis = ({
  edit,
  policyId,
  showImportButton,
  fromViewPolicy,
  jiraId,
}) => {
  ModuleRegistry.registerModules(AllCommunityModules);

  // const DiagnosisColums = {
  //   policyDiagnosisKey: undefined,
  //   policyId: undefined,
  //   diagFrom: undefined,
  //   diagTo: undefined,
  //   dosFrom: undefined,
  //   dosTo: undefined,
  //   action: undefined,
  //   exclusion: 0,
  //   headerLevel: 0,
  //   principalDx: 0,
  //   onlyDx: 0,
  //   actionKeyValue: undefined,
  // };

  const [diagData, setdiagData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [selectedData, setSelectedData] = useState<Diagnosis[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openedit, setOpenedit] = React.useState(false);
  const [opendelete, setOpendelete] = React.useState(false);
  const [openHeaderPdx, setopenHeaderPdx] = React.useState(false);
  const dispatch = useDispatch();
  const [diagFromExist, setdiagFromExist] = useState(false);
  const [diagToExist, setdiagToExist] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [createDate, setCreateDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [fileError, setFileError] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);
  // const [Diagnosis, setDiagnosis] = useState(DiagnosisColums);
  const [isEdit, setIsEdit] = useState(false);
  const [deletedById, setDeletedById] = useState(undefined);
  const [actionValue, setActionValue] = useState(undefined);
  const [action, setAction] = useState("");
  const [checkSameDiag, setCheckSameDiag] = useState("");
  const [checkSameDiagTo, setCheckSameDiagTo] = useState("");
  const [updatedDiagsData, setUpdatedDiagsData] = useState(false);
  const [fieldError, setFiledError] = useState(false);

  const lookUpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  const DiagnosisFieldState: DiagnosisFieldState = useSelector(
    (state: any) => state.DiagnosisFieldsRedux
  );

  const isDisabled = edit && fromViewPolicy;

  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );

  // const updatedState: NewPolicyState = useSelector(
  //   (state: any) => state.newPolicy
  // );

  useEffect(() => {
    if (policyId != null || policyFields.policyId) {
      getChangesId(dispatch, policyId);
      getDiagnosisData(dispatch, policyFields.policyId);
    }
  }, [policyId, policyFields.policyId]);

  useEffect(() => {
    setUpdatedData(DiagnosisFieldState.dxDataToExcel);
  }, [DiagnosisFieldState.dxDataToExcel]);

  useEffect(() => {
    if (lookUpState.bwOrBwLkp.length === 0) {
      getBWORAndBOAnLKP(dispatch);
    }
  }, [dispatch, lookUpState.bwOrBwLkp]);

  function DiagsData() {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setOpen(true);
      handleClickToOpen();
    } else {
      validationPrompt();
    }
    setSelectedFile(undefined);
  }

  /// upload Diagnosis file
  const handleUploadFile = (file) => {
    var allowedFiles = [".xlsx", ".csv"];
    var regex = new RegExp(
      "([a-zA-Z0-9s_\\.-:()])+(" + allowedFiles.join("|") + ")$"
    );
    if (file != undefined) {
      if (!regex.test(file.name.toLowerCase())) {
        setOpen(false);
        CustomSwal("error", "Please upload valid file", navyColor, "Ok", "");
        return false;
      } else {
        return true;
      }
    }
  };

  const onFileUpload = async () => {
    if (!handleUploadFile(selectedFile)) return;

    const formData = prepareFormData(selectedFile);
    const user = localStorage.getItem("emailId");
    formData.append("emailId", user);

    const fileContent = await readFileContent(selectedFile);

    if (fileContent) {
      const { array, error } = processWorkbook(fileContent, navyColor);

      if (!error) {
        const importPolicyId = getImportPolicyId(
          array,
          policyFields.policyId,
          policyId
        );
        handlePolicyCheck(importPolicyId, policyId, () => {
          uploadData(dispatch, formData, policyFields.policyId);
        });
      }
    }
  };

  const prepareFormData = (file: File) => {
    const formData = new FormData();
    formData.append("uploadfile", file);
    return formData;
  };

  const readFileContent = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
      fileReader.onerror = () => reject(null);
      fileReader.readAsArrayBuffer(file);
    });
  };

  const processWorkbook = (fileContent: ArrayBuffer, navyColor: string) => {
    const workbook = XLSX.read(new Uint8Array(fileContent), { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataArray = XLSX.utils.sheet_to_json(firstSheet, { raw: true });

    const { error, uniqueCodes } = validateData(dataArray, navyColor);
    return { array: dataArray, error };
  };

  const validateData = (dataArray: any[], navyColor: string) => {
    const uniqueCodes: string[] = [];
    let error = false;

    dataArray.forEach((row, index) => {
      if (!addUniqueCode(uniqueCodes, row.DIAGFROM, row.DIAGTO)) {
        showError(
          `Duplicate Row at ${index + 2} - Dx From: ${row.DIAGFROM}, Dx To: ${
            row.DIAGTO
          }`
        );
        error = true;
        setOpen(false);
      }

      if (isDxCodeLengthInvalid(row.DIAGFROM, row.DIAGTO)) {
        showError("Length of the Dx code must be 8");
        error = true;
        setOpen(false);
      }
      if (
        headersCheckValidation(row.HEADERLEVEL, row.PRINCIPALDX, row.ONLYDX)
      ) {
        showError(
          "The Header Level, Principal Dx & Only Dx must be the same for the policy."
        );
        error = true;
        setOpen(false);
      }
    });

    return { error, uniqueCodes };
  };

  const addUniqueCode = (
    uniqueCodes: string[],
    diagFrom: string,
    diagTo: string
  ) => {
    const code = `${diagFrom}-${diagTo}`;
    if (uniqueCodes.includes(code)) return false;
    uniqueCodes.push(code);
    return true;
  };

  const isDxCodeLengthInvalid = (dxFrom, dxTo) => {
    let diagFrom = dxFrom ? String(dxFrom).length : 0;
    let diagTo = dxFrom ? String(dxTo).length : 0;
    return diagFrom > 8 || diagTo > 8;
  };

  let intialHeaderValue = null;
  let intialPrincipalValue = null;
  let intialOnlyDx = null;

  const headersCheckValidation = (headerLevel, principalDx, onlyDx) => {
    if (headerLevel != 0 && headerLevel != 1) {
      return true;
    }
    if (intialHeaderValue === null) {
      intialHeaderValue = headerLevel;
    }
    if (intialHeaderValue != headerLevel) {
      return true;
    }
    if (principalDx != 0 && principalDx != 1) {
      return true;
    }
    if (intialPrincipalValue === null) {
      intialPrincipalValue = principalDx;
    }
    if (intialPrincipalValue != principalDx) {
      return true;
    }

    if (onlyDx != 0 && onlyDx != 1) {
      return true;
    }
    if (intialOnlyDx === null) {
      intialOnlyDx = onlyDx;
    }
    if (intialOnlyDx != onlyDx) {
      return true;
    }
  };

  const getImportPolicyId = (
    array: any[],
    formPolicyId: any,
    policyId: string
  ) => {
    let importPolicyId = policyId;
    array.some((row) => {
      if (row.POLICYID !== formPolicyId) {
        importPolicyId = row.POLICYID || -1;
        return true;
      }
      return false;
    });
    return importPolicyId;
  };

  const handlePolicyCheck = (
    importPolicyId: any,
    policyId: string,
    onSuccess: () => void
  ) => {
    if (importPolicyId === policyId) {
      onSuccess();
    } else {
      const errorMessage =
        importPolicyId === -1
          ? "Policy Id is blank."
          : "Policy Id not matched.";
      showError(errorMessage);
      setOpen(false);
    }
  };

  const showError = (message: string) => {
    CustomSwal("error", message, navyColor, "Ok", "Error");
  };

  const uploadData = async (dispatch, formData, policyId) => {
    setOpen(false);
    await uploadDiagnosisData(dispatch, formData, policyId);
    if (gridRef.current) {
      const params = {
        api: gridRef.current,
      };
      await onGridReady(params);
    }
  };

  //---- till here--------------------------------

  const columnDefs = useMemo(
    () => [
      {
        field: "diagFrom",
        headerName: "Dx From",
        minWidth: 100,
        headerTooltip: "Diag From",
      },
      {
        field: "diagTo",
        headerName: "Dx To",
        minWidth: 100,
        headerTooltip: "Diag To",
      },
      {
        field: "dosFrom",
        headerName: "DOS From",
        minWidth: 150,
        headerTooltip: "DOS From",
      },
      {
        field: "dosTo",
        headerName: "DOS To",
        minWidth: 150,
        headerTooltip: "DOS To",
      },
      {
        field: "action",
        headerName: "Action",
        minWidth: 100,
        headerTooltip: "Action",
      },

      {
        field: "exclusion",
        headerTooltip: "Exclusion",
        headerName: "Exclusion",
        minWidth: 60,
        cellStyle: (isFlag) =>
          isFlag.value == "1"
            ? { "pointer-events": "none" }
            : { "pointer-events": "none" },

        cellRenderer: (data) => {
          return (
            <input
              style={{ width: 15, height: 15 }}
              type="checkbox"
              disabled
              checked={data.value == 1 ? true : false}
            />
          );
        },
      },

      // {
      //   field: "headerLevel",
      //   headerName: "Header Level",
      //   minWidth: 130,
      //   headerTooltip: "Header Level",
      //   cellStyle: (isFlag) =>
      //     isFlag.value == "1"
      //       ? { "pointer-events": "none" }
      //       : { "pointer-events": "none" },

      //   cellRenderer: (data) => {
      //     return (
      //       <input
      //         style={{ width: 15, height: 15 }}
      //         type="checkbox"
      //         disabled
      //         checked={data.value == 1 ? true : false}
      //       />
      //     );
      //   },
      // },
      // {
      //   field: "principalDx",
      //   headerName: "Principal Dx",
      //   minWidth: 130,
      //   headerTooltip: "Principal Dx",
      //   cellStyle: (isFlag) =>
      //     isFlag.value == "1"
      //       ? { "pointer-events": "none" }
      //       : { "pointer-events": "none" },

      //   cellRenderer: (data) => {
      //     return (
      //       <input
      //         style={{ width: 15, height: 15 }}
      //         type="checkbox"
      //         disabled
      //         checked={data.value == 1 ? true : false}
      //       />
      //     );
      //   },
      // },

      {
        field: "button",
        headerName: "Action",
        minWidth: 170,
        resizable: false,
        cellRenderer: (row) => {
          return (
            <ButtonGroup>
              <CustomButton
                variant="contained"
                style={{
                  height: 18,
                  marginTop: 1,
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: navyColor,
                  color: "white",
                  opacity: fromViewPolicy ? 0.7 : 1,
                }}
                onClick={() => {
                  let obj = _.cloneDeep(Diagnosis);
                  obj.policyDiagnosisKey = row.data.policyDiagnosisKey;
                  obj.diagFrom = row.data.diagFrom;
                  obj.diagTo = row.data.diagTo;
                  obj.dosFrom = row.data.dosFrom
                    ? Moment(row.data.dosFrom).format("YYYY-MM-DD")
                    : "";
                  obj.dosTo = row.data.dosTo
                    ? Moment(row.data.dosTo).format("YYYY-MM-DD")
                    : "";
                  obj.action = mapAction(row.data.action);
                  obj.exclusion = row.data.exclusion;
                  // obj.headerLevel = row.data.headerLevel;
                  // obj.principalDx = row.data.principalDx;
                  obj.headerLevel = DiagnosisFieldState.headerLevel;
                  obj.principalDx = DiagnosisFieldState.principalDx;
                  obj.onlyDx = DiagnosisFieldState.onlyDx;
                  obj.actionKeyValue = {
                    label: row.data.action,
                    value: mapAction(row.data.action),
                  };
                  setAction(obj.action);
                  // setDiagnosis(obj);
                  dispatch({ type: DIAGNOSIS_FIELDS, payload: { ...obj } });
                  setCheckSameDiag(row.data.diagFrom);
                  setCheckSameDiagTo(row.data.diagTo);
                  setIsEdit(true);
                  if (obj != null) {
                    setopenHeaderPdx(false);
                    editData();
                  }
                }}
                disabled={edit && fromViewPolicy}
              >
                Edit
              </CustomButton>

              <CustomButton
                variant="contained"
                style={{
                  height: 18,
                  marginTop: 1,
                  marginLeft: 3,
                  fontSize: "11px",
                  textTransform: "capitalize",
                  backgroundColor: dangerColor,
                  color: "white",
                  opacity: fromViewPolicy ? 0.7 : 1,
                }}
                onClick={() => {
                  let obj = _.cloneDeep(Diagnosis);
                  obj.policyDiagnosisKey = JSON.stringify(
                    row.data.policyDiagnosisKey
                  );
                  setDeletedById(row.data.policyDiagnosisKey);
                  deleteData();
                }}
                disabled={edit && fromViewPolicy}
              >
                Delete
              </CustomButton>
            </ButtonGroup>
          );
        },
      },
    ],
    []
  );

  const DeletedMethod = () => {
    setUpdatedDiagsData(false);
    deleteDiagnosisDetails(dispatch, deletedById, policyId);
    setOpendelete(false);
  };

  const handleClickToOpen = () => {
    setdiagFromExist(false);
    setdiagToExist(false);
    setOpenedit(false);
    setCheckSameDiag("");
    setCheckSameDiagTo("");
    setUpdatedDiagsData(true);
    setFiledError(false);
  };

  const handleClickToCloseEdit = () => {
    setOpenedit(false);
    setOpendelete(false);
    setopenHeaderPdx(false);
    setCheckSameDiag("");
    setCheckSameDiagTo("");
    setdiagFromExist(false);
    setUpdatedDiagsData(true);
  };

  function editData() {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setOpenedit(true);
      setUpdatedDiagsData(true);
    } else {
      validationPrompt();
    }
  }

  function deleteData() {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setOpendelete(true);
    } else {
      validationPrompt();
    }
  }

  function resetLookup() {
    // setDiagnosis(DiagnosisColums);
    dispatch({ type: RESET_DIAGNOSIS_FIELDS });
  }

  const handleToClose = () => {
    setOpen(false);
    setOpenedit(false);
    setOpendelete(false);
    setopenHeaderPdx(false);
    setCheckSameDiag("");
    setCheckSameDiagTo("");
    setdiagFromExist(false);
    setFiledError(false);
    setUpdatedDiagsData(true);
  };

  const actionData = lookUpState.bwOrBwLkp?.map((ad) => {
    return {
      label: ad.policyDiagnosisActionCode,
      value: ad.policyDiagnosisActionKey,
    };
  });
  const mapActionValue = (value) => {
    let v;
    lookUpState.bwOrBwLkp?.map((val) => {
      if (val.policyDiagnosisActionKey == value) {
        v = val.policyDiagnosisActionCode;
      }
    });
    return v;
  };

  const gridRef = useRef();
  let exportedDiagsData;
  let checkFileds = false;

  useEffect(() => {
    // if (updatedState.diagnosisData) {
    let data;
    data = DiagnosisFieldState?.getDiagnosisTableData?.map((d, i) => {
      return {
        policyDiagnosisKey: d.policyDiagnosisKey,
        policyId: d.policyId,
        diagFrom:
          d.diagFrom.length > 3
            ? d.diagFrom.substring(0, 3) + "." + d.diagFrom.substring(3)
            : d.diagFrom,
        diagTo:
          d.diagTo.length > 3
            ? d.diagTo.substring(0, 3) + "." + d.diagTo.substring(3)
            : d.diagTo,
        dosFrom: d.dosFrom ? Moment(d.dosFrom).format("MM-DD-YYYY") : "",
        dosTo: d.dosTo ? Moment(d.dosTo).format("MM-DD-YYYY") : "",
        action: mapActionValue(d.action),
        exclusion: d.exclusion,
      };
    });
    setdiagData(data);
    if (DiagnosisFieldState.getDiagnosisTableData) {
      const exportedDiagsData = DiagnosisFieldState?.getDiagnosisTableData?.map(
        (d) => {
          return {
            policyId: d.policyId,
            diagFrom: d.diagFrom,
            diagTo: d.diagTo,
            dosFrom: d.dosFrom ? Moment(d.dosFrom).format("YYYY-MM-DD") : "",
            dosTo: d.dosTo ? Moment(d.dosTo).format("YYYY-MM-DD") : "",
            action: d.action,
            exclusion: d.exclusion,
            headerLevel: d.headerLevel,
            principalDx: d.principalDx,
            onlyDx: d.onlyDx,
          };
        }
      );

      // Update the export data state
      setExportData(exportedDiagsData);
      setNumberOfRows(
        DiagnosisFieldState?.getDiagnosisTableData
          ? DiagnosisFieldState?.getDiagnosisTableData.length
          : 0
      );
    }
    setUpdatedDiagsData(true);
  }, [DiagnosisFieldState.getDiagnosisTableData]);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  // validations for saving diags data
  function check() {
    if (
      DiagnosisFieldState.diagFrom == undefined ||
      DiagnosisFieldState.diagTo == undefined ||
      DiagnosisFieldState.dosFrom == undefined ||
      DiagnosisFieldState.dosTo == undefined ||
      DiagnosisFieldState.action == undefined
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (
      DiagnosisFieldState.diagFrom == undefined ||
      DiagnosisFieldState.diagFrom == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (
      DiagnosisFieldState.diagTo == undefined ||
      DiagnosisFieldState.diagTo == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (
      DiagnosisFieldState.dosFrom == undefined ||
      DiagnosisFieldState.dosFrom == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (
      DiagnosisFieldState.dosTo == undefined ||
      DiagnosisFieldState.dosTo == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    if (
      DiagnosisFieldState.action == undefined ||
      DiagnosisFieldState.action == ""
    ) {
      checkFileds = true;
      setFiledError(true);
    }
    return checkFileds;
  }

  function dateCheck(d1, d2) {
    let flag = false;
    if (d1 <= d2) {
      flag = true;
    }
    return flag;
  }

  function checkDates(d, selectedDosFrom, selectedDosTo) {
    let flag = false;

    let currentDosFrom = moment(d.dosFrom).format("YYYY-MM-DD");
    let currentDosTo = moment(d.dosTo).format("YYYY-MM-DD");

    if (isEdit) {
      if (!dateCheck(selectedDosFrom, selectedDosTo)) {
        flag = true;
      } else if (
        selectedDosFrom !== currentDosFrom &&
        selectedDosFrom < currentDosFrom
      ) {
        flag = true;
      }
    } else if (selectedDosFrom < currentDosTo) {
      flag = true;
    }
    return flag;
  }

  function removeRowByKey(rowData, key) {
    return rowData.filter(
      (row) => String(row?.policyDiagnosisKey) === String(key)
    );
  }

  function duplicateCheck() {
    let checkDuplicate = false;
    let defaultDosTo = "";

    const formatDiag = (diag) =>
      diag?.length > 3
        ? diag?.substring(0, 3) + "." + diag?.substring(3)
        : diag;
    const selectedDiagFrom = isEdit
      ? DiagnosisFieldState.diagFrom
      : formatDiag(DiagnosisFieldState.diagFrom);
    const selectedDiagTo = isEdit
      ? DiagnosisFieldState.diagTo
      : formatDiag(DiagnosisFieldState.diagTo);

    let selectedDosFrom = moment(DiagnosisFieldState.dosFrom).format(
      "YYYY-MM-DD"
    );
    let selectedDosTo = moment(DiagnosisFieldState.dosTo).format("YYYY-MM-DD");

    (isEdit
      ? removeRowByKey(diagData, DiagnosisFieldState.policyDiagnosisKey)
      : diagData
    ).forEach((d) => {
      if (
        d?.diagFrom == selectedDiagFrom &&
        d?.diagTo === selectedDiagTo &&
        checkDates(d, selectedDosFrom, selectedDosTo)
      ) {
        checkDuplicate = true;
        defaultDosTo = moment(d.dosTo).format("YYYY-MM-DD");
      }
    });

    if (selectedDosTo < selectedDosFrom) {
      checkDuplicate = true;
    }

    return [checkDuplicate, defaultDosTo];
  }

  async function saveDiag() {
    setUpdatedDiagsData(false);
    let policyid = policyId;
    let obj = {};
    let error = check();
    let duplicate = duplicateCheck();
    if (error) {
      setUpdatedDiagsData(true);
      dispatch({
        type: DIALOG,
        payload: {
          isDialog: true,
          title: "Error",
          message: "Please fill in required fields",
        },
      });
    } else if (duplicate[0]) {
      setUpdatedDiagsData(true);
      dispatch({
        type: DIALOG,
        payload: {
          isDialog: true,
          title: "Error",
          message:
            duplicate[1] == "9999-12-31"
              ? `Record already exists. Please check the DOS To.`
              : `Please enter the valid DOS.`,
        },
      });
    } else {
      DiagnosisFieldState.policyId = parseInt(policyid);
      // Object.entries(DiagnosisFieldState).forEach(
      //   ([key, val]) => (obj[key] = val?.toString())
      // );
      const DiagnosisData = {
        policyId: DiagnosisFieldState.policyId,
        diagFrom: DiagnosisFieldState.diagFrom,
        diagTo: DiagnosisFieldState.diagTo,
        dosFrom: DiagnosisFieldState.dosFrom,
        dosTo: DiagnosisFieldState.dosTo,
        action: DiagnosisFieldState.action,
        exclusion: DiagnosisFieldState.exclusion,
        policyDiagnosisKey: DiagnosisFieldState.policyDiagnosisKey,
        headerLevel: DiagnosisFieldState.headerLevel,
        principalDx: DiagnosisFieldState.principalDx,
        onlyDx: DiagnosisFieldState.onlyDx,
        actionKeyValue: DiagnosisFieldState.actionKeyValue,
      };
      if (!isEdit) {
        setFiledError(false);
        saveDiagDetails(dispatch, DiagnosisData);
      } else {
        setFiledError(false);
        editDiagnosisDetails(dispatch, DiagnosisData, policyId);
      }
      setOpenedit(false);
    }
    setdiagFromExist(false);
    setdiagToExist(false);
  }
  // ------------till here----------------------

  function stringMethod1(e) {
    const re = /^[a-zA-Z0-9.]+$/;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  function mapAction(data) {
    let diagnosis = actionData.find((a) => a.label === data);
    if (diagnosis !== undefined) {
      return diagnosis.value;
    }
  }

  //--------------validation for custom input fields -----------------------
  function checkValid() {
    let code = false;
    DiagnosisFieldState.getDiagnosisTableData.find((sc) => {
      if (sc.diagFrom == DiagnosisFieldState.diagFrom) {
        if (checkSameDiag != DiagnosisFieldState.diagFrom) {
          code = true;
        }
      }
    });
    return code;
  }

  function checkToValid() {
    let code = false;
    DiagnosisFieldState.getDiagnosisTableData.find((sc) => {
      if (sc.diagTo == DiagnosisFieldState.diagTo) {
        if (checkSameDiagTo != DiagnosisFieldState.diagTo) {
          code = true;
        }
      }
    });
    return code;
  }

  function stringToDateFormat(date) {
    let formattedDate = "";
    const newDate = new Date(date);
    if (
      newDate.getFullYear != undefined &&
      newDate.getDate != undefined &&
      newDate.getMonth != undefined
    ) {
      formattedDate = Moment(newDate).format("YYYY-MM-DD");
    }
    return formattedDate;
  }

  const checkFilterDiagsData = (Diags) => {
    let DxFromValues =
      Diags["diagFrom"] != ""
        ? Diags["diagFrom"].split(/,(?=\S)|,$/).filter(Boolean)
        : Diags["diagFrom"].split(",");
    let DxToValues =
      Diags["diagTo"] != ""
        ? Diags["diagTo"].split(/,(?=\S)|,$/).filter(Boolean)
        : Diags["diagTo"].split(",");

    let filteredDiagsData = [];
    let j = DiagnosisFieldState.getDiagnosisTableData.filter((d, i) => {
      if (
        DxFromValues.some((value) =>
          d.diagFrom
            .toLowerCase()
            .includes(value.toLowerCase().replace(".", ""))
        ) &&
        DxToValues.some((value) =>
          d.diagTo.toLowerCase().includes(value.toLowerCase().replace(".", ""))
        ) &&
        mapActionValue(d.action).includes(Diags["action"])
      ) {
        filteredDiagsData.push({
          policyDiagnosisKey: d.policyDiagnosisKey,
          policyId: d.policyId,
          diagFrom:
            d.diagFrom.length > 3
              ? d.diagFrom.substring(0, 3) + "." + d.diagFrom.substring(3)
              : d.diagFrom,
          diagTo:
            d.diagTo.length > 3
              ? d.diagTo.substring(0, 3) + "." + d.diagTo.substring(3)
              : d.diagTo,
          dosFrom: d.dosFrom ? Moment(d.dosFrom).format("MM-DD-YYYY") : "",
          dosTo: d.dosTo ? Moment(d.dosTo).format("MM-DD-YYYY") : "",
          action: mapActionValue(d.action),
          exclusion: d.exclusion,
          headerLevel: d.headerLevel,
          principalDx: d.principalDx,
          onlyDx: d.onlyDx,
        });
      }
    });
    return filteredDiagsData;
  };

  /// not using
  // const checkIntegerData = (days) => {
  //   let j = updatedState.diagnosisData.filter((f, i) => {
  //     if (days["exclusion"].length > 0) {
  //       if (f.exclusion == days["exclusion"]) {
  //         return { f };
  //       }
  //     }
  //     if (days["headerLevel"].length > 0) {
  //       if (f.headerLevel == days["headerLevel"]) {
  //         return { f };
  //       }
  //     }
  //     if (days["principalDx"].length > 0) {
  //       if (f.principalDx == days["principalDx"]) {
  //         return { f };
  //       }
  //     }
  //   });
  //   return j;
  // };

  const checkFilterdDOSData = (dos) => {
    let j = DiagnosisFieldState.getDiagnosisTableData.filter((f, i) => {
      if (dos["dosFrom"] != "") {
        if (
          Moment(f.dosFrom).format("MM-DD-YYYY") ==
          Moment(dos["dosFrom"]).format("MM-DD-YYYY")
        ) {
          return { f };
        }
      }
      if (dos["dosTo"] != "") {
        if (
          Moment(f.dosTo).format("MM-DD-YYYY") ==
          Moment(dos["dosTo"]).format("MM-DD-YYYY")
        ) {
          return { f };
        }
      }
    });
    return j;
  };

  //---------------------TILL HERE ----------------------------

  const onGridReady = async (params) => {
    gridRef.current = params.api;
    const dataSource = {
      rowCount: null,
      getRows: async (params) => {
        let rows: any = [];
        let sortType = "";
        let sortableColumn = "";
        let Diagnosis = {};
        if (!(params.filterModel == null || undefined)) {
          Diagnosis = {
            diagFrom: params.filterModel.diagFrom
              ? params.filterModel.diagFrom.filter
              : "",
            diagTo: params.filterModel.diagTo
              ? params.filterModel.diagTo.filter
              : "",
            dosFrom: params.filterModel.dosFrom
              ? stringToDateFormat(params.filterModel.dosFrom.filter)
              : "",
            dosTo: params.filterModel.dosTo
              ? stringToDateFormat(params.filterModel.dosTo.filter)
              : "",
            action: params.filterModel.action
              ? params.filterModel.action.filter
              : "",
            exclusion: params.filterModel.exclusion
              ? params.filterModel.exclusion.filter
              : "",
            isSort: sortType != "" ? sortType : "",
            sortColumn: sortableColumn != "" ? sortableColumn : "",
          };
        }

        let filteredData = [];
        if (policyFields.policyId) {
          rows = await getDiagnosisData(dispatch, policyFields.policyId);
          filteredData = rows.map((d, i) => {
            return {
              policyDiagnosisKey: d.policyDiagnosisKey,
              policyId: d.policyId,
              diagFrom:
                d.diagFrom.length > 3
                  ? d.diagFrom.substring(0, 3) + "." + d.diagFrom.substring(3)
                  : d.diagFrom,
              diagTo:
                d.diagTo.length > 3
                  ? d.diagTo.substring(0, 3) + "." + d.diagTo.substring(3)
                  : d.diagTo,
              dosFrom: d.dosFrom ? Moment(d.dosFrom).format("MM-DD-YYYY") : "",
              dosTo: d.dosTo ? Moment(d.dosTo).format("MM-DD-YYYY") : "",
              action: mapActionValue(d.action),
              exclusion: d.exclusion,
              headerLevel: d.headerLevel,
              principalDx: d.principalDx,
              onlyDx: d.onlyDx,
            };
          });
        }
        let StringData = [];
        let IntegerData = [];
        if (
          Diagnosis["diagFrom"].length > 0 ||
          Diagnosis["diagTo"].length > 0 ||
          Diagnosis["action"].length > 0
        ) {
          StringData = checkFilterDiagsData(Diagnosis);
          filteredData = StringData;
        }
        let dosData = [];
        if (Diagnosis["dosFrom"].length > 0 || Diagnosis["dosTo"].length > 0) {
          dosData = checkFilterdDOSData(Diagnosis);
          filteredData = dosData;
        }

        if (filteredData.length === 0) {
          CustomSwal("info", "No data found", navyColor, "Ok", "");
        }

        exportedDiagsData = filteredData.map((d, i) => {
          return {
            policyId: d.policyId,
            diagFrom: d.diagFrom,
            diagTo: d.diagTo,
            dosFrom: d.dosFrom ? Moment(d.dosFrom).format("YYYY-MM-DD") : "",
            dosTo: d.dosTo ? Moment(d.dosTo).format("YYYY-MM-DD") : "",
            action: d.action,
            exclusion: d.exclusion,
            headerLevel: d.headerLevel,
            principalDx: d.principalDx,
            onlyDx: d.onlyDx,
          };
        });
        setExportData(exportedDiagsData);
        setNumberOfRows(filteredData.length);
        setTimeout(() => {
          const rowsThisPage = filteredData.slice(
            params.startRow,
            params.endRow
          );
          let lastRow = -1;
          if (filteredData.length <= params.endRow) {
            lastRow = filteredData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        }, 500);
      },
    };
    params.api.setDatasource(dataSource);
  };

  return edit ? (
    <div style={{ height: window.innerHeight / 2.2 }}>
      <CustomPaper
        style={{
          paddingLeft: 10,
          position: "relative",
          right: 20,
          paddingRight: 8,
          paddingTop: 0,
          paddingBottom: 15,
          boxShadow: "none",
          border: diagData.length > 0 ? "1px solid #D6D8DA" : "",
        }}
      >
        <IconButton
          onClick={() => {
            editData();
            setIsEdit(false);
            resetLookup();
          }}
          style={{
            backgroundColor: navyColor,
            float: "right",
            color: "white",
            padding: 5,
            marginTop: 2,
            opacity: fromViewPolicy ? 0.7 : 1,
          }}
          disabled={edit && fromViewPolicy}
        >
          <Add />
        </IconButton>

        {diagData.length > 0 && updatedDiagsData == true ? (
          <div
            style={{
              height: window.innerHeight / 2.2,
              opacity: fromViewPolicy ? 0.7 : 1,
            }}
          >
            <div className="row">
              <div className="col-sm-4" />
              <div
                className="col-sm-2"
                style={{ position: "relative", left: "90px" }}
              >
                <CustomCheckBox
                  checked={DiagnosisFieldState.principalDx == 1}
                  disabled={isDisabled}
                  label={
                    <span style={{ fontSize: "12px" }}>Principal Dx </span>
                  }
                  onChange={(e) => {
                    dispatch({
                      type: DIAGNOSIS_FIELDS,
                      payload: { principalDx: e.target.checked ? 1 : 0 },
                    });
                  }}
                />
              </div>
              <div className="col-sm-2">
                <CustomCheckBox
                  checked={DiagnosisFieldState.onlyDx == 1}
                  disabled={isDisabled}
                  label={<span style={{ fontSize: "12px" }}>Only Dx</span>}
                  onChange={(e) => {
                    dispatch({
                      type: DIAGNOSIS_FIELDS,
                      payload: { onlyDx: e.target.checked ? 1 : 0 },
                    });
                  }}
                />
              </div>
            </div>
            <AgGrids
              ref={gridRef}
              columnDefs={columnDefs}
              onFilterChanged={onFilterChanged}
              onGridReady={onGridReady}
              maxConcurrentDatasourceRequests={1}
              modules={AllCommunityModules}
              cacheOverflowSize={2}
              infiniteInitialRowCount={1}
              cacheBlockSize={1000}
              maxBlocksInCache={1}
              debug={true}
              rowBuffer={0}
              animateRows={true}
              rowModelType={"infinite"}
            />
          </div>
        ) : undefined}
      </CustomPaper>
      {diagData.length > 0 ? (
        <small style={{ position: "relative", fontSize: "12px" }}>
          Number of rows : {numberOfRows}
        </small>
      ) : undefined}
      <div
        style={{
          float: "right",
          top: diagData.length > 0 ? 5 : -9,
          position: "relative",
          right: 25,
        }}
      >
        <CustomButton
          onClick={() => {
            DiagsData();
          }}
          variant={"contained"}
          disabled={!showImportButton}
          style={{
            backgroundColor: !showImportButton ? disabledColor : navyColor,
            color: "white",
            padding: 3,
            fontSize: 12,
            textTransform: "capitalize",
            marginLeft: 10,
          }}
        >
          Import
        </CustomButton>
        {diagData.length > 0 ? (
          <CustomButton
            onClick={() => {
              exportedExcelFileData(
                exportData,
                policyFields.policyNumber + "/" + policyFields.version,
                "Diagnosis"
              );
            }}
            variant={"contained"}
            style={{
              backgroundColor: navyColor,
              color: "white",
              padding: 3,
              fontSize: 12,
              textTransform: "capitalize",
              marginLeft: 10,
            }}
          >
            Export
          </CustomButton>
        ) : undefined}
      </div>

      <Dialogbox
        open={fromViewPolicy ? false : openedit}
        onClose={handleToClose}
        style={{ overflowY: "scroll" }}
        disableBackdropClick={true}
        title={isEdit ? "Edit Diagnosis Data" : "Add Diagnosis Data"}
        message={
          <DialogContent>
            <GridItem sm={12} md={12} xs={12}>
              <CustomInput
                fullWidth={true}
                error={
                  DiagnosisFieldState.diagFrom == undefined ||
                  DiagnosisFieldState.diagFrom == ""
                    ? fieldError
                    : false
                }
                labelText={"Dx From"}
                showStarIcon={true}
                onKeyPress={(e) => {
                  stringMethod1(e);
                }}
                variant={"outlined"}
                maxLength={8}
                onBlur={(e) => {
                  if (e.target.value.length != 0) {
                    if (checkValid()) {
                      setdiagFromExist(true);
                    } else {
                      setdiagFromExist(false);
                    }
                  }
                }}
                onChange={(e) => {
                  // let obj = _.cloneDeep(Diagnosis);
                  // obj.diagFrom = e.target.value;
                  // setDiagnosis(obj);

                  dispatch({
                    type: DIAGNOSIS_FIELDS,
                    payload: { diagFrom: e.target.value },
                  });
                }}
                value={isEdit ? DiagnosisFieldState.diagFrom : undefined}
              />

              {diagFromExist ? (
                <small style={{ color: "red" }}>Diag From already Exists</small>
              ) : undefined}
              <CustomInput
                fullWidth={true}
                error={
                  DiagnosisFieldState.diagTo == undefined ||
                  DiagnosisFieldState.diagTo == ""
                    ? fieldError
                    : false
                }
                labelText={"Dx To"}
                showStarIcon={true}
                onKeyPress={(e) => {
                  stringMethod1(e);
                }}
                variant={"outlined"}
                maxLength={8}
                onBlur={(e) => {
                  if (e.target.value.length != 0) {
                    if (checkToValid()) {
                      setdiagToExist(true);
                    } else {
                      setdiagToExist(false);
                    }
                  }
                }}
                onChange={(e) => {
                  // let obj = _.cloneDeep(Diagnosis);

                  // obj.diagTo = e.target.value;
                  // setDiagnosis(obj);
                  dispatch({
                    type: DIAGNOSIS_FIELDS,
                    payload: { diagTo: e.target.value },
                  });
                }}
                value={isEdit ? DiagnosisFieldState.diagTo : undefined}
              />
              {diagToExist ? (
                <small style={{ color: "red" }}>Diag To already Exists</small>
              ) : undefined}
              <CustomInput
                id="date"
                error={
                  DiagnosisFieldState.dosFrom == undefined ||
                  DiagnosisFieldState.dosFrom == ""
                    ? fieldError
                    : false
                }
                type="date"
                labelText={"DOS From"}
                showStarIcon={true}
                variant={"outlined"}
                onChange={(e) => {
                  // let obj = _.cloneDeep(Diagnosis);
                  // obj.dosFrom = e.target.value;
                  // setDiagnosis(obj);
                  dispatch({
                    type: DIAGNOSIS_FIELDS,
                    payload: { dosFrom: e.target.value },
                  });
                  setCreateDate(e.target.value);
                }}
                value={
                  isEdit
                    ? Moment(DiagnosisFieldState.dosFrom).format("YYYY-MM-DD")
                    : undefined
                }
              />
              <CustomInput
                id="date"
                type="date"
                error={
                  DiagnosisFieldState.dosTo == undefined ||
                  DiagnosisFieldState.dosTo == ""
                    ? fieldError
                    : false
                }
                labelText={"DOS To"}
                showStarIcon={true}
                variant={"outlined"}
                value={
                  isEdit
                    ? Moment(DiagnosisFieldState.dosTo).format("YYYY-MM-DD")
                    : undefined
                }
                onChange={(e) => {
                  let obj = _.cloneDeep(Diagnosis);
                  // obj.dosTo = e.target.value;
                  // setDiagnosis(obj);
                  dispatch({
                    type: DIAGNOSIS_FIELDS,
                    payload: { dosTo: e.target.value },
                  });
                  setCreateDate(e.target.value);
                }}
              />
              <div className="view">
                <div
                  style={{
                    width: 150,
                    marginLeft: 1,
                    marginBottom: 5,
                    marginTop: -3,
                  }}
                >
                  <CustomSelect
                    labelText={"Action"}
                    showStarIcon={true}
                    options={actionData}
                    error={
                      DiagnosisFieldState.action == undefined ||
                      DiagnosisFieldState.action == ""
                        ? fieldError
                        : false
                    }
                    onSelect={(e) => {
                      if (e != null) {
                        // let obj = _.cloneDeep(Diagnosis);
                        // obj.action = e.value;
                        // obj.actionKeyValue = e;
                        // setDiagnosis(obj);
                        dispatch({
                          type: DIAGNOSIS_FIELDS,
                          payload: { action: e.value, actionKeyValue: e },
                        });
                      }
                      if (isEdit) {
                        dispatch({
                          type: DIAGNOSIS_FIELDS,
                          payload: { action: e.value, actionKeyValue: e },
                        });
                      }
                      if (e === null) {
                        let obj = _.cloneDeep(Diagnosis);
                        obj.action = undefined;
                        obj.actionKeyValue = undefined;
                        dispatch({
                          type: DIAGNOSIS_FIELDS,
                          payload: {
                            action: obj.action,
                            actionKeyValue: obj.actionKeyValue,
                          },
                        });
                      }
                    }}
                    value={DiagnosisFieldState.actionKeyValue}
                  />
                </div>
              </div>

              <div
              // style={{
              // display: "grid",
              // rowGap: "6px",
              // gridTemplateColumns: "120px 55px 55px",
              // }}
              >
                <span>Exclusion </span>
                <RadioButton
                  label={"Yes"}
                  checked={DiagnosisFieldState.exclusion == 1 ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({
                        type: DIAGNOSIS_FIELDS,
                        payload: { exclusion: 1 },
                      });
                    }
                  }}
                />
                <RadioButton
                  label={"No"}
                  checked={DiagnosisFieldState.exclusion == 0 ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({
                        type: DIAGNOSIS_FIELDS,
                        payload: { exclusion: 0 },
                      });
                    }
                  }}
                />
              </div>
            </GridItem>

            <ButtonGroup>
              <div style={{ marginLeft: 5 }}>
                <CustomButton
                  onClick={saveDiag}
                  style={{
                    backgroundColor: navyColor,
                    color: "white",
                    margin: 10,
                    padding: 4,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  save
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    handleClickToOpen();
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
              </div>
            </ButtonGroup>
          </DialogContent>
        }
      />

      <Dialogbox
        open={fromViewPolicy ? false : opendelete}
        onClose={handleToClose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={"Would you like to Delete This Record ?"}
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={DeletedMethod}
              style={{
                backgroundColor: navyColor,
                color: "white",
                marginRight: 10,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={handleClickToCloseEdit}
              style={{
                backgroundColor: dangerColor,
                color: "white",
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
      <Dialogbox
        open={open}
        onClose={handleToClose}
        title={"Upload Source File"}
        message={
          <input
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              let file = event.target.files[0];
              setSelectedFile(file);
              let flag = handleUploadFile(event.target.files[0]);
              setFileError(flag);
            }}
          />
        }
        actions={
          <ButtonGroup>
            {selectedFile ? (
              <CustomButton
                onClick={() => {
                  onFileUpload();
                }}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  marginRight: 10,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                upload
              </CustomButton>
            ) : undefined}
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
              cancel
            </CustomButton>
          </ButtonGroup>
        }
      />
    </div>
  ) : (
    <></>
  );
};

export default Diagnosis;

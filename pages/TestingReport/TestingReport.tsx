import { ButtonGroup, InputAdornment, Tab, Tabs } from "@material-ui/core";
import { MoreHoriz } from "@mui/icons-material";
import { default as Moment } from "moment";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/system";
import { TabContext, TabPanel } from "@material-ui/lab";
import { PolicyConstants } from "../NewPolicy/PolicyConst";
import * as XLSX from "xlsx";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  black,
  dangerColor,
  navyColor,
  successColor,
} from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomInput from "../../components/CustomInput/CustomInput";
import Dialogbox from "../../components/Dialog/DialogBox";
import "../../components/FontFamily/fontFamily.css";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import RadioButton from "../../components/RadioButton/RadioButton";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import { PROD } from "../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import {
  getPolicyNumber,
  sendClaimData,
} from "../../redux/ApiCalls/TestingReportApis/TestingReportApis";
import {
  CLAIM_HEADER_DATA,
  GET_TESTING_REPORT_DATA,
  HISTORY_TEMP_DATA,
  INCLUDE_DB,
  LINE_LEVEL_DATA,
  TEMP_DATA,
  TOTAL_CLAIMS_DATA,
} from "../../redux/ApiCalls/TestingReportApis/TestingReportTypes";
import {
  intialPolicyData,
  TestingReportState,
} from "../../redux/reducers/TestingReportReducer/TestingReportReducer";
import "../TestingReport/TestingReport.css";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import { getClientgroupData } from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import { clientgroupColumns, HistoricColumns } from "./TestingReportColumns";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import {
  checkDateDob,
  checkDatesDos,
  checkHeight,
  checkImportBtn,
  checkNullForClaimLines,
  checkNullForHistoryLines,
  checkScroll,
  claimDataObject,
  claimHistoryDataObject,
  convertCellDate,
  exportToCSV,
  referenceTemplate,
} from "./TestingReportLogic";
import ClassicLoader from "../../components/Spinner/ClassicLoader";
import { getProductType } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
import { batchDispatch } from "../../redux/ApiCallAction/ApiCallAction";

const TestingReportScenario = React.lazy(
  () => import("./TestingReportScenario")
);

const _ = require("lodash");

const TestingReport = () => {
  const [selectedTab, setSelectedTab] = useState("currentLines");
  const [policy, setPolicy] = useState("");
  const [version, setVersion] = useState("");
  const [clientGroup, setClientGroup] = React.useState(null);
  const [clientGroupCode, setClientGroupCode] = React.useState(null);
  const [clientGroupType, setClientGroupType] = useState(undefined);
  const [selectedLkpColumns, setselectedLkpColumns] = useState([]);
  const [selectedLkp, setSelectedLkp] = useState("");
  const [historicdata, sethistoricdata] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openLkp, setOpenLkp] = React.useState(false);
  const [numberOfHistoricRows, setnumberOfHistoricRows] = useState(0);
  const [importClicked, setImportClicked] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [totaltestingreportdata, settotalreportdata] =
    useState(intialPolicyData);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [runAllClicked, setRunAllClicked] = useState(false);
  const [testInclude, setTestInclude] = useState(0);
  const [includeDbHistory, setIncludeDbHistory] = useState(0);
  const [clientRowData, setClientRowData] = useState([]);
  const [exportedData, setExportedData] = useState([]);
  const [resetClicked, setResetClicked] = useState(false);
  const [showRun, setShowRun] = useState(false);

  const fullWidth = true;
  const maxWidth = "md";
  const updatedState: TestingReportState = useSelector(
    (state: any) => state.testingReportReducer
  );

  const newPolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const clientState = useSelector((state: any) => state.clientPolicy);

  const dispatch = useDispatch();

  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "-30px",
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
  // header level data
  let headerLevelData = {
    policyNumber: policy,
    clientGroup: clientGroup,
    clientGroupCode: clientGroupCode,
    clientGroupType: clientGroupType,
    includeDbHistory: includeDbHistory,
    includeTest: testInclude,
    selectedType: selectedType,
    deactivated: totaltestingreportdata?.deactivated == 1 ? 1 : 0,
    disabled: totaltestingreportdata?.disabled == 1 ? 1 : 0,
    resetClicked: resetClicked,
    runAllClicked: runAllClicked,
    importClicked: importClicked,
    policyVersion: version,
  };

  const handleClickToOpen = () => {
    if (selectedType == "single") {
      if (totaltestingreportdata.minAgeFk != null) {
        setOpen(true);
      } else {
        CustomSwal(
          "info",
          "Policy number does not exist enter correct policy number",
          navyColor,
          "OK",
          ""
        );
      }
    } else {
      setOpen(true);
    }
  };

  const handleToClose = () => {
    setOpen(false);
    setOpenLkp(false);
    setFileError(false);
  };


  const productTypeCM = newPolicyState.ProductType.map((p) => {
    return { label: p.productTitle, value: p.productKey };
  });

  const resetInputField = () => {
    sethistoricdata([]);
    setClientGroup("");
    setClientGroupType("");
    setIncludeDbHistory(null);
    setPolicy("");
    setVersion("");
    setTestInclude(null);
    setRunAllClicked(false);
    setImportClicked(false);
    BatchReset();
  };

  const BatchReset = () => {
    const dispatchActions = [
      { type: GET_TESTING_REPORT_DATA, payload: [] },
      { type: TEMP_DATA, payload: [] },
      { type: CLAIM_HEADER_DATA, payload: [] },
      { type: HISTORY_TEMP_DATA, payload: [] },
      { type: LINE_LEVEL_DATA, payload: [] },
      { type: TOTAL_CLAIMS_DATA, payload: [] },
    ];
    // batch(() => dispatchActions.forEach((action) => dispatch(action)));
        batchDispatch(dispatch,dispatchActions);
    
  };

  // storing testing Report Data
  const storeSheetData = (unique, result, ReportedData1) => {
    const dispatchActions = [
      { type: CLAIM_HEADER_DATA, payload: unique },
      { type: TEMP_DATA, payload: result },
      { type: HISTORY_TEMP_DATA, payload: ReportedData1 },
    ];
    // batch(() => dispatchActions.forEach((action) => dispatch(action)));
        batchDispatch(dispatch,dispatchActions);
    
  };

  const onFilterChanged = (params) => {
    setnumberOfHistoricRows(params.api.getDisplayedRowCount());
  };

  useEffect(() => {
    if (newPolicyState.ProductType.length == 0) {
      getProductType(dispatch);
    }
    if (clientState.getClientExclusion.length == 0) {
      getClientgroupData(dispatch);
    }
    if (paths == PolicyConstants.TESTING_REPORT) {
      resetInputField();
    }
  }, []);
  // mapping the response data
  useEffect(() => {
    exportedData.map((r) => {
      updatedState.totalClaimsData.forEach((claim) => {
        claim.testClaimLines.forEach((line) => {
          if (r.claimSlId === line.claimSlId) {
            r.policyNumber = line.policyNumber;
            r.policyVersion = line.policyVersion;
            r.challengeCode = line.challengeCode;
            r.refDrgnSlId = line.refDrgnSlId;
            r.reasonCode = line.reasonCode;
            r.refDrgnClaimId = line.refDrgnClaimId;
            r.allowedQuantity = line.allowedQuantity;
          }
        });
      });
      return r;
    });
  }, [updatedState.totalClaimsData]);

  // getting client group data
  useEffect(() => {
    settotalreportdata(updatedState.getTestingReportData);

    let col = Object.assign({}, selectedLkpColumns);
    col = clientgroupColumns;
    setselectedLkpColumns(col);

    let clientExclusion = clientState.getClientExclusion.map((k) => {
      return {
        clientCode: k.clientCode,
        clientGroupId: k.clientGroupId,
        clientGroupName: k.clientGroupName,
        clientGroupCode: k.clientGroupCode,
      };
    });
    setClientRowData(clientExclusion);
  }, [clientState, updatedState]);

  // checking selected check box
  useEffect(() => {
    if (
      selectedType == "single" &&
      policy.length > 0 &&
      version.length > 0 &&
      updatedState.claimHeaderData.length > 0
    ) {
      setShowRun(true);
    } else if (
      selectedType == "all" &&
      updatedState.claimHeaderData.length > 0
    ) {
      setShowRun(true);
    } else {
      setShowRun(false);
    }
  }, [
    selectedType,
    policy.length,
    version.length,
    updatedState.claimHeaderData.length,
  ]);

  useEffect(() => {
    setRunAllClicked(false);
  }, [selectedType]);

  // selecting clientgroupcode
  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();
    if (a.length !== 0) {
      setClientGroup(a[0].clientGroupId);
      setClientGroupCode(a[0].clientGroupCode);
    } else {
      setClientGroup("");
      setClientGroupCode("");
    }
  };

  // ag grid checkbox selection
  const onGridReady = (data) => {
    data.api.forEachLeafNode((s) => {
      if (s.data?.clientGroupId === clientGroup) {
        s.setSelected(true);
      }
    });
  };

  // validation method for testing report
  const handleUploadFile = (file) => {
    var allowedFiles = [".xlsx", ".csv"];
    var regex = new RegExp(
      "([a-zA-Z0-9s_\\.-:()])+(" + allowedFiles.join("|") + ")$"
    );
    if (file != undefined) {
      if (!regex.test(file.name.toLowerCase())) {
        setOpen(false);
        CustomSwal("error", "Please upload valid file", navyColor, "OK", "");
        return false;
      } else {
        return true;
      }
    }
  };

  // uploading file method
  const UploadTestingReportFile = () => {
    dispatch({ type: TOTAL_CLAIMS_DATA, payload: [] });
    dispatch({ type: LINE_LEVEL_DATA, payload: [] });
    storeSheetData([],[],[]);
    let validation = handleUploadFile(selectedFile);
    if (validation) {
      var files = selectedFile;
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {
          type: "binary",
          cellDates: true,
          dateNF: "mm/dd/yyyy",
        });

        const claim = readedData.SheetNames[0];
        const claimSheet = readedData.Sheets[claim];
        const history = readedData.SheetNames[1];
        const historySheet = readedData.Sheets[history];

        let checkErrorDetails = false;


        //@ts-ignore
        let claimSheetRows = XLSX.utils.sheet_to_row_object_array(claimSheet);

        //@ts-ignore 
        let historySheetRows = XLSX.utils.sheet_to_row_object_array(historySheet);

        for (let i = 1; i < claimSheetRows.length + 1; i++) {
          convertCellDate(claimSheet, 6, i); // Column 6
          convertCellDate(claimSheet, 24, i); // Column 24
          convertCellDate(claimSheet, 25, i); // Column 25
        }
        
        const claimDataParse = XLSX.utils.sheet_to_json(claimSheet, {
          header: 1,
          blankrows: false,
        });
        let claimSheetData = [];
        claimDataParse.forEach((d, idx) => {
          // if (idx > 0 && d[0] != null) {
          if (idx >= 1) {
            let obj = claimDataObject(d);
            claimSheetData.push(obj);
            if (checkNullForClaimLines(obj, idx)) {
              checkErrorDetails = true;
            }


            if (d[6] && checkDateDob(d[6], idx)) {
              checkErrorDetails = true;
            }
            let lines = "ClaimLines";
            if (d[24] && d[25] && checkDatesDos(d[24], d[25], idx, lines)) {
              checkErrorDetails = true;

            }
          }
        });
        const groupedById = _.groupBy(claimSheetData, "scenarioId");
        const result = Object.values(groupedById);
        const uniqueData = claimSheetData.filter((obj, index) => {
          return (
            index ===
            claimSheetData.findIndex((o) => obj.scenarioId === o.scenarioId)
          );
        });
        setOpen(false);
        for (let i = 1; i < historySheetRows.length + 1; i++) {
          convertCellDate(historySheet, 21, i); // Column 21
          convertCellDate(historySheet, 22, i); // Column 22
        }
        
        const historySheetParse = XLSX.utils.sheet_to_json(historySheet, {
          header: 1,
          blankrows: false,
        });
        let HistoryData = [];
        historySheetParse.forEach((d, idx) => {
          // if (idx > 0 && d[0] != null) {
          if (idx >= 1) {
            let obj = claimHistoryDataObject(d);
            HistoryData.push(obj);
            if (checkNullForHistoryLines(obj, idx)) {
              checkErrorDetails = true;
            }
          
          let lines = "historyLines";
          if (d[21] && d[22] && checkDatesDos(d[21], d[22], idx, lines)) {
            checkErrorDetails = true;
          }
        }
        });
        HistoryData.forEach((k, l) => {
          k.dosFrom = Moment(k.dosFrom).format("YYYY-MM-DD");
          k.dosTo = Moment(k.dosTo).format("YYYY-MM-DD");
        });

        if (!checkErrorDetails) {
          storeSheetData(uniqueData, result, HistoryData);
          sethistoricdata(HistoryData);
          setnumberOfHistoricRows(HistoryData.length);
          setOpen(false);
          setExportedData(claimSheetData);
        }
      };
      reader.readAsBinaryString(files);
    }
  };

  const location = useLocation();
  const paths = location.pathname.replaceAll("/", "");

  // setting line level data
  function LineLevelData(Id) {
    let array = [];
    let i = updatedState.tempData.length;
    for (let p = 0; p < i; p++) {
      updatedState.tempData[p].forEach((k, l) => {
        if (k.scenarioId == Id) {
          array.push({
            drgClaimSlId: k.claimSlId,
            cptFrom: k.cptFrom,
            submittedModifier1: k.mod1,
            submittedModifier2: k.mod2,
            submittedModifier3: k.mod3,
            submittedModifier4: k.mod4,
            dxCode1: k.dx1,
            dxCode2: k.dx2,
            dxCode3: k.dx3,
            dxCode4: k.dx4,
            dosFrom: k.dosFrom,
            dosTo: k.dosTo,
            submittedUnits: k.qty,
            revenueCode: k.revenueCode,
            payerAllowedRevenueCode: k.payerAllowedRevenueCode,
            submittedChargeAmount: k.totalChargeAmount,
            allowedQuantity: k.allowedQuantity,
            payerAllowedProcedureCode: k.payerAllowedProcedureCode,
            payerAllowedUnits: k.payerAllowedUnits,
            payerAllowedModifier1: k.payerAllowedModifier1,
            payerAllowedModifier2: k.payerAllowedModifier2,
            payerAllowedModifier3: k.payerAllowedModifier3,
            payerAllowedModifier4: k.payerAllowedModifier4,
            pos: k.lineLevelPos,
            renderingProviderNpi: k.lineLevelNpi,
            renderingTaxonomy: k.lineLevelTaxonomy,
            payerAllowedAmount: k.payerAllowedAmount,
            rvuPrice: k.rvuPrice,
          });
        }
      });
    }
    return array;
  }
  // sending claim data
  async function sendClaim() {
    let policyId;
    let claimDataDTO = {};
    if (selectedType == "single") {
      if (policy.length > 0 && version.length > 0) {
        policyId = await getPolicyNumber(
          dispatch,
          Number(policy),
          Number(version)
        );
      }
    }
    if (selectedType == "single") {
      claimDataDTO["policyId"] = policyId?.policyId;
    }
    let claimDTOList = [];
    updatedState.claimHeaderData.forEach((k, l) => {
      claimDTOList.push({
        postiveData: k.postiveData,
        scenarioId: k.scenarioId,
        patientGender: k.gender,
        ipuPatientId: k.memberId,
        clmFormType: k.claimFormType,
        taxIdentifier: k.tin,
        renderingProviderNpi: k.npi,
        renderingTaxonomy: k.taxonomy,
        policyId: selectedType == "single" ? policyId?.policyId : null,
        dateOfService: Moment(checkHeaderDosFrom(k.scenarioId)).format(
          "YYYY-MM-DD"
        ),
        diags: k.diagsCodes,
        posLkp: k.pos,
        condCode: k.conditionCode,
        zipCode: k.zipCode,
        patientDateOfBirth: Moment(k.dob).format("YYYY-MM-DD"),
        billType: k.billType,
        scenarioDesc: k.scenarioDesc,
        clientGroupId: clientGroup,
        clientGroupCode: clientGroupCode,
        clientGroupType: clientGroupType.label,
        fileHistoricalClaimLines: updatedState.historicTempData,
        isProdb: testInclude == null ? 0 : testInclude,
        includeDBHistory: includeDbHistory == null ? 0 : includeDbHistory,
        testClaimLines: LineLevelData(k.scenarioId),
      });
    });
    if (clientGroupType == "" || clientGroupType == undefined) {
      CustomSwal(
        "info",
        "Please Select Client Group Type ",
        navyColor,
        "OK",
        " "
      );
    } else if(selectedType == "single" && policyId?.policyId == undefined){
      CustomSwal(
        "info",
        "Policy number does not exist enter correct policy number",
        navyColor,
        "OK",
        ""
      );
    }
    else {
      sendClaimData(dispatch, claimDTOList);
    }
  }
  // updating latest date at header level
  const checkHeaderDosFrom = (scenarioId) => {
    let earliestDosFrom = "";
    let dosFromDates = [];
  
    // Collect all 'dosFrom' dates for the given scenario ID
    exportedData.forEach((record) => {
      if (record.scenarioId === scenarioId) {
        dosFromDates.push({
          dosFrom: record.dosFrom,
        });
      }
    });
  
    // Iterate over the exported data to find the earliest 'dosFrom' date
    for (let i = 0; i < exportedData.length; i++) {
      dosFromDates.forEach((entry) => {
        if (exportedData[i].scenarioId === scenarioId) {
          const currentDate = new Date(exportedData[i].dosFrom);
          const comparedDate = new Date(entry.dosFrom);
          if (comparedDate < currentDate) {
            earliestDosFrom = entry.dosFrom;
          } else if (earliestDosFrom === "") {
            earliestDosFrom = entry.dosFrom;
          }
        }
      });
    }
  
    // Return the formatted 'earliestDosFrom' date
    return Moment(earliestDosFrom).format("MM-DD-YYYY");
  };

  // Check box
  const renderCustomCheckBox = ({
    checked,
    onChange,
    label,
    style,
    size,
    value,
    disabled,
  }) => (
    <CustomCheckBox
      checked={checked}
      disabled={disabled}
      style={style}
      onChange={onChange}
      label={label}
      size={size}
      value={value}
    />
  );
  // custom Input
  const renderCustomInput = ({
    labelText = "",
    value = "",
    onChange = undefined, // Leave undefined by default
    onKeyPress = undefined, // Leave undefined by default
    onBlur = undefined, // Leave undefined by default
    maxLength = 10,
    type = "text",
    disabled = false,
    title = "",
    endAdornment = null,
  }) => (
    <CustomInput
      fullWidth={true}
      labelText={labelText}
      value={value || ""}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onBlur={onBlur}
      maxLength={maxLength}
      type={type}
      disabled={disabled}
      variant={"outlined"}
      title={title}
      endAdornment={endAdornment}
    />
  );
  // tabs
  const renderTab = ({label, value, selectedTabConstant, onClickHandler}) => (
    <Tab
      className="desc"
      style={{
        minHeight: "3px",
        minWidth: "50%",
        color: selectedTab === selectedTabConstant ? "black" : "white",
        backgroundColor:
          selectedTab === selectedTabConstant ? "#B7C9CD" : navyColor,
        textTransform: "capitalize",
        fontSize: 12,
        marginTop: -4,
      }}
      label={<span>{label}</span>}
      value={value}
      onClick={onClickHandler}
    />
  );
  // Dialob box

  const buttonStyles = {
    backgroundColor: navyColor,
    color: "white",
    padding: 4,
    fontSize: 12,
    textTransform: "capitalize",
    margin: 10,
  };
  
  const dangerButtonStyles = {
    ...buttonStyles,
    backgroundColor: dangerColor,
  };
  
  function openPop() {
    if (openLkp) {
      return openLkp;
    }
    if (open) {
      return open;
    }
   
    return null;
  }

  const dialogBoxTitle=()=> {
    let title = "";
    if (openLkp) {
      title = selectedLkp;
    }
    if(open){
      title = "Upload File"
    }
    return title;
  }

  const dialogBoxMessage = ()=>{
    if(openLkp){
      return (
        <>
        <div style={{ height: window.innerHeight / 1.8, marginTop: "30px" }}>
          <AgGrids
            rowData={clientRowData}
            columnDefs={selectedLkpColumns}
            rowSelection={"single"}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            gridIconStyle={lkpGridIconStyle}
          />
        </div>
      </>
      )
    }
    if(open){
      return (
        <>
          <div>
            <input
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                setSelectedFile(file);
                let flag = handleUploadFile(e.target.files[0]);
                setFileError(flag);
              }}
            />
          </div>
        </>
    )
  }
  return null; // Return null if neither `open` nor `openLkp` is true
}
const dialogBoxButtons = ()=>{

  if(openLkp){
    return (
      <>
          <ButtonGroup style={{ marginTop: "-50px" }}>
            <CustomButton
              variant="contained"
              onClick={() => handleToClose()}
              style={buttonStyles}
            >
              Yes
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleToClose();
                setClientGroup("");
              }}
              variant="contained"
              style={dangerButtonStyles}
            >
              No
            </CustomButton>
          </ButtonGroup>
      </>
    )
  }

  if(open){
    return (
      <>
        <ButtonGroup>
          {fileError ? (
            <CustomButton
              onClick={() => {
                handleToClose();
                UploadTestingReportFile();
                setResetClicked(false);
                setRunAllClicked(false);
                setImportClicked(true);
              }}
              style={buttonStyles}
            >
              Yes
            </CustomButton>
          ) : undefined}
          <CustomButton onClick={handleToClose} style={dangerButtonStyles}>
            No
          </CustomButton>
        </ButtonGroup>
      </>
    )
  }
  return null; // Return null if neither `open` nor `openLkp` is true
}


  return (
    <Template>
      <h5>Testing Report</h5>
      <GridContainer style={{ position: "relative", bottom: "20px" }}>
        <GridItem sm={4} md={4} xs={4} />
        <GridItem sm={3} md={3} xs={3}>
          <RadioButton
            label={"All Policies"}
            checked={selectedType == "all"}
            onChange={() => {
              setSelectedType("all");
            }}
          />
          <RadioButton
            label={"Single Policy"}
            checked={selectedType == "single"}
            onChange={() => {
              setSelectedType("single");
            }}
          />
        </GridItem>
        <GridItem sm={2} md={2} xs={2}>
          <div className="testButtons">
            {selectedType == "all" || selectedType == "single" ? (
              <a target="_blank" href={referenceTemplate}>
                {"Reference Template"}
              </a>
            ) : undefined}
          </div>
        </GridItem>
        <GridItem sm={3} md={3} xs={3}>
          <div className="testButtons">
            {selectedType == "all" || selectedType == "single" ? (
              <CustomButton
                variant={"contained"}
                disabled={checkImportBtn(selectedType, policy, version)}
                style={{
                  backgroundColor: checkImportBtn(selectedType, policy, version)
                    ? "#9CAEA4"
                    : navyColor,
                  color: "white",
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
                onClick={handleClickToOpen}
                startIcon={
                  <FileUploadIcon
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      left: "1px",
                      marginRight: "0px",
                    }}
                  />
                }
              >
                Import
              </CustomButton>
            ) : undefined}
            {showRun ? (
              <CustomButton
                onClick={() => {
                  sendClaim();
                  setRunAllClicked(true);
                }}
                variant={"contained"}
                style={{
                  backgroundColor: successColor,
                  color: "white",
                  margin: 0,
                  padding: 4,
                  fontSize: 12,
                  marginLeft: 6,
                  textTransform: "capitalize",
                }}
                startIcon={
                  <PlayArrowIcon
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      left: "1px",
                      marginRight: "0px",
                    }}
                  />
                }              >
                Run All
              </CustomButton>
            ) : undefined}
            {updatedState.claimHeaderData?.length > 0 ? (
              <CustomButton
                onClick={(e) =>
                  exportToCSV(
                    historicdata,
                    selectedType == "single"
                      ? updatedState?.getTestingReportData.policyNumber +
                          "/" +
                          updatedState?.getTestingReportData.policyVersion
                      : "all Policy",
                    updatedState,
                    selectedType,
                    totaltestingreportdata,
                    clientGroup,
                    clientGroupType
                  )
                }
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  padding: 4,
                  fontSize: 12,
                  marginLeft: 6,
                  textTransform: "capitalize",
                }}
                startIcon={
                  <FileDownloadIcon
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      left: "1px",
                      marginRight: "0px",
                    }}
                    />
                  }
                variant={"contained"}
              >
                Export
              </CustomButton>
            ) : undefined}
            {selectedType == "all" || selectedType == "single" ? (
              <CustomButton
                className="RstBtn"
                onClick={() => {
                  resetInputField();
                  setResetClicked(true);
                }}
                variant={"contained"}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  margin: 0,
                  padding: 4,
                  fontSize: 12,
                  marginLeft: 6,
                  textTransform: "capitalize",
                }}
                startIcon={
                  <RestartAltIcon
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      left: "1px",
                      marginRight: "0px",
                    }}
                  />
                }
              >
                Reset
              </CustomButton>
            ) : undefined}
          </div>
        </GridItem>
      </GridContainer>
      {selectedType ? (
        <>
          <CustomPaper
            className="testingReportBox"
            style={{
              backgroundColor: "#ecf0f1",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 4px",
            }}
          >
            <div className="main">
              {selectedType == "single" ? (
                <>
                  <span className="mainChild">
                    {renderCustomInput({
                      labelText: "Policy#",
                      value: policy,
                      onChange: (event) => setPolicy(event.target.value),
                      onKeyPress: (e) => StringMethod(e),
                      maxLength: 10,
                      type: "text",
                      disabled: false,
                    })}
                  </span>
                  <span className="mainChild">
                    {renderCustomInput({
                      labelText: "Ver",
                      value: version,
                      onChange: (event) => {
                        setVersion(event.target.value);
                      },
                      onKeyPress: (e) => StringMethod(e),
                      onBlur: (e) => {
                        if (policy.length > 0 && version.length > 0) {
                          getPolicyNumber(
                            dispatch,
                            Number(policy),
                            Number(e.target.value)
                          );
                        }
                        setVersion(e.target.value);
                      },
                      maxLength: 1,
                      type: "text",
                      disabled: false,
                    })}
                  </span>
                  {totaltestingreportdata?.minAgeFk?.minMaxAgeDesc ? (
                    <>
                      <span className="mainChild">
                        {renderCustomInput({
                          labelText: "CLM TYPE",
                          value: totaltestingreportdata?.claimType,
                          maxLength: 10,
                          disabled: false,
                        })}
                      </span>
                      <span className="mainChildMin">
                        {renderCustomInput({
                          labelText: "Min Age",
                          value:
                            totaltestingreportdata?.minAgeFk?.minMaxAgeDesc,
                          maxLength: 100,
                          disabled: true,
                        })}
                      </span>

                      <span className="mainChildMin">
                        {renderCustomInput({
                          labelText: "Max Age",
                          value:
                            totaltestingreportdata?.maxAgeFk?.minMaxAgeDesc,
                          maxLength: 100,
                          disabled: true,
                        })}
                      </span>

                      {renderCustomCheckBox({
                        checked: totaltestingreportdata.isProdb == 1,
                        onChange: (event) => {
                          updatedState.getTestingReportData.isProdb = event
                            .target.checked
                            ? 1
                            : 0;
                        },
                        label: <span style={{ fontSize: "12px" }}>Prod</span>,
                        style: { marginTop: "20px" },
                        size: "",
                        value: totaltestingreportdata.isProdb == 1,
                        disabled: true,
                      })}

                      {renderCustomCheckBox({
                        checked: totaltestingreportdata.deactivated == 1,
                        onChange: (event) => {
                          updatedState.getTestingReportData.deactivated = event
                            .target.checked
                            ? 1
                            : 0;
                        },
                        label: (
                          <span style={{ fontSize: "12px" }}>Deactivated</span>
                        ),
                        style: { marginTop: "20px" },
                        size: "",
                        value: totaltestingreportdata.deactivated == 1,
                        disabled: true,
                      })}

                      {renderCustomCheckBox({
                        checked: totaltestingreportdata.disabled == 1,
                        onChange: (event) => {
                          updatedState.getTestingReportData.disabled = event
                            .target.checked
                            ? 1
                            : 0;
                        },
                        label: (
                          <span style={{ fontSize: "12px" }}>Disabled</span>
                        ),
                        style: { marginTop: "20px" },
                        size: "",
                        value: totaltestingreportdata.disabled == 1,
                        disabled: true,
                      })}
                    </>
                  ) : undefined}
                </>
              ) : undefined}

              <span className="mainChildMin">
                <CustomSelect
                  labelText={"Client Group Type"}
                  onSelect={(event) => {
                    if (event != null) {
                      setClientGroupType(event);
                    } else {
                      setClientGroupType("");
                    }
                  }}
                  value={clientGroupType}
                  options={productTypeCM}
                />
              </span>
              <span className="mainChildMin">
                {renderCustomInput({
                  labelText: "Client Group Id",
                  value: clientGroup,
                  maxLength: 10,
                  disabled: false,
                  title: "Client Group ID",
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => {
                        setOpenLkp(true);
                        setSelectedLkp("Client Group ID");
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
                  ),
                })}
              </span>
              <span className="checkBtn">
                {renderCustomCheckBox({
                  checked: includeDbHistory == 1,
                  onChange: (event) => {
                    updatedState.includeDB = event.target.checked ? 1 : 0;
                    dispatch({
                      type: INCLUDE_DB,
                      payload: event.target.checked ? 1 : 0,
                    });
                    setIncludeDbHistory(event.target.checked ? 1 : 0);
                  },
                  label: (
                    <p style={{ fontSize: "12px", display: "table-cell" }}>
                      Include Dragon History
                    </p>
                  ),
                  style: { position: "relative", bottom: "6%" },
                  size: "small",
                  value: includeDbHistory,
                  disabled: false,
                })}
              </span>
              {selectedType == "all" ? (
                <span className="checkBtn">
                  {renderCustomCheckBox({
                    checked: testInclude == 1,
                    onChange: (event) => {
                      updatedState.getTestingReportData.isProdb = event.target
                        .checked
                        ? 1
                        : 0;
                      dispatch({
                        type: PROD,
                        payload: event.target.checked ? 1 : 0,
                      });
                      setTestInclude(event.target.checked ? 1 : 0);
                    },
                    label: (
                      <p style={{ fontSize: "12px", display: "table-cell" }}>
                        Include Mock Test
                      </p>
                    ),
                    style: { position: "relative", bottom: "6%" },
                    size: "small",
                    value: testInclude,
                    disabled: false,
                  })}
                </span>
              ) : undefined}
            </div>
          </CustomPaper>
          <div className="testingTabs">
            <Box sx={{ width: "100%" }}>
              {updatedState.claimHeaderData?.length > 0 ? (
                <TabContext value={selectedTab}>
                  <Tabs
                    onChange={(value, newValue) => {
                      setSelectedTab(newValue);
                    }}
                    style={{
                      backgroundColor: navyColor,
                      minHeight: "5px",
                      height: "26px",
                      marginTop: "1%",
                      position: "relative",
                      top: "3px",
                      borderRadius: "20px",
                    }}
                    value={selectedTab}
                    aria-label="basic tabs example"
                  >
                    {renderTab({
                      label:"Current Lines ",
                      value:"currentLines",
                      selectedTabConstant:PolicyConstants.CURRENT_LINES,
                      onClickHandler:""
                    })}
                    {renderTab({
                      label:"historyLines",
                      value:"historyLines",
                      selectedTabConstant:PolicyConstants.HISTORY_LINES,
                     onClickHandler: () => setnumberOfHistoricRows(historicdata.length)
                    })}

                  </Tabs>
                  <div>
                    <TabPanel
                      style={{
                        overflowY: checkScroll(updatedState),
                        height: checkHeight(),
                        scrollbarWidth: "thin",
                      }}
                      value="currentLines"
                    >
                      {updatedState.claimHeaderData.length === 0?<ClassicLoader/>:
                      <Suspense fallback={<ClassicLoader/>}>
                        <TestingReportScenario {...headerLevelData} />
                      </Suspense>}
                    </TabPanel>
                    <TabPanel value="historyLines">
                      {historicdata.length > 0 ? (
                        <div
                          style={{
                            position: "relative",
                            top: "10px",
                            height:
                              selectedType == "all"
                                ? window.innerHeight / 2.2
                                : window.innerHeight / 2.6,
                          }}
                        >
                          <>
                            <AgGrids
                              rowData={historicdata}
                              columnDefs={HistoricColumns}
                              onGridReady={onGridReady}
                              onFilterChanged={onFilterChanged}
                              gridIconStyle={gridIconStyle}
                            />
                            <small
                              style={{
                                position: "relative",
                                top: "5px",
                                fontSize: "12px",
                              }}
                            >
                              Number of rows : {numberOfHistoricRows}
                            </small>
                          </>
                        </div>
                      ) : undefined}
                    </TabPanel>
                  </div>
                </TabContext>
              ) : undefined}
            </Box>
          </div>
        </>
      ) : undefined}

      {openPop()?<Dialogbox
        open={openPop()}
        onClose={handleToClose}
        fullWidth={fullWidth}
        maxWidth={openLkp ? "md" :"xs"}
        disableBackdropClick={true}
        title={<>{dialogBoxTitle()}</>}
        message={<>{dialogBoxMessage()}</>}
        actions={<>{dialogBoxButtons()}</>}
       
      />:undefined}
    </Template>
  );
};
export default TestingReport;

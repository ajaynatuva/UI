import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import { ButtonGroup, Link } from "@mui/material";
import Moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
  dangerColor,
  disabledColor,
  navyColor,
} from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomPaper from "../../../components/CustomPaper/CustomPaper";
import Dialogbox from "../../../components/Dialog/DialogBox";
import AgGrids from "../../../components/TableGrid/AgGrids";
import {
  getProcsByPolicyId,
  getPolicyProcsTotalDataByPolicyId,
  uploadProceduresToStage,
  UploadProceduresToTarget,
} from "../../../redux/ApiCalls/NewPolicyTabApis/CPT_HCPCS_Apis";
import {
  PROCS_TARGET,
} from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "./CPT_HCPCS.css";
import { exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { ProcsColumns } from "../Columns";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { UseProgressValue } from "../../../components/Spinner/UseProgressValue";
import DialogBoxWithOutBorder from "../../../components/Dialog/DialogBoxWithOutBorder";
import { CircularProgressWithLabel } from "../../../components/Spinner/CircularProgressWithLabel";
import { getClmLinkLkp, getPolicyCptActionLkp } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { getChangesById, getChangesId } from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";

const Procs = ({ edit, policyId, showImportButton }) => {
  const [updatedData, setUpdatedData] = useState([]);
  const [changesData, setChangesData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [deltaLink, setDeltaLink] = useState(undefined);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [dataclm, setDataclm] = useState([]);
  const [actionData, setActionData] = useState([]);
  const { showProgress, progress, showProgressValues, hideProgress } =
    UseProgressValue();
  const [fileError, setFileError] = useState(false);
  const navigate = useNavigate();

  const updatedState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );

    const changesState: changesTabFieldState = useSelector(
      (state: any) => state.ChangesTabFieldsRedux
    );

   const policyFields: NewPolicyFormFieldState = useSelector(
      (state: any) => state.policyFieldsRedux
    );

  ModuleRegistry.registerModules(AllCommunityModules);

 

  // function customheader() {
  //   let claimKey;
  //   let claimDesc;
  //   let dataClm = dataclm.map((k) => {
  //     claimKey = k.claimLinkKey;
  //     claimDesc = k.claimLinkDesc;
  //     return " " + claimKey + "-" + claimDesc;
  //   });
  //   return dataClm;
  // }

  // function actionHeader() {
  //   let policyCptActionKey;
  //   let policyCptActionCode;
  //   let actnData = actionData.map((k) => {
  //     policyCptActionKey = k.policyCptActionKey;
  //     policyCptActionCode = k.policyCptActionCode;
  //     return " " + policyCptActionKey + "-" + policyCptActionCode;
  //   });
  //   return actnData;
  // }


  const customheader = useCallback(() => {
    return dataclm.map(k => `${k.claimLinkKey} - ${k.claimLinkDesc}`).join(", ");
  }, [dataclm]);
  
  const actionHeader = useCallback(() => {
    return actionData.map(k => `${k.policyCptActionKey} - ${k.policyCptActionCode}`).join(", ");
  }, [actionData]);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  const columnDefs = useMemo(() => ProcsColumns(actionHeader, customheader), [actionHeader, customheader]);


  const target = async () => {
    try {
      await UploadProceduresToTarget(dispatch, policyFields.policyId, navigate);

      if (gridRef.current) {
        const params = {
          api: gridRef.current,
        };
        await onGridReady(params);
      } else {
        console.warn("Grid API is not available");
      }
    } catch (error) {
      console.error("Error during target operation:", error);
    }

    handleToCloseTargetProcs();
  };

  useEffect(() => {
    if (policyId != null) {
      getChangesId(dispatch, policyId);
    }
    getClmLinkLkp(dispatch);
    getPolicyCptActionLkp(dispatch);
  }, [policyId]);

  useEffect(() => {
    updatedState.clmLinkLkp.forEach((d, i) => {
      d.claimLinkKey = d.claimLinkKey;
      d.claimLinkCode = d.claimLinkCode;
    });
    setDataclm(updatedState.clmLinkLkp);
  }, [updatedState.clmLinkLkp]);

  useEffect(() => {
    setActionData(updatedState.policyCptActionLkp);
  }, [updatedState.policyCptActionLkp]);

  useEffect(() => {
    setChangesData(changesState.changesIsOpenB);
    setDeltaLink(updatedState.deltaLink);
  }, [updatedState]);

  const gridRef = useRef();

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

  let tablegridData = [];
  const onGridReady = async (params) => {
    gridRef.current = params.api;

    const dataSource = {
      getRows: async (params) => {
        let sortType = "";
        let sortableColumn = "";
        let rows: any = [];
        let procs = {};
        let hasFilter = false; // Flag to indicate if any filter is applied
        setUpdatedData([]);

        if (params.sortModel.length > 0) {
          const sortModel = params.sortModel[0];
          sortType = sortModel.sort;

          switch (sortModel.colId) {
            case "cptFrom":
              sortableColumn = "cptFrom";
              break;
            case "cptTo":
              sortableColumn = "cptTo";
              break;
            case "Mod1":
              sortableColumn = "mod1";
              break;
            case "Mod2":
              sortableColumn = "mod2";
              break;
            case "Mod3":
              sortableColumn = "mod3";
              break;
            case "LookBackStart":
              sortableColumn = "daysLo";
              break;
            case "LookBackEnd":
              sortableColumn = "daysHi";
              break;
            case "RevFrom":
              sortableColumn = "revFrom";
              break;
            case "RevTo":
              sortableColumn = "revTo";
              break;
            case "POS":
              sortableColumn = "pos";
              break;
            case "DOSFrom":
              sortableColumn = "dosFrom";
              break;
            case "DOSTo":
              sortableColumn = "dosTo";
              break;
            case "Action":
              sortableColumn = "action";
              break;
            case "Exclusion":
              sortableColumn = "exclusion";
              break;
            case "Dx":
              sortableColumn = "dxLink";
              break;
            case "ClmLink":
              sortableColumn = "claimLink";
              break;
            default:
              break;
          }
        }

        if (!(params.filterModel == null || undefined)) {
          for (let key in params.filterModel) {
            if (params.filterModel[key]?.filter?.length > 0) {
              hasFilter = true;
              break;
            }
          }
          procs = {
            cptFrom: params.filterModel.cptFrom?.filter || "",
            cptTo: params.filterModel.cptTo?.filter || "",
            mod1: params.filterModel.mod1?.filter || "",
            mod2: params.filterModel.mod2?.filter || "",
            mod3: params.filterModel.mod3?.filter || "",
            daysLo: params.filterModel.daysLo?.filter || "",
            daysHi: params.filterModel.daysHi?.filter || "",
            revFrom: params.filterModel.revFrom?.filter || "",
            revTo: params.filterModel.revTo?.filter || "",
            pos: params.filterModel.pos?.filter || "",
            dosFrom: params.filterModel.dosFrom?.filter
              ? stringToDateFormat(params.filterModel.dosFrom.filter)
              : "",
            dosTo: params.filterModel.dosTo?.filter
              ? stringToDateFormat(params.filterModel.dosTo.filter)
              : "",
            policyCptActionCode: params.filterModel.action?.filter || "",
            excludeb: params.filterModel.exclusion?.filter || "",
            dxLink: params.filterModel.dxLink?.filter || "",
            claimLinkCode: params.filterModel.claimLink?.filter || "",
            isSort: sortType || "",
            sortColumn: sortableColumn || "",
            policyId: policyFields.policyId,
            startRow: params.startRow,
            endRow: params.endRow - 1000,
          };
        } else {
          procs = {
            startRow: params.startRow,
            endRow: params.endRow - 1000,
            policyId: policyFields.policyId,
          };
        }
        if (policyFields.policyId) {
          rows = await getPolicyProcsTotalDataByPolicyId(dispatch, procs);

          setNumberOfRows(rows.numberOfRows);
          let mappedData = rows?.proceduresSearchResult.map((ad) => {
            return {
              cptFrom: ad.cptFrom,
              cptTo: ad.cptTo,
              mod1: ad.mod1,
              mod2: ad.mod2,
              mod3: ad.mod3,
              daysLo: ad.daysLo,
              daysHi: ad.daysHi,
              revFrom: ad.revFrom,
              revTo: ad.revTo,
              pos: ad.pos,
              dosFrom: moment(ad.dosFrom).format("MM-DD-YYYY"),
              dosTo: moment(ad.dosTo).format("MM-DD-YYYY"),
              exclusion: ad.excludeb,
              dxLink: ad.dxLink,
              action: ad.policyCptActionCode,
              claimLink: ad.claimLinkCode,
              claimDesc: ad.claimLinkDesc,
              claimLinkKey: ad.claimLinkKey,
            };
          });

          if (hasFilter == true) {
            setUpdatedData(mappedData);
          }
          if (params.startRow === 0) {
            tablegridData = mappedData;
          } else {
            tablegridData = tablegridData.concat(mappedData);
          }

          if (tablegridData.length === 0) {
            CustomSwal("info", "No data found", navyColor, "OK", "");
          }

          let lastRow =
            tablegridData.length < params.endRow ? tablegridData.length : -1;
          params.successCallback(mappedData, lastRow);
        }
      },
    };

    params.api.setDatasource(dataSource);
  };

  const handleClickToOpen = () => {
    setOpen(true);
  };
  const handleToClose = () => {
    setOpen(false);
    setSelectedFile("");
  };
  const handleToCloseTargetProcs = () => {
    dispatch({ type: PROCS_TARGET, payload: false });
  };

  function ProcsData() {
    if (changesData.length > 0) {
      setOpen(true);
      handleClickToOpen();
    } else {
      CustomSwal("error", "Please create Jira Ticket.", navyColor, "OK", "");
    }
    setSelectedFile(undefined);
  }

  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(undefined);

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
  function checkDates(dos, dosTo) {
    let err = true;
    let dosFromErr = true,
      dosToErr = true;
    let dosFrom1 = dos?.toString().includes("/");
    let dosFrom2 = dos?.toString().includes("-");
    let dosTo1 = dosTo?.toString().includes("/");
    let dosTo2 = dosTo?.toString().includes("-");

    if (dosFrom1 == true || dosFrom2 == true) {
      dosFromErr = false;
    } else {
      dosFromErr = true;
    }
    if (dosTo1 == true || dosTo2 == true) {
      dosToErr = false;
    } else {
      dosToErr = true;
    }
    if (dosFromErr == true || dosToErr == true) {
      err = true;
    } else {
      err = false;
    }
    return err;
  }
  function checkNull(d, i) {
    let error2 = false;
    if (!d.CPTFROM) {
      error2 = true;
    } else if (!d.CPTTO) {
      error2 = true;
    } else if (!d.MOD1) {
      error2 = true;
    } else if (!d.MOD2) {
      error2 = true;
    } else if (!d.MOD3) {
      error2 = true;
    } else if (!(d.REVFROM?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.REVTO?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.POS?.toString().length > 0)) {
      error2 = true;
    } else if (!d.DOSFROM) {
      error2 = true;
    } else if (!d.DOSTO) {
      error2 = true;
    } else if (!d.DAYSLO && !(d.DAYSLO?.toString().length > 0)) {
      error2 = true;
    } else if (!d.DAYSHI && !(d.DAYSHI?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.POLICYCPTACTIONKEY?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.EXCLUDEB?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.DXLINK?.toString().length > 0)) {
      error2 = true;
    } else if (!(d.CLAIMLINKKEY?.toString().length > 0)) {
      error2 = true;
    } else {
      error2 = false;
    }
    return error2;
  }
  // const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const batchSize = 3000;

  async function onFileUpload() {
    const formData = new FormData();
    formData.append("uploadfile", selectedFile);
    if (handleUploadFile(selectedFile)) {
      let user = localStorage.getItem("emailId");
      formData.append("email", user);
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(selectedFile);
      fileReader.onload = async (e) => {
        let arrayBuffer: any = [];
        arrayBuffer = fileReader.result;
        let data = new Uint8Array(arrayBuffer);
        let arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        let bstr = arr.join("");
        let workbook = XLSX.read(bstr, { type: "binary" });
        let first_sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[first_sheet_name];
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        let array: any = [];
        let exportarray: any = [];
        array = exportarray.concat(arraylist);
        const uniqueCodes = new Set();
        let error = false;

        for (let i = 0; i < array.length; i += batchSize) {
          const batch = array.slice(i, i + batchSize);
          batch.forEach((o, index) => {
            const uniqueCode = [
              o.CPTFROM,
              o.CPTTO,
              o.MOD1,
              o.MOD2,
              o.MOD3,
              o.DAYSLO,
              o.REVFROM,
              o.REVTO,
              o.POS,
              o.DOSFROM,
              o.EXCLUDEB,
              o.POLICYCPTACTIONKEY,
            ].join("-");

            if (uniqueCodes.has(uniqueCode)) {
              error = true;

              CustomSwal(
                "error",
                "Duplicate Row at " +
                  (i + index + 2) +
                  " - " +
                  "CPTFROM is : " +
                  o.CPTFROM +
                  ",  CPTTO is : " +
                  o.CPTTO +
                  ", MOD1 is : " +
                  o.MOD1 +
                  ", MOD2 is : " +
                  o.MOD2 +
                  ", MOD3 is : " +
                  o.MOD3 +
                  ", DASYLO is : " +
                  o.DAYSLO +
                  ", REVFROM is : " +
                  o.REVFROM +
                  ", REVTO is : " +
                  o.REVTO +
                  ", POS is : " +
                  o.POS +
                  ", DOSFROM is : " +
                  o.DOSFROM +
                  ", EXCLUDEB is : " +
                  o.EXCLUDEB +
                  ", ACTIONFK is : " +
                  o.POLICYCPTACTIONKEY,
                navyColor,
                "OK",
                ""
              );
            } else {
              uniqueCodes.add(uniqueCode);
            }

            if (checkNull(o, index)) {
              error = true;

              CustomSwal(
                "error",
                `Excel sheet contains empty cell Row at  ${i + index + 2}`,
                navyColor,
                "OK",
                "Error"
              );
              return;
            }

            // Check for date format issues
            if (checkDates(o.DOSFROM, o.DOSTO)) {
              error = true;

              CustomSwal(
                "error",
                `Incorrect Date Format Row at${i + index + 2}`,
                navyColor,
                "OK",
                "Error"
              );
              return;
            }
          });
          if (error) {
            setOpen(false);
            return;
          }
        }

        let importPolicyId = undefined;

        array.filter((d, i) => {
          if (policyFields.policyId != d.POLICYID) {
            importPolicyId = d.POLICYID;
          } else if (importPolicyId == undefined) {
            importPolicyId = policyId;
          }
        });

        if (importPolicyId == policyId) {
          if (!error) {
            const progressInterval = showProgressValues();
            await uploadProceduresToStage(dispatch, formData);
            hideProgress(progressInterval);
            setOpen(false);
          }
        } else {
          setOpen(false);
          setLoading(false);
          if (importPolicyId == -1) {
            CustomSwal(
              "error",
              "Policy Id is blank.",
              navyColor,
              "OK",
              "Error"
            );
          } else {
            CustomSwal(
              "error",
              "Policy Id not matched.",
              navyColor,
              "OK",
              "Error"
            );
          }
        }
      };
    }
  }

  const ExportData = async () => {
    let procsData;
    if (updatedData.length > 0) {
      await exportedExcelFileData(
        updatedData,
        `${policyFields.policyNumber}/${policyFields.version}`,
        "Procedures"
      );
    } else {
      if (policyFields.policyId != null) {
        procsData = await getProcsByPolicyId(dispatch, policyFields.policyId);
      }
      if (procsData.length > 0) {
        const exportedProcsData = procsData.map((d) => {
          return {
            POLICYID: policyId,
            CPTFROM: d.cptFrom,
            CPTTO: d.cptTo,
            MOD1: d.mod1,
            MOD2: d.mod2,
            MOD3: d.mod3,
            DAYSLO: d.daysLo,
            DAYSHI: d.daysHi,
            REVFROM: d.revFrom,
            REVTO: d.revTo,
            POS: d.pos,
            DOSFROM: d.dosFrom,
            DOSTO: d.dosTo,
            POLICYCPTACTIONKEY: d.policyCptActionKey,
            EXCLUDEB: d.excludeb,
            DXLINK: d.dxLink,
            CLAIMLINKKEY: d.claimLinkKey,
          };
        });
        await exportedExcelFileData(
          exportedProcsData,
          `${policyFields.policyNumber}/${policyFields.version}`,
          "Procedures"
        );
      }
    }
  };

  return edit ? (
    <div style={{ marginTop: "-20px" }}>
      <CustomPaper
        style={{
          paddingLeft: 10,
          position: "relative",
          right: 20,
          paddingRight: 8,
          paddingBottom: 15,
          boxShadow: "none",
        }}
      >
        {/* {numberOfRows > 0 ? ( */}
        <div style={{ height: window.innerHeight / 2.2 }}>
          <AgGrids
            ref={gridRef}
            columnDefs={columnDefs}
            onFilterChanged={onFilterChanged}
            onGridReady={onGridReady}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={1}
            infiniteInitialRowCount={1}
            cacheBlockSize={1000}
            maxBlocksInCache={1}
            modules={AllCommunityModules}
            debug={true}
            rowBuffer={0}
            animateRows={true}
            rowModelType={"infinite"}
          />
        </div>
        {/* ) : undefined}  */}
      </CustomPaper>
      {numberOfRows > 0 ? (
        <small style={{ position: "relative", fontSize: "12px" }}>
          Number of rows : {numberOfRows}
        </small>
      ) : undefined}
      <div style={{ float: "right", top: 5, position: "relative", right: 18 }}>
        <CustomButton
          onClick={() => {
            ProcsData();
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
        {numberOfRows > 0 ? (
          <CustomButton
            onClick={() => {
              ExportData();
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
        open={updatedState.stageprocs || updatedState.targetprocsSpinner}
        onClose={handleToClose}
      />
      <div>
        <Dialogbox
          open={updatedState.targetprocs}
          onClose={handleToCloseTargetProcs}
          disableBackdropClick={true}
          title="Confirm"
          message={
            <p>
              Delta Path:{" "}
              <Link target="_blank" href={`${deltaLink}`}>
                Delta Link
              </Link>{" "}
              <br></br>
              Would you like to Send Stage data to Target?
            </p>
          }
          actions={
            <>
              <ButtonGroup>
                <CustomButton
                  onClick={() => {
                    target();
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
                  Yes
                </CustomButton>
                <CustomButton
                  onClick={handleToCloseTargetProcs}
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
              <div>
                {updatedState.stageprocs ? <CircularProgress /> : undefined}
              </div>
            </>
          }
        />
      </div>

      <Dialogbox
        open={open}
        onClose={handleToClose}
        title={"Upload Source File"}
        message={
          <>
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
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <span className="loader"></span>
              </div>
            )}
          </>
        }
        actions={
          <>
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
          </>
        }
      />
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
    </div>
  ) : (
    <></>
  );
};
export default Procs;

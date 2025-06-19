import { ButtonGroup, Grid, IconButton } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dangerColor, navyColor } from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import AgGrids from "../../../components/TableGrid/AgGrids";
import {
  DeleteBillTypeData,
  getBillTypeData,
  getPolicyBillTypeActionLkp,
  getPolicyBillTypeByPolicyId,
  getPolicyBillTypeData,
  getSourceBillTypeLkpData,
  postBillTypeData,
} from "../../../redux/ApiCalls/NewPolicyTabApis/BillTypeTabApis";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { Add } from "@material-ui/icons";
import Dialogbox from "../../../components/Dialog/DialogBox";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import React from "react";
import * as XLSX from "xlsx";
import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import { exportedExcelFileData } from "../../../components/ExportExcel/ExportExcelFile";
import { isFieldInvalid, validationPrompt } from "../newPolicyUtils";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { NewPolicyFormFieldState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormFieldsReducer";
import { BillTypeState } from "../../../redux/reducers/NewPolicyTabReducers/BillTypeReducer";
import {
  BILL_TYPE_FIELDS,
  CHANGES_ISOPEN_B,
  CHANGES_TAB_FIELDS,
} from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { getChangesById, getChangesId } from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { uploadBillTypeData } from "../../../redux/ApiCalls/NewPolicyTabApis/BillTypeTabApis";
import {
  ChangesTabFieldsReducer,
  changesTabFieldState,
} from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";

const _ = require("lodash");

const BillType = ({
  fromViewPolicy,
  policyId,
  edit,
  showImportButton,
  jiraId,
  showAllErrors,
}) => {
  const dispatch = useDispatch();
  const fullWidth = true;
  const maxWidth = "md";
  const [deletedById, setDeletedById] = useState("");

  const [data, setData] = useState([]);

  const [exportData, setExportData] = useState([]);

  const [sourceBillTypeLkpData, setsourceBillTypeLkpData] = useState([]);
  const [openBillType, setopenBillType] = useState(false);
  const [popup, setPopUp] = useState(false);
  const [postPopup, setpostPopup] = useState(false);
  const [selectedData, setSelectedData] = useState("");
  const [unMatchedBillType, setUnMatchedBillType] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [updateData, setUpdateData] = useState(false);
  const policyFields: NewPolicyFormFieldState = useSelector(
    (state: any) => state.policyFieldsRedux
  );
  const billTypeStateFields: BillTypeState = useSelector(
    (state: any) => state.billTypeTabFieldsRedux
  );
  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  const openDeletePopUp = () => {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setPopUp(true);
      setUpdateData(false);
    } else {
      validationPrompt();
    }
  };

  const openpostPopup = () => {

    if (changesTabFields.changesIsOpenB.length > 0) {
     
      setpostPopup(true);
      // setopenBillType(false);
      setUpdateData(false);
    } else {
      validationPrompt();
    }
  };
  const handletoclose = () => {
    setopenBillType(false);
    setPopUp(false);
    setpostPopup(false);
    setOpen(false);
  };
  const closePopUp = () => {
    setUpdateData(true);
    setPopUp(false);
  };

  useEffect(() => {
    if (policyId != null) {
      getPolicyBillTypeByPolicyId(dispatch, policyId);
    }
    getBillTypeData(dispatch);
    getPolicyBillTypeActionLkp(dispatch);
    getSourceBillTypeLkpData(dispatch);
  }, []);
  const billTypeLkpData = newpolicyState.getbilltypedata?.map((bd) => {
    return {
      label: bd.billTypeCode + "  -  " + bd.billTypeLinkDesc,
      value: bd.billTypeLinkKey,
    };
  });

  const billTypeActionLkpData = newpolicyState.getPolicyBillTypeActionLkp?.map(
    (p, i) => {
      return {
        label: p.policyBillTypeActionCode,
        value: p.policyBillTypeActionKey,
      };
    }
  );
  const gridRef = useRef(null);
  const exportd = useRef<any>([]);

  useEffect(() => {
    if (newpolicyState.policyBillTypeData.length > 0) {
            setData(newpolicyState.policyBillTypeData);
      exportd.current = newpolicyState.policyBillTypeData.map((k) => {
        return {
          policyId: k.policyId,
          billType: k.billType,
          billTypeDesc: k.billTypeDesc,
        };
      });
      setExportData(exportd.current);
      setNumberOfRows(newpolicyState.policyBillTypeData.length);
      setUpdateData(true);
    }
  }, [newpolicyState.policyBillTypeData]);

  useEffect(() => {
    let sourceBillTypeLkpData1 = newpolicyState.getSourceBillTypeLkpData?.map(
      (bd, i) => {
        return {
          billTypeLkp: bd.billType,
          billTypeDescLkp: bd.billTypeDesc,
          inpatientB: bd.inpatientB,
          startDate: bd.startDate,
          endDate: bd.endDate,
          claimTypeMatch: bd.claimTypeMatch,
        };
      }
    );

    setsourceBillTypeLkpData(sourceBillTypeLkpData1);
  }, [newpolicyState.getSourceBillTypeLkpData]);

  useEffect(() => {
    let obj = [];
    var d = require("lodash");
    obj = d.differenceWith(sourceBillTypeLkpData, data, function (s, d) {
      return s["billTypeLkp"] === d["billType"];
    });
    setUnMatchedBillType(obj);
  }, [data, sourceBillTypeLkpData]);

  const columnDefs = [
    {
      field: "billType",
      headerName: "Bill Type",
      headerTooltip: "Bill Type",
    },
    {
      field: "billTypeDesc",
      headerName: "Bill Type Desc",
      headerTooltip: "Bill Type Desc",
    },
    {
      headerName: "Action",
      minWidth: 130,
      cellRenderer: (row) => {
        return (
          <ButtonGroup>
            <CustomButton
              disabled={fromViewPolicy}
              variant="contained"
              style={{
                height: 18,
                marginTop: 1,
                fontSize: "11px",
                textTransform: "capitalize",
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => {
                setDeletedById(row.data.policyBillTypeKey);
                openDeletePopUp();
              }}
            >
              Delete
            </CustomButton>
          </ButtonGroup>
        );
      },
    },
  ];

  const billTypeColmn = [
    {
      field: "billTypeLkp",
      headerName: "Bill Type",
      minWidth: 100,
      headerTooltip: "Bill Type",
      checkboxSelection: true,
    },
    {
      field: "billTypeDescLkp",
      headerName: "Bill Type Desc",
      minWidth: 100,
      headerTooltip: "Bill Type Desc",
    },
  ];

  useEffect(() => {
    if (policyId != null) {
      getChangesId(dispatch, policyId);
    }
  }, [policyId]);



  function billTypeData() {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setOpen(true);
    } else {
      validationPrompt();
    }
    setSelectedFile(undefined);
  }

  const openPopUp = () => {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setopenBillType(true);
    } else {
      validationPrompt();
    }
  };

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };
  ModuleRegistry.registerModules(AllCommunityModules);

  let filteredData = [];

  const onGridReady = async (params) => {
    gridRef.current = params.api;
    const dataSource = {
      rowCount: null,
      getRows: async (params) => {
        try {
          let sortType = "";
          let sortableColumn = "";
          let BillType = {};
          let rows: any = [];
          if (!(params.filterModel == null || undefined)) {
            BillType = {
              billType: params.filterModel.billType
                ? params.filterModel.billType.filter
                : "",
              billTypeDesc: params.filterModel.billTypeDesc
                ? params.filterModel.billTypeDesc.filter
                : "",
              isSort: sortType != "" ? sortType : "",
              sortColumn: sortableColumn != "" ? sortableColumn : "",
            };
          }

          let StringData = [];
          if (filteredData.length == 0 && policyId) {
            filteredData = await getPolicyBillTypeByPolicyId(dispatch, policyId);
          }
          if (
            BillType["billType"].length > 0 ||
            BillType["billTypeDesc"].length > 0
          ) {
            StringData = checkBillTypeData(BillType);
            filteredData = StringData;
          } else {
            if (policyId) {
              rows = await getPolicyBillTypeByPolicyId(dispatch, policyId);
              filteredData = rows;
            }
          }
          if (filteredData.length == 0) {
            CustomSwal("info", "No data found", navyColor, "Ok", "");
          }

          let exportd = filteredData.map((k) => {
            return {
              policyId: k.policyId,
              billType: k.billType,
              billTypeDesc: k.billTypeDesc,
            };
          });
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
        } catch (error) {
          params.failCallback();
        }
      },
    };
    params.api?.setDatasource(dataSource);
  };

  const checkBillTypeData = (billType) => {
    let billTypeValues = billType["billType"]
      .split(/,(?=\S)|,$/)
      .filter(Boolean);
    let p = newpolicyState.policyBillTypeData.filter((k, i) => {
      if (
        billTypeValues.some((value) =>
          k.billType.toLowerCase().includes(value.toLowerCase())
        ) &&
        k.billTypeDesc
          .toLowerCase()
          .includes(billType["billTypeDesc"].toLowerCase())
      ) {
        return { k };
      }
    });
    return p;
  };

  const [numberOfRows, setNumberOfRows] = useState(0);

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
    const formData: FormData = new FormData();
    formData.append("uploadfile", selectedFile);
    let validation = handleUploadFile(selectedFile);
    if (validation) {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(selectedFile);
      fileReader.onload = async (e) => {
        let arrayBuffer: any = [];
        arrayBuffer = fileReader.result;
        let uploaddata = new Uint8Array(arrayBuffer);
        let arr = new Array();
        for (var i = 0; i != uploaddata.length; ++i)
          arr[i] = String.fromCharCode(uploaddata[i]);
        let bstr = arr.join("");
        let workbook = XLSX.read(bstr, { type: "binary" });
        let first_sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[first_sheet_name];
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        arraylist = arraylist.filter((row) => {
          // Check if any value in the row is non-null and non-empty
          return Object.values(row).some(
            (value) => value !== null && value !== ""
          );
        });

        let array: any = [];
        let exportarray: any = [];
        array = exportarray.concat(arraylist);
        let uniqueCodes = [];
        let error = false;
        array.forEach((o, i) => {
          if (!checkIsPresent(uniqueCodes, o.BILLTYPE + "-" + o.BILLTYPEDESC)) {
            uniqueCodes.push(o.BILLTYPE + "-" + o.BILLTYPEDESC);
          } else {
            setOpen(false);
            error = true;
            CustomSwal(
              "error",
              "Duplicate Row at " +
                (i + 2) +
                " - " +
                "BILLTYPE is : " +
                o.BILLTYPE +
                " and " +
                "BILLTYPEDESC is : " +
                o.BILLTYPEDESC,
              navyColor,
              "Ok",
              "Error"
            );
          }
        });
        let importPolicyId = undefined;
        array.forEach((d) => {
          if (policyFields.policyId !== d.POLICYID) {
            importPolicyId = d.POLICYID;
            if (d.POLICYID === undefined) {
              importPolicyId = -1;
            }
          } else if (importPolicyId === undefined) {
            importPolicyId = policyId;
          }
        });
        if (importPolicyId === policyId) {
          if (!error) {
            setOpen(false);
            await uploadBillTypeData(dispatch, formData, policyId);

            if (gridRef.current) {
              const params = {
                api: gridRef.current,
              };
              await onGridReady(params);
            }
          }
        } else {
          setOpen(false);
          if (importPolicyId == -1) {
            CustomSwal(
              "error",
              "Policy Id is blank.",
              navyColor,
              "Ok",
              "Error"
            );
          } else {
            CustomSwal(
              "error",
              "Policy Id not matched.",
              navyColor,
              "Ok",
              "Error"
            );
          }
        }
      };
    }
  };

  function checkIsPresent(uniqueCodes, value) {
    const index = uniqueCodes.indexOf(value);
    return index >= 0;
  }

  let tableData = [];
  const onSelectionChanged = async (event) => {
    let a = event.api.getSelectedRows();
    tableData.push(a);
    setSelectedData(a);
  };

  return (
    <>
      {fromViewPolicy || edit ? (
        <div style={{ marginTop: "-20px" }}>
          <IconButton
            onClick={openPopUp}
            style={{
              backgroundColor: navyColor,
              float: "right",
              color: "white",
              padding: 5,
              opacity: fromViewPolicy ? 0.7 : 1,
              pointerEvents: fromViewPolicy ? "none" : "visible",
            }}
            disabled={edit && fromViewPolicy}
          >
            <Add />
          </IconButton>
        </div>
      ) : undefined}
      <GridContainer>
        <GridItem sm={4} md={4} xs={4}>
          {fromViewPolicy || edit ? (
            <div
              style={{
                marginRight: 60,
                marginTop: "10px",
              }}
            >
              <CustomSelect
                isDisabled={!edit ? undefined : fromViewPolicy}
                options={billTypeLkpData}
                error={
                  showAllErrors
                    ? isFieldInvalid(billTypeStateFields.billTypeLink)
                    : false
                }
                labelText={"Bill Type Link"}
                hoverData={billTypeLkpData.map((l) => {
                  return l.label;
                })}
                onSelect={(e) => {
                  dispatch({
                    type: BILL_TYPE_FIELDS,
                    payload: { billTypeLink: e },
                  });
                }}
                value={billTypeStateFields.billTypeLink}
              ></CustomSelect>
              <CustomSelect
                isDisabled={!edit ? undefined : fromViewPolicy}
                hoverData={billTypeActionLkpData.map((l) => {
                  return l.label;
                })}
                error={
                  showAllErrors
                    ? isFieldInvalid(billTypeStateFields.billTypeAction)
                    : false
                }
                options={billTypeActionLkpData}
                labelText={"Bill Type Action"}
                onSelect={(e) => {
                  dispatch({
                    type: BILL_TYPE_FIELDS,
                    payload: { billTypeAction: e },
                  });
                }}
                value={billTypeStateFields.billTypeAction}
              ></CustomSelect>
            </div>
          ) : undefined}
        </GridItem>

        <GridItem sm={8} md={8} xs={8} spacing={12}>
          {data.length > 0 && updateData == true ? (
            <div
              style={{
                height: window.innerHeight / 2.6,
              }}
            >
              <AgGrids
                columnDefs={columnDefs}
                ref={gridRef}
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

              <small
                style={{ position: "relative", fontSize: "12px", top: "7px" }}
              >
                Number of rows : {numberOfRows}
              </small>
            </div>
          ) : undefined}
        </GridItem>
      </GridContainer>
      {fromViewPolicy || edit ? (
        <div
          style={{
            float: "right",
            opacity: fromViewPolicy ? 0.7 : 1,
            pointerEvents: fromViewPolicy ? "none" : "visible",
            marginTop: "30px",
          }}
        >
          <ButtonGroup>
            <CustomButton
              variant={"contained"}
              disabled={!showImportButton}
              onClick={() => {
                billTypeData();
              }}
              onChange={(event) => {}}
              style={{
                backgroundColor: navyColor,
                color: "white",
                margin: 5,
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              Import
            </CustomButton>
            {data.length > 0 ? (
              <CustomButton
                variant={"contained"}
                onClick={() => {
                  exportedExcelFileData(
                    exportData,
                    policyFields.policyNumber + "/" + policyFields.version,
                    "BillType"
                  );
                }}
                onChange={(event) => {}}
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  margin: 5,
                  padding: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                Export
              </CustomButton>
            ) : undefined}
          </ButtonGroup>
        </div>
      ) : undefined}

<>
  {/* Dialogbox for openBillType & open (Upload Source/File) */}
  {(openBillType || open) && (
    <Dialogbox
    fullWidth={openBillType ? fullWidth : undefined}
    maxWidth={openBillType ? maxWidth : undefined}
      open={openBillType || open}
      onClose={handletoclose}
      style={{ overflowY: "scroll" }}
      disableBackdropClick={true}
      title={openBillType ? "Policy Bill Type" : "Upload Source File"}
      message={
        openBillType ? (
          <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
            <AgGrids
              columnDefs={billTypeColmn}
              rowData={unMatchedBillType}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        ) : (
          <input
            type="file"
            accept=".xlsx"
            onChange={(event) => {
              const file = event.target.files[0];
              setSelectedFile(file);
              handleUploadFile(file);
            }}
          />
        )
      }
      actions={
        <ButtonGroup style={{ marginTop: openBillType ? "-30px" : "0" }}>
          {openBillType ? (
            <>
              <CustomButton
                variant="contained"
                onClick={openpostPopup}
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
                onClick={handletoclose}
                variant="contained"
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
            </>
          ) : (
            <>
              {selectedFile && (
                <CustomButton
                  onClick={onFileUpload}
                  style={{
                    backgroundColor: navyColor,
                    color: "white",
                    marginRight: 10,
                    padding: 4,
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  Upload
                </CustomButton>
              )}
              <CustomButton
                onClick={handletoclose}
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
            </>
          )}
        </ButtonGroup>
      }
    />
  )}

  {/* Dialogbox for postPopup (Add Confirm) and popup (Delete Confirm) */}
  {(postPopup || popup) && (
    <Dialogbox
      open={postPopup || popup}
      onClose={handletoclose}
      disableBackdropClick={true}
      title="Confirm"
      message={
        postPopup
          ? "Would you like to Add This Record?"
          : "Would you like to Delete This Record?"
      }
      actions={
        <ButtonGroup>
          <CustomButton
            onClick={() => {
              handletoclose();
              if (postPopup) {
                postBillTypeData(dispatch, selectedData, policyId);
              } else {
                DeleteBillTypeData(dispatch, deletedById, policyId);
              }
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
            onClick={handletoclose}
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
  )}
</>

    </>
  );
};
export default BillType;

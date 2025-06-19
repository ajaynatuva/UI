import { ButtonGroup, Grid, IconButton } from "@material-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dangerColor, navyColor } from "../../../assets/jss/material-kit-react";
import CustomButton from "../../../components/CustomButtons/CustomButton";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import AgGrids from "../../../components/TableGrid/AgGrids";
import Moment from "moment";

// import { NewPolicyFormState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyFormReducer";
import { NewPolicyState } from "../../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { Add } from "@material-ui/icons";
import Dialogbox from "../../../components/Dialog/DialogBox";
import GridContainer from "../../../components/Grid/GridContainer";
import GridItem from "../../../components/Grid/GridItem";
import React from "react";

import { LookUpState } from "../../../redux/reducers/LookUpReducer/LookUpReducer";
import {
  getConditionTypeData,
  getPolicyConditionTypeData,
  postConditionTypeData,
  DeleteConditionTypeData,
} from "../../../redux/ApiCalls/NewPolicyTabApis/ConditionCodeTabApis";
import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import swal from "sweetalert2";
import { fetchLookupData } from "../../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { CONDITION_CODE_LKP } from "../../LookUps/LookUpConsts";
import { isFieldInvalid, validationPrompt } from "../newPolicyUtils";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { CONDITION_CODE_FIELDS } from "../../../redux/ApiCalls/NewPolicyTabApis/AllPolicyConstants";
import { conditionCodeTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ConditionCodeTabFieldsReducer";
import {
  getChangesById,
  getChangesId,
} from "../../../redux/ApiCalls/NewPolicyTabApis/ChangesTabApis";
import { changesTabFieldState } from "../../../redux/reducers/NewPolicyTabReducers/ChangesTabFieldsReducer";

const _ = require("lodash");

const ConditionCode = ({
  fromViewPolicy,
  policyId,
  edit,
  jiraId,
  showAllErrors,
}) => {
  const dispatch = useDispatch();
  const fullWidth = true;
  const maxWidth = "md";
  const [deletedByKey, setDeletedByKey] = useState("");

  const [policyConditionData, setpolicyConditionData] = useState([]);
  const [updatePolicyConditionData, setUpdatePolicyConditionData] =
    useState(false);

  const [sourceConditionTypeLkpData, setsourceConditionTypeLkpData] = useState(
    []
  );
  const [openBillType, setopenBillType] = useState(false);
  const [popup, setPopUp] = useState(false);
  const [postPopup, setpostPopup] = useState(false);
  const [billTypeKeyPopup, setbillTypeKeyPopup] = useState(false);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [selectedData, setSelectedData] = useState("");
  const [changesData, setChangesData] = useState([]);
  const [selectedPolicyAction, setSelectedPolicyAction] = useState(undefined);
  const [selectedActionValue, setselectedActionValue] = useState("");
  const [unMatchedBillType, setUnMatchedBillType] = useState([]);
  const [open, setOpen] = React.useState(false);

  // const formState: NewPolicyFormState = useSelector(
  //   (state: any) => state.newPolicyForm
  // );

  const conditionCodeTabFields: conditionCodeTabFieldState = useSelector(
    (state: any) => state.conditionCodeTabFieldsRedux
  );

  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const changesTabFields: changesTabFieldState = useSelector(
    (state: any) => state.ChangesTabFieldsRedux
  );

  useEffect(() => {
    if (policyId != null) {
      getChangesId(dispatch, policyId);
    }
  }, [policyId]);



  const openDeletePopUp = () => {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setPopUp(true);
      setUpdatePolicyConditionData(false);
    } else {
      validationPrompt();
    }
  };

  const openpostPopup = () => {
    setpostPopup(true);
    setUpdatePolicyConditionData(false);
  };

  const handletoclose = () => {
    setopenBillType(false);
    setPopUp(false);
    setpostPopup(false);
    setbillTypeKeyPopup(false);
    setOpen(false);
  };

  const closePopUp = () => {
    setUpdatePolicyConditionData(true);
    setPopUp(false);
    setOpen(false);
  };

  const openPopUp = () => {
    if (changesTabFields.changesIsOpenB.length > 0) {
      setopenBillType(true);
    } else {
      CustomSwal("error", "Please create Jira Ticket.", navyColor, "OK", "");
    }
  };

  let id;

  const columnDefs = useMemo(
    () => [
      {
        field: "condCode",
        headerName: "Condition Code",
        headerTooltip: "Condition Code",
        cellRenderer: (props) => {
          if (props.value !== undefined) {
            return props.value;
          } else {
            return (
              <>
                <img src="https://www.ag-grid.com/example-assets/loading.gif" />
              </>
            );
          }
        },
      },
      {
        field: "condDesc",
        headerName: "Condition Code Desc",
        headerTooltip: "Condition Code Desc",
      },
      {
        headerName: "Action",
        minWidth: 130,
        filter: false,
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
                  id = row.data.key;
                  setDeletedByKey(row.data.key);
                  openDeletePopUp();
                }}
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
  const ConditionLKPColumns = useMemo(
    () => [
      {
        field: "condCode",
        headerName: "Cond Code",
        minWidth: 109,
        headerTooltip: "Cond Code",
        checkboxSelection: true,
      },

      {
        field: "condDesc",
        headerName: "Cond Desc",
        minWidth: 83,
        headerTooltip: "Cond Desc",
      },
    ],
    []
  );

  useEffect(() => {
    if (updatedState.condition.length == 0) {
      let lkpName = CONDITION_CODE_LKP;
      fetchLookupData(dispatch, lkpName);
    }
    getConditionTypeData(dispatch);

    if (policyId != null) {
      getPolicyConditionTypeData(dispatch, policyId);
    }
  }, []);

  useEffect(() => {
    const tableData = conditionCodeTabFields?.conditionTabTableData;
    if (!tableData) return;

    const newData = tableData.map((item) => ({
      key: item.policyConditionCodeKey,
      condCode: item.conditionCode,
      condDesc: item.conditionCodeDesc,
    }));

    // Update only if newData is different from the current state.
    setpolicyConditionData((prevData) =>
      JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData
    );

    setNumberOfRows((prevRows) =>
      prevRows !== newData.length ? newData.length : prevRows
    );

    // If updatePolicyConditionData is meant to be set only once,
    // update it conditionally:
    setUpdatePolicyConditionData((prev) => (prev ? prev : true));
  }, [conditionCodeTabFields?.conditionTabTableData]);

  useEffect(() => {
    if (!updatedState.condition || !policyConditionData) return;

    const conditionCodeLkpData = updatedState.condition.map((bd) => ({
      condId: bd.condId,
      condCode: bd.condCode,
      condDesc: bd.condDesc,
      startDate: Moment(bd.startDate).format("MM-DD-YYYY"),
      endDate: Moment(bd.endDate).format("MM-DD-YYYY"),
    }));

    const unMatchedData = require("lodash").differenceWith(
      conditionCodeLkpData,
      policyConditionData,
      (s, d) => s["condDesc"] === d["condDesc"]
    );

    setsourceConditionTypeLkpData(conditionCodeLkpData);
    setUnMatchedBillType(unMatchedData);
  }, [updatedState.condition, policyConditionData]);

  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  ModuleRegistry.registerModules(AllCommunityModules);

  const gridRef = useRef(null);

  const onGridReady = (params) => {
    let filteredData = [];

    const dataSource = {
      rowCount: null,
      getRows: async (params) => {
        try {
          let sortType = "";
          let sortableColumn = "";
          let ConditionType = {};
          if (!(params.filterModel == null || undefined)) {
            ConditionType = {
              condCode: params.filterModel.condCode
                ? params.filterModel.condCode.filter
                : "",
              condDesc: params.filterModel.condDesc
                ? params.filterModel.condDesc.filter
                : "",
              isSort: sortType != "" ? sortType : "",
              sortColumn: sortableColumn != "" ? sortableColumn : "",
            };
          }

          let StringData = [];
          if (filteredData.length == 0) {
            filteredData = policyConditionData;
          }
          if (
            ConditionType["condCode"].length > 0 ||
            ConditionType["condDesc"].length > 0
          ) {
            StringData = checkConditionTypeData(ConditionType);
            filteredData = StringData;
          } else {
            filteredData = policyConditionData;
          }
          if (filteredData.length == 0) {
            CustomSwal("info", "No data found", navyColor, "Ok", "");
          }
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

  const checkConditionTypeData = (ConditionType) => {
    let ConditionTypeValues = ConditionType["condCode"]
      .split(/,(?=\S)|,$/)
      .filter(Boolean);
    let conditionTypeData = [];
    newpolicyState.policyConditiontypedata.filter((k, i) => {
      if (
        ConditionTypeValues.some((value) => k.conditionCode == value) &&
        k.conditionCodeDesc
          .toLowerCase()
          .includes(ConditionType["condDesc"].toLowerCase())
      ) {
        conditionTypeData.push({
          condCode: k.conditionCode,
          condDesc: k.conditionCodeDesc,
        });
      }
    });
    return conditionTypeData;
  };

  const ConditionTypeActionLkpData = newpolicyState.getConditionTypeData?.map(
    (bd) => {
      return {
        label: bd.conditionCode,
        value: bd.condCodeKey,
      };
    }
  );

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
                marginTop: "10px",
              }}
            >
              <CustomSelect
                isDisabled={!edit ? undefined : fromViewPolicy}
                hoverData={ConditionTypeActionLkpData.map((l) => {
                  return l.label;
                })}
                error={
                  showAllErrors
                    ? isFieldInvalid(conditionCodeTabFields.conditionCodeAction)
                    : false
                }
                options={ConditionTypeActionLkpData}
                labelText={"Condition Code Applicable"}
                onSelect={(e) => {
                  if (e == null) {
                    dispatch({
                      type: CONDITION_CODE_FIELDS,
                      payload: { conditionCodeAction: undefined },
                    });
                    setSelectedPolicyAction(undefined);
                  } else {
                    dispatch({
                      type: CONDITION_CODE_FIELDS,
                      payload: { conditionCodeAction: e },
                    });
                    setSelectedPolicyAction(e);
                  }
                }}
                value={conditionCodeTabFields.conditionCodeAction}
              ></CustomSelect>
            </div>
          ) : undefined}
        </GridItem>

        <GridItem sm={8} md={8} xs={8} spacing={12}>
          {policyConditionData.length > 0 &&
          updatePolicyConditionData == true ? (
            <div
              style={{
                height: window.innerHeight / 2.6,
                opacity: fromViewPolicy ? 0.7 : 1,
              }}
            >
              <AgGrids
                columnDefs={columnDefs}
                onFilterChanged={onFilterChanged}
                ref={gridRef}
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
              {policyConditionData.length > 0 ? (
                <small style={{ position: "relative", fontSize: "12px" }}>
                  Number of rows : {numberOfRows}
                </small>
              ) : undefined}
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
          }}
        ></div>
      ) : undefined}

      <Dialogbox
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openBillType}
        onClose={handletoclose}
        style={{ overflowY: "scroll" }}
        disableBackdropClick={true}
        title={"Policy Condition Type"}
        message={
          <div style={{ height: window.innerHeight / 1.8, marginTop: "-10px" }}>
            <AgGrids
              columnDefs={ConditionLKPColumns}
              rowData={unMatchedBillType}
              rowSelection={"multiple"}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        }
        actions={
          <ButtonGroup style={{ marginTop: "-30px" }}>
            <CustomButton
              variant={"contained"}
              onClick={() => {
                openpostPopup();
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
                handletoclose();
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
              No
            </CustomButton>
          </ButtonGroup>
        }
      />

      <Dialogbox
        open={popup || postPopup}
        onClose={handletoclose}
        disableBackdropClick={true}
        title={"Confirm"}
        message={
          postPopup
            ? "Would you like to Add This Record ?"
            : "Would you like to Delete This Record ?"
        }
        actions={
          <ButtonGroup>
            <CustomButton
              onClick={() => {
                if (postPopup) {
                  handletoclose();
                  postConditionTypeData(dispatch, selectedData, policyId);
                } else if (popup) {
                  DeleteConditionTypeData(dispatch, deletedByKey, policyId);
                  handletoclose();
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
              onClick={postPopup ? handletoclose : closePopUp}
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
    </>
  );
};
export default ConditionCode;

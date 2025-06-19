import { IconButton } from "@material-ui/core";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navyColor } from "../../assets/jss/material-kit-react";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "../../components/FontFamily/fontFamily.css";
import "../LookUps/LookUp.css";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { Add } from "@material-ui/icons";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import Paragraph from "../../components/Paragraph/Paragraph";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import { UserState } from "../../redux/reducers/UserReducer/UserReducer";
import "../LookUps/LookUp.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  BILL_TYPE_LKP,
  BO_TYPE_LKP,
  BW_TYPE_LKP,
  CCI_DEVIATIONS,
  CCI_LKP,
  CCI_RATIONALE_LKP,
  CONDITION_CODE_LKP,
  MAX_UNITS_LKP,
  MAX_UNITS_TYPES,
  MIN_MAX_AGE_LKP,
  MODIFIER_INTERACTION_LKP,
  MODIFIER_PAY_PERCENTAGE_DATA,
  MODIFIER_PAY_PERCENTAGE_LKP,
  MODIFIER_PAY_PERCENTAGE_LKP_DATA,
  MODIFIER_PRIORITY_LKP,
  MOD_LKP,
  MUE_RATIONALE_LKP,
  POLICY_CATEGORY_LKP,
  POS_LKP,
  REASON_CODE_LKP,
  REVENUE_CODE_LKP,
  SAME_OR_SIMILAR_CODE_LKP,
  SPECS_LKP,
  SUB_SPEC_LKP,
} from "./LookUpConsts";
import { AccessForExport } from "../../redux/ApiCallAction/Validations/AccessForExport";
import { exportedExcelFileData } from "../../components/ExportExcel/ExportExcelFile";
import { fetchLookupData , ModifierPayPercentageData} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import ShowSpinnerInDialogBox from "../../components/Spinner/ShowSpinnerInDialogBox";
import { useLocation, useNavigate } from "react-router-dom";
import CciDeviationEditPopUp from "./CciDeviationEditPopUp";

//Load components only when they are needed
const BillTypeLookup = lazy(() => import("./BillTypeLookup"));
const BoTypeLookup = lazy(() => import("./BoTypeLookup"));
const BwTypeLookup = lazy(() => import("./BwTypeLookup"));
const CciLookup = lazy(() => import("./CciLookup"));
const CciRationaleLookup = lazy(() => import("./CciRationaleLookup"));
const ConditionCodeLookup = lazy(() => import("./ConditionCodeLookup"));
const MaxUnitsLookup = lazy(() => import("./MaxUnitsLookup"));
const MaxUnitsType = lazy(() => import("./MaxUnitsType"));
const MinMaxAgeLookup = lazy(() => import("./MinMaxAgeLookup"));
const ModLookup = lazy(() => import("./ModLookup"));
const ModifierInteractionLookup = lazy(
  () => import("./ModifierInteractionLookup")
);
const ModifierPayPercentage = lazy(() => import("./ModifierPayPercentage"));
const ModifierPriorityLookUp = lazy(() => import("./ModifierPriorityLookup"));
const MueRationaleLkp = lazy(() => import("./MueRationaleLkp"));
const PolicyCategoryLookup = lazy(() => import("./PolicyCategoryLookup"));
const PosLookup = lazy(() => import("./PosLookup"));
const ReasonCodeLookup = lazy(() => import("./ReasonCodeLookup"));
const RevenueCodeLookup = lazy(() => import("./RevenueCodeLookup"));
const SameOrSimilarCodeLookup = lazy(() => import("./SameOrSimilarCodeLookup"));
const SpecLookup = lazy(() => import("./SpecLookup"));
const SubSpecLookup = lazy(() => import("./SubSpecLookup"));
const CciDeviations = lazy(() => import("./CciDeviations"));

const _ = require("lodash");
function alphaOrder(a, b) {
  const name1 = a.label.toUpperCase();
  const name2 = b.label.toUpperCase();

  let comparison = 0;

  if (name1 > name2) {
    comparison = 1;
  } else if (name1 < name2) {
    comparison = -1;
  }
  return comparison;
}

const selectedLKPOptions = [
  { value: SPECS_LKP, label: SPECS_LKP },
  { value: SUB_SPEC_LKP, label: SUB_SPEC_LKP },
  { value: MIN_MAX_AGE_LKP, label: MIN_MAX_AGE_LKP },
  { value: REVENUE_CODE_LKP, label: REVENUE_CODE_LKP },
  { value: BILL_TYPE_LKP, label: BILL_TYPE_LKP },
  { value: CONDITION_CODE_LKP, label: CONDITION_CODE_LKP },
  { value: MOD_LKP, label: MOD_LKP },
  { value: POS_LKP, label: POS_LKP },
  { value: POLICY_CATEGORY_LKP, label: POLICY_CATEGORY_LKP },
  { value: REASON_CODE_LKP, label: REASON_CODE_LKP },
  { value: CCI_RATIONALE_LKP, label: CCI_RATIONALE_LKP },
  { value: CCI_LKP, label: CCI_LKP },
  { value: MUE_RATIONALE_LKP, label: MUE_RATIONALE_LKP },
  { value: BO_TYPE_LKP, label: BO_TYPE_LKP },
  { value: BW_TYPE_LKP, label: BW_TYPE_LKP },
  { value: MAX_UNITS_TYPES, label: MAX_UNITS_TYPES },
  { value: MAX_UNITS_LKP, label: MAX_UNITS_LKP },
  { value: MODIFIER_PRIORITY_LKP, label: MODIFIER_PRIORITY_LKP },
  { value: MODIFIER_INTERACTION_LKP, label: MODIFIER_INTERACTION_LKP },
  { value: SAME_OR_SIMILAR_CODE_LKP, label: SAME_OR_SIMILAR_CODE_LKP },
  { value: MODIFIER_PAY_PERCENTAGE_LKP, label: MODIFIER_PAY_PERCENTAGE_LKP },
  { value: CCI_DEVIATIONS, label: CCI_DEVIATIONS },
];

const ViewConfig = (props) => {
  const [selectedLookup, setSelectedLookUp] = useState("");
  const [selectedModifierPayLkp, setSelectedModifierPayLkp] = useState("");
  const [selectedCCIDev, setSelectedCCIDev] = useState(false);
  const [saveLkpValues, setSaveLkpValues] = useState([]);

  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [openLkp, setOpenLkp] = React.useState(false);
  const roleState: UserState = useSelector((state: any) => state.userReducer);

  const navigate = useNavigate();

  let roles = roleState.roleName;
  let Role = JSON.stringify(roles);
  let adminIdx = Role.toLocaleLowerCase().search("admin");

  function openLookUp() {
    setOpenLkp(true);
  }

  useEffect(() => {
    if (
      (selectedLookup === CCI_DEVIATIONS && state?.refresh) ||
      state?.selectedLkp === CCI_DEVIATIONS
    ) {
      setSelectedLookUp(CCI_DEVIATIONS);
    }
  }, [props.lookUpValue, state?.refresh, selectedLookup]);

  const showAddIcon = () => {
    let flag = false;
    if (adminIdx > 0 && selectedLookup) {
      if (
        selectedLookup == "Modifier Pay Percentage Lkp" ||
        selectedLookup == "Modifier Interaction" ||
        selectedLookup == "Modifier Priority" ||
        selectedLookup == "Same Or Similar Code" ||
        selectedLookup == "CCI Deviations"
      ) {
        flag = false;
      } else {
        flag = true;
      }
    } else {
      flag = false;
    }
    return flag;
  };

  const fromLkpchilds = (msg) => {
    setOpenLkp(msg);
  };
  const [LookUpColums, setLookUpColums] = useState([]);
  const [LookUpRowData, setLookUpRowData] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const gridApiRef = useRef(null);

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };
  const onFilterChanged = (params) => {
    setNumberOfRows(params.api.getDisplayedRowCount());
    params.api.redrawRows();
    params.api.refreshClientSideRowModel("filter");
    params.api.refreshCells({ force: true });
    params.api.refreshHeader();
  };

  const allLookUpColumns = (col) => {
    setLookUpColums(col);
  };
  const allLookUpRowData = (row) => {
    setLookUpRowData(row);
  };
  function showTable() {
    let flag = false;
    if (selectedLookup && LookUpRowData.length > 0) {
      flag = true;
    }
    return flag;
  }
  const modifierPayPercentageLkp =
    updatedState.getModifierPayPercentageLkp?.map((mp) => {
      return { label: mp.mppKey + "-" + mp.description, value: mp.mppKey };
    });
  useEffect(() => {
    if (updatedState.getModifierPayPercentageLkp.length === 0) {
      let lkpName = MODIFIER_PAY_PERCENTAGE_LKP_DATA;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);
  const gridIconStyle = {
    position: "absolute",
    float: "right",
    top: "121px",
    display: "inline",
    right: "100px",
  };
  function showLookUps(selectedLkpValue, selectedModifierPayLkp) {
    const lkpInput = {
      selectedLookup,
      fromLkpchilds,
      openLkp,
      allLookUpColumns,
      allLookUpRowData,
      setSelectedCCIDev,
      setSaveLkpValues,
      Role,
      ...(selectedModifierPayLkp && { selectedModifierPayLkp }), // Conditionally add for ModifierPayPercentage
    };

    const lookupComponents = {
      [SPECS_LKP]: <SpecLookup lkpInput={lkpInput} />,
      [SUB_SPEC_LKP]: <SubSpecLookup lkpInput={lkpInput} />,
      [MIN_MAX_AGE_LKP]: <MinMaxAgeLookup lkpInput={lkpInput} />,
      [BILL_TYPE_LKP]: <BillTypeLookup lkpInput={lkpInput} />,
      [REVENUE_CODE_LKP]: <RevenueCodeLookup lkpInput={lkpInput} />,
      [CONDITION_CODE_LKP]: <ConditionCodeLookup lkpInput={lkpInput} />,
      [MOD_LKP]: <ModLookup lkpInput={lkpInput} />,
      [POS_LKP]: <PosLookup lkpInput={lkpInput} />,
      [POLICY_CATEGORY_LKP]: <PolicyCategoryLookup lkpInput={lkpInput} />,
      [REASON_CODE_LKP]: <ReasonCodeLookup lkpInput={lkpInput} />,
      [CCI_RATIONALE_LKP]: <CciRationaleLookup lkpInput={lkpInput} />,
      [MUE_RATIONALE_LKP]: <MueRationaleLkp lkpInput={lkpInput} />,
      [BO_TYPE_LKP]: <BoTypeLookup lkpInput={lkpInput} />,
      [BW_TYPE_LKP]: <BwTypeLookup lkpInput={lkpInput} />,
      [MAX_UNITS_TYPES]: <MaxUnitsType lkpInput={lkpInput} />,
      [MODIFIER_PAY_PERCENTAGE_LKP]: (
        <ModifierPayPercentage lkpInput={lkpInput} />
      ),
      [CCI_LKP]: <CciLookup lkpInput={lkpInput} />,
      [MAX_UNITS_LKP]: <MaxUnitsLookup lkpInput={lkpInput} />,
      [MODIFIER_PRIORITY_LKP]: <ModifierPriorityLookUp lkpInput={lkpInput} />,
      [MODIFIER_INTERACTION_LKP]: (
        <ModifierInteractionLookup lkpInput={lkpInput} />
      ),
      [SAME_OR_SIMILAR_CODE_LKP]: (
        <SameOrSimilarCodeLookup lkpInput={lkpInput} />
      ),
      [CCI_DEVIATIONS]: <CciDeviations lkpInput={lkpInput} />,
    };
    return (
      <Suspense fallback={ShowSpinnerInDialogBox(true)}>
        {lookupComponents[selectedLkpValue] || null}{" "}
        {/* Render the component if found, else render null */}
      </Suspense>
    );
  }
  function showOption() {
    let flag = false;
    if (selectedLookup == MODIFIER_PAY_PERCENTAGE_LKP) {
      flag = true;
    }
    return flag;
  }

  const ModifyingCCIdevations = () => {
    const cciDevData = LookUpRowData.map((d) => {
      return {
        Client: d.Client,
        ClientGroup: d.ClientGroup,
        state: d.state,
        lob: d.lobKey,
        claimType: d.claimType,
        cciKey: d.cciKey,
        column_i: d.column_i,
        column_ii: d.column_ii,
        startDate: d.startDate,
        endDate: d.endDate,
        cciRationale: d.cciRationaleKey,
        allowModifier: d.allowModB,
        devStartDate: d.devStartDate,
        devEndDate: d.devEndDate,
        jiraId: d.jiraId,
        jiraDesc: d.jiraDesc,
        comments: d.comments,
        userId: d.userId,
        status: d.deletedB === true ? "Disabled" : "Active",
      };
    });
    return cciDevData;
  };

  return (
    <Template>
      <div className="row">
        <div className="col-sm-4" style={{ position: "relative", top: "7px" }}>
          <CustomHeader labelText={"View Configuration"} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3">
          <CustomSelect
            options={selectedLKPOptions.sort(alphaOrder)}
            onSelect={(event) => {
              if (event != null) {
                setSelectedLookUp(event.value);
                setNumberOfRows(0);
              } else {
                setSelectedLookUp(null);
                if (selectedModifierPayLkp) {
                  setSelectedModifierPayLkp(null);
                }
                setLookUpRowData([]);
              }
            }}
            value={selectedLKPOptions.filter(function (option) {
              return option?.value == selectedLookup;
            })}
          />
        </div>
        {showOption() ? (
          <>
            <div
              className="col-sm-1"
              style={{ width: "6.7%", marginTop: "10px" }}
            >
              <Paragraph labelText={"MPP Key"} />
            </div>
            <div className="col-sm-3">
              <CustomSelect
                options={modifierPayPercentageLkp}
                onSelect={async (event) => {
                  if (event != null) {
                    await ModifierPayPercentageData(dispatch, event.value);
                    setSelectedModifierPayLkp(event.value);
                  } else {
                    setSelectedModifierPayLkp(null);
                    dispatch({
                      type: MODIFIER_PAY_PERCENTAGE_DATA,
                      payload: [],
                    });
                  }
                }}
                value={modifierPayPercentageLkp.filter(function (option) {
                  return option?.value == selectedModifierPayLkp;
                })}
              />
            </div>
          </>
        ) : (
          <div className="col-sm-3" />
        )}
        <div className="col-sm-6">
          {showAddIcon() ? (
            <IconButton
              onClick={openLookUp}
              style={{
                backgroundColor: navyColor,
                float: "right",
                color: "white",
                width: "32px",
                height: "32px",
                marginTop: "20px",
                marginRight: "20px",
              }}
            >
              <Add />
            </IconButton>
          ) : undefined}
        </div>
      </div>
      {showTable() ? (
        <div className="row">
          <div style={{ height: window.innerHeight / 1.5 }}>
            <AgGrids
              columnDefs={LookUpColums}
              gridIconStyle={gridIconStyle}
              onFilterChanged={onFilterChanged}
              rowData={LookUpRowData}
              suppressRowTransform={true}
              onGridReady={onGridReady} // Store API reference
            />
          </div>
          <div className="row">
            <small>
              Number of rows :{" "}
              {numberOfRows != 0 ? numberOfRows : LookUpRowData.length}
            </small>
          </div>
        </div>
      ) : undefined}
      {showTable() ? (
        <div className="row">
          <div className="col-sm-12">
            {AccessForExport(LookUpRowData, adminIdx) ? (
              <CustomButton
                style={{
                  backgroundColor: navyColor,
                  color: "white",
                  textTransform: "capitalize",
                  float: "right",
                  fontSize: 11,
                  padding: 4,
                  marginTop: -20,
                }}
                onClick={() => {
                  exportedExcelFileData(
                    selectedLookup == CCI_DEVIATIONS
                      ? ModifyingCCIdevations()
                      : LookUpRowData,
                    selectedLookup,
                    selectedLookup
                  );
                }}
              >
                export
              </CustomButton>
            ) : undefined}
          </div>
        </div>
      ) : undefined}
      <div className="row">
        <>{showLookUps(selectedLookup, selectedModifierPayLkp)}</>
      </div>
      {(state?.data || selectedCCIDev) && (
        <CciDeviationEditPopUp
          saveLkpValues={state?.data || saveLkpValues}
          setSelectedCCIDev={setSelectedCCIDev}
          navigate={navigate}
          flag={true}
          TotalData={LookUpRowData}
          isEdit={state?.data ? false : true}
        />
      )}
    </Template>
  );
};
export default ViewConfig;

import {
  AllCommunityModules,
  ModuleRegistry,
} from "@ag-grid-community/all-modules";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert2";
import { dangerColor, navyColor } from "../../assets/jss/material-kit-react";
import CustomButton from "../../components/CustomButtons/CustomButton";
import CustomCheckBox from "../../components/CustomCheckBox/CustomCheckBox";
import CustomHeader from "../../components/CustomHeaders/CustomHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomPaper from "../../components/CustomPaper/CustomPaper";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import AgGrids from "../../components/TableGrid/AgGrids";
import Template from "../../components/Template/Template";
import { getBwTypeData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { getMfsQuaterLoader } from "../../redux/ApiCalls/MetaLoaderApis/MetaLoaderApi";
import { MetaDataLoaderState } from "../../redux/reducers/MetaLoaderReducer/MetaDataLoaderReducer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import "../ViewMeta/ViewMeta.css";
import APCDateBindedData from "./APCDateBindedReferentialData";
import addOnCodesReferentialData from "./AddOnCodeReferentialData";
import BwPairsReferentialData from "./BwPairsReferentialData";
import CAPCDateBindedData from "./CAPCDateBindedReferentialData";
import CPTHcpcsRefernretialData from "./CPTHcpcsReferentialData";
import GPCIReferentialData from "./GPCIReferentialData";
import ICDReferentialData from "./ICDReferentialData";
import MaxUnitsReferentialData from "./MaxUnitsReferentialData";
import oceHcpcsReferentialData from "./OceHcpcsReferentialData";
import {
  SearchFields,
  SearchFirstLabel,
  SearchSecondLabel,
  Source,
  showDrop,
  showLookUpOptions,
  showSecondLabelDrop,
  showSourceDropDown,
} from "./ViewMetaAction";
import {
  AddOnCodesColumns,
  BwPairsColumns,
  CCIColumns,
  ICDColumns,
  MFSColumns,
  MaxUnitsColumns,
  apcDateBindedColumns,
  capcDateBindedColumns,
  clientSpecficCodes,
  cptColumns,
  gpciColumns,
  hcpcsColumns,
  zip5Columns,
  zip9Columns,
} from "./ViewMetaColumns";
import Zip5ReferentialData from "./Zip5ReferentialData";
import Zip9ReferentialData from "./Zip9ReferentialData";
import { ViewMetaConstants } from "./viewMetaConstants";
import MfsReferentialData from "./MfsReferentialData";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { CCI_LKP, CCI_RATIONALE_LKP } from "../LookUps/LookUpConsts";
import {
  fetchLookupData,
  getMaiLkpData,
  getMaxUnitsLkpData,
  getMueLkpData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import CCIReferentialData from "./CCIReferentialData";
import ClientSpecficCodesReferentialData from "./ClientSpecficCodesReferentialData";
import {
  getClientPolicyData,
  getClientgroupData,
} from "../../redux/ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsApis";
import {
  CCI_RATIONAL_DESC,
  GET_TRUNCATED,
  MAXUNITSLKPKEY,
  RESET_STATE_OF_VIEW_META,
  SELECTED_COLUMN_II,
  SELECTED_CPT_CODE,
  SELECTED_QUARTER,
  SELECTED_SOURCE,
} from "../../redux/ApiCalls/ReferentialDataApi/ReferetialDataTypes";
import { CustomSwal } from "../../components/CustomSwal/CustomSwal";
import { useNavigate } from "react-router-dom";
import { exportedExcelFileData } from "../../components/ExportExcel/ExportExcelFile";
import moment from "moment";
import { ReferentialDataState } from "../../redux/reducers/ReferentialDataReducer/ReferentialDataReducer";

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

const ViewMeta = (props) => {
  const dispatch = useDispatch();
  // const taskStates: TaskState = useSelector((state: any) => state.taskReducer);
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(false);
  const [mfsQuarter, setMfsQuarter] = useState(null);
  const [maxUnitsLkp, setMaxUnitsLkp] = useState(null);
  const [maiUnitsLkp, setMaiUnitsLkp] = useState(null);
  const [mueUnitsLkp, setMueUnitsLkp] = useState(null);
  const [selectedLkpColumns, setselectedLkpColumns] = useState([]);
  const [bwTypeKey, setbwTypeKey] = useState(undefined);
  const [clientSpecificCodesData, setCleintSpecificCodesData] = React.useState(
    []
  );
  const [cciRationale, setCciRationale] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  ModuleRegistry.registerModules(AllCommunityModules);
  const gridRef = useRef();

  const updatedState: MetaDataLoaderState = useSelector(
    (state: any) => state.metaDataLoader
  );

  const formState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );

  const lkpState:LookUpState = useSelector((state: any) => state.lookupReducer);

  const ReferentialState: ReferentialDataState = useSelector(
    (state: any) => state.ReferentialDataReducer
  );

  const lookUpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );

  const clientExclusionState = useSelector((state: any) => state.clientPolicy);

  useEffect(() => {
    let lkpName = "";
    if (ReferentialState.selectedSource?.value === ViewMetaConstants.CCI) {
      lkpName = CCI_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, [ReferentialState]);

  useEffect(() => {
    let RationalLkpName = CCI_RATIONALE_LKP;
    fetchLookupData(dispatch, RationalLkpName);
  }, []);

  useEffect(() => {
    dispatch({ type: CCI_RATIONAL_DESC, payload: formState.rationale });
  }, [formState.rationale]);

  useEffect(() => {
    if (updatedState.mfsQuarter.length == 0) {
      getMfsQuaterLoader(dispatch);
    }
  }, []);

  const currentYear = new Date().getFullYear();

  var nextQuarter = String(currentYear).slice(-2);
  let array = ["A", "B", "C", "D"];

  let newQuarter = [];
  let alpha = "";
  let futureQuarter = Number(nextQuarter) + 1;

  for (let i = 19; i <= futureQuarter; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i == 19) {
        alpha = "D";
        newQuarter.push({ value: i + "" + alpha, Name: i + "" + alpha });
        break;
      }
      alpha = array[j];
      newQuarter.push({ value: i + "" + alpha, Name: i + "" + alpha });
    }
  }

  useEffect(() => {
    getMaxUnitsLkpData(dispatch);
    getMaiLkpData(dispatch);
    getMueLkpData(dispatch);
    getBwTypeData(dispatch);
  }, []);

  useEffect(() => {
    setNumberOfRows(ReferentialState.getTotalNumberOfRows);
  }, [ReferentialState]);

  const onFilterChanged = (params) => {
    if (params.api.getDisplayedRowCount() == 0) {
      CustomSwal("info", "No data found", navyColor, "Ok", "");
    }
    setNumberOfRows(params.api.getDisplayedRowCount());
  };

  useEffect(() => {
    let MaxUnitsLkpData = updatedState.maxUnitsLkpData.map((d) => {
      return {
        maxUnitsLkpKey: d.maxUnitsLkpKey,
        description: d.description,
      };
    });
    setMaxUnitsLkp(MaxUnitsLkpData);

    let maiLookpData = updatedState.maiLkpData.map((d) => {
      return {
        maiLkpKey: d.maiLkpKey,
        description: d.description,
      };
    });
    setMaiUnitsLkp(maiLookpData);

    let mueLookpData = updatedState.mueLkpData.map((d) => {
      return {
        mueRationaleKey: d.mueRationaleKey,
        description: d.description,
      };
    });
    setMueUnitsLkp(mueLookpData);
  }, [updatedState]);

  useEffect(() => {
    if (clientExclusionState.getclientPolicyExclusion.length == 0) {
      getClientPolicyData(dispatch);
    }

    if (clientExclusionState.getClientExclusion.length == 0) {
      getClientgroupData(dispatch);
    }
  }, []);

  const BW_PAIRS = lkpState.getBwTypeData.map((k, l) => {
    return { label: k.description, value: k.bwTypeKey };
  });

  const Cci_Keys = lookUpState.cci.map((c) => {
    return {
      label: c.cciDesc,
      value: c.cciKey,
    };
  });

  const Quarters = newQuarter?.map((mfs) => {
    return { label: mfs.Name, value: mfs.value };
  });
  const maxUnitLookUP = maxUnitsLkp
    ?.map((maxunits) => {
      return {
        label: maxunits.maxUnitsLkpKey + "-" + maxunits.description,
        value: maxunits.maxUnitsLkpKey + "-" + maxunits.description,
      };
    })
    .sort((a, b) => {
      // Extract the numeric part of the value for comparison
      const numA = parseInt(a.value.split("-")[0], 10);
      const numB = parseInt(b.value.split("-")[0], 10);

      return numA - numB;
    });

  const [selectedSourceValue, setSelectedSourceValue] = useState(null);

  const ResetQaurterAndCpt = () => {
    dispatch({ type: SELECTED_QUARTER, payload: null });
    dispatch({ type: SELECTED_CPT_CODE, payload: "" });
    dispatch({ type: SELECTED_COLUMN_II, payload: "" });
    dispatch({ type: MAXUNITSLKPKEY, payload: null });
  };
  const gridIconStyle = useMemo(
    () => ({
      position: "absolute",
      top: "67px",
      float: "right",
      right: "180px",
      display: "inline",
    }),
    []
  );
  useEffect(() => {
    if (ReferentialState.selectedSource != null) {
      if (
        ReferentialState.selectedSource.value === ViewMetaConstants.MFS ||
        ReferentialState.selectedSource.value ===
          ViewMetaConstants.MFS_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = MFSColumns;
        if (ReferentialState.selectedSource.value === ViewMetaConstants.MFS) {
          const hideColumnsForMFS = ["START DATE", "END DATE"];
          hideColumnsForMFS.forEach((key) => {
            const columnIndexToHide = MFSColumns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              MFSColumns[columnIndexToHide].hide = true;
            }
          });
          MFSColumns.forEach((k, l) => {
            if (k.headerName === "QTR") k.hide = false;
          });
        } else if (
          ReferentialState.selectedSource.value ===
          ViewMetaConstants.MFS_DATE_BINDED
        ) {
          const hideColumnForMFSDateBinded = ["QTR"];
          hideColumnForMFSDateBinded.forEach((key) => {
            const columnIndexToHide = MFSColumns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              MFSColumns[columnIndexToHide].hide = true;
            }
          });
          MFSColumns.forEach((k, l) => {
            if (k.headerName !== "QTR") k.hide = false;
          });
        }
        setselectedLkpColumns(col);
      }

      if (
        ReferentialState.selectedSource?.value ===
          ViewMetaConstants.OCE_HCPCS ||
        ReferentialState.selectedSource?.value ===
          ViewMetaConstants.HCPCS_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = hcpcsColumns;
        if (
          ReferentialState.selectedSource.value === ViewMetaConstants.OCE_HCPCS
        ) {
          const hideColumnsForOCEHCPCS = ["START DATE", "END DATE"];
          hideColumnsForOCEHCPCS.forEach((key) => {
            const columnIndexToHide = hcpcsColumns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              hcpcsColumns[columnIndexToHide].hide = true;
            }
          });
          hcpcsColumns.forEach((k, l) => {
            if (k.headerName === "QTR") k.hide = false;
          });
        } else if (
          ReferentialState.selectedSource.value ===
          ViewMetaConstants.HCPCS_DATE_BINDED
        ) {
          const hideColumnForHcpcsDateBinded = ["QTR"];
          hideColumnForHcpcsDateBinded.forEach((key) => {
            const columnIndexToHide = hcpcsColumns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              hcpcsColumns[columnIndexToHide].hide = true;
            }
          });
          hcpcsColumns.forEach((k, l) => {
            if (k.headerName !== "QTR") k.hide = false;
          });
        }
        setselectedLkpColumns(col);
      }
      if (ReferentialState.selectedSource?.value === ViewMetaConstants.CPT) {
        let col = Object.assign({}, selectedLkpColumns);
        col = cptColumns;
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value ===
        ViewMetaConstants.ADD_ON_CODES
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = AddOnCodesColumns;
        setselectedLkpColumns(col);
      }

      if (ReferentialState.selectedSource?.value === ViewMetaConstants.CCI) {
        let col = Object.assign({}, selectedLkpColumns);
        col = CCIColumns(navigate);
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value ==
        ViewMetaConstants.CLIENT_SPECIFIC
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = clientSpecficCodes;
        setselectedLkpColumns(col);
      }
      if (ReferentialState.selectedSource?.value === ViewMetaConstants.ICD) {
        let col = Object.assign({}, selectedLkpColumns);
        col = ICDColumns;
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value === ViewMetaConstants.MAX_UNITS
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = MaxUnitsColumns(ReferentialState.maxUnitsLkpKey);
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource.value === ViewMetaConstants.BW_Pairs
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = BwPairsColumns;
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value ===
        ViewMetaConstants.APC_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = apcDateBindedColumns;
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value ===
        ViewMetaConstants.CAPC_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = capcDateBindedColumns;
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value === ViewMetaConstants.GPCI ||
        ReferentialState.selectedSource?.value ===
          ViewMetaConstants.GPCI_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        let columnIndexToHide = 0;
        col = gpciColumns;
        const hideColumnsForGPCI = ["START DATE", "END DATE"];
        if (ReferentialState.selectedSource.value === ViewMetaConstants.GPCI) {
          hideColumnsForGPCI.forEach((key) => {
            columnIndexToHide = gpciColumns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              gpciColumns[columnIndexToHide].hide = true;
            }
          });
        } else {
          gpciColumns.forEach((column) => {
            column.hide = false;
          });
        }
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value === ViewMetaConstants.ZIP_5 ||
        ReferentialState.selectedSource?.value ===
          ViewMetaConstants.ZIP_5_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = zip5Columns;
        if (ReferentialState.selectedSource.value === ViewMetaConstants.ZIP_5) {
          const hideColumnsForZip5 = ["START DATE", "END DATE"];
          hideColumnsForZip5.forEach((key) => {
            const columnIndexToHide = zip5Columns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              zip5Columns[columnIndexToHide].hide = true;
            }
          });
          zip5Columns.forEach((k, l) => {
            if (k.headerName === "QTR") k.hide = false;
          });
        } else if (
          ReferentialState.selectedSource.value ===
          ViewMetaConstants.ZIP_5_DATE_BINDED
        ) {
          const hideColumnsForZip5DateBinded = ["QTR"];
          hideColumnsForZip5DateBinded.forEach((key) => {
            const columnIndexToHide = zip5Columns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              zip5Columns[columnIndexToHide].hide = true;
            }
          });
          zip5Columns.forEach((k, l) => {
            if (k.headerName !== "QTR") k.hide = false;
          });
        }
        setselectedLkpColumns(col);
      }
      if (
        ReferentialState.selectedSource?.value === ViewMetaConstants.ZIP_9 ||
        ReferentialState.selectedSource?.value ===
          ViewMetaConstants.ZIP_9_DATE_BINDED
      ) {
        let col = Object.assign({}, selectedLkpColumns);
        col = zip9Columns;
        if (ReferentialState.selectedSource.value === ViewMetaConstants.ZIP_9) {
          const hideColumnsForZip9 = ["START DATE", "END DATE"];
          hideColumnsForZip9.forEach((key) => {
            const columnIndexToHide = zip9Columns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              zip9Columns[columnIndexToHide].hide = true;
            }
          });
          zip9Columns.forEach((k, l) => {
            if (k.headerName === "QTR") k.hide = false;
          });
        } else if (
          ReferentialState.selectedSource.value ===
          ViewMetaConstants.ZIP_9_DATE_BINDED
        ) {
          const hideColumnsForZip9DateBinded = ["QTR"];
          hideColumnsForZip9DateBinded.forEach((key) => {
            const columnIndexToHide = zip9Columns.findIndex(
              (column) => column.headerName === key
            );
            if (columnIndexToHide !== -1) {
              zip9Columns[columnIndexToHide].hide = true;
            }
          });
          zip9Columns.forEach((k, l) => {
            if (k.headerName !== "QTR") k.hide = false;
          });
        }
        setselectedLkpColumns(col);
      }
    }
  }, [ReferentialState]);
  const resetInputField = () => {
    dispatch({ type: RESET_STATE_OF_VIEW_META });
    setShowResults(false);
    setbwTypeKey(undefined);
    setNumberOfRows(0);
  };
  const Search = async () => {
    if (ReferentialState.selectedSource === null) {
      CustomSwal("info", "Please Select Source", navyColor, "Ok", "");
    } else if (!SearchFields.includes(ReferentialState.selectedSource?.value)) {
      if (ReferentialState.selectedCptCode === null) {
        CustomSwal("info", "Please Select  CPT/HCPCS", navyColor, "Ok", "");
      } else if (ReferentialState.selectedQuarter === null) {
        CustomSwal("info", "Please Select Quarter", navyColor, "Ok", "");
      } else {
        setShowResults(true);
      }
    } else {
      setShowResults(true);
    }
  };
  let tablegridData = [];

  const requestParamsRef = useRef(null);

  const onGridReady = async (params) => {
    if (
      ReferentialState.selectedSource.value != ViewMetaConstants.CLIENT_SPECIFIC
    ) {
      gridRef.current = params;
      const dataSource = {
        rowCount: null,
        getRows: async (params) => {
          requestParamsRef.current = params;

          let rows = [];
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.MFS ||
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.MFS_DATE_BINDED
          ) {
            rows = await MfsReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.GPCI ||
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.GPCI_DATE_BINDED
          ) {
            rows = await GPCIReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value ==
            ViewMetaConstants.ADD_ON_CODES
          ) {
            rows = await addOnCodesReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value ==
            ViewMetaConstants.APC_DATE_BINDED
          ) {
            rows = await APCDateBindedData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value ==
            ViewMetaConstants.CAPC_DATE_BINDED
          ) {
            rows = await CAPCDateBindedData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }

          if (ReferentialState.selectedSource.value == ViewMetaConstants.CCI) {
            rows = await CCIReferentialData(
              dispatch,
              ReferentialState,
              params,
              formState,
              selectedSourceValue?.value,
              Cci_Keys,
              ReferentialState.selectedSource.label,
              false
            );
          }
          if (
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.OCE_HCPCS ||
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.HCPCS_DATE_BINDED
          ) {
            rows = await oceHcpcsReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (ReferentialState.selectedSource.value == ViewMetaConstants.CPT) {
            rows = await CPTHcpcsRefernretialData(
              dispatch,
              ReferentialState,
              params,
              "CPT HCPCS"
            );
          }
          if (ReferentialState.selectedSource.value == ViewMetaConstants.ICD) {
            rows = await ICDReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.MAX_UNITS
          ) {
            rows = await MaxUnitsReferentialData(
              dispatch,
              ReferentialState,
              params,
              maxUnitsLkp,
              maiUnitsLkp,
              mueUnitsLkp,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.BW_Pairs
          ) {
            rows = await BwPairsReferentialData(
              dispatch,
              ReferentialState,
              params,
              lkpState,
              selectedSourceValue?.value,
              ReferentialState.selectedSource.value
            );
          }
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.ZIP_5 ||
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.ZIP_5_DATE_BINDED
          ) {
            rows = await Zip5ReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (
            ReferentialState.selectedSource.value == ViewMetaConstants.ZIP_9 ||
            ReferentialState.selectedSource.value ==
              ViewMetaConstants.ZIP_9_DATE_BINDED
          ) {
            rows = await Zip9ReferentialData(
              dispatch,
              ReferentialState,
              params,
              ReferentialState.selectedSource.label
            );
          }
          if (!(params.filterModel == null || undefined)) {
            if (rows.length < 1000) {
              tablegridData = rows;
            } else if (rows.length == 0) {
              tablegridData = tablegridData.concat(rows);
            } else {
              tablegridData = tablegridData.concat(rows);
            }
          } else {
            tablegridData = tablegridData.concat(rows);
          }
          if (!(tablegridData.length > 0)) {
            CustomSwal("info", "No data found", navyColor, "Ok", "");
          }
          let lastRow = -1;
          if (tablegridData.length < params.endRow) {
            lastRow = tablegridData.length;
          }
          params.successCallback(rows, lastRow);
        },
      };
      params.api.setDatasource(dataSource);
    }
    let rows = [];

    if (
      ReferentialState.selectedSource.value == ViewMetaConstants.CLIENT_SPECIFIC
    ) {
      rows = await ClientSpecficCodesReferentialData(
        dispatch,
        ReferentialState,
        clientExclusionState
      );
    }
    setCleintSpecificCodesData(rows);
  };
  const ExportReferentialData = async () => {
    let params;
    let exportCCiData;
    if (requestParamsRef.current) {
      params = requestParamsRef.current;
    }
    if (numberOfRows < 60000) {
      if (ReferentialState.selectedSource.value == ViewMetaConstants.CCI) {
        exportCCiData = await CCIReferentialData(
          dispatch,
          ReferentialState,
          params,
          formState,
          selectedSourceValue?.value,
          Cci_Keys,
          ReferentialState.selectedSource.label,
          true
        );
      }

      let mappedData = exportCCiData.map((ad) => {
        return {
          cciKey: ad.cciKey,
          column_i: ad.column_i,
          column_ii: ad.column_ii,
          startDate: moment(ad.startDate).format("MM-DD-YYYY"),
          endDate: moment(ad.endDate).format("MM-DD-YYYY"),
          cciRationale: ad.cciRationaleKey,
          prior_1996: ad.prior_1996_b,
          allowMod: ad.allowModB,
          deviations: ad.deviations,
        };
      });

      if (exportCCiData.length > 0) {
        await exportedExcelFileData(mappedData, ViewMetaConstants.CCI, "CCI");
      }
    } else {
      CustomSwal(
        "info",
        "Note : Max Records that can be exported is 60K records.",
        navyColor,
        "Ok",
        ""
      );
    }
  };

  return (
    <div>
      <Template>
        <GridContainer>
          <GridItem sm={10} md={10} xs={10}>
            <CustomHeader labelText={"Referential Data"} />
          </GridItem>
          <GridItem sm={2} md={2} xs={2}>
            <div className="viewMetaBtns">
              <CustomButton
                type="reset"
                variant={"contained"}
                onClick={() => {
                  resetInputField();
                }}
                style={{
                  backgroundColor: dangerColor,
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: 12,
                  padding: 4,
                  float: "right",
                }}
              >
                Reset
              </CustomButton>
              <CustomButton
                onClick={Search}
                variant={"contained"}
                style={{
                  backgroundColor: navyColor,
                  marginRight: 10,
                  float: "right",
                  color: "white",
                  fontSize: 12,
                  padding: 4,
                  textTransform: "capitalize",
                }}
              >
                Search
              </CustomButton>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem sm={12} md={12} xs={12}>
            <CustomPaper
              style={{
                paddingLeft: 15,
                paddingRight: 25,
                boxShadow: "none",
                border: "1px solid #D6D8DA",
                marginRight: "10px",
                innerWidth: 100,
                height: 135,
              }}
            >
              <GridContainer>
                <GridItem sm={2} md={2} xs={2}>
                  <div style={{ width: 180 }}>
                    <CustomSelect
                      options={Source.sort(alphaOrder)}
                      onSelect={(event) => {
                        tablegridData = [];
                        setShowResults(false);
                        dispatch({ type: SELECTED_SOURCE, payload: event });
                        ResetQaurterAndCpt();
                        setSelectedSourceValue("");
                      }}
                      value={ReferentialState.selectedSource}
                      labelText={"Source"}
                    />
                  </div>
                </GridItem>
                <GridItem sm={2} md={2} xs={2}>
                  <>
                    {showDrop(ReferentialState.selectedSource?.value) ? (
                      <div style={{ width: 150, marginLeft: -20 }}>
                        <CustomSelect
                          options={showLookUpOptions(
                            ReferentialState.selectedSource?.value,
                            maxUnitLookUP,
                            BW_PAIRS,
                            Quarters,
                            Cci_Keys
                          )}
                          onSelect={(event) => {
                            setShowResults(false);
                            setSelectedSourceValue(event);
                            dispatch({
                              type: SELECTED_QUARTER,
                              payload: event || null,
                            });

                            dispatch({
                              type: MAXUNITSLKPKEY,
                              payload: event || null,
                            });
                          }}
                          value={selectedSourceValue}
                          labelText={
                            ReferentialState.selectedSource?.value ===
                            ViewMetaConstants.MAX_UNITS
                              ? "Type"
                              : ReferentialState.selectedSource?.value ===
                                ViewMetaConstants.CCI
                              ? "CCI Key"
                              : ReferentialState.selectedSource?.value ===
                                ViewMetaConstants.BW_Pairs
                              ? "BW Key"
                              : "Quarter"
                          }
                        />
                      </div>
                    ) : undefined}
                  </>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem sm={1} md={1} xs={1}>
                  <div style={{ width: 150 }}>
                    {showSourceDropDown(
                      ReferentialState.selectedSource?.value
                    ) ? (
                      <div style={{ width: 150 }}>
                        <CustomInput
                          labelText={SearchFirstLabel(
                            ReferentialState.selectedSource?.value
                          )}
                          fullWidth={true}
                          maxLength={
                            ReferentialState.selectedSource?.value ===
                              ViewMetaConstants.ICD ||
                            ReferentialState.selectedSource?.value ===
                              ViewMetaConstants.CLIENT_SPECIFIC
                              ? undefined
                              : 5
                          }
                          type={"text"}
                          variant={"outlined"}
                          onChange={(event) => {
                            setShowResults(false);
                            dispatch({
                              type: SELECTED_CPT_CODE,
                              payload: event.target.value.toUpperCase(),
                            });
                          }}
                          value={ReferentialState.selectedCptCode}
                        />
                      </div>
                    ) : undefined}
                  </div>
                </GridItem>
                <GridItem sm={1} md={1} xs={1}>
                  <div style={{ width: 150, marginLeft: 70 }}>
                    {showSecondLabelDrop(
                      ReferentialState.selectedSource?.value
                    ) ? (
                      <div style={{ width: 150 }}>
                        <CustomInput
                          labelText={SearchSecondLabel(
                            ReferentialState.selectedSource?.value
                          )}
                          fullWidth={true}
                          maxLength={5}
                          type={"text"}
                          variant={"outlined"}
                          onChange={(event) => {
                            setShowResults(false);
                            dispatch({
                              type: SELECTED_COLUMN_II,
                              payload: event.target.value.toUpperCase(),
                            });
                          }}
                          value={ReferentialState.selectedColumnII}
                        />
                      </div>
                    ) : undefined}
                  </div>
                </GridItem>

                {ReferentialState.selectedSource?.value == "ICD" ? (
                  <GridItem sm={2} md={2} xs={2}>
                    <div className="checkbox">
                      <CustomCheckBox
                        // checked={taskStates.truncated==1}
                        value={ReferentialState.truncated}
                        size="small"
                        className="checkboxes"
                        label={
                          <span style={{ fontSize: "12px" }}>Truncated</span>
                        }
                        onChange={(event) => {
                          setShowResults(false);
                          dispatch({
                            type: GET_TRUNCATED,
                            payload: event.target.checked,
                          });
                        }}
                      />
                    </div>
                  </GridItem>
                ) : undefined}
              </GridContainer>
            </CustomPaper>
          </GridItem>
        </GridContainer>
        <div className="grid" style={{ height: window.innerHeight / 1.59 }}>
          {showResults && ReferentialState.selectedSource?.value ? (
            <>
              <AgGrids
                columnDefs={selectedLkpColumns}
                onGridReady={onGridReady}
                debug={true}
                rowBuffer={0}
                rowSelection="single"
                rowModelType={
                  ReferentialState.selectedSource?.value !==
                  ViewMetaConstants.CLIENT_SPECIFIC
                    ? "infinite"
                    : ""
                }
                rowDeselection={true}
                pageinationPerSize={
                  ReferentialState.selectedSource?.value !==
                  ViewMetaConstants.CLIENT_SPECIFIC
                    ? 500
                    : ""
                }
                cacheOverflowSize={1}
                maxConcurrentDatasourceRequests={1}
                infiniteInitialRowCount={1}
                maxBlocksInCache={1}
                modules={AllCommunityModules}
                defaultColDef={true}
                suppressRowTransform={true}
                rowData={
                  ReferentialState.selectedSource?.value ===
                  ViewMetaConstants.CLIENT_SPECIFIC
                    ? clientSpecificCodesData
                    : ""
                }
                onFilterChanged={
                  ReferentialState.selectedSource?.value ===
                  ViewMetaConstants.CLIENT_SPECIFIC
                    ? onFilterChanged
                    : ""
                }
                gridIconStyle={gridIconStyle}
              />
              <small
                style={{ position: "relative", top: "3px", fontSize: "12px" }}
              >
                Number of rows : {numberOfRows}
              </small>
            </>
          ) : undefined}

          {ReferentialState.selectedSource?.value == ViewMetaConstants.CCI &&
          showResults ? (
            <CustomButton
              onClick={() => {
                ExportReferentialData();
              }}
              variant={"contained"}
              style={{
                backgroundColor: navyColor,
                color: "white",
                padding: 4,
                fontSize: 12,
                textTransform: "capitalize",
                marginTop: 38,
                float: "right",
              }}
            >
              Export
            </CustomButton>
          ) : undefined}
        </div>
      </Template>
    </div>
  );
};

export default ViewMeta;

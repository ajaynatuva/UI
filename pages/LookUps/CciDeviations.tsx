import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCci } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { getActiveClientGroups } from "../../redux/ApiCalls/NewPolicyTabApis/ClientAssignmentTabApis";
import { fetchLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { NewPolicyState } from "../../redux/reducers/NewPolicyTabReducers/NewPolicyReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { LookUpColumns } from "./LookupColumns";
import { CCI_DEVIATIONS, CCI_RATIONALE_LKP } from "./LookUpConsts";
import { ModifierPriorityLookUpInitialState } from "./LookUpInitialState";
import { getLOB } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { ClientAssignmentState } from "../../redux/reducers/NewPolicyTabReducers/ClientAssisgnmentTabReducer";

const CciDeviations = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const newpolicyState: NewPolicyState = useSelector(
    (state: any) => state.newPolicy
  );
  const taskStates: TaskState = useSelector((state: any) => state.taskReducer);

  const lkpState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const clientAssignmentState: ClientAssignmentState = useSelector(
    (state: any) => state.clientAssignmentTabFieldsRedux
  );

  useEffect(() => {
    if (newpolicyState.LOB.length === 0) {
      getLOB(dispatch);
    }
  }, [dispatch, newpolicyState.LOB, newpolicyState.LOB.length]);

  useEffect(() => {
    if (taskStates.rationale.length == 0) {
      let lkpName = CCI_RATIONALE_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);

  const [saveLkpValues, setSaveLkpValues] = useState(
    ModifierPriorityLookUpInitialState
  );

  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  useEffect(() => {
    // if (updatedState.getCciDeviations.length == 0) {
    let lkpName = CCI_DEVIATIONS;
    fetchLookupData(dispatch, lkpName);
    // }
  }, [selectedLookup]);

  useEffect(() => {
    if (lkpState.ptpCci.length === 0) {
      getCci(dispatch);
    }
    // setCci(newpolicyState.ptpCci);
  }, [dispatch, lkpState.ptpCci, lkpState.ptpCci.length]);

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(ModifierPriorityLookUpInitialState);
    setIsCodeError(false);
  };

  function showLKPFields() {
    return null;
  }

  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  const [getActiveClientData, setActiveClientData] = useState([]);

  useEffect(() => {
    if (clientAssignmentState.getActiveClientData.length === 0) {
      getActiveClientGroups(dispatch);
    }
    setActiveClientData(clientAssignmentState.getActiveClientData);
  }, [clientAssignmentState.getActiveClientData.length, dispatch]);

  const getCCIDesc = (value) => {
    let cciDesc;
    lkpState.ptpCci.forEach((c: any) => {
      if (c.cciKey == value) {
        cciDesc = c.cciDesc;
      }
    });
    return cciDesc;
  };

  const getCCIRationale = (value) => {
    let cciRationale;
    taskStates.rationale.forEach((c) => {
      if (c.cciRationaleKey == value) {
        cciRationale = c.cmsCciRationale;
      }
    });
    return cciRationale;
  };

  const getLobDesc = (lobKey) => {
    let lobDesc = [];
    let nums = lobKey?.split(",");
    nums.forEach((value) => {
      newpolicyState.LOB.forEach((c) => {
        if (value == c.lobKey) {
          if (lobDesc) {
            lobDesc.push({ label: c.lobTitle, value: c.lobKey });
            // lobDesc = lobDesc + "," + c.lobTitle;
          }
        }
      });
    });
    return lobDesc;
  };

  useEffect(() => {
    let cciDeviation = [];
    setTimeout(() => {
      let col = LookUpColumns(
        selectedLookup,
        saveLkpValues,
        handleUpdateObj,
        Role,
        props.lkpInput.setSelectedCCIDev,
        props.lkpInput.setSaveLkpValues,
        cciDeviation
      );
      props.lkpInput.allLookUpColumns(col);
      if (Array.isArray(updatedState.getCciDeviations)) {
        updatedState?.getCciDeviations?.forEach((d) => {
          getActiveClientData?.forEach((K) => {
            if (K.clientGroupId === d.clientGroupId) {
              cciDeviation.push({
                Client: K.clientName,
                ClientGroup: K.clientGroupName,
                state: d.state === "0" ? "ALL" : d.state,
                lobKey: getLobDesc(d.lobKey),
                claimType: d.claimType,
                cciKey: d.cciKey + "-" + getCCIDesc(d.cciKey),
                column_i: d.columnI,
                column_ii: d.columnII,
                startDate: moment(d.startDate).format("MM-DD-YYYY"),
                endDate: moment(d.endDate).format("MM-DD-YYYY"),
                cciRationaleKey:
                  d.cciRationaleKey + "-" + getCCIRationale(d.cciRationaleKey),
                allowModB: d.allowModB == 0 ? "NO" : "YES",
                devStartDate: moment(d.devStartDate).format("MM-DD-YYYY"),
                devEndDate: moment(d.devEndDate).format("MM-DD-YYYY"),
                jiraId: d.jiraId,
                jiraDesc: d.jiraDesc,
                comments: d.comments,
                userId: d.userId,
                deletedB: d.deletedB,
                deviationsKey: d.deviationsKey,
                ClientGroupId: d.clientGroupId,
              });
            }
          });
        });
      }
      props.lkpInput.allLookUpRowData(cciDeviation);
    }, 20);
  }, [getActiveClientData, updatedState.getCciDeviations]);
  return (
    <div>
      <DailogBoxForAddandEdit
        lkpInput={{
          selectedLookup,
          popUp,
          fromLkpChilds,
          showLKPFields,
          resetFields,
          isEdit,
          fromLkpEditchilds,
          saveLkpValues,
          isCodeError,
        }}
      />
    </div>
  );
};

export default CciDeviations;

import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import {
  fetchLookupData,
  postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import {
  CciRationaleLkpInitialState
} from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { CCI_RATIONALE_LKP } from "./LookUpConsts";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";

const CciRationaleLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const taskStates: TaskState = useSelector((state: any) => state.taskReducer);
  const [saveLkpValues, setSaveLkpValues] = useState(
    CciRationaleLkpInitialState
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = CCI_RATIONALE_LKP;
    postLookupData(dispatch,obj,isEdit,lkpName);
    setSaveLkpValues(CciRationaleLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(CciRationaleLkpInitialState);
    setIsCodeError(false);
  };


  useEffect(() => {
    if (taskStates.rationale.length == 0) {
      let lkpName = CCI_RATIONALE_LKP;
      fetchLookupData(dispatch,lkpName);
    }
  }, []);

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"CCI Rationale Key"}
            maxLength={5}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.cciRationaleKey == e.target.value.replace(/^\s+/, "");
                });
                obj.cciRationaleKey = e.target.value;
                if (code.length>0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.cciRationaleKey}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>
              CCI Rationale Key already Exists
            </small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"CMS CCI Rationale"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.cmsCciRationale = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.cmsCciRationale}
          />
          <CustomInput
            fullWidth={true}
            labelText={"CCI Ratioanale Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.cciRationaleDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.cciRationaleDesc}
          />
        </div>
      </>
    );
  }

  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };

  useEffect(() => {
    setTimeout(() => {
      let col = LookUpColumns(
        selectedLookup,
        saveLkpValues,
        handleUpdateObj,
        Role,null,null,null
      );
      props.lkpInput.allLookUpColumns(col);
      let cciRationaleRows = taskStates.rationale?.map((sp, i) => {
        return {
          id: i,
          cciRationaleKey: sp.cciRationaleKey,
          cmsCciRationale: sp.cmsCciRationale,
          cciRationaleDesc: sp.cciRationaleDesc,
        };
      });
      props.lkpInput.allLookUpRowData(cciRationaleRows);
      setRows(cciRationaleRows)
    }, 10);
  }, [taskStates]);

  return (
    <div>
      <DailogBoxForAddandEdit
        lkpInput={{
          selectedLookup,
          popUp,
          fromLkpChilds,
          showLKPFields,
          saveLkpFields,
          resetFields,
          isEdit,
          fromLkpEditchilds,
          saveLkpValues,
          isCodeError
        }}
      />
    </div>
  );
};

export default CciRationaleLookup;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import { BoLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { 
  fetchLookupData, postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import CustomInput from "../../components/CustomInput/CustomInput";
import _ from "lodash";
import { BO_TYPE_LKP } from "./LookUpConsts";
import { validateNumberMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
const BoTypeLookup = (props) => {
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const [saveLkpValues, setSaveLkpValues] = useState(BoLookUpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const [rows, setRows] = useState([]);
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const taskStates: TaskState = useSelector((state: any) => state.taskReducer);
  const dispatch = useDispatch();
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = BO_TYPE_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(BoLookUpInitialState);
  }
  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(BoLookUpInitialState);
    setIsCodeError(false);
  };
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  useEffect(() => {
    if (updatedState.Bo.length == 0) {
      let lkpName = BO_TYPE_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      let col = LookUpColumns(
        selectedLookup,
        saveLkpValues,
        handleUpdateObj,
        Role,
        null,
        null,
        null
      );
      props.lkpInput.allLookUpColumns(col);
      const boLkpRows = updatedState.Bo?.map((bo, i) => {
        return {
          id: i,
          boKey: bo.boKey,
          boDesc: bo.boDesc,
        };
      });
      props.lkpInput.allLookUpRowData(boLkpRows);
      setRows(boLkpRows);
    }, 10);
  }, [updatedState]);
  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"BO Key"}
            maxLength={5}
            variant={"outlined"}
            onChange={(e) => {
              // let obj = _.cloneDeep(saveLkpValues);
              // obj.boKey = e.target.value;
              // setSaveLkpValues(obj);
              let obj = _.cloneDeep(saveLkpValues);

              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.boKey == e.target.value;
                });
                obj.boKey = e.target.value;
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setIsCodeError(false);
                  setSaveLkpValues(obj);
                }
              }
            }}
            onKeyPress={(e) => validateNumberMethod(e)}
            disabled={isEdit}
            value={isEdit ? saveLkpValues.boKey : undefined}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>BO Key already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"BO Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.boDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.boDesc}
          />
        </div>
      </>
    );
  }
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
          isCodeError,
        }}
      />
    </div>
  );
};
export default BoTypeLookup;

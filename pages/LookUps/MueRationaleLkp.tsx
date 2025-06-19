import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import {
  fetchLookupData,
  postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { MueLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MUE_RATIONALE_LKP } from "./LookUpConsts";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
const MueRationaleLkp = (props) => {
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const [saveLkpValues, setSaveLkpValues] = useState(MueLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const [rows, setRows] = useState([]);

  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (updatedState.mue.length == 0) {
      let lkpName = MUE_RATIONALE_LKP;
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
      const mueLkpRows = updatedState.mue?.map((mu, i) => {
        return {
          id: i,
          mueRationalKey: mu.mueRationalKey,
          description: mu.description,
        };
      });
      props.lkpInput.allLookUpRowData(mueLkpRows);
      setRows(mueLkpRows);
    }, 10);
  }, [updatedState]);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = MUE_RATIONALE_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(MueLkpInitialState);
  }
  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(MueLkpInitialState);
    setIsCodeError(false);
  };
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"MUE Rationale Key"}
            maxLength={5}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc, i) => {
                  return (
                    sc.mueRationalKey == e.target.value.replace(/^\s+/, "")
                  );
                });
                obj.mueRationalKey = e.target.value;
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setIsCodeError(false);
                  setSaveLkpValues(obj);
                }
              }
            }}
            disabled={isEdit}
            value={isEdit ? saveLkpValues.mueRationalKey : undefined}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>MUE Key already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Description"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.description = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.description}
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

export default MueRationaleLkp;

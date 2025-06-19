import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import {
  fetchLookupData, postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { MaxUnitsTypesInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MAX_UNITS_TYPES } from "./LookUpConsts";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
const MaxUnitsType = (props) => {
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const [saveLkpValues, setSaveLkpValues] = useState(MaxUnitsTypesInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = MAX_UNITS_TYPES;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(MaxUnitsTypesInitialState);
  }
  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(MaxUnitsTypesInitialState);
    setIsCodeError(false);
  };
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  useEffect(() => {
    if (updatedState.MaxUnitsTypes.length == 0) {
      let lkpName = MAX_UNITS_TYPES;
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
      const maxUnitsTypeRows = updatedState.MaxUnitsTypes?.map((mt, i) => {
        return {
          id: i,
          maxUnitsTypeKey: mt.maxUnitsTypeKey,
          maxUnitsTypeDesc: mt.maxUnitsTypeDesc,
        };
      });
      props.lkpInput.allLookUpRowData(maxUnitsTypeRows);
      setRows(maxUnitsTypeRows);
    }, 10);
  }, [updatedState]);

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Max Units Type Key"}
            maxLength={5}
            variant={"outlined"}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc, i) => {
                  return (
                    sc.maxUnitsTypeKey == e.target.value.replace(/^\s+/, "")
                  );
                });
                obj.maxUnitsTypeKey = e.target.value;
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={isEdit ? saveLkpValues.maxUnitsTypeKey : undefined}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>Max Units Key already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Description"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.maxUnitsTypeDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.maxUnitsTypeDesc}
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

export default MaxUnitsType;

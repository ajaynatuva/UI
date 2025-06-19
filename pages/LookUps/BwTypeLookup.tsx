import React, { useEffect, useState } from "react";
import { fetchLookupData, postLookupData, 
  } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { useSelector, useDispatch } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";

import { BwTypeLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import _ from "lodash";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { BW_TYPE_LKP } from "./LookUpConsts";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { validateNumberMethod } from "../../redux/ApiCallAction/Validations/StringValidation";

const BwTypeLookup = (props) => {
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const [saveLkpValues, setSaveLkpValues] = useState(BwTypeLookUpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [rows, setRows] = useState([]);
  const [isCodeError, setIsCodeError] = useState(false);
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const dispatch = useDispatch();
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = BW_TYPE_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(BwTypeLookUpInitialState);
  }
  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(BwTypeLookUpInitialState);
    setIsCodeError(false);
  };
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  useEffect(() => {
    if (updatedState.BwType.length == 0) {
      let lkpName = BW_TYPE_LKP;
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
      const bwTypeLkpRows = updatedState.BwType?.map((bw, i) => {
        return {
          id: i,
          bwTypeKey: bw.bwTypeKey,
          description: bw.description,
        };
      });
      props.lkpInput.allLookUpRowData(bwTypeLkpRows);
      setRows(bwTypeLkpRows);
    }, 10);
  }, [updatedState]);

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"BW Type Key"}
            maxLength={5}
            variant={"outlined"}
            onChange={(e) => {
              // let obj = _.cloneDeep(saveLkpValues);
              // obj.bwTypeKey = e.target.value;
              // setSaveLkpValues(obj);
              // setIsCodeError(false);
              let obj = _.cloneDeep(saveLkpValues);

              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.bwTypeKey == e.target.value;
                });
                obj.bwTypeKey = e.target.value;
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
            value={isEdit ? saveLkpValues.bwTypeKey : undefined}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>Bw Key already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"BW Type Desc"}
            variant={"outlined"}
            maxLength={30}
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
          isCodeError
        }}
      />
    </div>
  );
};
export default BwTypeLookup;

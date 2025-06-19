import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import {
  fetchLookupData, postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { MaxUnitsLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MAX_UNITS_LKP } from "./LookUpConsts";
import RadioButton from "../../components/RadioButton/RadioButton";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";

const MaxUnitsLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(
    MaxUnitsLookUpInitialState
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

useEffect(() => {
    let lkpName = MAX_UNITS_LKP;
    fetchLookupData(dispatch, lkpName);
  }, [selectedLookup]);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = MAX_UNITS_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(MaxUnitsLookUpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(MaxUnitsLookUpInitialState);
    setIsCodeError(false);
  };

  function showLKPFields() {
    return (
      <div className="row">
        <div className="col-sm-4"></div>
        <CustomInput
          fullWidth={true}
          labelText={"Max Units LookUp Key"}
          maxLength={5}
          onKeyPress={(e) => {
            StringMethod(e);
          }}
          variant={"outlined"}
          onChange={(e) => {
            let obj = _.cloneDeep(saveLkpValues);
            if (e != undefined) {
              let code = rows.filter((sc, i) => {
                return sc.maxUnitsLkpKey == e.target.value.replace(/^\s+/, "");
              });
              obj.maxUnitsLkpKey = e.target.value;
              if (code.length > 0) {
                setIsCodeError(true);
              } else {
                setSaveLkpValues(obj);
                setIsCodeError(false);
              }
            }
          }}
          disabled={isEdit}
          value={isEdit ? saveLkpValues.maxUnitsLkpKey : undefined}
        />
        {isCodeError ? (
          <small style={{ color: "red" }}>Max Units Key already Exists</small>
        ) : undefined}
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
            obj.maxUnitsTypeKey = e.target.value;
            setSaveLkpValues(obj);
          }}
          value={saveLkpValues.maxUnitsTypeKey}
        />
        <CustomInput
          fullWidth={true}
          labelText={"Comments"}
          variant={"outlined"}
          onChange={(e) => {
            let obj = _.cloneDeep(saveLkpValues);
            obj.comments = e.target.value.replace(/^\s+/, "");
            setSaveLkpValues(obj);
          }}
          value={saveLkpValues.comments}
        />
        <div style={{ marginTop: "10px" }}></div>
        <div className="col-sm-2">Custom ?</div>
        <div className="col-sm-2">
          <RadioButton
          disabled={isEdit}
            label={"Yes"}
            checked={
              saveLkpValues.custom == "YES" || saveLkpValues.custom == 1
                ? true
                : false
            }
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e.target.checked) {
                obj.custom = 1;
              }
              saveLkpValues.custom = obj;
              setSaveLkpValues(obj);
            }}
          />
        </div>
        <div className="col-sm-2">
          <RadioButton
            label={"No"}
            disabled={isEdit}
            checked={
              saveLkpValues.custom == "NO" || saveLkpValues.custom == 0
                ? true
                : false
            }
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e.target.checked) {
                obj.custom = 0;
              }
              saveLkpValues.custom = obj;
              setSaveLkpValues(obj);
            }}
          />
        </div>
      </div>
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
        Role, null, null, null
      );
      props.lkpInput.allLookUpColumns(col);
      let maxUnitsRows = updatedState.MaxUnits?.map((mx, i) => {
        return {
          id: i,
          maxUnitsLkpKey: mx.maxUnitsLkpKey,
          maxUnitsTypeKey: mx.maxUnitsTypeKey,
          description: mx.description,
          comments: mx.comments,
          custom: mx.custom == 0 ? "No" : "Yes"
        };
      });
      props.lkpInput.allLookUpRowData(maxUnitsRows);
      setRows(maxUnitsRows)
    }, 10);
  }, [updatedState]);

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

export default MaxUnitsLookup;

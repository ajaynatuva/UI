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
import { CciLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { CCI_LKP } from "./LookUpConsts";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";

const CciLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(CciLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);


  useEffect(() => {
    if (updatedState.cci.length == 0) {
      let lkpName = CCI_LKP;
      fetchLookupData(dispatch,lkpName);
    }
  }, []);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = CCI_LKP;
    postLookupData(dispatch,obj,isEdit,lkpName);
    setSaveLkpValues(CciLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(CciLkpInitialState);
    setIsCodeError(false);
  };
  
  function showLKPFields() {
    return (
      <div className="row">
        <div className="col-sm-4"></div>
        <CustomInput
          fullWidth={true}
          labelText={"CCI Key"}
          maxLength={5}
          onKeyPress={(e) => {
            StringMethod(e);
          }}
          variant={"outlined"}
          onChange={(e) => {
            let obj = _.cloneDeep(saveLkpValues);
            if (e != undefined) {
              let code = rows.filter((sc, i) => {
                return sc.cciKey == e.target.value.replace(/^\s+/, "");
              });
              obj.cciKey = e.target.value;
              if (code.length>0) {
                setIsCodeError(true);
              } else {
                setSaveLkpValues(obj);
                setIsCodeError(false);
              }
            }
          }}
          disabled={isEdit}
          value={isEdit ? saveLkpValues.cciKey : undefined}
        />
        {isCodeError ? (
          <small style={{ color: "red" }}>CCI Key already Exists</small>
        ) : undefined}
        <CustomInput
          fullWidth={true}
          labelText={"CCI Desc"}
          variant={"outlined"}
          onChange={(e) => {
            let obj = _.cloneDeep(saveLkpValues);
            obj.cciDesc = e.target.value.replace(/^\s+/, "");
            setSaveLkpValues(obj);
          }}
          value={saveLkpValues.cciDesc}
        />
        <CustomInput
          fullWidth={true}
          labelText={"CCI Notes"}
          variant={"outlined"}
          onChange={(e) => {
            let obj = _.cloneDeep(saveLkpValues);
            obj.cciNotes = e.target.value.replace(/^\s+/, "");
            setSaveLkpValues(obj);
          }}
          value={saveLkpValues.cciNotes}
        />
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
              Role,null,null,null
            );
            props.lkpInput.allLookUpColumns(col);
            let cciRows = updatedState.cci?.map((cc, i) => {
              return {
                id: i,
                cciKey: cc.cciKey,
                cciDesc: cc.cciDesc,
                cciNotes: cc.cciNotes,
              };
            });
            props.lkpInput.allLookUpRowData(cciRows);
            setRows(cciRows)
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

export default CciLookup;

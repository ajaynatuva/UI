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
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { SPECS_LKP } from "./LookUpConsts";
import { specLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";

const SpecLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(specLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  useEffect(() => {
    if (updatedState.specs.length == 0) {
      let lkpName = SPECS_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = SPECS_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(specLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(specLkpInitialState);
    setIsCodeError(false);
  };

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Spec Code"}
            variant={"outlined"}
            maxLength={3}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return (
                    sc.specCode ==
                    e.target.value.toUpperCase().replace(/^\s+/, "")
                  );
                });
                obj.specCode = e.target.value.toUpperCase();
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setIsCodeError(false);
                  setSaveLkpValues(obj);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.specCode}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>Spec code already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Spec Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.specDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.specDesc}
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
        Role,
        null,
        null,
        null
      );
      props.lkpInput.allLookUpColumns(col);
      let specRows = updatedState.specs?.map((sp, i) => {
        return {
          id: i,
          specCode: sp.specCode,
          specDesc: sp.specDesc,
        };
      });
      props.lkpInput.allLookUpRowData(specRows);
      setRows(specRows);
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
          isCodeError,
        }}
      />
    </div>
  );
};

export default SpecLookup;

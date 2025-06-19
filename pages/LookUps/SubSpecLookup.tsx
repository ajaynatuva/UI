import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import "../../components/FontFamily/fontFamily.css";
import RadioButton from "../../components/RadioButton/RadioButton";
import {
  fetchLookupData,
  postLookupData,
}from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { subSpecInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { SPECS_LKP, SUB_SPEC_LKP } from "./LookUpConsts";

const SubSpecLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(subSpecInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = SUB_SPEC_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(subSpecInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(subSpecInitialState);
    setIsCodeError(false);
  };

  const specCodesub = updatedState.specs?.map((rs) => {
    return { label: rs.specCode, value: rs.specCode };
  });
  useEffect(() => {
    if (updatedState.subSpecs.length == 0) {
      let lkpName = SUB_SPEC_LKP;
      fetchLookupData(dispatch, lkpName);
    }
    if (updatedState.specs.length == 0) {
      let lkpName = SPECS_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomSelect
            options={specCodesub}
            labelText={"Spec code"}
            isDisabled={isEdit}
            onSelect={(e) => {
              if (e == null) {
                setSaveLkpValues(subSpecInitialState);
              } else {
                let obj = _.cloneDeep(saveLkpValues);
                obj.specCode = e.value.replace(/^\s+/, "");
                setSaveLkpValues(obj);
              }
            }}
            value={specCodesub.filter(function (option) {
              return option.value == saveLkpValues.specCode;
            })}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Sub Spec Code"}
            variant={"outlined"}
            maxLength={5}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.subSpecCode == e.target.value.toUpperCase();
                });
                obj.subSpecCode = e.target.value
                  .toUpperCase()
                  .replace(/^\s+/, "");
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setIsCodeError(false);
                  setSaveLkpValues(obj);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.subSpecCode}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>SubSpec code already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Sub Spec Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.subSpecDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.subSpecDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"CMS Speciality Code"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.cmsSpecialityCode = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.cmsSpecialityCode}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Taxonomy Code"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.taxonomyCode = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.taxonomyCode}
          />
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "5px" }}
        >
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <span>Misc ?</span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.miscB == "YES" || saveLkpValues.miscB == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.miscB = 1;
                }

                saveLkpValues.miscB = obj;
                setSaveLkpValues(obj);
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.miscB == "NO" || saveLkpValues.miscB == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.miscB = 0;
                }
                saveLkpValues.miscB = obj;

                setSaveLkpValues(obj);
              }}
            />
          </div>
        </div>
      </>
    );
  }

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
      let subSpecRows = updatedState.subSpecs?.map((sp, i) => {
        return {
          id: i,
          specCode: sp.specCode,
          subSpecCode: sp.subspecCode,
          subSpecDesc: sp.subspecDesc,
          cmsSpecialityCode: sp.cmsSpecialityCode,
          taxonomyCode: sp.taxonomyCode,
          deletedB: sp.deletedB,
          miscB: sp.miscB == 0 ? "NO" : "YES",
        };
      });
      props.lkpInput.allLookUpRowData(subSpecRows);
      setRows(subSpecRows);
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

export default SubSpecLookup;

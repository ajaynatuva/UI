import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import RadioButton from "../../components/RadioButton/RadioButton";
import { fetchLookupData, postLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { MinMaxAgeInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MIN_MAX_AGE_LKP } from "./LookUpConsts";
import { StringMethod } from "../../redux/ApiCallAction/Validations/StringValidation";

const MinMaxAgeLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(MinMaxAgeInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  useEffect(() => {
    if (updatedState.minMax.length == 0) {
      let lkpName = MIN_MAX_AGE_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(MinMaxAgeInitialState);
    setIsCodeError(false);
  };

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Min Max Age Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.minMaxAgeDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.minMaxAgeDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Age Years"}
            variant={"outlined"}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.ageYears = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.ageYears}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Age Months"}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.ageMonths = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.ageMonths}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Age Days"}
            onKeyPress={(e) => {
              StringMethod(e);
            }}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.ageDays = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.ageDays}
          />
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "10px" }}
        >
          <div className="col-sm-2">
            <span style={{ fontSize: 12 }}>Equals ?</span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label="Yes"
              checked={
                saveLkpValues.equalsB == "YES" ||
                saveLkpValues.equalsB == 1 ||
                saveLkpValues.equalsB == -1 ||
                saveLkpValues.equalsB == 2
                  ? true
                  : false
              }
              style={{ marginLeft: "23px" }}
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.equalsB = 1;
                  saveLkpValues.equalsB = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.equalsB == "NO" || saveLkpValues.equalsB == 0
                  ? true
                  : false
              }
              style={{ marginLeft: "23px" }}
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.equalsB = obj;
                if (e.target.checked) {
                  obj.equalsB = 0;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "10px" }}
        >
          <div className="col-sm-3">
            <span style={{ fontSize: 12 }}>Min vs Max ?</span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.minVsMaxB == "YES" ||
                saveLkpValues.minVsMaxB == 1 ||
                saveLkpValues.minVsMaxB == -1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.minVsMaxB = 1;
                  saveLkpValues.minVsMaxB = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.minVsMaxB == "NO" || saveLkpValues.minVsMaxB == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.minVsMaxB = obj;
                if (e.target.checked) {
                  obj.minVsMaxB = 0;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = MIN_MAX_AGE_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(MinMaxAgeInitialState);
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
      let minMaxRows = updatedState.minMax?.map((sp, i) => {
        return {
          id: i,
          minMaxAgeLkpId: sp.minMaxAgeLkpId,
          minMaxAgeDesc: sp.minMaxAgeDesc,
          ageYears: sp.ageYears,
          ageMonths: sp.ageMonths,
          ageDays: sp.ageDays,
          equals: sp.equalsB == 0 ? "NO" : "YES",
          minVsMax: sp.minVsMaxB == 0 ? "NO" : "YES",
        };
      });
      props.lkpInput.allLookUpRowData(minMaxRows);
      setRows(minMaxRows);
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
        }}
      />
    </div>
  );
};

export default MinMaxAgeLookup;

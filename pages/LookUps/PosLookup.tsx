import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import RadioButton from "../../components/RadioButton/RadioButton";
import {
  fetchLookupData, postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { posLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { POS_LKP_DATA } from "./LookUpConsts";

const PosLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(posLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = POS_LKP_DATA;
    postLookupData(dispatch,obj,isEdit,lkpName);
    setSaveLkpValues(posLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(posLkpInitialState);
    setIsCodeError(false);
  };

  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"POS Code"}
            variant={"outlined"}
            maxLength={2}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return (
                    sc.posCode.toUpperCase() == e.target.value.toUpperCase().replace(/^\s+/, "")
                  );
                });
                obj.posCode = e.target.value.toUpperCase().replace(/^\s+/, "");
                if (code.length>0) {
                  setIsCodeError(true);
                }
                 else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.posCode}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>POS Code already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"POS Name"}
            maxLength={100}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.posName = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.posName}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"POS Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.posDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.posDesc}
          />
        </div>
        <div
          className="row"
          style={{ position: "relative", right: "10px", top: "10px" }}
        >
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <span
              style={{
                fontSize: 12,
              }}
            >
              Facility ?
            </span>
          </div>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.facilityB == "YES" || saveLkpValues.facilityB == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.facilityB = 1;
                  saveLkpValues.facilityB = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.facilityB == "NO" || saveLkpValues.facilityB == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.facilityB = 0;
                  saveLkpValues.facilityB = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }
  useEffect(() => {
    if (updatedState.pos.length == 0) {
      let lkpName = POS_LKP_DATA;
      fetchLookupData(dispatch,lkpName);
    }
  }, []);
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
      let posRows = updatedState.pos?.map((sp, i) => {
        return {
          id: i,
          posCode: sp.posCode,
          posName: sp.posName,
          posDesc: sp.posDesc,
          facility: sp.facilityB == 0 ? "NO" : "YES",
        };
      });
      props.lkpInput.allLookUpRowData(posRows);
      setRows(posRows);
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

export default PosLookup;

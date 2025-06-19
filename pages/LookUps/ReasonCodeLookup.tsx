import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import RadioButton from "../../components/RadioButton/RadioButton";
import {
  fetchLookupData,
  postLookupData,
} from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { reasonCodeLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { REASON_CODE_LKP } from "./LookUpConsts";

const ReasonCodeLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(reasonCodeLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = REASON_CODE_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(reasonCodeLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(reasonCodeLkpInitialState);
    setIsCodeError(false);
  };
  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Reason Code"}
            variant={"outlined"}
            maxLength={10}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return (
                    sc.reasonCode.toUpperCase() ==
                    e.target.value.toUpperCase().replace(/^\s+/, "")
                  );
                });
                obj.reasonCode = e.target.value
                  .toUpperCase()
                  .replace(/^\s+/, "");
                if (code.length > 0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.reasonCode}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>Reason Code already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Reason Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.reasonDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.reasonDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Challenge Code"}
            variant={"outlined"}
            maxLength={5}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.challengeCode = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.challengeCode}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Challenge Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.challengeDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.challengeDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"PCO Code"}
            variant={"outlined"}
            maxLength={5}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.pcoCode = e.target.value.toUpperCase().replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.pcoCode}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"HIPAA Code"}
            variant={"outlined"}
            maxLength={5}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.hipaaCode = e.target.value.toUpperCase().replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.hipaaCode}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"HIPAA Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.hippaDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.hippaDesc}
          />
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "5px" }}
        >
          <div className="col-sm-3" style={{ marginRight: "0px" }}>
            <span
              style={{
                fontSize: 12,
              }}
            >
              Deactivated :
            </span>
          </div>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.deactivatedb == "YES" ||
                saveLkpValues.deactivatedb == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.deactivatedb = 1;
                  saveLkpValues.deactivatedb = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.deactivatedb == "NO" ||
                saveLkpValues.deactivatedb == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.deactivatedb = obj;
                if (e.target.checked) {
                  obj.deactivatedb = 0;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "5px" }}
        >
          <div className="col-sm-3" style={{ marginRight: "0px" }}>
            <span
              style={{
                fontSize: 12,
              }}
            >
              Custom :
            </span>
          </div>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.customb == "YES" || saveLkpValues.customb == 1
                  ? true
                  : false
              }
              style={{ marginRight: 0 }}
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.customb = 1;
                  saveLkpValues.customb = obj;
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.customb == "NO" || saveLkpValues.customb == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.customb = obj;
                if (e.target.checked) {
                  obj.customb = 0;
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
    if (updatedState.reason.length == 0) {
      let lkpName = REASON_CODE_LKP;
      fetchLookupData(dispatch, lkpName);
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
        Role,
        null,
        null,
        null
      );
      props.lkpInput.allLookUpColumns(col);
      let reasonRows = updatedState.reason?.map((sp, i) => {
        return {
          id: i,
          reasonCode: sp.reasonCode,
          reasonDesc: sp.reasonDesc,
          ChallengeCode: sp.challengeCode,
          ChallengeDesc: sp.challengeDesc,
          PCOCode: sp.pcoCode,
          HIPAACode: sp.hipaaCode,
          HIPAADesc: sp.hippaDesc,
          deactivated: sp.deactivatedb == 0 ? "NO" : "YES",
          custom: sp.customb == 0 ? "NO" : "YES",
        };
      });
      props.lkpInput.allLookUpRowData(reasonRows);
      setRows(reasonRows);
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

export default ReasonCodeLookup;

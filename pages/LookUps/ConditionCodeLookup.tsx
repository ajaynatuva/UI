import _ from "lodash";
import { default as Moment, default as moment } from "moment";
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
import { conditionLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { CONDITION_CODE_LKP } from "./LookUpConsts";

const ConditionCodeLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(conditionLkpInitialState);
  const [createDate, setCreateDate] = useState("");
  const [startDatePost, setStartDatePost] = useState("");
  const [endDatePost, setEndDatePost] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  useEffect(() => {
    if (updatedState.condition.length == 0) {
          let lkpName = CONDITION_CODE_LKP;
          fetchLookupData(dispatch,lkpName);
    }
  },[]);
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(conditionLkpInitialState);
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
            labelText={"Cond Code"}
            variant={"outlined"}
            maxLength={2}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.condCode == e.target.value.replace(/^\s+/, "");
                });
                obj.condCode = e.target.value.replace(/^\s+/, "");
                if (code.length>0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.condCode}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>CondCode already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Cond Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.condDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.condDesc}
          />
        </div>
        <div className="row" style={{ position: "relative", right: "10px" }}>
          <div className="col-sm-3">
            <CustomInput
              id="date"
              type="date"
              variant={"outlined"}
              labelText={"Start Date"}
              value={
                isEdit
                  ? Moment(saveLkpValues.startDate).format("YYYY-MM-DD")
                  : createDate
              }
              onChange={(event) => {
                saveLkpValues.startDate = event.target.value;
                setStartDatePost(event.target.value);
                setCreateDate(event.target.value);
              }}
              InputProps={{
                style: {
                  height: 34,
                  width: "100%",
                },
              }}
            />
          </div>
          <div className="col-sm-3">
            <CustomInput
              id="date"
              type="date"
              variant={"outlined"}
              labelText={"End Date"}
              value={
                isEdit
                  ? Moment(saveLkpValues.endDate).format("YYYY-MM-DD")
                  : endDate
              }
              onChange={(event) => {
                saveLkpValues.endDate = event.target.value;
                setEndDatePost(event.target.value);
                setEndDate(event.target.value);
              }}
              InputProps={{
                style: {
                  height: 34,
                  width: "100%",
                },
              }}
            />
          </div>
        </div>
      </>
    );
  }
  function saveLkpFields() {
    let obj = {};
    saveLkpValues.startDate = Moment(saveLkpValues.startDate).format("YYYY-MM-DD");
    saveLkpValues.endDate = Moment(saveLkpValues.endDate).format("YYYY-MM-DD");
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpNmae = CONDITION_CODE_LKP;
    postLookupData(dispatch,obj,isEdit,lkpNmae);
    setSaveLkpValues(conditionLkpInitialState);
  }
  useEffect(() => {
    setTimeout(() => {
      let col = LookUpColumns(
        selectedLookup,
        saveLkpValues,
        handleUpdateObj,
        Role,null,null,null
      );
      props.lkpInput.allLookUpColumns(col);
      let conditionCol = updatedState.condition?.map((sp, i) => {
        return {
          id: sp.condId,
          condCode: sp.condCode,
          condDesc: sp.condDesc,
          startDate:
            sp.startDate == null
              ? ""
              : moment(sp.startDate).format("MM-DD-YYYY"),
          endDate:
            sp.endDate == null ? "" : moment(sp.endDate).format("MM-DD-YYYY"),
        };
      });
      props.lkpInput.allLookUpRowData(conditionCol);
      setRows(conditionCol);
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

export default ConditionCodeLookup;

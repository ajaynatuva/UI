import _ from "lodash";
import { default as Moment, default as moment } from "moment";
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
import { billTypeInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { BILL_TYPE_LKP } from "./LookUpConsts";

const BillTypeLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(billTypeInitialState);
  const [createDate, setCreateDate] = useState("");
  const [startDatePost, setStartDatePost] = useState("");
  const [endDatePost, setEndDatePost] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  useEffect(() => {
    if (updatedState.billType.length == 0) {
      let lkpName = BILL_TYPE_LKP;
      fetchLookupData(dispatch,lkpName);
    }
  },[]);
  const handleUpdateObj = (updatedObj, edit) => {
    setIsEdit(edit);
    setSaveLkpValues(updatedObj);
    setStartDatePost(updatedObj.startDate);
    setEndDatePost(updatedObj.endDate);
  };
  const resetFields = (resetField) => {
    setSaveLkpValues(billTypeInitialState);
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
            labelText={"Bill Type"}
            variant={"outlined"}
            maxLength={4}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return sc.billType == e.target.value.replace(/^\s+/, "");
                });
                obj.billType = e.target.value;
                if (code.length>0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.billType}
          />
          {isCodeError ? (
            <small style={{ color: "red" }}>BillType already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Bill Type Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.billTypeDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.billTypeDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Claim Type Match"}
            variant={"outlined"}
            maxLength={1}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.claimTypeMatch = e.target.value;
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.claimTypeMatch}
          />
        </div>
        <div className="row">
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
                  position: "relative",
                  right: "10px",
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

        <div className="row" style={{ position: "relative", top: "10px", right: "5px" }}>
          <div className="col-sm-2" style={{ marginRight: "0px" }}>
            <small style={{ fontSize: "12px" }}>In Patient?</small>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.inpatientB == "YES" || saveLkpValues.inpatientB == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.inpatientB = 1;
                }
                saveLkpValues.inpatientB = obj;
                setSaveLkpValues(obj);
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.inpatientB == "NO" || saveLkpValues.inpatientB == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.inpatientB = obj;
                if (e.target.checked) {
                  obj.inpatientB = 0;
                }
                setSaveLkpValues(obj);
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
    let lkpName = BILL_TYPE_LKP;
    postLookupData(dispatch,obj,isEdit,lkpName);
    setSaveLkpValues(billTypeInitialState);
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
      let billTypeCol = updatedState.billType?.map((sp, i) => {
        return {
          id: i,
          billType: sp.billType,
          billTypeDesc: sp.billTypeDesc,
          Inpatient: sp.inpatientB == 0 ? "NO" : "YES",
          startDate:
            sp.startDate == null
              ? ""
              : moment(sp.startDate).format("MM-DD-YYYY"),
          endDate:
            sp.endDate == null ? "" : moment(sp.endDate).format("MM-DD-YYYY"),
          claimTypeMatch: sp.claimTypeMatch,
        };
      });
      props.lkpInput.allLookUpRowData(billTypeCol);
      setRows(billTypeCol)
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

export default BillTypeLookup;

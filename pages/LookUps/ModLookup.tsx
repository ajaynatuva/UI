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
import { EDIT_MOD_LKP_DATA, MOD_LKP, POST_MOD_LKP_DATA } from "./LookUpConsts";
import {
  modLkpInitialState,
} from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";

const ModLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(modLkpInitialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const [createDate, setCreateDate] = useState("");
  const [startDatePost, setStartDatePost] = useState("");
  const [endDatePost, setEndDatePost] = useState("");
  const [endDate, setEndDate] = useState("");
  const [is59groupsIntialvalue, setIs59groupsIntialvalue] =
    useState(modLkpInitialState);

  function saveLkpFields() {
    let obj = {};
    saveLkpValues.startDate = Moment(saveLkpValues.startDate).format("YYYY-MM-DD");
    saveLkpValues.endDate = Moment(saveLkpValues.endDate).format("YYYY-MM-DD");
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    if (!isEdit) {
      let lkpName = POST_MOD_LKP_DATA;
      postLookupData(dispatch,obj,isEdit,lkpName);
    } else {
      let lkpName =  EDIT_MOD_LKP_DATA;
      postLookupData(dispatch,obj,isEdit,lkpName);
    }
    setSaveLkpValues(modLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(modLkpInitialState);
    setIsCodeError(false);
  };

  useEffect(() => {
    if (updatedState.mod.length == 0) {
      let lkpName = MOD_LKP;
      fetchLookupData(dispatch,lkpName);
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
          <CustomInput
            fullWidth={true}
            labelText={"CPT MOD"}
            variant={"outlined"}
            maxLength={2}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              if (e != undefined) {
                let code = rows.filter((sc) => {
                  return (
                    sc.cptMod.toUpperCase() == e.target.value.toUpperCase()
                  );
                });
                obj.cptMod = e.target.value.toUpperCase();
                if (code.length>0) {
                  setIsCodeError(true);
                } else {
                  setSaveLkpValues(obj);
                  setIsCodeError(false);
                }
              }
            }}
            disabled={isEdit}
            value={saveLkpValues.cptMod}
          />

          {isCodeError ? (
            <small style={{ color: "red" }}>CPT MOD already Exists</small>
          ) : undefined}
        </div>
        <div className="row">
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
        </div>
        <div className="row" style={{ position: "relative", right: "11px" }}>
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
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "10px" }}
        >
          <div className="col-sm-3">
            <span
              style={{
                fontSize: 12,
              }}
            >
              Ambulance MOD ?
            </span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.ambulanceModB == "YES" ||
                saveLkpValues.ambulanceModB == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.ambulanceModB = 1;
                  saveLkpValues.ambulanceModB = obj;
                  setSaveLkpValues(obj);
                }
              }}
              disabled={isEdit}
              value={saveLkpValues.ambulanceModB}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.ambulanceModB == "NO" ||
                saveLkpValues.ambulanceModB == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.ambulanceModB = obj;
                if (e.target.checked) {
                  obj.ambulanceModB = 0;
                  setSaveLkpValues(obj);
                }
              }}
              disabled={isEdit}
              value={saveLkpValues.ambulanceModB}
            />
          </div>
        </div>
        <div
          className="row"
          style={{ position: "relative", top: "10px", right: "10px" }}
        >
          <div className="col-sm-3">
            <span
              style={{
                fontSize: 12,
              }}
            >
              Is CCI ?
            </span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.isCci == "YES" || saveLkpValues.isCci == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.isCci = 1;
                  if (isEdit) {
                    obj.is_59_group = is59groupsIntialvalue.is_59_group;
                  } else {
                    obj.is_59_group = undefined;
                  }
                  setSaveLkpValues(obj);
                }
              }}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.isCci == "NO" || saveLkpValues.isCci == 0
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.isCci = obj;
                if (e.target.checked) {
                  obj.isCci = 0;
                  obj.is_59_group = 0;
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
            <span
              style={{
                fontSize: 12,
              }}
            >
              Is 59 Group ?
            </span>
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"Yes"}
              checked={
                saveLkpValues.is_59_group == "YES" ||
                saveLkpValues.is_59_group == 1
                  ? true
                  : false
              }
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                if (e.target.checked) {
                  obj.is_59_group = 1;
                  saveLkpValues.is_59_group = obj;
                  setSaveLkpValues(obj);
                }
              }}
              disabled={saveLkpValues.isCci == 0 || saveLkpValues.isCci == null}
            />
          </div>
          <div className="col-sm-2">
            <RadioButton
              label={"No"}
              checked={
                saveLkpValues.is_59_group == "NO" ||
                saveLkpValues.is_59_group == 0
                  ? true
                  : false
              }
              disabled={saveLkpValues.isCci == 0 || saveLkpValues.isCci == null}
              onChange={(e) => {
                let obj = _.cloneDeep(saveLkpValues);
                saveLkpValues.is_59_group = obj;
                if (e.target.checked) {
                  obj.is_59_group = 0;
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
          setTimeout(() => {
            let col = LookUpColumns(
              selectedLookup,
              saveLkpValues,
              handleUpdateObj,
              Role,null,null,null
            );
            props.lkpInput.allLookUpColumns(col);
            let modRows = updatedState.mod?.map((md, i) => {
              return {
                id: i,
                cptMod: md.cptMod,
                description: md.description,
                ambulanceMod: md.ambulanceModB == 0 ? "NO" : "YES",
                isCci: md.isCci == 0 ? "NO" : "YES",
                is_59_group: md.is_59_group == 0 ? "NO" : "YES",
                startDate:
                md.startDate == null
                    ? ""
                    : moment(md.startDate).format("MM-DD-YYYY"),
                endDate:
                md.endDate == null
                    ? ""
                    : moment(md.endDate).format("MM-DD-YYYY"),
              };
            });
            props.lkpInput.allLookUpRowData(modRows);
            setRows(modRows);
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

export default ModLookup;

import _ from "lodash";
import { default as Moment, default as moment } from "moment";
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
import { policyCategoryLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { POLICY_CATEGORY_LKP } from "./LookUpConsts";
import { validateNumberMethod } from "../../redux/ApiCallAction/Validations/StringValidation";
const PolicyCategoryLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(
    policyCategoryLkpInitialState
  );
  const [createDate, setCreateDate] = useState("");
  const [lastUpdt, setLastUpdt] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (updatedState.policyCategory.length == 0) {
      let lkpName = POLICY_CATEGORY_LKP;
      fetchLookupData(dispatch, lkpName);
    }
  }, []);

  function saveLkpFields() {
    let obj = {};
    saveLkpValues.hardDenialB = 0;
    saveLkpValues.lastUpdatedAt = Moment(saveLkpValues.lastUpdatedAt).format(
      "YYYY-MM-DD"
    );
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    let lkpName = POLICY_CATEGORY_LKP;
    postLookupData(dispatch, obj, isEdit, lkpName);
    setSaveLkpValues(policyCategoryLkpInitialState);
  }

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(policyCategoryLkpInitialState);
    setIsCodeError(false);
  };
  function showLKPFields() {
    return (
      <>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Policy Category Desc"}
            variant={"outlined"}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.policyCategoryDesc = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.policyCategoryDesc}
          />
        </div>
        <div className="row">
          <CustomInput
            fullWidth={true}
            labelText={"Order of Operation"}
            variant={"outlined"}
            maxLength={10}
            onChange={(e) => {
              let obj = _.cloneDeep(saveLkpValues);
              obj.priority = e.target.value.replace(/^\s+/, "");
              setSaveLkpValues(obj);
            }}
            value={saveLkpValues.priority}
            onKeyPress={(e) => validateNumberMethod(e)}
          />
          <div className="row">
            <CustomInput
              id="date"
              type="date"
              variant={"outlined"}
              labelText={"Last Updated At"}
              value={
                isEdit
                  ? Moment(saveLkpValues.lastUpdatedAt).format("YYYY-MM-DD")
                  : createDate
              }
              onChange={(event) => {
                saveLkpValues.lastUpdatedAt = event.target.value;
                setCreateDate(event.target.value);
                setLastUpdt(event.target.value);
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
      let policyCatRows = updatedState.policyCategory?.map((pc, i) => {
        return {
          id: i,
          policyCategoryLkpId: pc.policyCategoryLkpId,
          policyCategoryDesc: pc.policyCategoryDesc,
          priority: pc.priority,
          orderOfOperation: pc.priority,
          hardDenial: pc.hardDenialB == 0 ? "NO" : "YES",
          lastUpdatedAt:
            pc.lastUpdatedAt == null
              ? ""
              : moment(pc.lastUpdatedAt).format("MM-DD-YYYY"),
        };
      });
      props.lkpInput.allLookUpRowData(policyCatRows);
      setRows(policyCatRows);
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

export default PolicyCategoryLookup;

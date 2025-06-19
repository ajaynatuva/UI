import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { modifierPayPercentageInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";

const ModifierPayPercentage = (props) => {
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const [saveLkpValues, setSaveLkpValues] = useState(
    modifierPayPercentageInitialState
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);

  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  function saveLkpFields() {
    let obj = {};
    Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
    setSaveLkpValues(modifierPayPercentageInitialState);
  }
  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(modifierPayPercentageInitialState);
    setIsCodeError(false);
  };
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
      let modifierPayPercentageRows =
        updatedState.ModifierPayPercentageData?.map((mp, d) => {
          return {
            mppKey: mp.mppKeyFk,
            modifier: mp.modifier,
            allowedPercentage: mp.allowedPercentage,
            preOp: mp.preOp,
            intraOp: mp.intraOp,
            postOp: mp.postOp,
          };
        });
          props.lkpInput.allLookUpRowData(modifierPayPercentageRows);
    }, 10);
  }, [updatedState]);

  function showLKPFields() {
    return null;
  }

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

export default ModifierPayPercentage;

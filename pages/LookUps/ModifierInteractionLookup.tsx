import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../components/FontFamily/fontFamily.css";
import { fetchLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { ModifierPriorityLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MODIFIER_INTERACTION_LKP } from "./LookUpConsts";

const ModifierInteractionLookup = (props) => {
  const dispatch = useDispatch();
  const selectedLookup = props.lkpInput.selectedLookup;
  const Role = props.lkpInput.Role;
  const popUp = props.lkpInput.openLkp;
  const fromLkpChilds = props.lkpInput.fromLkpchilds;
  const [rows, setRows] = useState([]);
  const updatedState: LookUpState = useSelector(
    (state: any) => state.lookupReducer
  );
  const [saveLkpValues, setSaveLkpValues] = useState(
    ModifierPriorityLookUpInitialState
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  useEffect(() => {
    if (updatedState.ModifierInteraction.length == 0) {
      let lkpNmae = MODIFIER_INTERACTION_LKP;
      fetchLookupData(dispatch,lkpNmae);
    }
  }, []);

  const fromLkpEditchilds = (msg) => {
    setIsEdit(msg);
  };

  const resetFields = (resetField) => {
    setSaveLkpValues(ModifierPriorityLookUpInitialState);
    setIsCodeError(false);
  };

  function showLKPFields() {
    return null;
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
        Role,null,null,null
      );
      props.lkpInput.allLookUpColumns(col);
      let modInteractionRows = updatedState.ModifierInteraction?.map((mi, i) => {
        return {
          id: i,
          mitKey: mi.mitKey,
          modifier: mi.modifier,
          editsOffSameModifier: mi.hitsOffSameModifier == 0 ? "NO" : "YES",
          editsOffOtherModifier: mi.hitsOffOtherModifier == 0 ? "NO" : "YES",
          editsOffBlankModifier: mi.hitsOffBlankModifier == 0 ? "NO" : "YES",
          otherEditsOffThisModifier:
            mi.otherHitsOffThisModifier == 0 ? "NO" : "YES",
          blankEditsOffThisModifier:
            mi.blankHitsOffThisModifier == 0 ? "NO" : "YES",
          modifierException: mi.modifierException,
        };
      });
      props.lkpInput.allLookUpRowData(modInteractionRows);
      setRows(modInteractionRows);
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

export default ModifierInteractionLookup;

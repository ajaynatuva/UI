import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../components/FontFamily/fontFamily.css";
import { fetchLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { ModifierPriorityLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";
import { MODIFIER_PRIORITY_LKP } from "./LookUpConsts";

const ModifierPriorityLookUp = (props) => {
    const dispatch = useDispatch();
    const selectedLookup = props.lkpInput.selectedLookup;
    const Role = props.lkpInput.Role;
    const popUp = props.lkpInput.openLkp;
    const fromLkpChilds = props.lkpInput.fromLkpchilds;
    const [rerender, setRerender] = useState(false);
    const updatedState: LookUpState = useSelector(
        (state: any) => state.lookupReducer
    );
    const [saveLkpValues, setSaveLkpValues] = useState(ModifierPriorityLookUpInitialState);
    const [isEdit, setIsEdit] = useState(false);
    const [isCodeError, setIsCodeError] = useState(false);
    useEffect(() => {
        if (updatedState.ModifierPriority.length == 0) {
            let lkpName = MODIFIER_PRIORITY_LKP;
            fetchLookupData(dispatch,lkpName);
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
         let col = LookUpColumns(selectedLookup,saveLkpValues,handleUpdateObj,Role,null,null,null);
                        props.lkpInput.allLookUpColumns(col);
                        let modPriorityRows = updatedState.ModifierPriority?.map((mp, i) => {
                 return {
                         id: i,
                         modifier: mp.modifier,
                         priority: mp.priority
                        };
                        });
                        props.lkpInput.allLookUpRowData(modPriorityRows);
                        setRerender(!rerender);
                    }, 10);

    }, [ updatedState]);

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

export default ModifierPriorityLookUp;

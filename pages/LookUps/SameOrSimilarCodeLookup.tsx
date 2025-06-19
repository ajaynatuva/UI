import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../components/FontFamily/fontFamily.css";
import { fetchLookupData } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { SAME_OR_SIMILAR_CODE_LKP } from "./LookUpConsts";
import { ModifierPriorityLookUpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";

const SameOrSimilarCodeLookup = (props) => {
    const dispatch = useDispatch();
    const selectedLookup = props.lkpInput.selectedLookup;
    const Role = props.lkpInput.Role;
    const popUp = props.lkpInput.openLkp;
    const fromLkpChilds = props.lkpInput.fromLkpchilds;
    const updatedState: LookUpState = useSelector(
        (state: any) => state.lookupReducer
    );
    const [saveLkpValues, setSaveLkpValues] = useState(ModifierPriorityLookUpInitialState);
    const [isEdit, setIsEdit] = useState(false);
    const [isCodeError, setIsCodeError] = useState(false);

    useEffect(() => {
        if (updatedState.SameOrSimilarCodes.length == 0) {
            let lkpName = SAME_OR_SIMILAR_CODE_LKP;
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
            let col = LookUpColumns(
                selectedLookup,
                saveLkpValues,
                handleUpdateObj,
                Role,null,null,null
            );
            props.lkpInput.allLookUpColumns(col);
            let sameOrSimRows = updatedState.SameOrSimilarCodes?.map((si, i) => {
                return {
                    cptCode: si.cptCode,
                    sameOrSimCode: si.sameOrSimCode,
                    dosFrom: si.dosFrom == null ? "" : moment(si.dosFrom).format("MM-DD-YYYY"),
                    dosTo: si.dosTo == null ? "" : moment(si.dosTo).format("MM-DD-YYYY")

                };
            });
            props.lkpInput.allLookUpRowData(sameOrSimRows);
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

export default SameOrSimilarCodeLookup;

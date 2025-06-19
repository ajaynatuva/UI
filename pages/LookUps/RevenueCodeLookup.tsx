import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput/CustomInput";
import "../../components/FontFamily/fontFamily.css";
import {  
    fetchLookupData,
    postLookupData,
     } from "../../redux/ApiCalls/LookUpsApi/LookUpsApi";
import { LookUpState } from "../../redux/reducers/LookUpReducer/LookUpReducer";
import { TaskState } from "../../redux/reducers/TaskReducer/TaskReducer";
import "../LookUps/LookUp.css";
import DailogBoxForAddandEdit from "./DailogBoxForAddandEdit";
import { REVENUE_CODE_LKP } from "./LookUpConsts";
import { revenueCodeLkpInitialState } from "./LookUpInitialState";
import { LookUpColumns } from "./LookupColumns";

const RevenueCodeLookup = (props) => {
    const dispatch = useDispatch();
    const selectedLookup = props.lkpInput.selectedLookup;
    const Role = props.lkpInput.Role;
    const popUp = props.lkpInput.openLkp;
    const fromLkpChilds = props.lkpInput.fromLkpchilds;
    const [rows, setRows] = useState([]);
    const updatedState: LookUpState = useSelector(
        (state: any) => state.lookupReducer
    );
    const [saveLkpValues, setSaveLkpValues] = useState(revenueCodeLkpInitialState);
    const [isEdit, setIsEdit] = useState(false);
    const [isCodeError, setIsCodeError] = useState(false);
    useEffect(() => {
        if (updatedState.revenue.length == 0) {
            let lkpName = REVENUE_CODE_LKP;
            fetchLookupData(dispatch,lkpName);
        }
    },[]);
    const handleUpdateObj = (updatedObj, edit) => {
        setIsEdit(edit);
        setSaveLkpValues(updatedObj);
    };
    const resetFields = (resetField) => {
        setSaveLkpValues(revenueCodeLkpInitialState);
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
                        labelText={"Rev Code"}
                        variant={"outlined"}
                        maxLength={4}
                        onChange={(e) => {
                            let obj = _.cloneDeep(saveLkpValues);
                            if (e != undefined) {
                                let code = rows.filter((sc) => {
                                    return sc.revCode == e.target.value.toUpperCase().replace(/^\s+/, "");
                                });
                                obj.revCode = e.target.value.toUpperCase().replace(/^\s+/, "");
                                if (code.length>0) {
                                    setIsCodeError(true);
                                } else {                                    
                                    setSaveLkpValues(obj);
                                    setIsCodeError(false);
                                }
                            }
                        }}
                        disabled={isEdit}
                        value={saveLkpValues.revCode}
                    />
                    {isCodeError ? (
                        <small style={{ color: "red" }}>
                            RevCode already Exists
                        </small>
                    ) : undefined}
                </div>
                <div className="row">

                    <CustomInput
                        fullWidth={true}
                        labelText={"Rev Desc"}
                        variant={"outlined"}
                        onChange={(e) => {
                            let obj = _.cloneDeep(saveLkpValues);
                            obj.revDesc = e.target.value.replace(/^\s+/, "");
                            setSaveLkpValues(obj);
                        }}
                        value={saveLkpValues.revDesc}
                    />
                </div>
            </>
        );
    }
    function saveLkpFields() {
        let obj = {};
        Object.entries(saveLkpValues).forEach(([key, val]) => (obj[key] = val));
        let lkpName = REVENUE_CODE_LKP;
        postLookupData(dispatch,obj,isEdit,lkpName);
        setSaveLkpValues(revenueCodeLkpInitialState);
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
           let revenueCodeCol = updatedState.revenue?.map((sp, i) => {
                return {
                    id: i,
                    revCode: sp.revCode,
                    revDesc: sp.revDesc,
                };
            });
            props.lkpInput.allLookUpRowData(revenueCodeCol);
            setRows(revenueCodeCol);
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

export default RevenueCodeLookup;
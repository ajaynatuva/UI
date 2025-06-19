import { DIAGNOSIS_FIELDS, RESET_DIAGNOSIS_FIELDS } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants";

export interface DiagnosisFieldState {
    policyDiagnosisKey: undefined,
    policyId: number,
    diagFrom: String;
    diagTo: String;
    dosFrom: undefined;
    dosTo: undefined;
    action: any;
    exclusion: any;
    headerLevel: any;
    principalDx: any;
    onlyDx: any;
    actionKeyValue: any;
    getDiagnosisTableData:any[],
    editDiagnosisData:any[],
    postDiagnosisData:any[],
    dxDataToExcel:any[],
}

const DiagnosisFieldsInitialState: DiagnosisFieldState = {
    policyDiagnosisKey: undefined,
    policyId: undefined,
    diagFrom: "",
    diagTo: "",
    dosFrom: undefined,
    dosTo: undefined,
    action: undefined,
    exclusion: 0,
    headerLevel: 0,
    principalDx: 0,
    onlyDx: 0,
    actionKeyValue: undefined,
    getDiagnosisTableData:[],
    editDiagnosisData:[],
    postDiagnosisData:[],
    dxDataToExcel:[]
} as const;

//Action types
type DiagnosisFields = {
    type: typeof DIAGNOSIS_FIELDS | typeof RESET_DIAGNOSIS_FIELDS;
    payload: Partial<DiagnosisFieldState>;
};

export const DaignosisTabFieldsReducer = (
    state: DiagnosisFieldState = DiagnosisFieldsInitialState,
    action: DiagnosisFields
): DiagnosisFieldState => {
    switch (action.type) {
        case DIAGNOSIS_FIELDS:
            return {
                ...state,
                ...action.payload,
            };
        case RESET_DIAGNOSIS_FIELDS:
            return {
                ...state,
                policyDiagnosisKey: undefined,
                policyId: undefined,
                diagFrom: "",
                diagTo: "",
                dosFrom: undefined,
                dosTo: undefined,
                action: undefined,
                exclusion: undefined,
                headerLevel: 0,
                principalDx: 0,
                onlyDx: 0,
                actionKeyValue: undefined,
                dxDataToExcel:[]
            };
        default:
            return state;
    }
}
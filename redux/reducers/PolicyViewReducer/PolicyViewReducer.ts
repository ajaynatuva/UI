import { GET_DETAILS_TOTAL_DATA, GET_FILTERD_POLICIES_DATA, GET_FILTERD_REASON_DATA, GET_FILTERD_SUB_POLICIES_DATA, GET_MEDICAL_TOTAL_DATA, 
  GET_POLICY_DETAILS_FROM_REASON, GET_REASON_TREE_DATA, GET_SUB_TOTAL_DATA, GET_USED_CAT, TEMP_TOTAL } from '../../ApiCalls/PolicyViewApis/PolicyViewType';
  
  export interface PolicyViewState {
    getLobData: any[];
    getProductData: any[];
    getMedicalTotalData: any[];
    getSubTotalData: any[];
    getDetailsTotaldata: any[];
    getUsedCat: any[];
    getReasonTreeData: any[];
    getPolicyDetailsFromReason: any[];
    tempTotal:any[];
    getFilterdSubPoliciesData:any[];
    getFilterReasonData:any[];
    getFilerdPoliciesData:any[];
  }
  const initialState: PolicyViewState = {
    getLobData: [],
    getProductData: [],
    getMedicalTotalData: [],
    getSubTotalData: [],
    getDetailsTotaldata: [],
    getUsedCat: [],
    getReasonTreeData: [],
    getPolicyDetailsFromReason: [],
    tempTotal:[],
    getFilterdSubPoliciesData:[],
    getFilterReasonData:[],
    getFilerdPoliciesData:[],
  
  };
  
  export default function PolicyViewReducer(
    state = initialState,
    action: { type: string; payload: any }
  ): PolicyViewState {
    switch (action.type) {
      case GET_MEDICAL_TOTAL_DATA:
        return { ...state, getMedicalTotalData: action.payload };
      case GET_SUB_TOTAL_DATA:
        return { ...state, getSubTotalData: action.payload };
      case GET_DETAILS_TOTAL_DATA:
        return { ...state, getDetailsTotaldata: action.payload };
      case GET_USED_CAT:
        return { ...state, getUsedCat: action.payload };
      case GET_REASON_TREE_DATA:
        return { ...state, getReasonTreeData: action.payload };
      case GET_POLICY_DETAILS_FROM_REASON:
        return { ...state, getPolicyDetailsFromReason: action.payload };
        case TEMP_TOTAL:
        return { ...state, tempTotal: action.payload };
        case GET_FILTERD_SUB_POLICIES_DATA:
        return { ...state, getFilterdSubPoliciesData: action.payload };
        case GET_FILTERD_REASON_DATA:
        return { ...state, getFilterReasonData: action.payload };
        case GET_FILTERD_POLICIES_DATA:
        return { ...state, getFilerdPoliciesData: action.payload };
      default:
        return state;
    }
  }
  
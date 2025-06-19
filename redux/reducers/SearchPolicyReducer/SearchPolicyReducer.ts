import {
  SEARCH_CATEGORY,
  CATEGORY_VALUE,
  SEARCH_CLAIM_TYPE,
  CLAIM_TYPE_VALUE,
  SEARCH_CREATED_DATE,
  SEARCH_DEACTIVATED,
  SEARCH_DESCRIPTION,
  SEARCH_DISABLED,
  SEARCH_EBC,
  EBC_VALUE,
  SEARCH_LOB,
  LOB_VALUE,
  SEARCH_MEDICAL_POLICY,
  MEDICAL_POLICY_VALUE,
  SEARCH_POLICY_ID,
  SEARCH_POLICY_NUMBER,
  SEARCH_PRIORITY,
  SEARCH_PRODUCT_TYPE,
  PRODUCT_TYPE_VALUE,
  SEARCH_REASON_CODE,
  REASON_CODE_VALUE,
  SEARCH_REFERENCE,
  RESET,
  SEARCH_SUB_POLICY,
  SUB_POLICY_VALUE,
  CPT_CODE,
  POS,
  BILL_TYPE,
  CLIENT_GROUP_VALUE,
  SEARCH_CLIENT_GROUP_ID,
} from '../../ApiCalls/SearchPolicyApis/SearchPolicyConstants';

export interface SearchPolicyState {
  searchPolicyNumber: String;
  searchPolicyId: String;
  searchCategory: String;
  searchReasonCode: String;
  searchDeactivated: String;
  searchDisabled: String;
  searchLob: String;
  searchProductType: String;
  searchEbc: String;
  searchClaimType: String;
  searchMedicalPolicy: String;
  searchSubPolicy: String;
  searchClientGroupId: String;
  searchReference: String;
  searchDescription: String;
  searchPriority: String;
  searchCreatedDate: String;

  categoryValue: String;
  clientGroupValue: String;
  reasonCodeValue: String;
  ebcValue: String;
  medicalPolicyValue: String;
  subPolicyValue: String;
  lobValue: String;
  productTypeValue: String;
  claimTypeValue: any;
  cptCode: String;
  searchPos: String;
  billType: String;
}
const initialState: SearchPolicyState = {
  searchPolicyNumber: '',
  searchPolicyId: '',
  searchCategory: '',
  searchReasonCode: '',
  searchDeactivated: '',
  searchDisabled: '',
  searchLob: '',
  searchProductType: '',
  searchEbc: '',
  searchClaimType: '',
  searchMedicalPolicy: '',
  searchSubPolicy: '',
  searchClientGroupId: '',
  searchReference: '',
  searchDescription: '',
  searchPriority: '',
  searchCreatedDate: '',

  categoryValue: '',
  clientGroupValue:'',
  reasonCodeValue: '',
  ebcValue: '',
  medicalPolicyValue: '',
  subPolicyValue: '',
  lobValue: '',
  productTypeValue: '',
  claimTypeValue: undefined,
  cptCode: '',
  searchPos: '',
  billType: '',
};

export default function SearchPolicyReducer(
  state = initialState,
  action: { type: string; payload: any }
): SearchPolicyState {
  switch (action.type) {
    case SEARCH_POLICY_NUMBER:
      return { ...state, searchPolicyNumber: action.payload };
    case SEARCH_POLICY_ID:
      return { ...state, searchPolicyId: action.payload };
    case SEARCH_CATEGORY:
      return { ...state, searchCategory: action.payload };
    case SEARCH_REASON_CODE:
      return { ...state, searchReasonCode: action.payload };
    case SEARCH_DEACTIVATED:
      return { ...state, searchDeactivated: action.payload };
    case SEARCH_DISABLED:
      return { ...state, searchDisabled: action.payload };
    case SEARCH_LOB:
      return { ...state, searchLob: action.payload };
    case SEARCH_PRODUCT_TYPE:
      return { ...state, searchProductType: action.payload };
    case SEARCH_EBC:
      return { ...state, searchEbc: action.payload };
    case SEARCH_CLAIM_TYPE:
      return { ...state, searchClaimType: action.payload };
    case SEARCH_MEDICAL_POLICY:
      return { ...state, searchMedicalPolicy: action.payload };
    case SEARCH_SUB_POLICY:
      return { ...state, searchSubPolicy: action.payload };
      case SEARCH_CLIENT_GROUP_ID:
        return {...state,searchClientGroupId: action.payload };
    case SEARCH_REFERENCE:
      return { ...state, searchReference: action.payload };
    case SEARCH_DESCRIPTION:
      return { ...state, searchDescription: action.payload };
    case SEARCH_PRIORITY:
      return { ...state, searchPriority: action.payload };
    case SEARCH_CREATED_DATE:
      return { ...state, searchCreatedDate: action.payload };

    case CATEGORY_VALUE:
      return { ...state, categoryValue: action.payload };
      case CLIENT_GROUP_VALUE:
        return {...state, clientGroupValue:action.payload};
    case REASON_CODE_VALUE:
      return { ...state, reasonCodeValue: action.payload };
    case EBC_VALUE:
      return { ...state, ebcValue: action.payload };
    case MEDICAL_POLICY_VALUE:
      return { ...state, medicalPolicyValue: action.payload };
    case SUB_POLICY_VALUE:
      return { ...state, subPolicyValue: action.payload };
    case LOB_VALUE:
      return { ...state, lobValue: action.payload };
    case PRODUCT_TYPE_VALUE:
      return { ...state, productTypeValue: action.payload };
    case CLAIM_TYPE_VALUE:
      return { ...state, claimTypeValue: action.payload };
    case CPT_CODE:
      return { ...state, cptCode: action.payload };
    case POS:
      return { ...state, searchPos: action.payload };
    case BILL_TYPE:
      return { ...state, billType: action.payload };
    case RESET:
      return {
        ...state,
        searchPolicyNumber: '',
        searchPolicyId: '',
        searchCategory: '',
        searchReasonCode: '',
        searchDeactivated: '',
        searchDisabled: '',
        searchLob: '',
        searchProductType: '',
        searchEbc: '',
        searchClaimType: '',
        searchMedicalPolicy: '',
        searchSubPolicy: '',
        searchClientGroupId:'',
        searchReference: '',
        searchDescription: '',
        searchPriority: '',
        searchCreatedDate: '',
        cptCode: '',
        searchPos: '',
        billType: '',

        categoryValue: '',
        clientGroupValue:'',
        reasonCodeValue: '',
        ebcValue: '',
        medicalPolicyValue: '',
        subPolicyValue: '',
        lobValue: '',
        productTypeValue: '',
        claimTypeValue: undefined,
      };
    default:
      return state;
  }
}

import {
  CLAIM_ID,
  GET_DRGN_CLAIM_REVIW_DATA,
  GET_POLICY_CLAIM,
  GET_REFERENCE_POLICY_CLAIM,
  GET_REFERENCE_SEARCH_CLAIM,
  GET_REF_DRGN_CLAIM_REVIW_DATA,
  RESET_CLAIM_REVIEW,
  TEMP_CLAIM_ID,
} from '../../ApiCalls/ClaimApis/ClaimApiType';

export interface ClaimState {
  getDrgnClaimReviewData: any;
  getPolicyClaim: any;
  tempClaimId: any;
  claimId: any;
  getReferencePolicyClaim: any;
  getRefDrgnClaimReviewData: any;
  getReferenceSearchClaim:any;
}
const initialState: ClaimState = {
  getDrgnClaimReviewData: [],
  getPolicyClaim: [],
  claimId: '',
  tempClaimId: 0,
  getReferencePolicyClaim: [],
  getRefDrgnClaimReviewData: [],
  getReferenceSearchClaim:[],
};

export default function ClaimReducer(
  state = initialState,
  action: { type: string; payload: any }
): ClaimState {
  switch (action.type) {
    case GET_DRGN_CLAIM_REVIW_DATA:
      return { ...state, getDrgnClaimReviewData: action.payload };
    case GET_POLICY_CLAIM:
      return { ...state, getPolicyClaim: action.payload };
    case CLAIM_ID:
      return { ...state, claimId: action.payload };
    case TEMP_CLAIM_ID:
      return { ...state, tempClaimId: action.payload };
    case GET_REF_DRGN_CLAIM_REVIW_DATA:
      return { ...state, getRefDrgnClaimReviewData: action.payload };
    case GET_REFERENCE_POLICY_CLAIM:
      return { ...state, getReferencePolicyClaim: action.payload };
      case GET_REFERENCE_SEARCH_CLAIM:
      return { ...state, getReferenceSearchClaim: action.payload };
    default:
      return state;
  }
}

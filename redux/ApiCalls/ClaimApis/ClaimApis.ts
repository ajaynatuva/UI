import {
  apiUrl,
  policyConfigUrl,
  policyengine,
} from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { SEARCH_CLAIM } from '../NewPolicyTabApis/AllPolicyConstants';
import { GET_TOTAL_NUMBER_OF_ROWS } from '../TaskApis/TaskApiType';
import {
  GET_DRGN_CLAIM_REVIW_DATA,
  GET_POLICY_CLAIM,
  GET_REF_DRGN_CLAIM_REVIW_DATA,
  GET_REFERENCE_POLICY_CLAIM,
  GET_REFERENCE_SEARCH_CLAIM,
} from './ClaimApiType';

export async function getDragonClaimId(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: `${policyengine + apiUrl.getByDragonClaimId}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_DRGN_CLAIM_REVIW_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getPolicyClaim(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: `${policyengine + apiUrl.getPolicyClaim}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_POLICY_CLAIM,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getRefernceClaim(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: `${policyengine + apiUrl.getReferenceClaim}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_REF_DRGN_CLAIM_REVIW_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getReferncePolicyClaim(
  dispatch: typeof store.dispatch,
  data
) {
  return await apiRequest({
    URL: `${policyengine + apiUrl.getReferenceDragonClaimId}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_REFERENCE_POLICY_CLAIM,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function searchRefClaimData(
  dispatch: typeof store.dispatch,
  data
) {
  const response = await apiRequest({
    URL: policyConfigUrl + apiUrl.searchClaim,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_REFERENCE_SEARCH_CLAIM,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
  return response.refclaimData;
}
export async function searchClaimData(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL:policyConfigUrl + apiUrl.searchClaim,
    options: {method:'POST',
      body:data},
    dispatch: dispatch,
    actionType: SEARCH_CLAIM,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getClaimDataSize(dispatch: typeof store.dispatch, data) {
   await apiRequest({
      URL: policyConfigUrl + apiUrl.searchClaimDataSize,
      options: { method: 'POST', body: data },
      dispatch: dispatch,
      actionType: GET_TOTAL_NUMBER_OF_ROWS,
      alertRequired: false,
      successMessage: null,
      errorMessage: null,
      alertTitle: '',
    });
}
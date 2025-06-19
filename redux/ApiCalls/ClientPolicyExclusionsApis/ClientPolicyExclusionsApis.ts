import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  DELETE_CLIENT_EXCLUSION_DATA,
  GET_CLIENT_EXCLUSION,
  GET_CLIENT_POLICY_EXCLUISON,
  GET_POLICY_EXCLUSION,
  POST_CLIENT_EXCLUSION_DATA,
} from './ClientPolicyExclusionsTypes';

export async function getPolicyExclusionData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.policyExclusion,
    options: {},
    dispatch: dispatch,
    actionType: GET_POLICY_EXCLUSION,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getClientgroupData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.clientExclusion,
    options: {},
    dispatch: dispatch,
    actionType: GET_CLIENT_EXCLUSION,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getClientPolicyData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.clientPolicyExcluison,
    options: {},
    dispatch: dispatch,
    actionType: GET_CLIENT_POLICY_EXCLUISON,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function postclientExclusionData(
  dispatch: typeof store.dispatch,
  data
) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.postClientPolicyExclusion,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: POST_CLIENT_EXCLUSION_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
  await getClientPolicyData(dispatch);
  await getClientgroupData(dispatch);
}
export async function DeleteclientExclusionData(
  dispatch: typeof store.dispatch,
  data
) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.deleteClientPolicyExclusion,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: DELETE_CLIENT_EXCLUSION_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

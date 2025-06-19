import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { SEARCH_POLICY } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function searchPolicy(dispatch: typeof store.dispatch, data) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.searchPolicy,
    options: {
      method: 'POST',
      body: data,
    },
    dispatch: dispatch,
    actionType: SEARCH_POLICY,
    alertRequired: false,
    successMessage: null,
    errorMessage: 'Failed to search policy',
    alertTitle: 'error',
  });
  return response;
}

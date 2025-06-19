import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function uploadPolicyReport(
  dispatch: typeof store.dispatch,
  data
) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.uploadPolicyReportFile,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

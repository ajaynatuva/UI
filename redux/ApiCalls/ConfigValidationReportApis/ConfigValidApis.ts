import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { GET_CONFIG_REPORT } from '../../ApiCalls/TestingReportApis/TestingReportTypes';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function getConfigReport(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.generateconfigreport,
    options: {},
    dispatch: dispatch,
    actionType: GET_CONFIG_REPORT,
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
}
export async function getConfigValidation(
  dispatch: typeof store.dispatch,
  data
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.generateconfigreport}`,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Report Generated Successfully',
    errorMessage: 'Failed to Generated Report',
    alertTitle: 'error',
  });
}

import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import {
  apiUrl,
  policyConfigUrl,
  policyengine,
} from '../../../configs/apiUrls';
import { SET_IS_LOADING } from '../NewPolicyTabApis/AllPolicyConstants';
import {
  GET_TESTING_REPORT_DATA,
  TOTAL_CLAIMS_DATA,
} from '../TestingReportApis/TestingReportTypes';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function getPolicyNumber(
  dispatch: typeof store.dispatch,
  policyNumber: number,
  version: number
) {
  let policiesData;
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(
    `${policyConfigUrl + apiUrl.testReport}/${policyNumber}/${version}`
  )
    .then((response) => {
      if (!response.ok) {
      }
      return response.json();
    })
    .then((data) => {
      if (data.length == 1) {
        policiesData = data[0];
        dispatch({ type: GET_TESTING_REPORT_DATA, payload: data[0] });
      } else if (data.length == 0) {
        CustomSwal('info', 'Policy number does not exist', navyColor, 'Ok', '');
        dispatch({ type: GET_TESTING_REPORT_DATA, payload: data });
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
  return policiesData;
}
export async function sendClaimData(
  dispatch: typeof store.dispatch,
  testingReportData
) {
  return await apiRequest({
    URL: policyengine + apiUrl.sendclaimdata,
    options: { method: 'POST', body: testingReportData },
    dispatch: dispatch,
    actionType: TOTAL_CLAIMS_DATA,
    alertRequired: true,
    successMessage: 'Claim Processed successfully',
    errorMessage: 'Claim Processed failed',
    alertTitle: null,
  });
}


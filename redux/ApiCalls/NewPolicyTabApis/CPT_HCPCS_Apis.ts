import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { DELTA_LINK, GET_PROCS, PROCS_TARGET } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function uploadProceduresToStage(
  dispatch: typeof store.dispatch,
  data1
) {
  // dispatch({ type: SET_IS_LOADING, payload: true });
  // try{
  try {
    await fetch(policyConfigUrl + apiUrl.createProcs, {
      method: 'POST',
      body: data1,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((data) => {
        // dispatch({ type: SET_IS_LOADING, payload: false });
        // dispatch({ type: POST_PROCS, payload: false });
        dispatch({ type: PROCS_TARGET, payload: true });
        dispatch({ type: DELTA_LINK, payload: data });
        return true;
      });
  } catch (error) {}
}

export async function UploadProceduresToTarget(
  dispatch: typeof store.dispatch,
  policyId,
  navigate
) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.createTargetUrl}/${policyId}`,
    options: {
      method: 'POST',
      body: policyId,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'saved data successfully',
    errorMessage: 'Failed to save data',
    alertTitle: 'error',
  });
  return response;
}
export async function getProcsByPolicyId(dispatch, policyId) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getProcsById + '/' + policyId,
    options: {},
    dispatch: dispatch,
    actionType: GET_PROCS,
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get procedures Data',
    alertTitle: 'error',
  });
  return response;
}
export async function getPolicyProcsTotalDataByPolicyId(
  dispatch: typeof store.dispatch,
  procs: any
) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getProceduresData,
    options: {
      method: 'POST',
      body: procs,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get procedures Data',
    alertTitle: 'error',
  });
  return response;
}

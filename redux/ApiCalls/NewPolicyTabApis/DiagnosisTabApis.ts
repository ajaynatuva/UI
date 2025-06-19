import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import {
  DIAGNOSIS_FIELDS,
  EDIT_DIAGNOSIS_DATA,
  GET_DIAGNOSIS_DATA,
  POST_DIAG,
  POST_DIAGNOSIS_DATA,
  SET_IS_LOADING,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { batch } from 'react-redux';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { navyColor } from '../../../assets/jss/material-kit-react';

export async function getDiagnosisData(dispatch: typeof store.dispatch, id) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getDiagnosis}/${id}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });

 
  const actions = [
    {type:DIAGNOSIS_FIELDS,payload:{headerLevel:response[0]?.headerLevel}},
    {type:DIAGNOSIS_FIELDS,payload:{principalDx:response[0]?.principalDx}},
    {type:DIAGNOSIS_FIELDS,payload:{onlyDx:response[0]?.onlyDx}},

  ]
  batch(() => {
    actions.forEach((k) => dispatch(k));
  });
  dispatch({
    type: DIAGNOSIS_FIELDS,
    payload: { getDiagnosisTableData: response },
  })
  return response;
}
export async function saveDiagDetails(dispatch: typeof store.dispatch, data) {
  let diagObject = {
    policyId: parseInt(data.policyId),
    diagFrom: data.diagFrom.replace(/\./g, ''),
    diagTo: data.diagTo.replace(/\./g, ''),
    dosFrom: data.dosFrom,
    dosTo: data.dosTo,
    action: data.action,
    exclusion: data.exclusion,
    headerLevel: data.headerLevel,
    principalDx: data.principalDx,
    onlyDx: data.onlyDx
  };
  await apiRequest({
    URL: `${policyConfigUrl + apiUrl.postDiagnosis}`,
    options: {
      method: 'POST',
      body: diagObject,
    },
    dispatch: dispatch,
    actionType: POST_DIAGNOSIS_DATA,
    alertRequired: true,
    successMessage: 'Diagnosis saved successfully',
    errorMessage: 'Failed to save diagnosis',
    alertTitle: 'error',
  });
  await getDiagnosisData(dispatch, diagObject.policyId);
}

export async function editDiagnosisDetails(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  let editedDiagdata = {
    diagFrom: data.diagFrom.replace(/\./g, ''),
    diagTo: data.diagTo.replace(/\./g, ''),
    dosFrom: data.dosFrom,
    dosTo: data.dosTo,
    action: data.action,
    exclusion: data.exclusion,
    headerLevel: data.headerLevel,
    principalDx: data.principalDx,
    actionKeyValue: data.actionKeyValue,
    policyDiagnosisKey: data.policyDiagnosisKey,
    onlyDx: data.onlyDx
  };
  await fetch(policyConfigUrl + apiUrl.editDiagnosis, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedDiagdata),
  })
    .then((response) => {
      if (!response.ok) {
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.json;
    })
    .then((data) => {
      getDiagnosisData(dispatch, policyId);
      dispatch({ type: EDIT_DIAGNOSIS_DATA, payload: data });
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal('success', 'Data Updated successfully', navyColor, 'Ok', '');
    });
}

export async function deleteDiagnosisDetails(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(policyConfigUrl + apiUrl.deleteDiagnosis + '/' + data, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.text();
    })
    .then((data) => {
      getDiagnosisData(dispatch, policyId);
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal('success', 'Data Deleted successfully', navyColor, 'Ok', '');
    });
}

export async function uploadDiagnosisData(
  dispatch: typeof store.dispatch,
  DiagData,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  // try{
  try {
    await fetch(policyConfigUrl + apiUrl.saveDaiagnosis, {
      method: 'POST',
      body: DiagData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((DiagData) => {
        dispatch({ type: SET_IS_LOADING, payload: false });
        dispatch({ type: POST_DIAG, payload: false });
        getDiagnosisData(dispatch, policyId);
        CustomSwal('success', 'Data saved Successfully', navyColor, 'Ok', '');
        return true;
      });
  } catch (error) {}
}

export function createDiagObject(formState, data) {
  let diagValues = {
    headerLevel: formState.headerLevel,
    principalDx: formState.principalDx,
    onlyDx: formState.onlyDx,
    policyId: data
  };
  return diagValues;
}

export async function saveDiagValues(
  dispatch,
  formState,
  data,
  navigate
) {
  let diagObj = createDiagObject(formState, data);
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.updateDiagHeaders,
    options: { method: 'POST', body: diagObj },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to create changes',
    alertTitle: 'error',
  });
  if(response){
    await getDiagnosisData(dispatch, data);
  }
  return response;
}
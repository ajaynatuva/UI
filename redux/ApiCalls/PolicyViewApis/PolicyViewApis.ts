import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { SET_IS_LOADING } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  GET_FILTERD_POLICIES_DATA,
  GET_FILTERD_REASON_DATA,
  GET_FILTERD_SUB_POLICIES_DATA,
  GET_MEDICAL_TOTAL_DATA,
  GET_USED_CAT,
} from './PolicyViewType';
import { saveAs } from 'file-saver';

export async function getUsedCategories(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.usedCat,
    options: {},
    dispatch: dispatch,
    actionType: GET_USED_CAT,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getPolicyTotalData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.policyTotalData,
    options: {},
    dispatch: dispatch,
    actionType: GET_FILTERD_POLICIES_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function searchViewPolicy(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.policyViewData,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_MEDICAL_TOTAL_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function subPolicyData1(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.filterSubPol,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_FILTERD_SUB_POLICIES_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function filterdReasonData(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.filterReason,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_FILTERD_REASON_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function filterdPolicies(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.filterdPolicies,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_FILTERD_POLICIES_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function ExportPolicies(
  dispatch: typeof store.dispatch,
  data,
  buttonType
) {
  let policyNumber = data.map((k) => {
    return {
      policyNumber: k.policyNumber,
      medicalPolicyKeyFk: k.medicalPolicyKey,
    };
  });

  try {
    dispatch({ type: SET_IS_LOADING, payload: true });

    const response = await fetch(
      policyConfigUrl + apiUrl.ExportPolicyView + '/' + buttonType,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyNumber),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Trigger file download using FileSaver.js
    let FileName = 'Policy_Details' + '-' + buttonType + '.docx';
    saveAs(blob, FileName);

    dispatch({ type: SET_IS_LOADING, payload: false });

    CustomSwal(
      'success',
      'File Downloaded Successfully!.',
      navyColor,
      'Ok',
      ''
    );
  } catch (error) {
    dispatch({ type: SET_IS_LOADING, payload: false });
    CustomSwal('error', 'Please Reach out It Team', navyColor, 'Ok', '');
  }
}
export async function uploadClaimProcssingIntroduction(
  dispatch: typeof store.dispatch,
  file
) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.uploadPolicyView,
    options: { method: 'POST', body: file },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'File Uploaded Successfully',
    errorMessage: null,
    alertTitle: '',
  });
}

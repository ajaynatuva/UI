import { batch } from "react-redux";
import { navyColor } from "../../../assets/jss/material-kit-react";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { apiUrl, policyConfigUrl } from "../../../configs/apiUrls";
import { RESET_TAX_ID_FIELDS, TAX_ID_FIELDS } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest, batchDispatch } from "../../ApiCallAction/ApiCallAction";
import { store } from "../../store";
import { getChangesById } from "./ChangesTabApis";

export async function addTaxIdData(dispatch: typeof store.dispatch, data) {
    const response = await apiRequest({
      URL: policyConfigUrl + apiUrl.saveTaxId,
      options: { method: 'POST', body: data },
      dispatch: dispatch,
      actionType: TAX_ID_FIELDS,
      alertRequired: true,
      successMessage: 'Tax ID Exclusion Added Successfully',
      errorMessage: 'Tax ID Exclusion Add Failed',
      alertTitle: null,
    });

    if(response){
    // Assuming the response contains the updated data for getTaxIdTabledata
    const TaxIdData = response; // or however your response is structured

    // Dispatch the action to update only the getTaxIdTabledata
    dispatch({
      type: TAX_ID_FIELDS,
      payload: { getTaxIdTabledata: TaxIdData?TaxIdData:"" }, // Update only the specific field
    });
  }
}

export async function addTaxIdChangesData(
  dispatch: typeof store.dispatch,
  changesData,
  policyId
) {
  try {
    // Wait for the API request to complete
    await apiRequest({
      URL: policyConfigUrl + apiUrl.createChanges,
      options: { method: 'POST', body: changesData },
      dispatch: dispatch,
      actionType: '',
      alertRequired: false,
      successMessage: null,
      errorMessage: null,
      alertTitle: null,
    });
    // After successful request, call getChangesById
    await getChangesById(dispatch, policyId);
  } catch (error) {
    console.error('Error adding TaxId changes:', error);
    // Handle any errors here, e.g., dispatch an error action or show an alert
  }
}

export async function getTaxIDDataPolicy(
  dispatch: typeof store.dispatch,
  policyId
) {
  const response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getTaxIdDetails}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
  dispatch({
    type: TAX_ID_FIELDS,
    payload: { getTaxIdTabledata: response }, // Update only the specific field
  });
  return response;
}

export async function DeactivateTaxIdData(
  dispatch: typeof store.dispatch,
  data
) {
  const response = await apiRequest({
    URL: policyConfigUrl + apiUrl.DeactivateTaxIdData,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Tax ID ' +data[0].taxId+' DEACTIVATED Successfully',
    errorMessage: 'Tax ID ' +data[0].taxId+' DEACTIVATED Failed',
    alertTitle: null,
  });
  dispatch({
    type: TAX_ID_FIELDS,
    payload: { getTaxIdTabledata: response }, // Update only the specific field
  });
}

export async function uploadTaxIdToStage(
  dispatch: typeof store.dispatch,
  taxIdDataFile,
  progressValue,
  hideProgress
) {
  // dispatch({ type: SET_IS_LOADING, payload: true });
    const response = await fetch(policyConfigUrl + apiUrl.uploadTaxIdFile, {
      method: 'POST',
      body: taxIdDataFile,
    });

    if (response.status === 500) {
      hideProgress(progressValue)
      // dispatch({ type: SET_IS_LOADING, payload: false }),
      CustomSwal(
        'error',
        `Import Failed.<br>A detailed email is sent with the failure reasons.`,
        navyColor,
        'OK',
        'Error'
      );
      dispatch({type:RESET_TAX_ID_FIELDS});
      return response;
      // throw new Error('Server error: 500');
    }
    const data = await response.text();
    const action = [
      // { type: SET_IS_LOADING, payload: false },
      { type: TAX_ID_FIELDS, payload: { taxIdTargetData: true } },
      { type: TAX_ID_FIELDS, payload: { taxIdDeltaLink: data } },
    ];
    // batch(() => {
    //   action.forEach((action) => dispatch(action));
    // });
    batchDispatch(dispatch,action)
    hideProgress(progressValue);
    return true;
}


export async function UploadTaxIdToTarget(
  dispatch: typeof store.dispatch,
  policyId,
  changesTaxIdData
) {
  const response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.TargetTaxIdData}/${policyId}`,
    options: {
      method: 'POST',
      body: changesTaxIdData,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Data saved Successfully',
    errorMessage: 'Please Reach out to the IT Team',
    alertTitle: 'Upload Status',
  });
  dispatch({type: TAX_ID_FIELDS, payload: { getTaxIdTabledata: response } });

}
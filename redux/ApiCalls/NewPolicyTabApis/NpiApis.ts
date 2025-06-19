import { batch } from "react-redux";
import { navyColor } from "../../../assets/jss/material-kit-react";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { apiUrl, policyConfigUrl } from "../../../configs/apiUrls";
import { apiRequest, batchDispatch } from "../../ApiCallAction/ApiCallAction";
import { store } from "../../store";
import { NPI_FIELDS, RESET_NPI_FIELDS } from "./AllPolicyConstants";
import { getChangesById } from "./ChangesTabApis";

export async function addNPIData(dispatch: typeof store.dispatch, data) {
    const response = await apiRequest({
      URL: policyConfigUrl + apiUrl.saveNPI,
      options: { method: 'POST', body: data },
      dispatch: dispatch,
      actionType: NPI_FIELDS,
      alertRequired: true,
      successMessage: 'NPI Exclusion Added Successfully',
      errorMessage: 'NPI Exclusion Add Failed',
      alertTitle: null,
    });

    if(response){

    // Assuming the response contains the updated data for getTaxIdTabledata
    const npiData = response; // or however your response is structured

    // Dispatch the action to update only the getTaxIdTabledata
    dispatch({
      type: NPI_FIELDS,
      payload: { getNPITabledata: npiData ? npiData:"" }, // Update only the specific field
    });
  }
}

export async function addNPIChangesData(
  dispatch: typeof store.dispatch,
  changesData,
  policyId
) {
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
}

export async function getNPIDataPolicy(
  dispatch: typeof store.dispatch,
  policyId
) {
  const response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getNPIDetails}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
  dispatch({
    type: NPI_FIELDS,
    payload: { getNPITabledata: response }, // Update only the specific field
  });
  return response;
}

export async function DeactivateNPIData(dispatch: typeof store.dispatch, data) {
  const response = await apiRequest({
    URL: policyConfigUrl + apiUrl.DeactivateNPIData,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'NPI ' + data[0].npi + ' DEACTIVATED Successfully',
    errorMessage: 'NPI ' + data[0].npi + ' DEACTIVATED Failed',
    alertTitle: null,
  });
  dispatch({
    type: NPI_FIELDS,
    payload: { getNPITabledata: response }, // Update only the specific field
  });
}


export async function uploadNPIToStage(
  dispatch: typeof store.dispatch,
  NPIDataFile,
  progressValue,
  hideProgress
) {
  // dispatch({ type: SET_IS_LOADING, payload: true });
  try {
    const response = await fetch(policyConfigUrl + apiUrl.uploadNPIFile, {
      method: 'POST',
      body: NPIDataFile,
    });

    if (response.status === 500) {
      hideProgress(progressValue)
      CustomSwal(
        'error',
        `Import Failed.<br>A detailed email is sent with the failure reasons.`,
        navyColor,
        'OK',
        'Error'
      );
      // throw new Error('Server error: 500');
      dispatch({type:RESET_NPI_FIELDS});
      return response;
    }
    const data = await response.text();
    const action = [
      // { type: SET_IS_LOADING, payload: false },
      { type: NPI_FIELDS, payload: { NPITargetData: true } },
      { type: NPI_FIELDS, payload: { NPIDeltaLink: data } },
    ];
    // batch(() => {
    //   action.forEach((action) => dispatch(action));
    // });
    batchDispatch(dispatch,action);
    hideProgress(progressValue)
    return true;
  } catch (error) {
    hideProgress(progressValue)
    console.error('Error uploading taxonomy data:', error);
    // dispatch({ type: SET_IS_LOADING, payload: false });
  }
}

export async function UploadNPIToTarget(
  dispatch: typeof store.dispatch,
  policyId: number,
  changesTaxIdData: any
) {
  try {
    const response = await apiRequest({
      URL: `${policyConfigUrl + apiUrl.TargetNPIData}/${policyId}`,
      options: {
        method: 'POST',
        body: changesTaxIdData, // Ensure data is properly formatted
      },
      dispatch,
      actionType: '',
      alertRequired: true,
      successMessage: 'Data saved Successfully',
      errorMessage: 'Please Reach out to the IT Team',
      alertTitle: 'Upload Status',
    });
    if (!response || response.status >= 400) {
      throw new Error(`Server error: ${response?.status || 'Unknown Error'}`);
    }

    dispatch({ type: NPI_FIELDS, payload: { getNPITabledata: response } });

  } catch (error) {
    console.error("UploadNPIToTarget Error:", error); // Log error in console

    CustomSwal(
      'error',
      `Target load Failed`,
      navyColor,
      'OK',
      'Error'
    );
  }
}

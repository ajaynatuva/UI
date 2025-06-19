import { batch } from "react-redux";
import { navyColor } from "../../../assets/jss/material-kit-react";
import { CustomSwal } from "../../../components/CustomSwal/CustomSwal";
import { policyConfigUrl, apiUrl } from "../../../configs/apiUrls";
import { SET_IS_LOADING, POST_TAXONOMY, TAXONOMY_TARGET, DELTA_LINK } from "../NewPolicyTabApis/AllPolicyConstants";
import { apiRequest, batchDispatch } from "../../ApiCallAction/ApiCallAction";
import { store } from "../../store";
import { GET_TAXONOMY_DATA } from "../NewClientSetUpApis/NewClientSetUpTypes";

export async function deleteTaxonomyData(
  dispatch: typeof store.dispatch,
  data,
  policyId,
  taxonomyCode
) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.deleteTaxonomy + '/' + data + '/' + policyId,
    options: { method: 'POST', body: taxonomyCode },
    dispatch: dispatch,
    actionType: GET_TAXONOMY_DATA,
    alertRequired: true,
    successMessage: 'Taxonomy Code Deleted Successfully',
    errorMessage: null,
    alertTitle: null,
  });
}

export async function DisableTaxonomyData(
  dispatch: typeof store.dispatch,
  data,
  policyId,
  taxonomyCode
) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.disableTaxonomy + '/' + data + '/' + policyId,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_TAXONOMY_DATA,
    alertRequired: true,
    successMessage: 'Taxonomy Code '+taxonomyCode+' is DEACTIVATED Successfully',
    errorMessage: 'Taxonomy Code '+taxonomyCode+' is DEACTIVATED Failed',
    alertTitle: null,
  });
}

export async function addTaxonomyData(dispatch: typeof store.dispatch, data,taxonomyFunction) {
  let  taxFun = taxonomyFunction == 1?"Applies To":"Exclude";
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.saveTaxonomy,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_TAXONOMY_DATA,
    alertRequired: true,
    successMessage: `Taxonomy ${taxFun} Details Added Successfully`,
    errorMessage: `Taxonomy ${taxFun} Details Failed To Save`,
    alertTitle: null,
  });
}

export async function uploadTaxonomyData(
  dispatch: typeof store.dispatch,
  TaxonomyData
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  try {
    const response = await fetch(policyConfigUrl + apiUrl.uploadTaxonomy, {
      method: 'POST',
      body: TaxonomyData,
    });

    if (response.status === 500) {
      CustomSwal(
        'error',
        `Import Failed.<br>A detailed email is sent with the failure reasons.`,
        navyColor,
        'OK',
        'Error'
      );
      throw new Error('Server error: 500');
    }
    const data = await response.text();

    const action = [
      { type: SET_IS_LOADING, payload: false },
      { type: POST_TAXONOMY, payload: false },
      { type: TAXONOMY_TARGET, payload: true },
      { type: DELTA_LINK, payload: data },
    ];
    // batch(() => {
    //   action.forEach((action) => dispatch(action));
    // });
    batchDispatch(dispatch,action);

    return true;
  } catch (error) {
    console.error('Error uploading taxonomy data:', error);
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
}

export async function getTaxonomyOfPolicy(
  dispatch: typeof store.dispatch,
  policyId
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getTaxonomy + '/' + policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_TAXONOMY_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

export async function UploadTaxonomyToTarget(
  dispatch: typeof store.dispatch,
  policyId
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.TargetTaxonomy}/${policyId}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ policyId }),
    },
    dispatch: dispatch,
    actionType: GET_TAXONOMY_DATA,
    alertRequired: true,
    successMessage: 'Data saved Successfully',
    errorMessage: 'Please Reach out to the IT Team',
    alertTitle: 'Upload Status',
  });
}
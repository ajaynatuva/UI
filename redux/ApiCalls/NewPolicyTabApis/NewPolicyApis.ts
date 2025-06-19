import moment from 'moment';
import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { SET_IS_LOADING } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { saveChangesTabDetails } from './ChangesTabApis';
import {
  createPolicyObject,
  mapAndSort,
  processPolicyDetails,
} from './ProcessNewPolicyDetails';
import { saveDiagValues } from './DiagnosisTabApis';
import { getClientAssignmentData } from './ClientAssignmentTabApis';

export async function getPolicyById(dispatch: typeof store.dispatch, policyId) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getPolicyById + '/' + policyId,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to create changes',
    alertTitle: 'error',
  });
  return processPolicyDetails(dispatch, response);
}
export async function onUpdateNewPolicy(
  dispatch,
  edit,
  formState,
  navigate,
  roleState
) {
  const clm = mapAndSort(formState.policyFields.claimType);
  const cgtype = mapAndSort(formState.descTabFields.productType);
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.updateNewPolicy,
    options: {
      method: 'POST',
      body: createPolicyObject(formState, clm, cgtype, edit, null, null),
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to create changes',
    alertTitle: 'error',
  });
  await saveChangesTabDetails(dispatch, formState.changesTabFields, response, navigate);
  await saveDiagValues(dispatch, formState.DiagnosisTabFields, response, navigate);

}
export async function onSaveNewPolicy(
  dispatch,
  edit,
  state,
  navigate,
  policyCreateState,
  forClientTabPolicyId,
  newPolicySaveId
) {
  // let error = validateNewPolicyForm(formState, dispatch);
  // if (error) return;
  const date = moment(new Date()).format('YYYY-MM-DD');
  const claimTypeMerge = mapAndSort(state.policyFields.claimType);
  const clientgroupType = mapAndSort(state.descTabFields.productType);
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.saveCustomPolicyData}/${
      policyCreateState.newPolicyStartDate
        ? policyCreateState.newPolicyStartDate
        : date
    }/${policyCreateState.cloneClientAssignmentTab}/${false}/${
      newPolicySaveId ? newPolicySaveId : 0
    }`,
    options: {
      method: 'POST',
      body: createPolicyObject(
        state,
        claimTypeMerge,
        clientgroupType,
        edit,
        policyCreateState,
        forClientTabPolicyId
      ),
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Please Reach Out IT Team',
    alertTitle: '',
  });
  await saveChangesTabDetails(dispatch, state.changesTabFields, response, navigate);
  await saveDiagValues(dispatch, state.DiagnosisTabFields, response, navigate);
  await getClientAssignmentData(dispatch,response);
}
export function validatePolicyCreationFields(
  policyCreationState,
  formstate,
  dispatch
) {
  let error = false;
  if (!policyCreationState.jiraId) {
    error = true;
  }
  if (!policyCreationState.jiraDesc) {
    error = true;
  }
  if (policyCreationState.cloneClientAssignmentTab) {
    if (!policyCreationState.forClonedPolicyAndVersion) {
      error = true;
    }
  }

  if (
    policyCreationState.cloneClientAssignmentTab ||
    policyCreationState.addAllActiveClients
  ) {
    if (
      policyCreationState.newPolicyStartDate === undefined ||
      policyCreationState.newPolicyStartDate === ''
    ) {
      error = true;
    }
  }

  return error;
}
export async function getPolicyNumberAndVersionChecking(
  dispatch: typeof store.dispatch,
  policyNumber: number,
  version: number
) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.testReport}/${policyNumber}/${version}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: 'Failed to get Policy Details',
    alertTitle: 'error',
  });

  if (response.length === 1) {
    return response;
  }
}

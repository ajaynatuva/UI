import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { CUSTOM_POLICY_VALIDATION } from '../../ApiCalls/CustomPolicyApis/CustomPolicyActionType';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { CustomPolicyState } from '../../reducers/CustomPolicyReducer/CustomPolicyReducer';
import { navigateAndFetch } from '../NewPolicyTabApis/ChangesTabApis';
import {
  createPolicyObject,
  mapAndSort,
} from '../NewPolicyTabApis/ProcessNewPolicyDetails';

export function validateCustomPolicyForm(
  customPolicyForm: CustomPolicyState,
  dispatch
) {
  let error = false;
  let customPolicyErrors = {
    customJiraId: false,
    customJiraDesc: false,
    customNewPolicyDate: false,
  };
  if (
    customPolicyForm.customJiraId === undefined ||
    customPolicyForm.customJiraId === ''
  ) {
    customPolicyErrors.customJiraId = true;
    error = true;
  }
  if (
    customPolicyForm.customJiraDesc === undefined ||
    customPolicyForm.customJiraDesc === ''
  ) {
    customPolicyErrors.customJiraDesc = true;
    error = true;
  }
  if (customPolicyForm.cloneAssignmentCheck) {
    if (
      customPolicyForm.customNewPolicyDate === undefined ||
      customPolicyForm.customNewPolicyDate === ''
    ) {
      customPolicyErrors.customNewPolicyDate = true;
      error = true;
    }
  }

  if (error) {
    dispatch({ type: CUSTOM_POLICY_VALIDATION, payload: customPolicyErrors });
  }
  return error;
}

export async function onSaveCustomPolicy(
  dispatch,
  allStates,
  createdDate,
  cloned,
  clonedTaxonomy,
  navigate,
  edit
) {
  const clm = mapAndSort(allStates.policyFields.claimType);
  const cgtype = mapAndSort(allStates.descTabFields.productType);
  let id = 0;
  let response = await apiRequest({
    URL: `${
      policyConfigUrl + apiUrl.saveCustomPolicyData
    }/${createdDate}/${cloned}/${clonedTaxonomy}/${id}`,
    options: {
      method: 'POST',
      body: createPolicyObject(allStates, clm, cgtype, edit, null, null),
      createdDate,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Please Reach Out IT Team',
    alertTitle: 'error',
  });
  await handleCustomChanges(dispatch, allStates.changesTabFields, response, navigate);
}

async function handleCustomChanges(
  dispatch,
  formState,
  returnedpolicyId,
  navigate
) {
  let customChangesObj = {
    jiraId: formState.jiraId,
    jiraDesc: formState.jiraDesc,
    jiraLink: formState.jiraLink,
    userId: formState.userId,
    policyId: returnedpolicyId,
    isOpenb: formState.jiraIsOpen ? 1 : 0,
    policyChangesKey: null,
  };
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.customChanges,
    options: { method: 'POST', body: customChangesObj },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to create changes',
    alertTitle: 'error',
  });
  await navigateAndFetch(dispatch, navigate, response);
}

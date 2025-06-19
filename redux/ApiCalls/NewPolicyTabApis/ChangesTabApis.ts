import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import {
  CHANGES_TAB_TABLE,
  RESET_CHANGES_TAB_FIELDS,
  RESET_CHANGES_TAB_TABLE,
  SET_IS_LOADING,
} from '../NewPolicyTabApis/AllPolicyConstants';
import { CHANGES_TAB_FIELDS } from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest, batchDispatch } from '../../ApiCallAction/ApiCallAction';
import { getPolicyById } from './NewPolicyApis';
import { store } from '../../store';
import { batch } from 'react-redux';

export async function getChangesById(dispatch, policyId) {
  let response = await apiRequest({
    URL: `${policyConfigUrl}${apiUrl.getChangesById}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get changes',
    alertTitle: 'error',
  });
  let tableData = [];
  let zeroObj = {
    id: '',
    jiraId: '',
    jiraDesc: '',
    jiraLink: '',
    userId: '',
    updatedOn: '',
    policyChangesKey: '',
    jiraIsOpen: false,
  };
  response.forEach((f) => {
    if (f.isOpenb === 0) {
      let obj = {
        id: f.jiraId,
        jiraId: f.jiraId,
        jiraDesc: f.jiraDesc,
        jiraLink: f.jiraLink,
        userId: f.userId,
        updatedOn: f.updatedOn,
        policyChangesKey: f.policyChangesKey,
        jiraIsOpen: false,
      };
      tableData.push(obj);
    } else {
      zeroObj.id = f.jiraId;
      zeroObj.jiraDesc = f.jiraDesc;
      zeroObj.jiraId = f.jiraId;
      zeroObj.jiraLink = f.jiraLink;
      zeroObj.userId = f.userId;
      zeroObj.updatedOn = f.updatedOn;
      zeroObj.jiraIsOpen = true;
      zeroObj.policyChangesKey = f.policyChangesKey;
    }
  });
  const actions = [
    { type: CHANGES_TAB_TABLE, payload: { changesTableData: tableData } },
    {
      type: CHANGES_TAB_FIELDS,
      payload: zeroObj,
    },
  ];
  batchDispatch(dispatch, actions);
}
function createChangesObject(formState, data) {
  let changes = {
    jiraId: formState.jiraId,
    jiraDesc: formState.jiraDesc,
    jiraLink: formState.jiraLink,
    userId: formState.tmpUser?.value
      ? formState.tmpUser?.value
      : formState.userId,
    policyId: data,
    isOpenb: formState.jiraIsOpen ? 1 : 0,
    policyChangesKey: formState.policyChangesKey,
  };
  return changes;
}

export async function navigateAndFetch(dispatch, navigate, policyId) {
  try {
    navigate('/viewPolicy');
    // Use Promise.all to run the async functions concurrently
    await Promise.all([
      getPolicyById(dispatch, policyId),
      getChangesById(dispatch, policyId),
    ]);
    CustomSwal('success', 'Policy Saved Successfully', navyColor, 'Ok', '');
  } catch (e) {
    console.error(e);
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
}
export async function saveChangesTabDetails(
  dispatch,
  formState,
  data,
  navigate
) {
  let changesObj = createChangesObject(formState, data);
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.createChanges,
    options: { method: 'POST', body: changesObj },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to create changes',
    alertTitle: 'error',
  });
  await navigateAndFetch(dispatch, navigate, response.policyId.policyId);
}

export async function addChangesData(
  dispatch: typeof store.dispatch,
  policyId,
  jiraId,
  jiraDesc
) {
  let changesData = {
    jiraId: jiraId,
    jiraDesc: jiraDesc,
    jiraLink: `https://advancedpricing.atlassian.net/browse/${jiraId}`,
    userId: localStorage.getItem('emailId'),
    policyId: policyId,
    isOpenb: 0,
  };
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

export async function getChangesId(dispatch, policyId) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getChangesId}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get changes',
    alertTitle: 'error',
  });
  dispatch({
    type: CHANGES_TAB_FIELDS,
    payload: { changesIsOpenB: response },
  });
}

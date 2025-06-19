import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import {
  CLIENT_ASSIGNMENT_FIELDS,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function getClientAssignmentData(
  dispatch: typeof store.dispatch,
  policyId
) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.clientAssignmet}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get client assignment data',
    alertTitle: 'error',
  });
  dispatch({
    type: CLIENT_ASSIGNMENT_FIELDS,
    payload: { getClientAssignmentTableData: response }, // Update only the specific field
  });
}
export async function postClientAssignment(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.postClientAssignmentData,
    options: {
      method: 'POST',
      body: data,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Data Added successfully',
    errorMessage: 'Failed to add data',
    alertTitle: 'success',
  });
  await getClientAssignmentData(dispatch, policyId);
}
export async function editClientAssignment(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  let clientAssignmentObject = {
    policyClntAssmtKey: data.policyClntAssmtKey,
    policyId: data.policyId,
    clientCode: data.clientCode,
    clientName: data.clientName,
    clientGroupCode: data.clientGroupCode[0].value,
    clientGroupName: data.clientGroupName,
    clientStartDate: data.clientStartDate,
    clientEndDate: data.clientEndDate,
    excludeClientSpecificCodes: data.excludeClientSpecificCodes,
    hp: data.hp,
  };
  let response =  await apiRequest({
    URL: policyConfigUrl + apiUrl.editClientAssignmentData,
    options: {
      method: 'POST',
      body: clientAssignmentObject,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Data Updated successfully',
    errorMessage: 'Failed to update data',
    alertTitle: 'success',
  });
  dispatch({
    type: CLIENT_ASSIGNMENT_FIELDS,
    payload: { postClientAssignmentData: response }, // Update only the specific field
  });
  await getClientAssignmentData(dispatch, policyId);
}
export async function deleteClientAssignmentData(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.deleteClientAssignmentData + '/' + data,
    options: {
      method: 'POST',
      body: data,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Data deleted successfully',
    errorMessage: 'Failed to delete data',
    alertTitle: 'success',
  });
  await getClientAssignmentData(dispatch, policyId);
}
export async function getActiveClientGroups(dispatch: typeof store.dispatch) {
  let response =  await apiRequest({
    URL: `${policyConfigUrl + apiUrl.activeClients}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get active client groups',
    alertTitle: 'error',
  });
  dispatch({
    type: CLIENT_ASSIGNMENT_FIELDS,
    payload: { getActiveClientData: response }, // Update only the specific field
  });
}
export async function getActiveClientGroupsNotHp(
  dispatch: typeof store.dispatch
) {
  let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.activeClientsNotHp}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get active client groups',
    alertTitle: 'error',
  });
  dispatch({
    type: CLIENT_ASSIGNMENT_FIELDS,
    payload: { getActiveClientDataNotHp: response }, // Update only the specific field
  });
}

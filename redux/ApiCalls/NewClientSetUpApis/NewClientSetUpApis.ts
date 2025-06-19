import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { SET_IS_LOADING } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  GET_ALL_CHANGES_DATA,
  GET_TOTAL_CLIENT_ASSIGNMENT_DATA,
  POLICYIDS,
  RESETNEWCLIENT,
} from './NewClientSetUpTypes';

export async function saveNewClientSetUp(
  dispatch: typeof store.dispatch,
  newClientSetUp,
  navigate
) {
  try {
    dispatch({ type: SET_IS_LOADING, payload: true });
    const response = await fetch(
      policyConfigUrl + apiUrl.saveNewClientSetUpData,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(newClientSetUp),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    } else {
      CustomSwal(
        'success',
        'Client Details Added Successfully',
        navyColor,
        'OK',
        'Success'
      ).then((res) => {
        if (res.isConfirmed) {
          navigate('/NewClientSetUp');
        }
      });
      dispatch({ type: SET_IS_LOADING, payload: false });
    }
    dispatch({ type: RESETNEWCLIENT });
  } catch (error) {
    dispatch({ type: SET_IS_LOADING, payload: false });

    CustomSwal('error', 'Please Reach out IT Team', navyColor, 'Ok', '');
  }
}
export async function getTotalClientAssignmentData(
  dispatch: typeof store.dispatch
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getTotalClientAssignmentData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_TOTAL_CLIENT_ASSIGNMENT_DATA,
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
}
export async function getClientAssignmentPolicyIds(
  dispatch: typeof store.dispatch,
  copyClientDTO
) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.getClientAssignmentPolicyIds,
    options: { method: 'POST', body: copyClientDTO },
    dispatch: dispatch,
    actionType: POLICYIDS,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getAllChangesData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getChanges}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_ALL_CHANGES_DATA,
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
}

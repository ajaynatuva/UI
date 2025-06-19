
import { Dispatch } from 'redux';
import { apiUrl, ipuUser } from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  CREATE_USER,
  CREATE_USER_VALIDATION,
  EDIT_PASSWORD,
  EDIT_USER,
  GET_ROLES,
  GET_ROLES_BY_ID,
  GET_USER_LIST,
  ROLE_NAME,
  USER_LOGIN_DETAILS_CACHE,
} from './UserApiActionType';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { navyColor } from '../../../assets/jss/material-kit-react';
export async function getRoles(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: ipuUser + apiUrl.getRoles,
    options: {},
    dispatch: dispatch,
    actionType: GET_ROLES,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getRolesById(dispatch: typeof store.dispatch, data) {
  let params = { userId: data.userId };
  return await apiRequest({
    URL: ipuUser + apiUrl.getRoleById,
    options: { method: 'POST', body: params },
    dispatch: dispatch,
    actionType: GET_ROLES_BY_ID,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getUserList(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: ipuUser + apiUrl.getAllUser,
    options: {},
    dispatch: dispatch,
    actionType: GET_USER_LIST,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function saveUser(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: ipuUser + apiUrl.saveUser,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: CREATE_USER,
    alertRequired: true,
    successMessage: 'User details saved successfully',
    errorMessage: 'User details failed to save',
    alertTitle: '',
  });
}
export async function editUser(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: ipuUser + apiUrl.updateUser,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: EDIT_USER,
    alertRequired: true,
    successMessage: 'User Details updated successfully',
    errorMessage: 'User Details update failed',
    alertTitle: null,
  });
}
export async function editPassword(dispatch: Dispatch, data) {
  return await apiRequest({
    URL: ipuUser + apiUrl.updatePassword,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: EDIT_PASSWORD,
    alertRequired: true,
    successMessage: 'Password updated successfully',
    errorMessage: 'Password update failed',
    alertTitle: null,
  });
}
export async function updatePassword(dispatch: Dispatch, body) {
  return await apiRequest({
    URL: ipuUser + apiUrl.updatePassword,
    options: { method: 'POST', body: body },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

export async function loginUser(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: ipuUser + apiUrl.checkUser,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: USER_LOGIN_DETAILS_CACHE,
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Your Username or Password is Incorrect. Please try again',
    alertTitle: 'Login Failed',
  });
}

export async function getUserRoleById(dispatch: typeof store.dispatch, id) {
  return await apiRequest({
    URL: `${ipuUser + apiUrl.getRoleByUser}/${id}`,
    options: {},
    dispatch: dispatch,
    actionType: ROLE_NAME,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function ResendOTP(data, isLoading: boolean, forgotPasswordView) {
  if (!forgotPasswordView || !isLoading) {
    CustomSwal('success', 'OTP Sent Successfully', navyColor, 'Ok', '');
  }

  return await apiRequest({
    URL: ipuUser + apiUrl.ResendOtp,
    options: { method: 'POST', body: data },
    dispatch: null,
    actionType: null,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

export async function validateOTP(dispatch: typeof store.dispatch, paramData) {
  return await apiRequest({
    URL: ipuUser + apiUrl.validateOtp,
    options: { method: 'POST', body: paramData },
    dispatch: dispatch,
    actionType: !paramData.isForgotPasswordOtp ? USER_LOGIN_DETAILS_CACHE : '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

export async function createUserValidation(dispatch, data) {
  let error = false;
  let errors = {
    userName: false,
    emailId: false,
    password: false,
    confirmPassword: false,
  };

  if (data.userName == undefined || data.userName == '') {
    errors.userName = true;
    error = true;
  }
  if (data.emailId == undefined || data.emailId == '') {
    errors.emailId = true;
    error = true;
  }
  if (data.password == undefined || data.password == '') {
    errors.password = true;
    error = true;
  }
  if (data.confirmPassword == undefined || data.confirmPassword == '') {
    errors.confirmPassword = true;
    error = true;
  }

  if (error) {
    dispatch({ type: CREATE_USER_VALIDATION, payload: errors });
  }
  return error;
}

export async function removeUsers(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: `${ipuUser + apiUrl.removeNonExistingUser}/${data}`,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_USER_LIST,
    alertRequired: true,
    successMessage: 'Data Deleted successfully',
    errorMessage: null,
    alertTitle: '',
  });
}

export async function validateUserEmailId(
  emailId,
  dispatch: typeof store.dispatch
) {
  return await apiRequest({
    URL: ipuUser + apiUrl.validateUserEmailId,
    options: { method: 'POST', body: emailId },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

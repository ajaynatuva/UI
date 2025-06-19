import { apiUrl, dataCurationETL } from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  DELTA_CONFIG,
  GET_GROUP_TASK,
  GET_MY_TASK,
  UNASSIGN_GROUP_TASK,
} from './TaskApiType';

export async function getMyTasks(dispatch: typeof store.dispatch, email) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.myTask}/${email}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MY_TASK,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getGroupTasks(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.groupTask,
    options: {},
    dispatch: dispatch,
    actionType: GET_GROUP_TASK,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function unAssignGroupTasks(
  dispatch: typeof store.dispatch,
  navigate,
  data,
  roleState,
  emailId
) {
  let response = await apiRequest({
    URL: dataCurationETL + apiUrl.updateMyTask,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: UNASSIGN_GROUP_TASK,
    alertRequired: true,
    successMessage: 'Task  Unassigned',
    errorMessage: null,
    alertTitle: '',
  });
  if (response) {
    await getMyTasks(dispatch, emailId);
    let roledata = roleState.roleName;
    let Role = JSON.stringify(roledata);
    let adminIdx = Role.toLocaleLowerCase().search('admin');
    if (adminIdx > 0) {
      await totalData(dispatch);
    } else {
      await getGroupTasks(dispatch);
    }
  }
}
export async function getDeltaConfigById(
  dispatch: typeof store.dispatch,
  taskId
) {
  let response = await apiRequest({
    URL: dataCurationETL + apiUrl.Delta + '/' + taskId,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: '',
    errorMessage: null,
    alertTitle: '',
  });
  if (response) {
    dispatch({ type: DELTA_CONFIG, payload: response[0] });
  }
}
export async function AssignMyTasks(
  dispatch: typeof store.dispatch,
  data,
  roleState
) {
  let response = await apiRequest({
    URL: dataCurationETL + apiUrl.update,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Task  Assigned Successfully',
    errorMessage: null,
    alertTitle: '',
  });
  if (response) {
    let roledata = roleState.roleName;
    let Role = JSON.stringify(roledata);
    let adminIdx = Role.toLocaleLowerCase().search('admin');
    if (adminIdx > 0) {
      await totalData(dispatch);
    } else {
      await getGroupTasks(dispatch);
    }
  }
}
export async function UpdateStatus(dispatch: typeof store.dispatch, TASK_Id) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.updateTaskStatus + '/' + TASK_Id,
    options: { method: 'POST', body: TASK_Id },
    dispatch: dispatch,
    actionType: UNASSIGN_GROUP_TASK,
    alertRequired: false,
    successMessage: '',
    errorMessage: null,
    alertTitle: '',
  });
}
export async function ErrorStatus(dispatch: typeof store.dispatch, TASK_Id) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.errorStatus + '/' + TASK_Id,
    options: { method: 'POST', body: TASK_Id },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: '',
    errorMessage: null,
    alertTitle: '',
  });
}
export async function totalData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.TotalData,
    options: {},
    dispatch: dispatch,
    actionType: GET_GROUP_TASK,
    alertRequired: false,
    successMessage: '',
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getLastQuater(dispatch: typeof store.dispatch, data) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getLastQuater}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: '',
    errorMessage: null,
    alertTitle: '',
  });
}

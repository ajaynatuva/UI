import { navyColor } from '../../assets/jss/material-kit-react';
import { CustomSwal } from '../../components/CustomSwal/CustomSwal';
import { SET_IS_LOADING } from '../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { batch } from 'react-redux';
import { Dispatch } from 'redux';

function showAlert(icon, title, text) {
  CustomSwal(icon, text, navyColor, 'Ok', title);
}

export async function apiRequest({
  URL,
  options,
  dispatch,
  actionType = '',
  alertRequired = false,
  successMessage = null,
  errorMessage = null,
  alertTitle = null,
}) {
  if (dispatch) {
    dispatch({ type: SET_IS_LOADING, payload: true });
  }
  const { method, headers, body } = options;
  try {
    const response = await fetch(`${URL}`, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body : body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (dispatch) {
        dispatch({ type: SET_IS_LOADING, payload: false });
      }
      if(alertRequired){
        showAlert('error', alertTitle || '', errorMessage);
        console.error("API IS FAILED :",errorText)
      }
      return;
    }
    if (response.status === 204) {
      if (dispatch) {
        dispatch({ type: SET_IS_LOADING, payload: false });
      }
      return null;
    }
    let data = null;
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }
    if (data !== null) {
      if (dispatch) {
        dispatch({ type: actionType, payload: data });
      }
      if (alertRequired && successMessage) {
        showAlert('success', '', successMessage || 'Request successful');
      }
    } else {
      if (alertRequired && successMessage) {
        showAlert('success', '', successMessage || 'Request successful');
      }
    }
    if (dispatch) {
      dispatch({ type: SET_IS_LOADING, payload: false });
    }
    return data;
  } catch (err) {
    console.error('Error during API request:', err);
    if (dispatch) {
      dispatch({ type: SET_IS_LOADING, payload: false });
    }
    throw err;
  }
}
export async function apiRequestForTextResponse({
  URL,
  dispatch,
  actionType = '',
}) {
  await fetch(URL)
  .then((response) => {
    const contentType = response.headers.get("content-type");
    // if (!response.ok) {
    //   throw new Error(response.statusText);
    // }
    if (!response.ok || (contentType && contentType.includes("text/html"))) {
      console.warn("Unexpected response type. Returning null.");
      return null;
    }
    return response.text();
  })
  .then((data) => {
    dispatch({ type: actionType, payload: data });
    return data
  });
}
export async function apiRequestWithFileData({
  URL,
  options,
  dispatch,
  actionType = '',
  alertRequired = false,
  successMessage = null,
  errorMessage = null,
  alertTitle = null,
}) {
  let errorMessageText = `Something went wrong. Please try again later.`;
  if (dispatch) {
    dispatch({ type: SET_IS_LOADING, payload: true });
  }
  const { method, headers, body } = options;
  try {
    const response = await fetch(`${URL}`, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ?body: undefined,
    });
    if (!response.ok) {
      showAlert(
        'error',
        alertTitle ? alertTitle : '',
        errorMessage || errorMessageText
      );
      if (dispatch) {
        dispatch({ type: SET_IS_LOADING, payload: false });
      }
    }
    const data = await response.text();
    if (data !== null) {
      if (dispatch) {
        dispatch({ type: actionType, payload: data });
      }
      if (alertRequired && successMessage) {
        showAlert('success', '', successMessage || 'Request successful');
      }
    }
  } catch (Exception) {
    console.error('Error during API request:', Exception);
    if (dispatch) {
      dispatch({ type: SET_IS_LOADING, payload: false });
    }
    throw Exception;
  }
}

export const batchDispatch = (dispatch: Dispatch, actions: any[]) => {
  batch(() => {
    actions.forEach(action => dispatch(action));
  });
};

import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import {
  GET_BILL_TYPE_DATA,
  GET_POLICY_BILL_TYPE_ACTION_LKP,
  GET_SOURCE_BILL_TYPE_LKP_DATA,
  POLICY_BILL_TYPE_DATA,
  POST_BILL_TYPE_DATA,
  SET_IS_LOADING,
} from '../NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { navyColor } from '../../../assets/jss/material-kit-react';

export async function uploadBillTypeData(
  dispatch: typeof store.dispatch,
  BillTypeData,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  // try{
  try {
    await fetch(policyConfigUrl + apiUrl.saveBillType, {
      method: 'POST',
      body: BillTypeData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.text();
      })
      .then((BillTypeData) => {
        dispatch({ type: SET_IS_LOADING, payload: false });
        getPolicyBillTypeByPolicyId(dispatch, policyId);
        CustomSwal('success', 'Data saved Successfully', navyColor, 'Ok', '');
        return true;
      });
  } catch (error) {}
}
export async function getPolicyBillTypeData(
  dispatch: typeof store.dispatch,
  policyId
) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getBillTypeKey,
    options: {},
    dispatch: dispatch,
    actionType: GET_BILL_TYPE_DATA,
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get Bill Type data',
    alertTitle: 'error',
  });
  return response;
}
export async function getPolicyBillTypeByPolicyId(
  dispatch: typeof store.dispatch,
  policyId
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getPolicyBillType}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: POLICY_BILL_TYPE_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function DeleteBillTypeData(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(policyConfigUrl + apiUrl.deleteBillTypeData + '/' + data, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.text();
    })
    .then((data) => {
      getPolicyBillTypeByPolicyId(dispatch, policyId);
      dispatch({ type: SET_IS_LOADING, payload: false });

      CustomSwal(
        'success',
        'BillType data deleted successfully',
        navyColor,
        'Ok',
        ''
      );
    });
}
export async function getBillTypeData(dispatch: typeof store.dispatch) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(policyConfigUrl + apiUrl.getBillTypeKey)
    .then((response) => {
      if (!response.ok) {
        // throw new Error(response.statusText);
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.json();
    })
    .then((data) => {
      // if(data.)
      dispatch({ type: GET_BILL_TYPE_DATA, payload: data });
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

export async function getSourceBillTypeLkpData(
  dispatch: typeof store.dispatch
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(policyConfigUrl + apiUrl.getSourceBillTypeLkpData)
    .then((response) => {
      if (!response.ok) {
        // throw new Error(response.statusText);
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.json();
    })
    .then((data) => {
      // if(data.)
      dispatch({ type: GET_SOURCE_BILL_TYPE_LKP_DATA, payload: data });
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}
export async function postBillTypeData(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  let ok = data.map((k, i) => {
    return {
      policyId: parseInt(policyId),
      billType: k.billTypeLkp,
      billTypeDesc: k.billTypeDescLkp,
    };
  });
  await fetch(policyConfigUrl + apiUrl.postBillTypeData, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ok),
  })
    .then((response) => {
      if (!response.ok) {
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.json;
    })
    .then((data) => {
      getPolicyBillTypeByPolicyId(dispatch, policyId);
      dispatch({ type: POST_BILL_TYPE_DATA, payload: data });
      dispatch({ type: SET_IS_LOADING, payload: false });

      CustomSwal(
        'success',
        'BillType data added successfully',
        navyColor,
        'Ok',
        ''
      );
    });
}
export async function getPolicyBillTypeActionLkp(
  dispatch: typeof store.dispatch
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(policyConfigUrl + apiUrl.getPolicyBillTypeActionLkp)
    .then((response) => {
      if (!response.ok) {
        // throw new Error(response.statusText);
      }
      dispatch({ type: SET_IS_LOADING, payload: false });
      return response.json();
    })
    .then((data) => {
      dispatch({ type: GET_POLICY_BILL_TYPE_ACTION_LKP, payload: data });
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}
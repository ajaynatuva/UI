import { apiUrl, policyConfigUrl } from '../../../configs/apiUrls';
import { GET_CONDITION_TYPE_DATA } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { CONDITION_CODE_FIELDS } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';

export async function postConditionTypeData(
  dispatch,
  conditionTypeData,
  policyId
) {
  let ConditionTabData = conditionTypeData.map((k, i) => {
    return {
      policyId: parseInt(policyId),
      conditionCode: k.condCode,
      conditionCodeDesc: k.condDesc,
    };
  });
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.postConditionTypeData,
    options: {
      method: 'POST',
      body: ConditionTabData,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Condition Type Data Saved',
    errorMessage: 'Failed to save Condition Type Data',
    alertTitle: 'error',
  });
 
  await getPolicyConditionTypeData(dispatch, policyId);
  
}
export async function getPolicyConditionTypeData(dispatch, policyId) {
 let response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getPolicyConditionType}/${policyId}`,
    options: {},
    dispatch: dispatch,
    actionType: CONDITION_CODE_FIELDS,
    alertRequired: true,
    successMessage: null,
    errorMessage: 'Failed to get Condition Type Data',
    alertTitle: 'error',
  });
  if(response){
    dispatch({
      type: CONDITION_CODE_FIELDS,
      payload: {
        conditionTabTableData: response,
      },
    });
  }
}
export async function DeleteConditionTypeData(
  dispatch: typeof store.dispatch,
  data,
  policyId
) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.deleteConditionTypeData + '/' + data,
    options: {
      method: 'POST',
      body: data,
    },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: 'Condition Type data deleted successfully',
    errorMessage: null,
    alertTitle: 'error',
  });
  await getPolicyConditionTypeData(dispatch, policyId);
}
export async function getConditionTypeData(dispatch: typeof store.dispatch) {
  await apiRequest({
    URL: policyConfigUrl + apiUrl.getConditionTypeData,
    options: {},
    dispatch: dispatch,
    actionType: GET_CONDITION_TYPE_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}

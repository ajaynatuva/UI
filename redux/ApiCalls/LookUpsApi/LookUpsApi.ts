import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import {
  apiUrl,
  dataCurationETL,
  policyConfigUrl,
  policyengine,
} from '../../../configs/apiUrls';
import {
  ADD_ON_CODES,
  ALLOW_CMS_NCCI_MODIFIERS,
  BILL_TYPE_LKP,
  BO_TYPE_LKP,
  BW_TYPE_LKP,
  CCI_DEVIATIONS,
  CCI_DEVIATIONS_EDIT,
  CCI_LKP,
  CCI_RATIONALE_LKP,
  CLAIM_TYPE_LINK_LKP,
  CONDITION_CODE_LKP,
  EDIT_MOD_LKP_DATA,
  GET_BW_TYPE_DATA,
  GET_CHANGE_MODIFIER,
  GET_DRGN_CHALLENGE_CODE,
  GET_TOTAL_NUMBER_OF_CLAIMS_ROWS,
  IGNORE_MODIFIER,
  MAX_UNITS_LKP,
  MAX_UNITS_TYPES,
  MIN_MAX_AGE_LKP,
  MOD_LKP,
  MODIFIER_INTERACTION_LKP,
  MODIFIER_INTRACTION_TYPE,
  MODIFIER_PAY_PERCENTAGE,
  MODIFIER_PAY_PERCENTAGE_DATA,
  MODIFIER_PAY_PERCENTAGE_LKP_DATA,
  MODIFIER_PRIORITY_LKP,
  MUE_RATIONALE_LKP,
  POLICY_CATEGORY_LKP,
  POS_LKP_DATA,
  POST_MOD_LKP_DATA,
  PTP_CCI,
  REASON_CODE_LKP,
  REFRESH_CHALLENGE_CACHE,
  REFRESH_POLICY_CACHE,
  REVENUE_CODE_LKP,
  SAME_OR_SIMILAR_CODE_LKP,
  SPECS_LKP,
  SUB_SPEC_LKP,
} from '../../../pages/LookUps/LookUpConsts';
import {
  GET_CAT,
  GET_CLAIM_LINK_LKP,
  GET_CLAIM_TYPE_LINK_LKP,
  GET_CPTLINK,
  GET_GENDER,
  GET_LOB,
  GET_MAX_AGE,
  GET_MEDICAL_POLICY,
  GET_MEDICAL_POLICY_DATA,
  GET_MIN_AGE,
  GET_MODIFIER_PAY_PERCENTAGE,
  GET_NPI,
  GET_POLICY_CPT_ACTION_LKP,
  GET_POSLINK,
  GET_PROD_TYPE,
  GET_REASON_CODES,
  GET_REVENUE_CODE_CLAIM_LINK,
  GET_SUB_POLICY,
  GET_SUBSPECIALITY,
  GET_TAX_LOGIC,
  SEARCH_CLAIM,
  SET_IS_LOADING,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { BW_OR_BOAN_ACTION_LKP } from '../../ApiCalls/LookUpsApi/LookUpsActionTypes';
import { GET_MODIFIER_PAY_PERCENTAGE_LKP } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import {
  GET_RATIONALE_DATA,
  GET_Max_UNITS_LKP_DATA,
  GET_MOD_INTRACTION_DATA,
  GET_MAI_LKP_DATA,
  GET_MUE_LKP_DATA,
} from '../../ApiCalls/TaskApis/TaskApiType';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { GET_ALL_CLAIM_TYPE } from '../NewPolicyTabApis/AllPolicyConstants';
import {
  GET_SPEC_LOOKUP,
  GET_SUB_SPEC_LOOKUP,
  GET_MIN_MAX_AGE_LOOKUP,
  GET_REVENUE_LOOKUP,
  GET_BILL_TYPE_LOOKUP,
  GET_CONDITION_LOOKUP,
  GET_MOD_LOOKUP,
  GET_POS_LOOKUP,
  GET_POLICY_CATEGORY_LOOKUP,
  GET_REASON_LOOKUP,
  GET_MODIFIER_PRIORITY_LKP,
  GET_MODIFIER_INTERACTION_LKP,
  GET_MODIFIER_INTERACTION_TYPE_LKP,
  GET_CCI_LOOKUP,
  GET_MUE_RATIONALE_LOOKUP,
  GET_BW_TYPE_LOOKUP,
  GET_MAX_UNITS_TYPES,
  GET_BO_LOOKUP,
  GET_MAX_UNITS_LKP,
  GET_CCI_DEVITIONS,
  GET_STATES,
} from './LookUpsActionTypes';

export async function fetchLookupData(
  dispatch: typeof store.dispatch,
  lkpName: string
) {
  const response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getLookUpData + '/' + lkpName}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
  if (response.length > 0) {
    dispatch({ type: getLookupActionType(lkpName), payload: response });
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
}

const getLookupActionType = (lkpName) => {
  switch (lkpName) {
    case SPECS_LKP:
      return GET_SPEC_LOOKUP;
    case SUB_SPEC_LKP:
      return GET_SUB_SPEC_LOOKUP;
    case MIN_MAX_AGE_LKP:
      return GET_MIN_MAX_AGE_LOOKUP;
    case REVENUE_CODE_LKP:
      return GET_REVENUE_LOOKUP;
    case BILL_TYPE_LKP:
      return GET_BILL_TYPE_LOOKUP;
    case CONDITION_CODE_LKP:
      return GET_CONDITION_LOOKUP;
    case MOD_LKP:
      return GET_MOD_LOOKUP;
    case POS_LKP_DATA:
      return GET_POS_LOOKUP;
    case POLICY_CATEGORY_LKP:
      return GET_POLICY_CATEGORY_LOOKUP;
    case REASON_CODE_LKP:
      return GET_REASON_LOOKUP;
    case MODIFIER_PRIORITY_LKP:
      return GET_MODIFIER_PRIORITY_LKP;
    case MODIFIER_INTERACTION_LKP:
      return GET_MODIFIER_INTERACTION_LKP;
    case MODIFIER_INTRACTION_TYPE:
      return GET_MODIFIER_INTERACTION_TYPE_LKP;
    case SAME_OR_SIMILAR_CODE_LKP:
      return SAME_OR_SIMILAR_CODE_LKP;
    case CCI_LKP:
      return GET_CCI_LOOKUP;
    case CCI_RATIONALE_LKP:
      return GET_RATIONALE_DATA;
    case CLAIM_TYPE_LINK_LKP:
      return GET_CLAIM_TYPE_LINK_LKP;
    case MUE_RATIONALE_LKP:
      return GET_MUE_RATIONALE_LOOKUP;
    case BW_TYPE_LKP:
      return GET_BW_TYPE_LOOKUP;
    case MAX_UNITS_TYPES:
      return GET_MAX_UNITS_TYPES;
    case BO_TYPE_LKP:
      return GET_BO_LOOKUP;
    case MAX_UNITS_LKP:
      return GET_MAX_UNITS_LKP;
    case MODIFIER_PAY_PERCENTAGE:
      return GET_MODIFIER_PAY_PERCENTAGE;
    case MODIFIER_PAY_PERCENTAGE_LKP_DATA:
      return GET_MODIFIER_PAY_PERCENTAGE_LKP;
    case CCI_DEVIATIONS:
      return GET_CCI_DEVITIONS;
    case CCI_DEVIATIONS:
      return GET_CCI_DEVITIONS;
    default:
      return null; // Handle default case if needed
  }
};

export async function postLookupData(
  dispatch: typeof store.dispatch,
  data,
  isEdit,
  lkpName
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  const response = await fetch(policyConfigUrl + apiUrl.postLookUpdata + '/' + lkpName, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  // const jsonData = await response.json(); // ✅ Await the actual JSON response

  dispatch({ type: SET_IS_LOADING, payload: false });

  if (response.status === 500) {
        CustomSwal(
          'error',
          'Please fill in required fields',
          navyColor,
          'OK',
          ''
        );
      } else {
        if (lkpName === EDIT_MOD_LKP_DATA || lkpName === POST_MOD_LKP_DATA) {
          lkpName = MOD_LKP;
        } else if (lkpName === CCI_DEVIATIONS_EDIT) {
          lkpName = CCI_DEVIATIONS;
        }else{
          lkpName = lkpName;
        }
        fetchLookupData(dispatch, lkpName);
        dispatch({ type: SET_IS_LOADING, payload: false });
        if (data && lkpName !== CCI_DEVIATIONS) {
          CustomSwal(
            'success',
            isEdit ? 'Data Updated successfully' : 'Data Added successfully',
            navyColor,
            'Ok',
            ''
          );
        }
      }
    };


export async function getMaxUnitsLkpData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getMaxUnitsLkpData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_Max_UNITS_LKP_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getModIntractionLkpData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getModifierIntractionLkpData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MOD_INTRACTION_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getMaiLkpData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getMaiLkpData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MAI_LKP_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getMueLkpData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getMueLkpData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MUE_LKP_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getStatesData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getStates}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_STATES,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

// new policy getting look ups
export async function getReasonCodes(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getLookUpData + '/' + REASON_CODE_LKP}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_REASON_CODES,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getCAT(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${
      policyConfigUrl + apiUrl.getLookUpData + '/' + POLICY_CATEGORY_LKP
    }`,
    options: {},
    dispatch: dispatch,
    actionType: GET_CAT,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getMedicalPolicy(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getMedicalpolicy}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MEDICAL_POLICY,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getSubPolicy(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getSubPolicy}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_SUB_POLICY,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getMedicalData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getMedicalData}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_MEDICAL_POLICY_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getProductType(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getProductType}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_PROD_TYPE,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getLOB(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getLob}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_LOB,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getGender(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getGender}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_GENDER,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getProcedureAgeDetails(dispatch: typeof store.dispatch) {
  const response = await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getLookUpData + '/' + MIN_MAX_AGE_LKP}`,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });

  let minAge = response.filter((d) => d.minVsMaxB != 0);
  dispatch({ type: GET_MIN_AGE, payload: minAge });

  let maxAge = response.filter((d) => d.minVsMaxB == 0);
  dispatch({ type: GET_MAX_AGE, payload: maxAge });
}

// export async function getMaxAge(dispatch: typeof store.dispatch) {
//   const response = await apiRequest({
//     URL: `${policyConfigUrl + apiUrl.getLookUpData + '/' + MIN_MAX_AGE_LKP}`,
//     options: {},
//     dispatch: dispatch,
//     actionType: GET_MAX_AGE,
//     alertRequired: false,
//     successMessage: null,
//     errorMessage: null,
//     alertTitle: '',
//   });
//   let maxAge = response.filter((d) => d.minVsMaxB == 0);
//   dispatch({ type: GET_MAX_AGE, payload: maxAge });
// }

export async function getTaxLogic(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getTaxlink}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_TAX_LOGIC,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getSubSpeciality(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getPropSubSpec}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_SUBSPECIALITY,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getBWORAndBOAnLKP(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getActionValue}`,
    options: {},
    dispatch: dispatch,
    actionType: BW_OR_BOAN_ACTION_LKP,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getClmLinkLkp(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getClmLinkLkp}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_CLAIM_LINK_LKP,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getPolicyCptActionLkp(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getPoliyCptActionLkp}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_POLICY_CPT_ACTION_LKP,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getNPI(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getNpi}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_NPI,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getPOSLINK(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getPosLink}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_POSLINK,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getRevenueCodeClaimLink(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getRevenueCodeClaimLink}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_REVENUE_CODE_CLAIM_LINK,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getCPTLink(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.getCptLink}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_CPTLINK,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getAllClaimType(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.getClaimType,
    options: {},
    dispatch: dispatch,
    actionType: GET_ALL_CLAIM_TYPE,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

export async function getAllowCmsNcciModifiers(
  dispatch: typeof store.dispatch
) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getLookUpData + '/' + MOD_LKP,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
  let isCci = response.filter((d) => d.isCci == 1);
  dispatch({ type: IGNORE_MODIFIER, payload: isCci });
}
export async function getIgnoreModifier(dispatch: typeof store.dispatch) {
  let response = await apiRequest({
    URL: policyConfigUrl + apiUrl.getLookUpData + '/' + MOD_LKP,
    options: {},
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
  let ignoreMod = response.filter((d) => d.is_59_group == 1);
  dispatch({ type: IGNORE_MODIFIER, payload: ignoreMod });
}
export async function getBwTypeData(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.getBwType,
    options: {},
    dispatch: dispatch,
    actionType: GET_BW_TYPE_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getCci(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.getLookUpData + '/' + CCI_LKP,
    options: {},
    dispatch: dispatch,
    actionType: PTP_CCI,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function ModifierPayPercentageData(
  dispatch: typeof store.dispatch,
  data
) {
  return await apiRequest({
    URL: `${policyConfigUrl + apiUrl.modiferPayPercentageKey}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: MODIFIER_PAY_PERCENTAGE_DATA,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getRefreshChallengeCache(
  dispatch: typeof store.dispatch
) {
  return await apiRequest({
    URL: policyengine + apiUrl.refreshChallengeCache,
    options: {},
    dispatch: dispatch,
    actionType: REFRESH_CHALLENGE_CACHE,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getRefreshPolicyCache(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyengine + apiUrl.refreshPolicyCache,
    options: {},
    dispatch: dispatch,
    actionType: REFRESH_POLICY_CACHE,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getAddOnCodes(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.getAddOnCodes,
    options: {},
    dispatch: dispatch,
    actionType: ADD_ON_CODES,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getChangeModifier(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyConfigUrl + apiUrl.getChangeModifier,
    options: {},
    dispatch: dispatch,
    actionType: GET_CHANGE_MODIFIER,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
// export async function getClaimDataSize(dispatch: typeof store.dispatch, data) {
//   return await apiRequest({
//     URL: policyConfigUrl + apiUrl.searchClaimDataSize,
//     options: {},
//     dispatch: dispatch,
//     actionType: GET_TOTAL_NUMBER_OF_CLAIMS_ROWS,
//     alertRequired: false,
//     successMessage: null,
//     errorMessage: null,
//     alertTitle: '',
//   });
// }

export async function getDrgnChallengeCode(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: policyengine + apiUrl.getChallengeCode,
    options: {},
    dispatch: dispatch,
    actionType: GET_DRGN_CHALLENGE_CODE,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}

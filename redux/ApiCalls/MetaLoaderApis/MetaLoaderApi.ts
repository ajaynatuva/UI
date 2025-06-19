import { navyColor } from '../../../assets/jss/material-kit-react';
import { CustomSwal } from '../../../components/CustomSwal/CustomSwal';
import { apiUrl, dataCurationETL } from '../../../configs/apiUrls';
import { MetaLoaderConstants } from '../../../pages/MetaDataLoader/MetaLoaderConst';
import { GET_MFS_QUARTER } from '../../ApiCalls/MetaLoaderApis/MetaLoaderApiTypes';
import { GET_GROUP_TASK } from '../../ApiCalls/TaskApis/TaskApiType';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { SET_IS_LOADING } from '../NewPolicyTabApis/AllPolicyConstants';

export const targetLoadCases = [
  MetaLoaderConstants.MFS,
  MetaLoaderConstants.MFS_DATE_BINDED,
  MetaLoaderConstants.APC,
  MetaLoaderConstants.CAPC,
  MetaLoaderConstants.OCE_HCPCS,
  MetaLoaderConstants.APC_DATE_BINDED,
  MetaLoaderConstants.CAPC_DATE_BINDED,
  MetaLoaderConstants.HCPCS_DATE_BINDED,
  MetaLoaderConstants.CCI_MEDICAID_HOSPITAL,
  MetaLoaderConstants.CCI_MEDICAID_PRACT,
  MetaLoaderConstants.CCI_MEDICARE_HOSPITAL,
  MetaLoaderConstants.CCI_MEDICARE_PRACT,
  MetaLoaderConstants.DMUV_PROFESSIONAL,
  MetaLoaderConstants.DMUV_OUTPATIENT,
  MetaLoaderConstants.ANNUAL_MAX_UNITS,
  MetaLoaderConstants.DMUV_PROFESSIONAL_AUTO,
  MetaLoaderConstants.DMUV_OUTPATIENT_AUTO,
  MetaLoaderConstants.DMUV_DME_AUTO,
  MetaLoaderConstants.MEDICAID_MUE_DME,
  MetaLoaderConstants.MEDICAID_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDICAID_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDICAID_MUE_DME_AUTO,
  MetaLoaderConstants.MEDICAID_MUE_OUTPATIENT_AUTO,
  MetaLoaderConstants.MEDICAID_MUE_PROFESSIONAL_AUTO,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_ASC,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_DME,
  MetaLoaderConstants.MEDICARE_NCCI_MEDICALLY_UNLIKELY_DME,
  MetaLoaderConstants.ADHOC_CPT_HCPCS,
  MetaLoaderConstants.CCI_DEVIATIONS,
  MetaLoaderConstants.HCPCS,
  MetaLoaderConstants.ICD_10_CM,
  MetaLoaderConstants.BW_Pairs,
  MetaLoaderConstants.ICD_10_PCS,
  MetaLoaderConstants.ICD_10_PCS_DRGN_AUTO,
  MetaLoaderConstants.ICD_10_CM_DRGN,
  MetaLoaderConstants.ADD_ON_CODES,
  MetaLoaderConstants.ADDON_CODE_TYPE_2,
  MetaLoaderConstants.ADDON_CODE_TYPE_3,
  MetaLoaderConstants.Modifier_Interaction,
  MetaLoaderConstants.GPCI,
  MetaLoaderConstants.GPCI_DATE_BINDED,
  MetaLoaderConstants.ZIP_5,
  MetaLoaderConstants.ZIP_9,
  MetaLoaderConstants.ZIP_5_DATE_BINDED,
  MetaLoaderConstants.ZIP_9_DATE_BINDED,
  MetaLoaderConstants.SAME_OR_SIMILAR,
  MetaLoaderConstants.RBRVS,
  MetaLoaderConstants.CPT,
];
export async function getMfsQuaterLoader(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.getQuarter,
    options: {},
    dispatch: dispatch,
    actionType: GET_MFS_QUARTER,
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
}
export async function uploadMetaLoader(
  dispatch: typeof store.dispatch,
  data1,
  sourceName,
  navigate
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  if (
    !(
      sourceName == MetaLoaderConstants.RBRVS ||
      sourceName == MetaLoaderConstants.ICD_10_PCS ||
      sourceName == MetaLoaderConstants.ICD_10_CM_DRGN ||
      sourceName == MetaLoaderConstants.ADHOC_CPT_HCPCS ||
      sourceName == MetaLoaderConstants.CCI_DEVIATIONS
    )
  ) {
    fetch(dataCurationETL + apiUrl.uploadManualFile, {
      method: 'POST',
      body: data1,
    });
    setTimeout(() => {
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal(
        'success',
        "File Uploaded Successfully. You'll receive an Email Notification shortly!",
        navyColor,
        'Ok',
        ''
      );
    }, 2000);
  }
  if (sourceName == MetaLoaderConstants.RBRVS) {
    dispatch({ type: SET_IS_LOADING, payload: true });
    fetch(dataCurationETL + apiUrl.uploadRBRVS, {
      method: 'POST',
      body: data1,
    });
    setTimeout(() => {
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal(
        'success',
        "File Uploaded Successfully. You'll receive an Email Notification shortly!",
        navyColor,
        'Ok',
        ''
      );
    }, 2000);
  }
  if (sourceName == MetaLoaderConstants.ICD_10_PCS) {
    dispatch({ type: SET_IS_LOADING, payload: true });
    fetch(dataCurationETL + apiUrl.uploadICD10PCS, {
      method: 'POST',
      body: data1,
    });
    setTimeout(() => {
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal(
        'success',
        "File Uploaded Successfully. You'll receive an Email Notification shortly!",
        navyColor,
        'Ok',
        ''
      );
    }, 2000);
  }
  if (sourceName == MetaLoaderConstants.ICD_10_CM_DRGN) {
    dispatch({ type: SET_IS_LOADING, payload: true });
    fetch(dataCurationETL + apiUrl.uploadICD10CMD, {
      method: 'POST',
      body: data1,
    });
    setTimeout(() => {
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal(
        'success',
        "File Uploaded Successfully. You'll receive an Email Notification shortly!",
        navyColor,
        'Ok',
        ''
      );
    }, 2000);
  }
  if (sourceName == MetaLoaderConstants.ADHOC_CPT_HCPCS || sourceName == MetaLoaderConstants.CCI_DEVIATIONS) {
    dispatch({ type: SET_IS_LOADING, payload: true });
    fetch(dataCurationETL + apiUrl.uploadManualFile, {
      method: 'POST',
      body: data1,
    });
    setTimeout(() => {
      dispatch({ type: SET_IS_LOADING, payload: false });
      CustomSwal(
        'success',
        "File Uploaded Successfully. You'll receive an Email Notification shortly!",
        navyColor,
        'Ok',
        ''
      );
    }, 2000);
  }
}
export async function loadDataToTarget(dispatch, data, LoaderName) {
  CustomSwal(
    'info',
    'Target Load in Progress. Email will be sent shortly.',
    navyColor,
    'Ok',
    ''
  );
  const apiEndPoint = targetLoadCases.includes(LoaderName)
    ? apiUrl.loadDataToTarget
    : null;
  return await apiRequest({
    URL: dataCurationETL + apiEndPoint,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: GET_GROUP_TASK,
    alertRequired: true,
    successMessage: 'Data Loaded Successfully',
    errorMessage: 'Failed to load data',
    alertTitle: 'error',
  });
}

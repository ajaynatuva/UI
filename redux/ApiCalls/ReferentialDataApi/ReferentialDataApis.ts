import { apiUrl, dataCurationETL } from '../../../configs/apiUrls';
import { ViewMetaConstants } from '../../../pages/ViewMeta/viewMetaConstants';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import { GET_TOTAL_NUMBER_OF_ROWS } from './ReferetialDataTypes';

export async function getReferentialData(
  dispatch: typeof store.dispatch,
  data,
  sourceName
) {
  const response = await apiRequest({
    URL: `${
      dataCurationETL + apiUrl.getReferentialDataDetails + '/' + sourceName
    }`,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: true,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });

  const sourceMapping = {
    [ViewMetaConstants.MFS]: response.mfsSearchResultDTO,
    [ViewMetaConstants.MFS_DATE_BINDED]: response.mfsSearchResultDTO,
    [ViewMetaConstants.GPCI]: response.gpciResult,
    [ViewMetaConstants.GPCI_DATE_BINDED]: response.gpciResult,
    [ViewMetaConstants.ADD_ON_CODES]: response.addOnCodeResult,
    [ViewMetaConstants.APC_DATE_BINDED]: response.apcResult,
    [ViewMetaConstants.CAPC_DATE_BINDED]: response.capcResult,
    [ViewMetaConstants.CCI]: response.cciSearchResults,
    [ViewMetaConstants.OCE_HCPCS]: response.oceHcpcsResult,
    [ViewMetaConstants.HCPCS_DATE_BINDED]: response.oceHcpcsResult,
    'CPT HCPCS': response.cptSearchResult,
    [ViewMetaConstants.ICD]: response.icdResultSet,
    [ViewMetaConstants.MAX_UNITS]: response.maxUnitsResultSet,
    [ViewMetaConstants.BW_Pairs]: response.bwPairsSearchResultDTO,
    [ViewMetaConstants.ZIP_5]: response.zip5Result,
    [ViewMetaConstants.ZIP_5_DATE_BINDED]: response.zip5Result,
    [ViewMetaConstants.ZIP_9]: response.zip9Result,
    [ViewMetaConstants.ZIP_9_DATE_BINDED]: response.zip9Result,
  };
  const dataResult = sourceMapping[sourceName] || [];
  dispatch({ type: GET_TOTAL_NUMBER_OF_ROWS, payload: response.numberOfRows });
  return dataResult;
}
export async function exportReferentialData(
  dispatch: typeof store.dispatch,
  data,
  sourceName,
  exportedData
) {
  return await apiRequest({
    URL: `${dataCurationETL}${apiUrl.exportReferentialDataDetails}/${sourceName}/${exportedData}`,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: null,
  });
}
export async function getClientSpecficCodesReferentialData(
  dispatch: typeof store.dispatch,
  data
) {
  const response = await apiRequest({
    URL: `${dataCurationETL + apiUrl.viewClientSpecficCodesData}`,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: '',
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
  dispatch({ type: GET_TOTAL_NUMBER_OF_ROWS, payload: response.length });
  return response;
}
export async function getReferentialDataTotalOfRows(
  dispatch: typeof store.dispatch,
  data
) {
  return await apiRequest({
    URL: `${dataCurationETL + apiUrl.getTotalNumberOfRowsFromSource}/${data}`,
    options: {},
    dispatch: dispatch,
    actionType: GET_TOTAL_NUMBER_OF_ROWS,
    alertRequired: false,
    successMessage: '',
    errorMessage: '',
    alertTitle: null,
  });
}

import { apiUrl, dataCrawler, dataCurationETL } from '../../../configs/apiUrls';
import { apiRequest } from '../../ApiCallAction/ApiCallAction';
import { store } from '../../store';
import {
  CRAWLER_VALIDATION,
  GET_ALL_CRAWLER_DETAILS,
  GET_CRAWLER,
  GET_CRAWLER_CLASS,
  GET_FREQUENCY,
  RUN_CRAWLER,
  SAVE_CONFIG,
} from './CrwalerActionType';

export async function errorValidation(dispatch, data) {
  let error = false;
  let errors = {
    name: false,
    url: false,
    xpaths: false,
    xpathDelimeter: false,
    frequency: false,
    lastPublishedDate: false,
    crawlerClass: false,
    emailIds: false,
  };
  if (data.name == undefined || data.name == '') {
    errors.name = true;
    error = true;
  }
  if (data.url == undefined || data.url == '') {
    errors.url = true;
    error = true;
  }
  if (data.xpaths == undefined || data.xpaths == '') {
    errors.xpaths = true;
    error = true;
  }
  if (data.xpathDelimiter == undefined || data.xpathDelimiter == '') {
    errors.xpathDelimeter = true;
    error = true;
  }
  if (data.frequency == undefined || data.frequency == '') {
    errors.frequency = true;
    error = true;
  }
  if (
    data.lastPublishedDate == null ||
    data.lastPublishedDate == '' ||
    data.lastPublishedDate == 'Invalid date'
  ) {
    errors.lastPublishedDate = true;
    error = true;
  }
  if (data.crawlerClass == undefined || data.crawlerClass == '') {
    errors.crawlerClass = true;
    error = true;
  }
  if (data.emailIds == undefined || data.emailIds == '') {
    errors.emailIds = true;
    error = true;
  }
  if (error) {
    dispatch({ type: CRAWLER_VALIDATION, payload: errors });
  }
  return error;
}
export async function getCrawler(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCurationETL + apiUrl.groupTask,
    options: {},
    dispatch: dispatch,
    actionType: GET_CRAWLER,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getAllCrawlerDetails(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCrawler + apiUrl.getConfig,
    options: {},
    dispatch: dispatch,
    actionType: GET_ALL_CRAWLER_DETAILS,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getFrequency(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCrawler + apiUrl.getFrequency,
    options: {},
    dispatch: dispatch,
    actionType: GET_FREQUENCY,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function getCrawlerClass(dispatch: typeof store.dispatch) {
  return await apiRequest({
    URL: dataCrawler + apiUrl.getCrawlerClass,
    options: {},
    dispatch: dispatch,
    actionType: GET_CRAWLER_CLASS,
    alertRequired: false,
    successMessage: null,
    errorMessage: null,
    alertTitle: '',
  });
}
export async function saveConfig(
  dispatch: typeof store.dispatch,
  data,
  navigate
) {
  const response = await apiRequest({
    URL: dataCrawler + apiUrl.saveConfig,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: SAVE_CONFIG,
    alertRequired: true,
    successMessage: 'Crawler config saved succesfully',
    errorMessage: 'Crawler config failed to save',
    alertTitle: '',
  });
  if (response) {
    navigate('/viewCrawler');
  }
}
export async function updateConfig(
  dispatch: typeof store.dispatch,
  data,
  navigate
) {
   await apiRequest({
    URL: dataCrawler + apiUrl.updateConfig,
    options: { method: 'POST', body: data },
    dispatch: dispatch,
    actionType: SAVE_CONFIG,
    alertRequired: true,
    successMessage: 'Crawler config updated succesfully',
    errorMessage: 'Failed to update crawler data',
    alertTitle: '',
  });
 
    await getAllCrawlerDetails(dispatch);
    navigate('/viewCrawler');
  
}
export async function crawlerRun(dispatch: typeof store.dispatch, source) {
   const response = await apiRequest({
    URL: dataCrawler + apiUrl.runCrawler,
    options: { method: 'POST', body: source },
    dispatch: dispatch,
    actionType: RUN_CRAWLER,
    alertRequired: true,
    successMessage: 'Crawler Initiated. Email will be sent shortly',
    errorMessage: 'Crawler Initiation failed',
    alertTitle: '',
  });
  return JSON.stringify(response);
}

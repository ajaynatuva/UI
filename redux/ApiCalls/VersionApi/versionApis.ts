import {
  apiUrl,
  dataCrawler,
  dataCurationETL,
  emailUrl,
  ipuUser,
  policyConfigUrl,
  policyengine,
} from '../../../configs/apiUrls';
import { apiRequestForTextResponse } from '../../ApiCallAction/ApiCallAction';

import { store } from '../../store';
import {
  CONFIG_VER,
  CRAWLER_VER,
  CURATION_VER,
  EMAIL_VER,
  ENGINE_VER,
  USER_VER,
} from './VersionActionTypes';

export async function getCurationVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${dataCurationETL + apiUrl.getCurationVersion}`,
    dispatch: dispatch,
    actionType: CURATION_VER,
  });
}
export async function getPolicyConfigVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${policyConfigUrl + apiUrl.getConfigVersion}`,
    dispatch: dispatch,
    actionType: CONFIG_VER,
  });
}
export async function getUserVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${ipuUser + apiUrl.getUserVersion}`,
    dispatch: dispatch,
    actionType: USER_VER,
  });
}
export async function getCrawlerVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${dataCrawler + apiUrl.getCrawlerVersion}`,
    dispatch: dispatch,
    actionType: CRAWLER_VER,
  });
}
export async function getEmailVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${emailUrl + apiUrl.getEmailVersion}`,
    dispatch: dispatch,
    actionType: EMAIL_VER,
  });
}

export async function getPolicyEngineVersion(dispatch: typeof store.dispatch) {
  return await apiRequestForTextResponse({
    URL: `${policyengine + apiUrl.getEngineVersion}`,
    dispatch: dispatch,
    actionType: ENGINE_VER,
  });
}

import { apiUrl, dataCurationETL } from '../../../configs/apiUrls';
import { SET_IS_LOADING } from '../NewPolicyTabApis/AllPolicyConstants';
import { store } from '../../store';
import FileSaver from 'file-saver';

export async function genearteRbrvsReport1(dispatch: typeof store.dispatch) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(dataCurationETL + apiUrl.generateRbrvsReport1, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
      }
      return response.blob();
    })
    .then(function (blob) {
      FileSaver.saveAs(blob, 'RBRVS missing acq_cost.csv');
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}
export async function genearteRbrvsReport2(dispatch: typeof store.dispatch) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(dataCurationETL + apiUrl.generateRbrvsReport2, { method: 'GET' })
    .then((response) => {
      if (!response.ok) {
      }
      return response.blob();
    })
    .then(function (blob) {
      FileSaver.saveAs(blob, '0 pricing values which has 0 acq_cost.csv');
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

export async function generateVaccinationCodes(
  dispatch: typeof store.dispatch,
  data
) {
  dispatch({ type: SET_IS_LOADING, payload: true });
  await fetch(dataCurationETL + apiUrl.generateVaccinationCodes, {
    method: 'POST',
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
      }
      return response.blob();
    })
    .then(function (blob) {
      FileSaver.saveAs(blob, 'Vaccination codes.csv');
      dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

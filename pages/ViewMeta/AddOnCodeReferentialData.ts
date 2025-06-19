import { default as moment, default as Moment } from 'moment';
// import { getAddOnCodesData } from '../../redux/actions/TaskActions';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const addOnCodesReferentialData = async (dispatch, taskStates, params, sourceName) => {
  function stringToDateFormat(date) {
    let formatedDate = [];
    const dos = date.split(',');
    if (dos) {
      dos.map((k, l) => {
        formatedDate.push(Moment(k).format('YYYY-MM-DD'));
      });
    }
    return formatedDate.join(',');
  }

  let sortType = '';
  let sortableColumn = '';
  let rows = [];
  let addOnCodes = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'primaryCode': {
        sortableColumn = 'primary_code';
        break;
      }
      case 'addonCode': {
        sortableColumn = 'addon_code';
        break;
      }
      case 'boPolicyKey': {
        sortableColumn = 'bo_policy_key';
        break;
      }
      case 'boTypeKey': {
        sortableColumn = 'bo_type_key';
        break;
      }
      case 'daysLo': {
        sortableColumn = 'days_lo';
        break;
      }
      case 'daysHi': {
        sortableColumn = 'days_hi';
        break;
      }
      case 'startDate': {
        sortableColumn = 'start_date';
        break;
      }
      case 'endDate': {
        sortableColumn = 'end_date';
        break;
      }
      case 'exclusion': {
        sortableColumn = 'exclusion';
        break;
      }
      default:
        break;
    }
  }
    if (!(params.filterModel == null || undefined)) {
    addOnCodes = {
      primaryCode: taskStates.selectedCptCode,
      addOnCodes: taskStates.selectedColumnII,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      primaryCodeF: params.filterModel.primaryCode
        ? params.filterModel.primaryCode.filter
        : '',
      startDateF: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : '',
      endDateF: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : '',
      addonCodeF: params.filterModel.addonCode
        ? params.filterModel.addonCode.filter
        : '',
      boPolicyKeyF: params.filterModel.boPolicyKey
        ? params.filterModel.boPolicyKey.filter
        : '',
      daysLoF: params.filterModel.daysLo
        ? params.filterModel.daysLo.filter
        : '',
      daysHiF: params.filterModel.daysHi
        ? params.filterModel.daysHi.filter
        : '',
      boTypeKeyF: params.filterModel.boTypeKey
        ? params.filterModel.boTypeKey.filter
        : '',
      exclusionF: params.filterModel.exclusion
        ? params.filterModel.exclusion.filter.toUpperCase() == 'NO'
          ? 0
          : 1
        : '',
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',

    };
  } else {
    addOnCodes = {
      primaryCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      addOnCodes: taskStates.selectedColumnII,
    };
  }

  rows = await getReferentialData(dispatch,addOnCodes,sourceName);
  let mappedData = rows.map((ad) => {
    return {
      primaryCode: ad.primaryCode,
      addonCode: ad.addonCode,
      boPolicyKey: ad.boPolicyKey,
      boTypeKey: ad.boTypeKey,
      daysLo: ad.daysLo,
      daysHi: ad.daysHi,
      startDate: moment(ad.startDate).format('MM-DD-YYYY'),
      endDate: moment(ad.endDate).format('MM-DD-YYYY'),
      exclusion: ad.exclusion == 0 ? 'NO' : 'YES',
    };
  });
  rows = mappedData;
  return rows;
};
export default addOnCodesReferentialData;

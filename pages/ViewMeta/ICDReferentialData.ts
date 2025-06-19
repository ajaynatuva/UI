import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const ICDReferentialData = async (dispatch, taskStates, params,sourceName) => {
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
  let icd = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'icdCode': {
        sortableColumn = 'icd_code';
        break;
      }
      case 'icdDesc': {
        sortableColumn = 'icd_desc';
        break;
      }
      case 'icdOrder': {
        sortableColumn = 'icd_order';
        break;
      }
      case 'dvKey': {
        sortableColumn = 'dv_key';
        break;
      }
      case 'startDate': {
        sortableColumn = 'start_date';
        break;
      }
      case 'dvKey': {
        sortableColumn = 'dv_key';
        break;
      }
      case 'endDate': {
        sortableColumn = 'end_date';
        break;
      }
      case 'trun10': {
        sortableColumn = 'trun_10';
        break;
      }
      default:
        break;
    }
  }

  if (!(params.filterModel == null || undefined)) {
    icd = {
      icdCode: taskStates.selectedCptCode.replaceAll('.', ''),
      trun10: taskStates.truncated == 0 ? 0 : 1,
      icdCodeF: params.filterModel.icdCode
        ? params.filterModel.icdCode.filter.replaceAll('.', '')
        : '',
      icdOrderF: params.filterModel.icdOrder
        ? params.filterModel.icdOrder.filter
        : '',
      dvKeyF: params.filterModel.dvKey ? params.filterModel.dvKey.filter : '',
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      startDateF: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : '',
      endDateF: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : '',
      icdDescF: params.filterModel.icdDesc
        ? params.filterModel.icdDesc.filter
        : '',
      trun10F: params.filterModel.trun_10
        ? params.filterModel.trun_10.filter.toUpperCase() == 'YES'
          ? 0
          : 1
        : '',
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',
    };
  } else {
    icd = {
      icdCode: taskStates.selectedCptCode.replaceAll('.', ''),
      trun10: taskStates.truncated == null ? '' : taskStates.truncated,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
    };
  }
  let data =await getReferentialData(dispatch,icd,sourceName);
  let mappedData = data.map((ad) => {
    return {
      icdCode:
        ad.icdCode.length > 3
          ? ad.icdCode.substring(0, 3) + '.' + ad.icdCode.substring(3)
          : ad.icdCode,
      icdDesc: ad.icdDesc,
      icdOrder: ad.icdOrder,
      dvKey: ad.dvKey,
      startDate: moment(ad.startDate).format('MM-DD-YYYY'),
      endDate: moment(ad.endDate).format('MM-DD-YYYY'),
      trun_10: ad.trun_10 == 0 ? 'YES' : 'NO',
    };
  });
  rows = mappedData;
  return rows;
};
export default ICDReferentialData;

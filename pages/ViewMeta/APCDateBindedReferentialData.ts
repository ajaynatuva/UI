import { default as moment, default as Moment } from 'moment';
// import { getAPCDateBindedData } from '../../redux/actions/TaskActions';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';
const APCDateBindedData = async (dispatch, taskStates, params,sourceName) => {
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
  let apcDateBinded = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'apc': {
        sortableColumn = 'apc';
        break;
      }
      case 'apcDesc': {
        sortableColumn = 'apc_desc';
        break;
      }
      case 'apcPayment': {
        sortableColumn = 'apc_payment';
        break;
      }
      case 'capcSrs': {
        sortableColumn = 'capc_srs';
        break;
      }
      case 'comp1Id': {
        sortableColumn = 'comp1_id';
        break;
      }
      case 'comp2Id': {
        sortableColumn = 'comp2_id';
        break;
      }
      case 'comp3Id': {
        sortableColumn = 'comp3_id';
        break;
      }
      case 'deviceOffset': {
        sortableColumn = 'device_offset';
        break;
      }
      case 'erVisit': {
        sortableColumn = 'er_visit';
        break;
      }
      case 'mentalHealth': {
        sortableColumn = 'mental_health';
        break;
      }
      case 'nucRadFb': {
        sortableColumn = 'nuc_rad_fb';
        break;
      }
      case 'paymentIndicator': {
        sortableColumn = 'payment_indicator';
        break;
      }
      case 'statusIndicator': {
        sortableColumn = 'status_indicator';
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
      default:
        break;
    }
  }
  if (!(params.filterModel == null || undefined)) {
    apcDateBinded = {
      apc: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      apcF: params.filterModel.apc ? params.filterModel.apc.filter : '',
      apcDesc: params.filterModel.apcDesc
        ? params.filterModel.apcDesc.filter
        : '',
      apcPayment: params.filterModel.apcPayment
        ? params.filterModel.apcPayment.filter
        : '',
      capcSrs: params.filterModel.capcSrs
        ? params.filterModel.capcSrs.filter
        : '',
      comp1Id: params.filterModel.comp1Id
        ? params.filterModel.comp1Id.filter
        : '',
      comp2Id: params.filterModel.comp2Id
        ? params.filterModel.comp2Id.filter
        : '',
      comp3Id: params.filterModel.comp3Id
        ? params.filterModel.comp3Id.filter
        : '',
      deviceOffset: params.filterModel.deviceOffset
        ? params.filterModel.deviceOffset.filter
        : '',
      erVisit: params.filterModel.erVisit
        ? params.filterModel.erVisit.filter
        : '',
      mentalHealth: params.filterModel.mentalHealth
        ? params.filterModel.mentalHealth.filter
        : '',
      nucRadFb: params.filterModel.nucRadFb
        ? params.filterModel.nucRadFb.filter
        : '',
      paymentIndicator: params.filterModel.paymentIndicator
        ? params.filterModel.paymentIndicator.filter
        : '',
      statusIndicator: params.filterModel.statusIndicator
        ? params.filterModel.statusIndicator.filter
        : '',
      startDate: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : '',
      endDate: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : '',
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',
    };
  } else {
    apcDateBinded = {
      apc: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
    };
  }
  rows = await getReferentialData(dispatch,apcDateBinded,sourceName)

  let mappedData = rows.map(d=>({
    ...d,
    startDate:Moment(d.startDate).format("MM-DD-YYYY"),
    endDate:Moment(d.endDate).format("MM-DD-YYYY")
  }))
  return mappedData;
};
export default APCDateBindedData;

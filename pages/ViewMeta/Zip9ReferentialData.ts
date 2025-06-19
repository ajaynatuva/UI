// import { getZip9Data } from '../../redux/actions/TaskActions';
import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';


const Zip9ReferentialData = async (dispatch, taskStates, params,sourceName) => {
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
  let zip9 = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'state': {
        sortableColumn = 'state';
        break;
      }
      case 'zipCode': {
        sortableColumn = 'zip_code';
        break;
      }
      case 'quarterName': {
        sortableColumn = 'quarter_name';
        break;
      }
      case 'carrier': {
        sortableColumn = 'carrier';
        break;
      }
      case 'pricingLocality': {
        sortableColumn = 'pricing_locality';
        break;
      }
      case 'plusFour': {
        sortableColumn = 'plus_four';
        break;
      }
      case 'partBPaymentIndicator': {
        sortableColumn = 'part_b_payment_indicator';
        break;
      }
      case "startDate": {
        sortableColumn = "start_date";
        break;
      }
      case "endDate": {
        sortableColumn = "end_date";
        break;
      }
      default:
        break;
    }
  }

  if (!(params.filterModel == null || undefined)) {
    zip9 = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      zipCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
      zipCodeF: params.filterModel.zipCode
        ? params.filterModel.zipCode.filter
        : '',
      state: params.filterModel.state ? params.filterModel.state.filter : '',
      carrier: params.filterModel.carrier
        ? params.filterModel.carrier.filter
        : '',
      pricingLocality: params.filterModel.pricingLocality
        ? params.filterModel.pricingLocality.filter
        : '',
      plusFour: params.filterModel.plusFour
        ? params.filterModel.plusFour.filter
        : '',
      partBPaymentIndicator: params.filterModel.partBPaymentIndicator
        ? params.filterModel.partBPaymentIndicator.filter
        : '',
        startDate: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : "",
      endDate: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : "",
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',
    };
  } else {
    zip9 = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      zipCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
    };
  }
  // rows = await getZip9Data(dispatch, zip9);
  rows = await getReferentialData(dispatch,zip9,sourceName)
  let mappedData = rows.map(zip9=>({
    ...zip9,
    startDate:Moment(zip9.startDate).format("MM-DD-YYYY"),
    endDate: Moment(zip9.endDate).format("MM-DD-YYYY")

  }))
  return mappedData;
};
export default Zip9ReferentialData;

// import { getZip5Data } from '../../redux/actions/TaskActions';
import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const Zip5ReferentialData = async (dispatch, taskStates, params,sourceName) => {
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
  let zip5 = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case "state": {
        sortableColumn = "state";
        break;
      }
      case "zipCode": {
        sortableColumn = "zip_code";
        break;
      }
      case "quarterName": {
        sortableColumn = "quarter_name";
        break;
      }
      case "carrier": {
        sortableColumn = "carrier";
        break;
      }
      case "locality": {
        sortableColumn = "locality";
        break;
      }
      case "ruralInd": {
        sortableColumn = "rural_ind";
        break;
      }
      case "labCbLocality": {
        sortableColumn = "lab_cb_locality";
        break;
      }
      case "ruralInd2": {
        sortableColumn = "rural_ind2";
        break;
      }
      case "plus4Flag": {
        sortableColumn = "plus4_flag";
        break;
      }
      case "partBDrugIndicator": {
        sortableColumn = "part_b_drug_indicator";
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
    zip5 = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ""
          : taskStates.selectedQuarter.value,
      zipCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
      zipCodeF: params.filterModel.zipCode
        ? params.filterModel.zipCode.filter
        : "",
      state: params.filterModel.state
        ? params.filterModel.state.filter
        : "",
      quarterNameF: params.filterModel.quarterName
        ? params.filterModel.quarterName.filter
        : "",
      carrier: params.filterModel.carrier
        ? params.filterModel.carrier.filter
        : "",
      locality: params.filterModel.locality
        ? params.filterModel.locality.filter
        : "",
      ruralInd: params.filterModel.ruralInd
        ? params.filterModel.ruralInd.filter
        : "",
      labCbLocality: params.filterModel.labCbLocality
        ? params.filterModel.labCbLocality.filter
        : "",
      ruralInd2: params.filterModel.ruralInd2
        ? params.filterModel.ruralInd2.filter
        : "",
      plus4Flag: params.filterModel.plus4Flag
        ? params.filterModel.plus4Flag.filter
        : "",
      partBDrugIndicator: params.filterModel.partBDrugIndicator
        ? params.filterModel.partBDrugIndicator.filter
        : "",
        startDate: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : "",
      endDate: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : "",
      isSort: sortType != "" ? sortType : "",
      sortColumn: sortableColumn != "" ? sortableColumn : "",
    };
  } else {
    zip5 = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ""
          : taskStates.selectedQuarter.value,
      zipCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
    };
  }
  // rows = await getZip5Data(dispatch, zip5);
  rows = await getReferentialData(dispatch,zip5,sourceName);

  let mappedData = rows.map(zip5=>({
    ...zip5,
    startDate:Moment(zip5.startDate).format("MM-DD-YYYY"),
    endDate: Moment(zip5.endDate).format("MM-DD-YYYY")

  }))
  return mappedData;
};
export default Zip5ReferentialData;

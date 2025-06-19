import { default as moment, default as Moment } from 'moment';
import { getReferentialData }from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const oceHcpcsReferentialData = async (dispatch, taskStates, params,sourceName) => {
  function stringToDateFormat(date) {
    let formatedDate = [];
    const dos = date.split(",");
    if (dos) {
      dos.map((k, l) => {
        formatedDate.push(Moment(k).format("YYYY-MM-DD"));
      });
    }
    return formatedDate.join(",");
  }
  let sortType = '';
  let sortableColumn = '';
  let rows = [];
  let oceHcpcs = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'hcpcs': {
        sortableColumn = 'hcpcs';
        break;
      }
      case 'apc': {
        sortableColumn = 'apc';
        break;
      }
      case 'statusIndicator': {
        sortableColumn = 'status_indicator';
        break;
      }
      case 'paymentIndicator': {
        sortableColumn = 'payment_indicator';
        break;
      }
      case 'questionable': {
        sortableColumn = 'questionable';
        break;
      }
      case 'notRecognizedMcare': {
        sortableColumn = 'not_recognized_mcare';
        break;
      }
      case 'notRecognizedOpps': {
        sortableColumn = 'not_recognized_opps';
        break;
      }
      case 'nonCovered': {
        sortableColumn = 'non_covered';
        break;
      }
      case 'bilateralConditional': {
        sortableColumn = 'bilateral_conditional';
        break;
      }
      case 'bilateralIndependent': {
        sortableColumn = 'bilateral_independent';
        break;
      }
      case 'bilateralInherent': {
        sortableColumn = 'bilateral_inherent';
        break;
      }
      case 'nccoCode1': {
        sortableColumn = 'ncci_code1';
        break;
      }
      case 'ncciCode2': {
        sortableColumn = 'ncci_code2';
        break;
      }
      case 'stvPackaged': {
        sortableColumn = 'stv_packaged';
        break;
      }
      case 'tPackaged': {
        sortableColumn = 't_packaged';
        break;
      }
      case 'separateProcedure': {
        sortableColumn = 'separate_procedure';
        break;
      }
      case 'statutoryExclusion': {
        sortableColumn = 'statutory_exclusion';
        break;
      }
      case 'addonType1': {
        sortableColumn = 'addon_type1';
        break;
      }
      case 'addonType2': {
        sortableColumn = 'addon_type2';
        break;
      }
      case 'addonType3': {
        sortableColumn = 'addon_type3';
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
    oceHcpcs = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      hcpcs: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
      hcpcsF: params.filterModel.hcpcs ? params.filterModel.hcpcs.filter : '',
      apc: params.filterModel.apc ? params.filterModel.apc.filter : '',
      quarterNameF: params.filterModel.quarterName
        ? params.filterModel.quarterName.filter
        : '',
      statusIndicator: params.filterModel.statusIndicator
        ? params.filterModel.statusIndicator.filter
        : '',
      paymentIndicator: params.filterModel.paymentIndicator
        ? params.filterModel.paymentIndicator.filter
        : '',
      questionable: params.filterModel.questionable
        ? params.filterModel.questionable.filter
        : '',
      notRecognizedMcare: params.filterModel.notRecognizedMcare
        ? params.filterModel.notRecognizedMcare.filter
        : '',
      notRecognizedOpps: params.filterModel.notRecognizedOpps
        ? params.filterModel.notRecognizedOpps.filter
        : '',
      nonCovered: params.filterModel.nonCovered
        ? params.filterModel.nonCovered.filter
        : '',
      bilateralConditional: params.filterModel.bilateralConditional
        ? params.filterModel.bilateralConditional.filter
        : '',
      bilateralIndependent: params.filterModel.bilateralIndependent
        ? params.filterModel.bilateralIndependent.filter
        : '',
      bilateralInherent: params.filterModel.bilateralInherent
        ? params.filterModel.bilateralInherent.filter
        : '',
      ncciCode1: params.filterModel.ncciCode1
        ? params.filterModel.ncciCode1.filter
        : '',
      ncciCode2: params.filterModel.ncciCode2
        ? params.filterModel.ncciCode2.filter
        : '',
      stvPackaged: params.filterModel.stvPackaged
        ? params.filterModel.stvPackaged.filter
        : '',
      tPackaged: params.filterModel.tPackaged
        ? params.filterModel.tPackaged.filter
        : '',
      separateProcedure: params.filterModel.separateProcedure
        ? params.filterModel.separateProcedure.filter
        : '',
      statutoryExclusion: params.filterModel.statutoryExclusion
        ? params.filterModel.statutoryExclusion.filter
        : '',
      addonType1: params.filterModel.addonType1
        ? params.filterModel.addonType1.filter
        : '',
      addonType2: params.filterModel.addonType2
        ? params.filterModel.addonType2.filter
        : '',
      addonType3: params.filterModel.addonType3
        ? params.filterModel.addonType3.filter
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
    oceHcpcs = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      hcpcs: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName:sourceName,
    };
  }
  rows = await getReferentialData(dispatch,oceHcpcs,sourceName);

  let mappedData = rows.map(hcpcs=>({
    ...hcpcs,
    startDate:Moment(hcpcs.startDate).format("MM-DD-YYYY"),
    endDate:Moment(hcpcs.endDate).format("MM-DD-YYYY")
  }))

  return mappedData;
};
export default oceHcpcsReferentialData;

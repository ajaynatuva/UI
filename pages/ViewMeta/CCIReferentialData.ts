import { default as moment, default as Moment } from 'moment';
import { exportReferentialData, getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const CCIReferentialData = async (dispatch, taskStates, params, formState, cciValue, Cci_Keys, sourceName, exportedData) => {
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

  const getCciData = (cciRat) => {
    let cciRatkey = [];
    cciRat?.split(",").map((k, l) => {
      formState.rationale.map((d) => {
        if (
          d.cciRationaleKey == k ||
          d.cmsCciRationale.toLowerCase().includes(cciRat.toLowerCase())
        ) {
          cciRatkey.push(d.cciRationaleKey);
        }
      });
    });

    return cciRatkey.join(",");
  };

  const mapCciRationaleKeyToDesc = (key) => {
    let desc = "";
    const d = taskStates.cciRationalDesc.find((a) => a.cciRationaleKey == key);
    if (d != undefined) {
      desc = d.cmsCciRationale;
    }
    return desc;
  }

  const mapCciKeyToDesc = (key) => {
    let desc = "";
    Cci_Keys.forEach((k, l) => {
      if (key == k.value) {
        desc = k.label
      }
    })
    return desc;
  }

  let sortType = "";
  let sortableColumn = "";
  let rows = [];
  let cci = {};

  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case "cci_key": {
        sortableColumn = "cci_key";
        break;
      }
      case "column_i": {
        sortableColumn = "column_i";
        break;
      }
      case "column_ii": {
        sortableColumn = "column_ii";
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
      case "cciRationaleKey": {
        sortableColumn = "cci_rationale_key";
        break;
      }
      case "prior_1996_b": {
        sortableColumn = "prior_1996_b";
        break;
      }
      case "allowModB": {
        sortableColumn = "allow_mod_b";
        break;
      }
      case "deviations": {
        sortableColumn = "deviations";
        break;
      }
      default:
        break;
    }
  }
   
  if (!(params.filterModel == null || undefined)) {
    cci = {
      cciKey: cciValue == null ? '' : cciValue,
      column_i: taskStates.selectedCptCode,
      column_ii: taskStates.selectedColumnII,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      startDateF: params.filterModel.startDate
        ? stringToDateFormat(params.filterModel.startDate.filter)
        : "",
      endDateF: params.filterModel.endDate
        ? stringToDateFormat(params.filterModel.endDate.filter)
        : "",
      cciKeyF: params.filterModel.cciKey
        ? params.filterModel.cciKey.filter
        : "",
      column_iF: params.filterModel.column_i
        ? params.filterModel.column_i.filter
        : "",
      column_iiF: params.filterModel.column_ii
        ? params.filterModel.column_ii.filter
        : "",
      cciRationaleKeyF: params.filterModel.cciRationaleKey
        ? getCciData(params.filterModel.cciRationaleKey.filter)
        : "",
      prior1996BF: params.filterModel.prior_1996_b
        ? params.filterModel.prior_1996_b.filter.toUpperCase() == "NO"
          ? 0
          : 1
        : "",
      allowModBF: params.filterModel.allowModB
        ? params.filterModel.allowModB.filter.toUpperCase() == "NO"
          ? 0
          : 1
        : "",
        deviationsF: params.filterModel.deviations
        ? params.filterModel.deviations.filter.toUpperCase() == "FALSE"
          ? false
          : true
        : "",
      isSort: sortType != "" ? sortType : "",
      sortColumn: sortableColumn != "" ? sortableColumn : "",
    };
  } else {
    cci = {
      column_i: taskStates.selectedCptCode,
      column_ii: taskStates.selectedColumnII,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
    };
  }
  let data;
  let exportCCIData;

  if(exportedData == false){
   data = await getReferentialData(dispatch, cci, sourceName);
  }
  else {
    exportCCIData = await exportReferentialData(dispatch,cci,sourceName,exportedData);
    data = exportCCIData.cciSearchResults;
  }

  let mappedData = data.map((ad) => {
    return {
      cciKey: ad.cciKey + '-' + mapCciKeyToDesc(ad.cciKey),
      // ptpCciKey: ad.ptpCciKey,
      column_i: ad.column_i,
      column_ii: ad.column_ii,
      startDate: moment(ad.startDate).format("MM-DD-YYYY"),
      endDate: moment(ad.endDate).format("MM-DD-YYYY"),
      cciRationaleKey:
        ad.cciRationaleKey +
        " - " +
        mapCciRationaleKeyToDesc(ad.cciRationaleKey),
      prior_1996_b: ad.prior_1996_b == 0 ? "NO" : "YES",
      allowModB: ad.allowModB == 0 ? "NO" : "YES",
      deviations: ad.deviations
    };
  });

  rows = mappedData;
  return rows;
}
export default CCIReferentialData;



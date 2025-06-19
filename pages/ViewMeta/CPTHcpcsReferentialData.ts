import { default as moment, default as Moment } from 'moment';
// import { getCPTData } from '../../redux/actions/TaskActions';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';
const CPTHcpcsRefernretialData = async(dispatch,taskStates,params,sourceName) => {

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
    let sortType = "";
          let sortableColumn = "";
          let rows = [];
          let cpt = {};    
          if (params.sortModel.length > 0) {
      sortType = params.sortModel[0].sort;
      switch (params.sortModel[0].colId) {
        case "cptSource": {
          sortableColumn = "cpt_source";
          break;
        }
        case "cptCode": {
          sortableColumn = "cpt_code";
          break;
        }
        case "longDesc": {
          sortableColumn = "long_desc";
          break;
        }
        case "shortDesc": {
          sortableColumn = "short_desc";
          break;
        }
        case "medDesc": {
          sortableColumn = "med_desc";
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
      cpt = {
        cptCode: taskStates.selectedCptCode,
        cptSource: params.filterModel.cptSource
          ? params.filterModel.cptSource.filter
          : "",
        startRow: params.startRow,
        endRow: params.endRow - 1000,
        cptCodeF: params.filterModel.cptCode
          ? params.filterModel.cptCode.filter
          : "",
        longDescF: params.filterModel.longDesc
          ? params.filterModel.longDesc.filter
          : "",
        shortDescF: params.filterModel.shortDesc
          ? params.filterModel.shortDesc.filter
          : "",
        medDescF: params.filterModel.medDesc
          ? params.filterModel.medDesc.filter
          : "",
        startDateF: params.filterModel.startDate
          ? stringToDateFormat(params.filterModel.startDate.filter)
          : "",
        endDateF: params.filterModel.endDate
          ? stringToDateFormat(params.filterModel.endDate.filter)
          : "",
        isSort: sortType != "" ? sortType : "",
        sortColumn: sortableColumn != "" ? sortableColumn : "",
      };
    } else {
      cpt = {
        cptCode: taskStates.selectedCptCode,
        startRow: params.startRow,
        endRow: params.endRow - 1000,
      };
    }
    let data = await getReferentialData(dispatch,cpt,sourceName);
    let mappedData = data.map((ad) => {
      return {
        cptSource: ad.cptSource,
        cptCode: ad.cptCode,
        shortDesc: ad.shortDesc,
        medDesc: ad.medDesc,
        longDesc: ad.longDesc,
        startDate: moment(ad.startDate).format("MM-DD-YYYY"),
        endDate: moment(ad.endDate).format("MM-DD-YYYY"),
      };
    });
    rows = mappedData;
    return rows;
    // if (rows.length > 0) {
    //   totalNumberOfReferrentialData = await getReferentialDataTotalOfRows(dispatch, "cpt_master");
    // }
  }
export default CPTHcpcsRefernretialData;
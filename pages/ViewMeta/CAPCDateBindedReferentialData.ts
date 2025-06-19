// import { getCAPCDateBindedData } from "../../redux/actions/TaskActions";
import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';


const CAPCDateBindedData = async(dispatch,taskStates,params,sourceName) => {

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
          let capcDateBinded = {};
    if (params.sortModel.length > 0) {
      sortType = params.sortModel[0].sort;
      switch (params.sortModel[0].colId) {
        case "hcpcs": {
          sortableColumn = "hcpcs";
          break;
        }
        case "complexityAdjustment": {
          sortableColumn = "complexity_adjustment";
          break;
        }
        case "rank": {
          sortableColumn = "rank";
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
      capcDateBinded = {
        hcpcs: taskStates.selectedCptCode,
        startRow: params.startRow,
        endRow: params.endRow - 1000,
        hcpcsF: params.filterModel.hcpcs
          ? params.filterModel.hcpcs.filter
          : "",
        complexityAdjustment: params.filterModel.complexityAdjustment
          ? params.filterModel.complexityAdjustment.filter
          : "",
        rank: params.filterModel.rank
          ? params.filterModel.rank.filter
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
      capcDateBinded = {
        hcpcs: taskStates.selectedCptCode,
        startRow: params.startRow,
        endRow: params.endRow - 1000,
      };
    }
    rows = await getReferentialData(dispatch,capcDateBinded,sourceName)

    let mappedData = rows.map(capc=>({
      ...capc,
      startDate:Moment(capc.startDate).format("MM-DD-YYYY"),
      endDate:Moment(capc.endDate).format("MM-DD-YYYY")
    }))
    return mappedData;

  }
  export default CAPCDateBindedData;
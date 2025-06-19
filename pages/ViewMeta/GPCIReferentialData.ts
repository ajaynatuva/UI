import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';


const GPCIReferentialData = async(dispatch,taskStates,params,sourceName) => {
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
          let gpciDateBinded = {};    if (params.sortModel.length > 0) {
      sortType = params.sortModel[0].sort;
      switch (params.sortModel[0].colId) {
        case "gpciId": {
          sortableColumn = "gpci_id";
          break;
        }
        case "mac": {
          sortableColumn = "mac";
          break;
        }
        case "state": {
          sortableColumn = "state";
          break;
        }
        case "localityNumber": {
          sortableColumn = "locality_number";
          break;
        }
        case "localityName": {
          sortableColumn = "locality_name";
          break;
        }

        case "workGpci": {
          sortableColumn = "work_gpci";
          break;
        }
        case "peGpci": {
          sortableColumn = "pe_gpci";
          break;
        }
        case "mpGpci": {
          sortableColumn = "mp_gpci";
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
      gpciDateBinded = {
        gpciId: taskStates.selectedCptCode,
        startRow: params.startRow,
        endRow: params.endRow - 1000,
        sourceName : sourceName,
        gpciIdF: params.filterModel.gpciId
          ? params.filterModel.gpciId.filter
          : "",
        quarterName:
          taskStates.selectedQuarter == null
            ? ""
            : taskStates.selectedQuarter.value,
        quarterNameF: params.filterModel.quarterName
          ? params.filterModel.quarterName.filter
          : "",
        mac: params.filterModel.mac ? params.filterModel.mac.filter : "",
        state: params.filterModel.state
          ? params.filterModel.state.filter
          : "",
        localityNumber: params.filterModel.localityNumber
          ? params.filterModel.localityNumber.filter
          : "",
        localityName: params.filterModel.localityName
          ? params.filterModel.localityName.filter
          : "",
        workGpci: params.filterModel.workGpci
          ? params.filterModel.workGpci.filter
          : "",
        peGpci: params.filterModel.peGpci
          ? params.filterModel.peGpci.filter
          : "",
        mpGpci: params.filterModel.mpGpci
          ? params.filterModel.mpGpci.filter
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
      gpciDateBinded = {
        gpciId: taskStates.selectedCptCode,
        startRow: params.startRow,
        endRow: params.endRow - 1000,
        sourceName:sourceName,
      };
    }
    rows = await getReferentialData(dispatch, gpciDateBinded,sourceName);
    let mappedData = rows.map(gpci=>({
      ...gpci,
      startDate:Moment(gpci.startDate).format("MM-DD-YYYY"),
      endDate: Moment(gpci.endDate).format("MM-DD-YYYY")
    }))

    return mappedData;
  }
  export default GPCIReferentialData;
import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const BwPairsReferentialData = async (dispatch, taskStates, params,formState,bwTypeKey,sourceName) => {
  const getBwData = (bwKey) => {
    let bwType;
    formState.getBwTypeData.map((d) => {
      if (
        d.bwTypeKey == bwKey ||
        d.description.toLowerCase().includes(bwKey.toLowerCase())
      ) {
        bwType = d.bwTypeKey;
      }
    });
    return bwType;
  };
  const bwTypeDesc = (code) => {
    let desc = '';
    formState.getBwTypeData.map((k, l) => {
      if (code == k.bwTypeKey) {
        desc = k.description;
      }
    });
    return desc;
  };
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
  let bwPairs = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'bwTypeKey': {
        sortableColumn = 'bw_type_Key';
        break;
      }
      case 'billedWithCode': {
        sortableColumn = 'billed_with_code';
        break;
      }
      case 'denyCode': {
        sortableColumn = 'deny_code';
        break;
      }
      case 'dosFrom': {
        sortableColumn = 'dos_from';
        break;
      }
      case 'dosTo': {
        sortableColumn = 'dos_to';
        break;
      }
      default:
        break;
    }
  }
  if (!(params.filterModel == null || undefined)) {
    bwPairs = {
      bwTypeKey: bwTypeKey == null ? '' : bwTypeKey,
      denyCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      denyCodeF: params.filterModel.denyCode
        ? params.filterModel.denyCode.filter
        : '',
      dosFromF: params.filterModel.dosFrom
        ? stringToDateFormat(params.filterModel.dosFrom.filter)
        : '',
      dosToF: params.filterModel.dosTo
        ? stringToDateFormat(params.filterModel.dosTo.filter)
        : '',
      billedWithCodeF: params.filterModel.billedWithCode
        ? params.filterModel.billedWithCode.filter
        : '',
      bwTypeKeyF: params.filterModel.bwTypeKey
        ? getBwData(params.filterModel.bwTypeKey.filter)
        : '',
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',
    };
  } else {
    bwPairs = {
      denyCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
    };
  }

  let data = await getReferentialData(dispatch,bwPairs,sourceName);

  let mappedData = data.map((ad) => {
    return {
      bwTypeKey: ad.bwTypeKey + '-' + bwTypeDesc(ad.bwTypeKey),
      billedWithCode: ad.billedWithCode,
      denyCode: ad.denyCode,
      dosFrom: Moment(ad.dosFrom).format('MM-DD-YYYY'),
      dosTo: Moment(ad.dosTo).format('MM-DD-YYYY'),
    };
  });
  rows = mappedData;
  return rows;
};
export default BwPairsReferentialData;

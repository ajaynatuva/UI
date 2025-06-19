import { default as moment, default as Moment } from 'moment';
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const MaxUnitsReferentialData = async (
  dispatch,
  taskStates,
  params,
  maxUnitsLkp,
  maiUnitsLkp,
  mueUnitsLkp,
  sourceName
) => {
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
 
  const getMaiID = (arr) => {
    let Maikey = [];
    arr?.split(',').map((k, l) => {
      maiUnitsLkp?.filter((a) => {
        if (a.description.includes(k)) {
          Maikey.push(a.maiLkpKey);
        }
      });
    });
    return Maikey.join(',');
  };
  const getMueID = (arr) => {
    let Muekey = '';
    mueUnitsLkp?.filter((a) => {
      if (a.description.includes(arr)) {
        Muekey = a.mueRationaleKey;
      }
      if (Muekey == '') {
        Muekey = arr;
      }
    });
    return Muekey;
  };
  const showMaxUnitsType = (key) => {
    let showDesc = '';
    maxUnitsLkp.map((k, l) => {
      if (key == k.maxUnitsLkpKey) {
        showDesc = k.description;
      }
    });
    return showDesc;
  };
  const showMaxUnitTypeKey = (key) => {
    let showMaxUnitsTypeDesc = '';
    for (let i = 0; i < maxUnitsLkp.length; i++) {
      if (key==maxUnitsLkp[i].maxUnitsLkpKey) {
        showMaxUnitsTypeDesc = maxUnitsLkp[i].description;
        break;
      } else {
        showMaxUnitsTypeDesc = key;
      }
    }
    return showMaxUnitsTypeDesc;
  };

  let sortType = '';
  let sortableColumn = '';
  let rows = [];
  let maxUnits = {};
  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'cptCode': {
        sortableColumn = 'cpt_code';
        break;
      }
      case 'maxUnits': {
        sortableColumn = 'max_units';
        break;
      }
      case 'maiKey': {
        sortableColumn = 'mai_key';
        break;
      }
      case 'mueRationaleKey': {
        sortableColumn = 'mue_key';
        break;
      }
      case 'maxUnitsLkpKey': {
        sortableColumn = 'max_units_lkp_key';
        break;
      }
      case 'maxUnitType': {
        sortableColumn = 'max_unit_type';
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
      case 'clientSpecific': {
        sortableColumn = 'client_specific';
        break;
      }
      case 'comments': {
        sortableColumn = 'comments';
        break;
      }
      default:
        break;
    }
  }
  if (!(params.filterModel == null || undefined)) {
    maxUnits = {
      maxUnitsLkpKey:
        taskStates.maxUnitsLkpKey == null
          ? ''
          : taskStates.maxUnitsLkpKey.value,
      cptCode: taskStates.selectedCptCode,
      cptCodeF: params.filterModel.cptCode
        ? params.filterModel.cptCode.filter.replaceAll('.', '')
        : '',
      maxUnitsF: params.filterModel.maxUnits
        ? params.filterModel.maxUnits.filter
        : '',
      maiKeyF: getMaiID(
        params.filterModel.maiKey ? params.filterModel.maiKey.filter : null
      ),
      mueRationaleKeyF: getMueID(
        params.filterModel.mueRationaleKey
          ? params.filterModel.mueRationaleKey.filter
          : null
      ),
      maxUnitsLkpKeyF: params.filterModel.maxUnitsLkpKey
        ? params.filterModel.maxUnitsLkpKey.filter
        : '',
      maxUnitType: params.filterModel.maxUnitType
        ? showMaxUnitTypeKey(params.filterModel.maxUnitType.filter)
        : undefined,
      dosFromF: params.filterModel.dosFrom
        ? stringToDateFormat(params.filterModel.dosFrom.filter)
        : '',
      dosToF: params.filterModel.dosTo
        ? stringToDateFormat(params.filterModel.dosTo.filter)
        : '',
        clientSpecificF:params.filterModel.clientSpecific
        ? params.filterModel.clientSpecific.filter
        : '',
        commentsF: params.filterModel.comments
        ? params.filterModel.comments.filter
        : '',
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      isSort: sortType != '' ? sortType : '',
      sortColumn: sortableColumn != '' ? sortableColumn : '',
    };
  } else {
    maxUnits = {
      cptCode: taskStates.selectedCptCode,
      maxUnitsLkpKey: taskStates.maxUnitsLkpKey.value,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
    };
  }
  let data = await getReferentialData(dispatch, maxUnits, sourceName);
  let mappedData = data.map((ad) => {
    return {
      maxUnitsLkpKey: ad.maxUnitsLkpKey,
      cptCode: ad.cptCode,
      maxUnits: ad.maxUnits,
      dosFrom: Moment(ad.dosFrom).format('MM-DD-YYYY'),
      dosTo: Moment(ad.dosTo).format('MM-DD-YYYY'),
      maiKey: ad.maiKey + '-' + ad.mai_desc.substring(2),
      mueRationaleKey: ad.mueKey + '-' + ad.mue_desc,
      maxUnitType:
        ad.maxUnitsLkpKey + '-' + showMaxUnitsType(ad.maxUnitsLkpKey),
     clientSpecific: ad.clientSpecific == false ? 'No' : 'Yes',
      comments: ad.comments,
    };
  });
  rows = mappedData;
  return rows;
};
export default MaxUnitsReferentialData;

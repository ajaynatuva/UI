import Moment from "moment";
import { getReferentialData } from '../../redux/ApiCalls/ReferentialDataApi/ReferentialDataApis';

const MfsReferentialData = async (dispatch, taskStates, params,sourceName) => {
  let sortType = '';
  let sortableColumn = '';
  let rows = [];
  let mfs = {};


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

  if (params.sortModel.length > 0) {
    sortType = params.sortModel[0].sort;
    switch (params.sortModel[0].colId) {
      case 'cptCode': {
        sortableColumn = 'cpt_code';
        break;
      }
      case 'cptModifier': {
        sortableColumn = 'cpt_modifier';
        break;
      }
      case 'quarterName': {
        sortableColumn = 'quarter_name';
        break;
      }
      case 'statusCode': {
        sortableColumn = 'status_code';
        break;
      }
      case 'pctcInd': {
        sortableColumn = 'pctc_ind';
        break;
      }
      case 'globDays': {
        sortableColumn = 'glob_days';
        break;
      }
      case 'intraOp': {
        sortableColumn = 'intra_op';
        break;
      }
      case 'preOp': {
        sortableColumn = 'pre_op';
        break;
      }
      case 'postOp': {
        sortableColumn = 'post_op';
        break;
      }
      case 'multProc': {
        sortableColumn = 'mult_proc';
        break;
      }
      case 'bilatSurg': {
        sortableColumn = 'bilat_surg';
        break;
      }
      case 'asstSurg': {
        sortableColumn = 'asst_surg';
        break;
      }
      case 'coSurg': {
        sortableColumn = 'co_surg';
        break;
      }
      case 'teamSurg': {
        sortableColumn = 'team_surg';
        break;
      }
      case 'endoBase': {
        sortableColumn = 'endo_base';
        break;
      }
      case 'physSupDiagProc': {
        sortableColumn = 'phys_sup_diag_proc';
        break;
      }
      case 'diagImgFamily': {
        sortableColumn = 'diag_img_family';
        break;
      }
      case 'nonFacPeOppsPmtAmt': {
        sortableColumn = 'non_fac_pe_opps_pmt_amt';
        break;
      }
      case 'facPeOppsPmtAmt': {
        sortableColumn = 'fac_pe_opps_pmt_amt';
        break;
      }
      case 'mpOppsPmtAmt': {
        sortableColumn = 'mp_opps_pmt_amt';
        break;
      }
      case 'workRvu': {
        sortableColumn = 'work_rvu';
        break;
      }
      case 'nonFacPeRvu': {
        sortableColumn = 'non_fac_pe_rvu';
        break;
      }
      case 'facPeRvu': {
        sortableColumn = 'fac_pe_rvu';
        break;
      }
      case 'convFactor': {
        sortableColumn = 'conv_factor';
        break;
      }
      case 'mpRvu': {
        sortableColumn = 'mp_rvu';
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
    mfs = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      cptCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName : sourceName,
      cptCodeF: params.filterModel.cptCode
        ? params.filterModel.cptCode.filter
        : '',
      cptModifier: params.filterModel.cptModifier
        ? params.filterModel.cptModifier.filter
        : '',
      quarterNameF: params.filterModel.quarterName
        ? params.filterModel.quarterName.filter
        : '',
      statusCode: params.filterModel.statusCode
        ? params.filterModel.statusCode.filter
        : '',
      pctcInd: params.filterModel.pctcInd
        ? params.filterModel.pctcInd.filter
        : '',
      globDays: params.filterModel.globDays
        ? params.filterModel.globDays.filter
        : '',
      multProc: params.filterModel.multProc
        ? params.filterModel.multProc.filter
        : '',
      bilatSurg: params.filterModel.bilatSurg
        ? params.filterModel.bilatSurg.filter
        : '',
      asstSurg: params.filterModel.asstSurg
        ? params.filterModel.asstSurg.filter
        : '',
      coSurg: params.filterModel.coSurg ? params.filterModel.coSurg.filter : '',
      teamSurg: params.filterModel.teamSurg
        ? params.filterModel.teamSurg.filter
        : '',
      endoBase: params.filterModel.endoBase
        ? params.filterModel.endoBase.filter
        : '',
      physSupDiagProc: params.filterModel.physSupDiagProc
        ? params.filterModel.physSupDiagProc.filter
        : '',
      diagImgFamily: params.filterModel.diagImgFamily
        ? params.filterModel.diagImgFamily.filter
        : '',
      nonFacPeOppsPmtAmt: params.filterModel.nonFacPeOppsPmtAmt
        ? params.filterModel.nonFacPeOppsPmtAmt.filter
        : '',
      facPeOppsPmtAmt: params.filterModel.facPeOppsPmtAmt
        ? params.filterModel.facPeOppsPmtAmt.filter
        : '',
      mpOppsPmtAmt: params.filterModel.mpOppsPmtAmt
        ? params.filterModel.mpOppsPmtAmt.filter
        : '',
      workRvu: params.filterModel.workRvu
        ? params.filterModel.workRvu.filter
        : '',
      nonFacPeRvu: params.filterModel.nonFacPeRvu
        ? params.filterModel.nonFacPeRvu.filter
        : '',
      facPeRvu: params.filterModel.facPeRvu
        ? params.filterModel.facPeRvu.filter
        : '',
      convFactor: params.filterModel.convFactor
        ? params.filterModel.convFactor.filter
        : '',
      preOp: params.filterModel.preOp ? params.filterModel.preOp.filter : '',
      postOp: params.filterModel.postOp ? params.filterModel.postOp.filter : '',
      intraOp: params.filterModel.intraOp
        ? params.filterModel.intraOp.filter
        : '',
      mpRvu: params.filterModel.mpRvu ? params.filterModel.mpRvu.filter : '',
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
    mfs = {
      quarterName:
        taskStates.selectedQuarter == null
          ? ''
          : taskStates.selectedQuarter.value,
      cptCode: taskStates.selectedCptCode,
      startRow: params.startRow,
      endRow: params.endRow - 1000,
      sourceName : sourceName
    };
  }
  rows = await getReferentialData(dispatch, mfs,sourceName);

  let mappedData = rows.map(mfs=>({
    ...mfs,
    startDate:Moment(mfs.startDate).format("MM-DD-YYYY"),
    endDate: Moment(mfs.endDate).format("MM-DD-YYYY")
  }))

  return mappedData;
};

export default MfsReferentialData;

import { disabledColor, navyColor } from '../../assets/jss/material-kit-react';
import swal from 'sweetalert2';
import { MetaLoaderConstants } from './MetaLoaderConst';
import { CustomSwal } from '../../components/CustomSwal/CustomSwal';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export function handleUploadFile(file) {
  if (file?.name.includes('NCCI') || file?.name.includes('cci')) {
    var allowedFiles = ['.zip'];
  } else {
     allowedFiles = ['.xlsx', '.csv', '.zip', '.txt', '.pdf'];
  }
  var regex = new RegExp(
    '([a-zA-Z0-9s_\\.-:()])+(' + allowedFiles.join('|') + ')$'
  );
  if (!regex.test(file.name.toLowerCase())) {
    CustomSwal('error', 'Please upload valid file', navyColor, 'Ok', '');
    return false;
  } else {
    return true;
  }
}

export const checkQauterOrYear = (
  selectedMetaDataLoader,
  selectedMaxLkpValue
) => {
  let showQuaterOrYear;
  if (selectedMetaDataLoader == 'Modifier Interaction') {
    showQuaterOrYear = 'Modifier Interaction Type';
  } else if (selectedMetaDataLoader == 'BW Pairs') {
    showQuaterOrYear = 'BW Key';
  } else if (
    selectedMetaDataLoader == MetaLoaderConstants.ICD_10_CM_DRGN ||
    selectedMetaDataLoader == MetaLoaderConstants.ICD_10_PCS ||
    selectedMetaDataLoader == MetaLoaderConstants.ZIP_5 ||
    selectedMetaDataLoader == MetaLoaderConstants.ZIP_9 
  ) {
    showQuaterOrYear = ' Year';
  } else if (
    selectedMetaDataLoader == MetaLoaderConstants.RBRVS ||
    selectedMetaDataLoader == MetaLoaderConstants.SAME_OR_SIMILAR ||
    selectedMetaDataLoader == MetaLoaderConstants.ADHOC_CPT_HCPCS ||
    selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS
  ) {
    showQuaterOrYear = '';
  } else if (
    selectedMetaDataLoader == MetaLoaderConstants.MAX_UNITS ||
    selectedMetaDataLoader == MetaLoaderConstants.CCI
  ) {
    showQuaterOrYear = ' Quarter';
  } else {
    showQuaterOrYear = ' Quarter';
  }
  return showQuaterOrYear;
};

export const checkDisable = (
  selectedMetaDataLoader,
  selectedFile,
  selectedQuarter,
  selectedBwKey,
  selectedMaxLkpValue
) => {
  let disable;

  if((selectedMetaDataLoader == MetaLoaderConstants.CCI || selectedMetaDataLoader == MetaLoaderConstants.MAX_UNITS) && selectedMaxLkpValue == undefined){
    disable = disabledColor;
  } 
   else if (
    selectedMetaDataLoader &&
    (selectedQuarter || selectedBwKey) &&
    selectedFile
  ) {
    disable = navyColor;
  }
  else if (
    (selectedMetaDataLoader == MetaLoaderConstants.ADHOC_CPT_HCPCS ||
      selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS ||
      selectedMetaDataLoader == MetaLoaderConstants.RBRVS ||
      selectedMetaDataLoader == MetaLoaderConstants.SAME_OR_SIMILAR) &&
    selectedFile
  ) {
    disable = navyColor;
  }


  else {
    disable = disabledColor;
  }
  return disable;
};
const sameorsimeCodeheader = [
  'Client Group ID',
  'State',
  'LOB',
  'Claim Type',
  'CCI Key',
  'Column I ',
  'Column II',
  'Start Date',
  'End Date',
  'CCI Rationale Key',
  'Allow Modifier',
  'Dev Start Date',
  'Dev End Date',
  'Jira ID',
  'Jira Desc',
  'Comments',
  'User ID',
  'Status',
];
const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function DownloadReferenceTemplate(clickTimeout) {
  clearTimeout(clickTimeout.current);
  clickTimeout.current = setTimeout(() => {
    // const ws = XLSX.utils.json_to_sheet(RefTemplateObj);
    const ws = XLSX.utils.aoa_to_sheet([sameorsimeCodeheader]);

    const wb = {
      Sheets: { InputFile: ws },
      SheetNames: ['InputFile'],
      Headers: sameorsimeCodeheader,
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    let fileName = 'Reference CCI Deviations Template';
    FileSaver.saveAs(data, fileName + fileExtension);
  }, 250);
}

export const checkFileDisable = (
  selectedBwKey,
  selectedMetaDataLoader,
  selectedQuarter,
  selectedFile,
  selectedMaxLkpValue
) => {
  let boolean = false;

  if((selectedMetaDataLoader == MetaLoaderConstants.CCI || selectedMetaDataLoader == MetaLoaderConstants.MAX_UNITS) && selectedMaxLkpValue == undefined){
    boolean = true;
  } 
  else if (
    selectedMetaDataLoader &&
    (selectedQuarter || selectedBwKey) &&
    selectedFile
  ) {
    boolean = false;
  } else if (
    (selectedMetaDataLoader == MetaLoaderConstants.ADHOC_CPT_HCPCS ||
      selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS ||
      selectedMetaDataLoader == MetaLoaderConstants.RBRVS ||
      selectedMetaDataLoader == MetaLoaderConstants.SAME_OR_SIMILAR) &&
    selectedFile
  ) {
    boolean = false;
  } else {
    boolean = true;
  }
  return boolean;
};

export const checkRbrsvsOrSameOrSimOrAdhocCpt = (selectedMetaDataLoader) => {
  let flag = true;
  if (
    selectedMetaDataLoader == MetaLoaderConstants.RBRVS ||
    selectedMetaDataLoader == MetaLoaderConstants.ADHOC_CPT_HCPCS ||
    selectedMetaDataLoader == MetaLoaderConstants.CCI_DEVIATIONS ||
    selectedMetaDataLoader == MetaLoaderConstants.SAME_OR_SIMILAR
  ) {
    flag = false;
  } else {
    flag = true;
  }
  return flag;
};

export function alphaOrder(a, b) {
  const name1 = a.Name.toUpperCase();
  const name2 = b.Name.toUpperCase();

  let comparison = 0;

  if (name1 > name2) {
    comparison = 1;
  } else if (name1 < name2) {
    comparison = -1;
  }
  return comparison;
}

export const VALID_LOADERS = new Set([
  MetaLoaderConstants.MFS,
  MetaLoaderConstants.MFS_DATE_BINDED,
  MetaLoaderConstants.OCE_HCPCS,
  MetaLoaderConstants.APC,
  MetaLoaderConstants.CAPC,
  MetaLoaderConstants.HCPCS,
  MetaLoaderConstants.ADD_ON_CODES,
  MetaLoaderConstants.ADDON_CODE_TYPE_2,
  MetaLoaderConstants.ADDON_CODE_TYPE_3,
  MetaLoaderConstants.CPT,
  MetaLoaderConstants.ICD_10_CM,
  MetaLoaderConstants.ICD_10_CM_DRGN,
  MetaLoaderConstants.ICD_10_PCS,
  MetaLoaderConstants.DMUV_PROFESSIONAL,
  MetaLoaderConstants.DMUV_OUTPATIENT,
  MetaLoaderConstants.MEDICAID_MUE_DME,
  MetaLoaderConstants.MEDICAID_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDICAID_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_PROFESSIONAL,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_OUTPATIENT,
  MetaLoaderConstants.MEDICARE_NCCI_MEDICALLY_UNLIKELY_DME,
  MetaLoaderConstants.CCI,
  MetaLoaderConstants.BW_Pairs,
  MetaLoaderConstants.MEDSTAR_MFCDC_MUE_ASC,
  MetaLoaderConstants.MEDSTAR_MFCMD_MUE_DME
]);

const currentYear = new Date().getFullYear();
let nextOneYear = currentYear + 1;
let nextTwoYear = nextOneYear + 1;
let previousOneYear = currentYear - 1;
let previousTwoYear = previousOneYear - 1;
let previousThreeYear = previousTwoYear - 1;
let previousFourYear = previousThreeYear - 1;

export let Years = [
  { value: '2019', Name: '2019' },
  { value: previousFourYear, Name: previousFourYear },
  { value: previousThreeYear, Name: previousThreeYear },
  { value: previousTwoYear, Name: previousTwoYear },
  { value: previousOneYear, Name: previousOneYear },
  { value: currentYear, Name: currentYear },
  { value: nextOneYear, Name: nextOneYear },
  { value: nextTwoYear, Name: nextTwoYear },
];

var nextQuarter = String(currentYear).slice(-2);
let array = ['A', 'B', 'C', 'D'];

export let newQuarter = [];
let alpha = '';
let futureQuarter = Number(nextQuarter) + 1;

for (let i = 19; i <= futureQuarter; i++) {
  for (let j = 0; j < array.length; j++) {
    if (i == 18) {
      alpha = 'A';
      newQuarter.push({ value: i + '' + alpha, Name: i + '' + alpha });
      break;
    }
    alpha = array[j];
    newQuarter.push({ value: i + '' + alpha, Name: i + '' + alpha });
  }
}

import {
  GET_META_DATA_LOADER,
  GET_MFS_QUARTER,
  UPLOAD_META_LOADER,
} from '../../ApiCalls/MetaLoaderApis/MetaLoaderApiTypes';
import {
  GET_LATEST_TASK,
  GET_MAI_LKP_DATA,
  GET_Max_UNITS_LKP_DATA,
  GET_MOD_INTRACTION_DATA,
  GET_MUE_LKP_DATA,
  SELECTED_METADATA_SOURCE,
} from '../../ApiCalls/TaskApis/TaskApiType';

export interface MetaDataLoaderState {
  metadataLoader: any[];
  mfsQuarter: any[];
  uploadMetaLoader: any[];
  selectedMetaDataSource: { label: string; value: string };
  latestQuarter: any;
  maxUnitsLkpData: any[];
  ModInteractionLkpData: any[];
  maiLkpData: any[];
  mueLkpData: any[];
}
const initialState: MetaDataLoaderState = {
  metadataLoader: [
    { value: 'MFS', Name: 'MEDICARE FEE SCHEDULE' },
    { value: 'MFS DATE BINDED', Name: 'MEDICARE FEE SCHEDULE DATE BINDED' },
    { value: 'APC', Name: 'OCE-APC' },
    { value: 'CAPC', Name: 'OCE-CAPC' },
    { value: 'OCE HCPCS', Name: 'OCE-HCPCS' },
    { value: 'APC DATE BINDED', Name: 'OCE-APC DATE BINDED' },
    { value: 'CAPC DATE BINDED', Name: 'OCE-CAPC DATE BINDED' },
    { value: 'HCPCS DATE BINDED', Name: 'OCE-HCPCS DATE BINDED' },
    { value: 'BW Pairs', Name: 'BW PAIRS' },
    { value: 'CCI', Name: 'CCI' },
    { value: 'CCI DEVIATIONS', Name: 'CCI DEVIATIONS' },
    // { value: 'CCI Practitioner', Name: 'CCI PRACTITIONER' },
    // { value: 'CCI Hospital', Name: 'CCI HOSPITAL' },
    // { value: 'DMUV Professional', Name: 'DMUV PROFESSIONAL' },
    // { value: 'DMUV Outpatient', Name: 'DMUV OUTPATIENT' },
    { value: 'HCPCS', Name: 'HCPCS' },
    { value: 'CPT', Name: 'CPT' },
    { value: 'ICD_10_CM', Name: 'ICD_10_CM' },
    { value: 'ADD_ON_CODES', Name: 'ADD_ON_CODES' },
    { value: 'Addon Code Type 2', Name: 'ADDON CODE TYPE 2' },
    { value: 'Addon Code Type 3', Name: 'ADDON CODE TYPE 3' },
    { value: 'RBRVS', Name: 'RBRVS_GAPLOAD' },
    { value: 'ICD_10_PCS', Name: 'ICD_10_PCS' },
    { value: 'ICD_10_CM_DRGN', Name: 'ICD_10_CM_DRGN' },
    { value: 'ADHOC_CPT_HCPCS', Name: 'ADHOC CPT/HCPCS' },
    { value: 'Modifier Interaction', Name: 'MODIFIER INTERACTION' },
    { value: 'GPCI', Name: 'GPCI' },
    { value: 'GPCI DATE BINDED', Name: 'GPCI DATE BINDED' },
    { value: 'ZIP 5', Name: 'ZIP 5' },
    { value: 'ZIP 9', Name: 'ZIP 9' },
    { value: 'MAX UNITS', Name: 'MAX UNITS' },
    { value: 'CPT SAME OR SIMILAR CODES', Name: 'CPT_SAME_OR_SIMILAR_CODES' },
    { value: 'ZIP 5 DATE BINDED', Name: 'ZIP 5 DATE BINDED' },
    { value: 'ZIP 9 DATE BINDED', Name: 'ZIP 9 DATE BINDED' },
  ],
  mfsQuarter: [],
  uploadMetaLoader: [],
  selectedMetaDataSource: undefined,
  latestQuarter: undefined,
  maxUnitsLkpData: [],
  ModInteractionLkpData: [],
  maiLkpData: [],
  mueLkpData: [],
};

export default function MetaDataLoaderReducer(
  state = initialState,
  action: { type: string; payload: any }
): MetaDataLoaderState {
  switch (action.type) {
    case GET_META_DATA_LOADER:
      return { ...state, metadataLoader: action.payload };
    case GET_MFS_QUARTER:
      return { ...state, mfsQuarter: action.payload };
    case UPLOAD_META_LOADER:
      return { ...state, uploadMetaLoader: action.payload };
    case SELECTED_METADATA_SOURCE:
      return { ...state, selectedMetaDataSource: action.payload };
    case GET_LATEST_TASK:
      return { ...state, latestQuarter: action.payload };
    case GET_Max_UNITS_LKP_DATA:
      return { ...state, maxUnitsLkpData: action.payload };
    case GET_MOD_INTRACTION_DATA:
      return { ...state, ModInteractionLkpData: action.payload };
    case GET_MAI_LKP_DATA:
      return { ...state, maiLkpData: action.payload };
    case GET_MUE_LKP_DATA:
      return { ...state, mueLkpData: action.payload };

    default:
      return state;
  }
}

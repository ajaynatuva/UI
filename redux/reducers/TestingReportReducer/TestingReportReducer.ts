import {
  GET_CONFIG_REPORT,
  GET_TESTING_REPORT_DATA,
  VALIDATIONREPORTSPINNER,
  // BILL_TYPE,
  SEND_CLAIMDATA,
  POS_LKP,
  INCLUDE_DB,
  TEMP_DATA,
  HISTORY_TEMP_DATA,
  CLAIM_HEADER_DATA,
  CLAIM_HISTORY_DATA,
  LINE_LEVEL_DATA,
  TOTAL_CLAIMS_DATA,
} from '../../ApiCalls/TestingReportApis/TestingReportTypes';

export const intialPolicyData = {
  policyId: undefined,
  policyNumber: undefined,
  policyVersion: undefined,
  policyDesc: undefined,
  deactivated: undefined,
  disabled: undefined,
  claimType: undefined,
  medicalPolicyKeyFK: undefined,
  subPolicyKeyFK: undefined,
  reference: undefined,
  policyCategoryKeyFk: undefined,
  priority: undefined,
  enforceBeforeCategory: undefined,
  genderCode: undefined,
  minAgeFk: undefined,
  maxAgeFk: undefined,
  npiLogicFk: undefined,
  taxLogicFk: undefined,
  subspecLogicFk: undefined,
  reasonCodeFk: undefined,
  isProdb: 0,
  notes: undefined,
  summary: undefined,
  explanation: undefined,
  refSourceDesc: undefined,
  refSourceTitle: undefined,
  sourceIndicator: undefined,
  lobFk: undefined,
  productTypeFk: undefined,
  createdBy: undefined,
  createdDate: undefined,
  updatedBy: undefined,
  updatedOn: undefined,
  claimData: undefined,
};

export interface TestingReportState {
  getConfigReport: any[];
  getTestingReportData: any;
  validationreportspinner: boolean;
  billType: any;
  claimData: any;
  pos: any;
  includeDB: any;
  tempData: any;
  historicTempData: any;
  claimHeaderData: any;
  claimHistoryData: any;
  lineLevelData:any;
  totalClaimsData:any;
}
const initialState: TestingReportState = {
  getConfigReport: [],
  getTestingReportData: intialPolicyData,
  billType: [],
  validationreportspinner: false,
  claimData: [],
  pos: [],
  includeDB: undefined,
  tempData: [],
  historicTempData: [],
  claimHeaderData: [],
  claimHistoryData: [],
  lineLevelData:[],
  totalClaimsData:[],
};

export default function TestingReportReducer(
  state = initialState,
  action: { type: string; payload: any }
): TestingReportState {
  switch (action.type) {
    case GET_CONFIG_REPORT:
      return { ...state, getConfigReport: action.payload };
    case GET_TESTING_REPORT_DATA:
      return { ...state, getTestingReportData: action.payload };
    case VALIDATIONREPORTSPINNER:
      return { ...state, validationreportspinner: action.payload };
    // case BILL_TYPE:
    //   return { ...state, billType: action.payload };
    case SEND_CLAIMDATA:
      return { ...state, claimData: action.payload };
    case INCLUDE_DB:
      return { ...state, includeDB: action.payload };
    case POS_LKP:
      return { ...state, pos: action.payload };
    case TEMP_DATA:
      return { ...state, tempData: action.payload };
    case HISTORY_TEMP_DATA:
      return { ...state, historicTempData: action.payload };
    case CLAIM_HEADER_DATA:
      return { ...state, claimHeaderData: action.payload };
    case CLAIM_HISTORY_DATA:
      return { ...state, claimHistoryData: action.payload };
      case LINE_LEVEL_DATA:
        return { ...state, lineLevelData: action.payload };
        case TOTAL_CLAIMS_DATA:
          return { ...state, totalClaimsData: action.payload };
    default:
      return state;
  }
}

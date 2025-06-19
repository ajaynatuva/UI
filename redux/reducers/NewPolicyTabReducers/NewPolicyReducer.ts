import {
  GET_CAT,
  GET_GENDER,
  GET_LOB,
  GET_MAX_AGE,
  GET_MEDICAL_POLICY,
  GET_MIN_AGE,
  GET_NPI,
  GET_POSLINK,
  GET_CPTLINK,
  GET_PROCS,
  GET_PROD_TYPE,
  GET_REASON_CODES,
  GET_SUBSPECIALITY,
  GET_SUB_POLICY,
  GET_TAX_LOGIC,
  SEARCH_POLICY,
  POST_PROCS,
  PROCS_TARGET,
  PROCS_TARGET_SPINNER,
  PROCS_DATA_TO_EXCEL,
  TAXONOMY_TARGET,
  GET_CONFIG_REPORT_FOR_SINGLE_RULE,
  GET_POLICY_BY_ID,
  SEARCH_CLAIM,
  CHANGES_ISOPEN_B,
  DELTA_LINK,
  GET_ALL_CLAIM_TYPE,
  DIAGNOSIS_DATA_TO_EXCEL,
  GET_CLAIM_LINK_LKP,
  GET_POLICY_CPT_ACTION_LKP,
  GET_REVENUE_CODE_CLAIM_LINK,
  GET_CLAIM_TYPE_LINK_LKP,
  GET_MODIFIER_PAY_PERCENTAGE,
  POST_TAXONOMY,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import {
  GET_ACTIVE_CLIENT_DATA,
  GET_ACTIVE_CLIENT_DATA_NOT_HP,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import {
  GET_MODIFIER_PRIORITY_LKP,
  GET_REVENUE_LOOKUP,
} from '../../ApiCalls/LookUpsApi/LookUpsActionTypes';
import { GET_TAXONOMY_DATA } from '../../ApiCalls/NewClientSetUpApis/NewClientSetUpTypes';
import {
  GET_ACTION_DATA,
  GET_BILL_TYPE_DATA,
  GET_CONDITION_TYPE_DATA,
  POLICY_CONDITION_TYPE_DATA,
  GET_DIAGNOSIS_DATA,
  GET_POLICY_BILL_TYPE_ACTION_LKP,
  GET_SOURCE_BILL_TYPE_LKP_DATA,
  POLICY_BILL_TYPE_DATA,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { GET_RATIONALE_DATA } from '../../ApiCalls/TaskApis/TaskApiType';
import { CONFIG_VER, CRAWLER_VER, CURATION_VER, EMAIL_VER, ENGINE_VER, USER_VER } from '../../ApiCalls/VersionApi/VersionActionTypes';

export interface NewPolicyState {
  RSN: any[];
  CAT: any[];
  MedicalPolicy: any[];
  SubPolicy: any[];
  LOB: any[];
  ProductType: any[];
  gender: any[];
  minAge: any[];
  taxLogic: any[];
  subSpeciality: any[];
  maxAge: any[];
  policies: any[];
  npi: any[];
  posLink: any[];
  cptLink: any[];
  revenueCodeClaimLink: any[];
  procs: any[];
  getPolicyNumber: any[];
  stageprocs: boolean;
  targetprocs: boolean;
  targetprocsSpinner: boolean;
  procsdatatoExcel: any[];
  dxDataToExcel: any[];

  stageTaxonomy:boolean;
  targetTaxonomy:boolean;

  getPolicyById: any[];
  getconfigreportforsinglerule: any[];
  claims: any[];
  getChallengeCode: any[];
  // changesisOpenB: any[];
  deltaLink: any;
  addOnCodes: any[];
  ptpCci: any[];
  curationVer: any;
  configVer: any;
  crawleVer: any;
  engineVer: any;
  email: any;
  userVer: any;

  getClaimTypes: any[];
  ignoreModifier: any[];
  allowCmsNcciModifiers: any[];
  diagnosisData: any[];
  clmLinkLkp: any[];
  policyCptActionLkp: any[];
  getbilltypedata: any[];
  getSourceBillTypeLkpData: any[];
  policyBillTypeData: any[];
  getPolicyBillTypeActionLkp: any[];

  getConditionTypeData: any[];
  policyConditiontypedata: any[];
  // getBwTypeData: any[];
  getChangeModifier: any[];
  getModifierPayPercentage: any[];
  getModifierPriority: any[];

  rationale: any;
  claimTypeLinkLkp: any;
  getTotalNumberOfRows: 0;
  getTaxonomyData: any[];
}
const initialState: NewPolicyState = {
  RSN: [],
  CAT: [],
  MedicalPolicy: [],
  SubPolicy: [],
  LOB: [],
  ProductType: [],
  gender: [],
  minAge: [],
  procs: [],
  taxLogic: [],
  subSpeciality: [],
  maxAge: [],
  npi: [],
  cptLink: [],
  posLink: [],
  revenueCodeClaimLink: [],
  policies: [],
  getPolicyById: [],
  stageprocs: false,
  targetprocs: false,
  targetprocsSpinner: false,
  procsdatatoExcel: [],
  stageTaxonomy:false,
  targetTaxonomy:false,
  getconfigreportforsinglerule: [],
  getPolicyNumber: [],
  claims: [],
  getChallengeCode: [],
  // changesisOpenB: [],
  deltaLink: [],
  addOnCodes: [],
  ptpCci: [],
  getChangeModifier: [],
  getModifierPayPercentage: [],
  curationVer: '',
  configVer: '',
  crawleVer: '',
  engineVer: '',
  email: '',
  userVer: '',
  getClaimTypes: [],
  ignoreModifier: [],
  allowCmsNcciModifiers: [],
  diagnosisData: [],
  dxDataToExcel: [],
  clmLinkLkp: [],
  getModifierPriority: [],
  getbilltypedata: [],
  getSourceBillTypeLkpData: [],
  policyBillTypeData: [],
  getPolicyBillTypeActionLkp: [],

  getConditionTypeData: [],
  policyConditiontypedata: [],
  policyCptActionLkp: [],
  // getBwTypeData: [],
  rationale: [],
  claimTypeLinkLkp: [],
 
  getTotalNumberOfRows: 0,
  getTaxonomyData: [],
};

export default function NewPolicyReducer(
  state = initialState,
  action: { type: string; payload: any }
): NewPolicyState {
  switch (action.type) {

    case GET_REASON_CODES:
      return { ...state, RSN: action.payload };
    case GET_CAT:
      return { ...state, CAT: action.payload };
    case GET_MEDICAL_POLICY:
      return { ...state, MedicalPolicy: action.payload };
    case GET_SUB_POLICY:
      return { ...state, SubPolicy: action.payload };
    case GET_PROD_TYPE:
      return { ...state, ProductType: action.payload };
    case GET_LOB:
      return { ...state, LOB: action.payload };
    case GET_GENDER:
      return { ...state, gender: action.payload };
    case GET_MIN_AGE:
      return { ...state, minAge: action.payload };
    case GET_MAX_AGE:
      return { ...state, maxAge: action.payload };
    case GET_SUBSPECIALITY:
      return { ...state, subSpeciality: action.payload };
    case GET_TAX_LOGIC:
      return { ...state, taxLogic: action.payload };
    case GET_NPI:
      return { ...state, npi: action.payload };
    case GET_POSLINK:
      return { ...state, posLink: action.payload };
    case GET_CPTLINK:
      return { ...state, cptLink: action.payload };
    case GET_REVENUE_CODE_CLAIM_LINK:
      return { ...state, revenueCodeClaimLink: action.payload };
    case SEARCH_POLICY:
      return { ...state, policies: action.payload };
    case GET_PROCS:
      return { ...state, procs: action.payload };
    case POST_PROCS:
      return { ...state, stageprocs: action.payload };
    case PROCS_TARGET:
      return { ...state, targetprocs: action.payload };
    case PROCS_TARGET_SPINNER:
      return { ...state, targetprocsSpinner: action.payload };
    case PROCS_DATA_TO_EXCEL:
      return { ...state, procsdatatoExcel: action.payload };
    case POST_TAXONOMY:
      return { ...state, stageTaxonomy: action.payload };
    case TAXONOMY_TARGET:
        return { ...state, targetTaxonomy: action.payload };
    case GET_POLICY_BY_ID:
      return { ...state, getPolicyById: action.payload };
    case GET_CONFIG_REPORT_FOR_SINGLE_RULE:
      return { ...state, getconfigreportforsinglerule: action.payload };
    case SEARCH_CLAIM:
      return { ...state, claims: action.payload };
    // case CHANGES_ISOPEN_B:
    //   return { ...state, changesisOpenB: action.payload };
    case DELTA_LINK:
    case GET_MODIFIER_PAY_PERCENTAGE:
      return { ...state, getModifierPayPercentage: action.payload };
    case GET_MODIFIER_PRIORITY_LKP:
      return { ...state, getModifierPriority: action.payload };
    case CURATION_VER:
      return { ...state, curationVer: action.payload };
    case CONFIG_VER:
      return { ...state, configVer: action.payload };
    case CRAWLER_VER:
      return { ...state, crawleVer: action.payload };
    case ENGINE_VER:
      return { ...state, engineVer: action.payload };
    case EMAIL_VER:
      return { ...state, email: action.payload };
    case USER_VER:
      return { ...state, userVer: action.payload };
    case GET_ALL_CLAIM_TYPE:
      return { ...state, getClaimTypes: action.payload };
    case GET_DIAGNOSIS_DATA:
      return { ...state, diagnosisData: action.payload };
    case DIAGNOSIS_DATA_TO_EXCEL:
      return { ...state, dxDataToExcel: action.payload };
    case GET_CLAIM_LINK_LKP:
      return { ...state, clmLinkLkp: action.payload };
    case GET_POLICY_CPT_ACTION_LKP:
      return { ...state, policyCptActionLkp: action.payload };
    case GET_BILL_TYPE_DATA:
      return { ...state, getbilltypedata: action.payload };
    case GET_SOURCE_BILL_TYPE_LKP_DATA:
      return { ...state, getSourceBillTypeLkpData: action.payload };
    case POLICY_BILL_TYPE_DATA:
      return { ...state, policyBillTypeData: action.payload };
    case GET_POLICY_BILL_TYPE_ACTION_LKP:
      return { ...state, getPolicyBillTypeActionLkp: action.payload };
    case GET_CONDITION_TYPE_DATA:
      return { ...state, getConditionTypeData: action.payload };
    case POLICY_CONDITION_TYPE_DATA:
      return { ...state, policyConditiontypedata: action.payload };
    case GET_RATIONALE_DATA:
      return { ...state, rationale: action.payload };
    case GET_CLAIM_TYPE_LINK_LKP:
      return { ...state, claimTypeLinkLkp: action.payload };
    case GET_TAXONOMY_DATA:
      return { ...state, getTaxonomyData: action.payload };
    default:
      return state;
  }
}

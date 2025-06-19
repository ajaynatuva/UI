import {
  ADD_ON_CODES,
  GET_BW_TYPE_DATA,
  GET_CHANGE_MODIFIER,
  MODIFIER_PAY_PERCENTAGE_DATA,
  PTP_CCI,
  SAME_OR_SIMILAR_CODE_LKP,
} from '../../../pages/LookUps/LookUpConsts';
import {
  BW_OR_BOAN_ACTION_LKP,
  GET_BILL_TYPE_LOOKUP,
  GET_BO_LOOKUP,
  GET_BW_TYPE_LOOKUP,
  GET_CCI_DEVITIONS,
  GET_CCI_LOOKUP,
  GET_CONDITION_LOOKUP,
  GET_MAX_UNITS_LKP,
  GET_MAX_UNITS_TYPES,
  GET_MIN_MAX_AGE_LOOKUP,
  GET_MODIFIER_INTERACTION_LKP,
  GET_MODIFIER_INTERACTION_TYPE_LKP,
  GET_MODIFIER_PRIORITY_LKP,
  GET_MOD_LOOKUP,
  GET_MUE_RATIONALE_LOOKUP,
  GET_POLICY_CATEGORY_LOOKUP,
  GET_POS_LOOKUP,
  GET_REASON_LOOKUP,
  GET_REVENUE_LOOKUP,
  GET_SPEC_LOOKUP,
  GET_STATES,
  GET_SUB_SPEC_LOOKUP,
} from '../../ApiCalls/LookUpsApi/LookUpsActionTypes';
import { GET_MODIFIER_PAY_PERCENTAGE_LKP } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';

export interface LookUpState {
  specs: any[];
  subSpecs: any[];
  minMax: any[];
  revenue: any[];
  mod: any[];
  pos: any[];
  condition: any[];
  reason: any[];
  policyCategory: any[];
  billType: any[];
  cci: any[];
  mue: any[];
  Bo: any[];
  BwType: any[];
  MaxUnitsTypes: any[];
  MaxUnits: any[];
  ModifierPriority: any[];
  ModifierInteraction: any[];
  ModifierInteractionType: any;
  SameOrSimilarCodes: any[];
  getModifierPayPercentageLkp: any[];
  ModifierPayPercentageData: any[];
  bwOrBwLkp: any[];
  getCciDeviations: any[];
  getStates: any[];
  ptpCci: [];
  getBwTypeData: any[];
  getChangeModifier: any[];
  addOnCodes: any[];


}

const initialState: LookUpState = {
  specs: [],
  subSpecs: [],
  minMax: [],
  revenue: [],
  mod: [],
  pos: [],
  condition: [],
  reason: [],
  policyCategory: [],
  billType: [],
  cci: [],
  mue: [],
  Bo: [],
  BwType: [],
  MaxUnitsTypes: [],
  MaxUnits: [],
  ModifierPriority: [],
  ModifierInteraction: [],
  ModifierInteractionType: [],
  SameOrSimilarCodes: [],
  getModifierPayPercentageLkp: [],
  ModifierPayPercentageData: [],
  getCciDeviations: [],
  getStates: [],
  bwOrBwLkp: [],
  ptpCci: [],
  getBwTypeData: [],
  getChangeModifier: [],
  addOnCodes: [],


  
};

export default function LookUpReducer(
  state = initialState,
  action: { type: string; payload: any }
): LookUpState {
  switch (action.type) {
    case GET_SPEC_LOOKUP:
      return { ...state, specs: action.payload };
    case GET_SUB_SPEC_LOOKUP:
      return { ...state, subSpecs: action.payload };
    case GET_REVENUE_LOOKUP:
      return { ...state, revenue: action.payload };
    case GET_MIN_MAX_AGE_LOOKUP:
      return { ...state, minMax: action.payload };
    case GET_REASON_LOOKUP:
      return { ...state, reason: action.payload };
    case GET_BILL_TYPE_LOOKUP:
      return { ...state, billType: action.payload };
    case GET_MOD_LOOKUP:
      return { ...state, mod: action.payload };
    case GET_POS_LOOKUP:
      return { ...state, pos: action.payload };
    case GET_POLICY_CATEGORY_LOOKUP:
      return { ...state, policyCategory: action.payload };
    case GET_CONDITION_LOOKUP:
      return { ...state, condition: action.payload };
    case GET_CCI_LOOKUP:
      return { ...state, cci: action.payload };
    case GET_MUE_RATIONALE_LOOKUP:
      return { ...state, mue: action.payload };
    case GET_BO_LOOKUP:
      return { ...state, Bo: action.payload };
    case GET_BW_TYPE_LOOKUP:
      return { ...state, BwType: action.payload };
    case GET_MAX_UNITS_TYPES:
      return { ...state, MaxUnitsTypes: action.payload };
    case GET_MAX_UNITS_LKP:
      return { ...state, MaxUnits: action.payload };
    case GET_CCI_DEVITIONS:
      return { ...state, getCciDeviations: action.payload };
    case GET_STATES:
      return { ...state, getStates: action.payload };
    case GET_MODIFIER_PRIORITY_LKP:
      return { ...state, ModifierPriority: action.payload };
    case GET_MODIFIER_INTERACTION_LKP:
      return { ...state, ModifierInteraction: action.payload };
    case GET_MODIFIER_INTERACTION_TYPE_LKP:
      return { ...state, ModifierInteractionType: action.payload };
    case SAME_OR_SIMILAR_CODE_LKP:
      return { ...state, SameOrSimilarCodes: action.payload };
    case GET_MODIFIER_PAY_PERCENTAGE_LKP:
      return { ...state, getModifierPayPercentageLkp: action.payload };
    case BW_OR_BOAN_ACTION_LKP:
      return { ...state, bwOrBwLkp: action.payload };
    case PTP_CCI:
      return { ...state, ptpCci: action.payload };
    case MODIFIER_PAY_PERCENTAGE_DATA:
      return { ...state, ModifierPayPercentageData: action.payload };
    case GET_BW_TYPE_DATA:
      return { ...state, getBwTypeData: action.payload };
      case GET_CHANGE_MODIFIER:
        return { ...state, getChangeModifier: action.payload };
        case ADD_ON_CODES:
          return { ...state, addOnCodes: action.payload };
    default:
      return state;
  }
}

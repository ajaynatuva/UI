import { POLICY_FIELDS, RESET_POLICY_FILEDS } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';

export interface NewPolicyFormFieldState {
  policyId: number;
  policyNumber: any;
  version: any;
  custom: any;
  clonedPolicyId: any;
  clonedPolVer: any;
  catCode: any;
  catCodeCheck: any;
  reasonCode: any;
  reasonCodeCheck: any;
  medicalCodeCheck: any;
  medicalPolicyCode: any;
  subCodeCheck: any;
  subPolicyCode: any;
  reference: string;
  claimType: { label: string; value: string }[];
  prod: any;
  deactivated: any;
  disabled: any;
  policyDescription: string;
  newPolicyTabs: any;
  paths:String;
  errors: { [key: string]: boolean };


}
const NewPolicyFormFieldInitialState: NewPolicyFormFieldState = {
  policyId: undefined,
  policyNumber: undefined,
  version: undefined,
  custom: undefined,
  clonedPolicyId: undefined,
  clonedPolVer: undefined,
  catCode: null,
  catCodeCheck: null,
  reasonCode: null,
  reasonCodeCheck: null,
  medicalCodeCheck: null,
  medicalPolicyCode: null,
  subCodeCheck: null,
  subPolicyCode: null,
  reference: '',
  claimType: [],
  prod: 0,
  deactivated: 0,
  disabled: 0,
  policyDescription: '',
  newPolicyTabs: '',
  paths:'',
  errors: {},

} as const;

// Action Types
type NewPolicyFields = {
  type: typeof POLICY_FIELDS | typeof RESET_POLICY_FILEDS;
  payload: Partial<NewPolicyFormFieldState>;
};

// Reducer Function
export default function NewPolicyFormFieldReducer(
  state:NewPolicyFormFieldState= NewPolicyFormFieldInitialState,
  action: NewPolicyFields
): NewPolicyFormFieldState {
  switch (action.type) {
    case POLICY_FIELDS:
      return { ...state, ...action.payload };
    case RESET_POLICY_FILEDS:
      return {
        ...NewPolicyFormFieldInitialState,
        errors: {},
      }
    default:
      return state;
  }
}

 


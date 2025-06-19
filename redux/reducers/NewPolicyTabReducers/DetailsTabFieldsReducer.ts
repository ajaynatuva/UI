import {
  DETAILS_TAB_FIELDS,
  RESET_DETAILS_TAB_FIELDS,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';

export interface DetailsTabFieldState {
  createdDate: Date;
  gender: { label: string; value: number };
  npi: { label: string; value: number };
  taxonomy: { label: string; value: number };
  revenueCodeClaimLink: { label: string; value: number };
  cptLink: { label: string; value: number };
  enforceBeforeCategory: any;
  enfoCatCheck:any;
  priority: any;
  procedureMaxAge: any;
  procedureMaxAgeIdCheck:any;
  procedureMinAge:any;
  procedureMinAgeIdCheck:any;
  taxId: { label: string; value: number };
  posLink: { label: string; value: number };
  claimTypeLink: any;
  ncciModifierB: any;
  Modifier59GroupB: any;
  ASGroupB: any;
  tc26ModB: any;
  referZeroChargeLine: any;
  referenceClaimType:any;
}
const DetailsTabFieldsInitialState: DetailsTabFieldState = {
  createdDate: undefined,
  gender: undefined,
  npi: undefined,
  taxonomy: undefined,
  revenueCodeClaimLink: undefined,
  cptLink: undefined,
  enforceBeforeCategory: undefined,
  enfoCatCheck:undefined,
  priority: undefined,
  procedureMaxAge: undefined,
  procedureMaxAgeIdCheck:undefined,
  procedureMinAge:undefined,
  procedureMinAgeIdCheck:undefined,
  taxId: undefined,
  posLink: undefined,
  claimTypeLink: undefined,
  ncciModifierB: 0,
  Modifier59GroupB: 0,
  ASGroupB: 0,
  tc26ModB: 0,
  referZeroChargeLine: undefined,
  referenceClaimType: false,
} as const;

// Action Types
type DetailsTabFields = {
  type: typeof DETAILS_TAB_FIELDS | typeof RESET_DETAILS_TAB_FIELDS;
  payload: Partial<DetailsTabFieldState>;
};

export const DetailsTabfieldsReducer = (
  state: DetailsTabFieldState = DetailsTabFieldsInitialState,
  action: DetailsTabFields
): DetailsTabFieldState => {
  switch (action.type) {
    case DETAILS_TAB_FIELDS:
      return { ...state, ...action.payload };
    case RESET_DETAILS_TAB_FIELDS:
      return DetailsTabFieldsInitialState;
    default:
      return state;
  }
};

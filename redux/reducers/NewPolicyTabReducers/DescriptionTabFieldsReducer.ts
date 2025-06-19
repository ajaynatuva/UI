import {
  DESCRIPTION_TAB_FIELDS,
  RESET_DESCRIPTION_TAB_FIELDS,
}  from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface DescriptionTabFieldState {
  productType: { label: string; value: string }[];
  lob: { label: string; value: number };
  notes: string;
  policySummary: string;
  policyExplanation: string;
  referenceSourceDescription: string;
  referenceSourceTitleDesc: string;
  sourceIndicator: string;
}

const DescriptionTabFieldsInitialState: DescriptionTabFieldState = {
  productType: [],
  lob: undefined,
  notes: '',
  policySummary: '',
  policyExplanation: '',
  referenceSourceDescription: '',
  referenceSourceTitleDesc: '',
  sourceIndicator: '',
} as const;

// Action Types
type DescriptionTabFields = {
  type: typeof DESCRIPTION_TAB_FIELDS | typeof RESET_DESCRIPTION_TAB_FIELDS;
  payload: Partial<DescriptionTabFieldState>;
};

// Reducer Function
export default function DescriptionTabFieldReducer(
  state: DescriptionTabFieldState = DescriptionTabFieldsInitialState,
  action: DescriptionTabFields
): DescriptionTabFieldState {
  switch (action.type) {
    case DESCRIPTION_TAB_FIELDS:
      return { ...state, ...action.payload };
    case RESET_DESCRIPTION_TAB_FIELDS:
      return DescriptionTabFieldsInitialState;
    default:
      return state;
  }
}

import {
  CAT_FIELDS,
  CAT_RESET,
}  from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface CategoryState {
  //category 38
  billedWith: { label: string; value: string };
 
  //category 25
  bwTypeKey: any;

  //category 20
  changeModifierKey: any;
  
  // category 45 or category 46
  modifierPayPercentage: any;

  //category 35
  maxUnitsType: any;
  modIntractionType: any;

  //category 23
  ccikey: any;
  byPassMod: any;
  denyType: any;
  mutuallyExclusive: any;

  //category 12
  lineOrHeaderOrPrincipal: any;
  // category 49
  modifierPriority: any;

  //category 32
  units: any;
  frequency: any;
  duration: any;
  durationDropdown: { label: string; value: string };
  ranking: any;
  payment: any;
}
const CategoryInitialState: CategoryState = {
  billedWith: { label: '', value: '' },
  ccikey: null,
  bwTypeKey: null,
  changeModifierKey: null,
  modifierPayPercentage: null,
  maxUnitsType: null,
  modIntractionType: null,
  byPassMod: null,
  denyType: null,
  mutuallyExclusive: null,
  lineOrHeaderOrPrincipal: null,
  modifierPriority: null,
  units: null,
  frequency: null,
  duration: null,
  ranking: null,
  payment: null,
  durationDropdown: { label: '', value: '' },
} as const;

type CategoryFields = {
  type: typeof CAT_FIELDS | typeof CAT_RESET;
  payload: Partial<CategoryState>;
};
// Reducer Function
export default function CategoryReducer(
  state: CategoryState = CategoryInitialState,
  action: CategoryFields
): CategoryState {
  switch (action.type) {
    case CAT_FIELDS:
      return { ...state, ...action.payload };
    case CAT_RESET:
      return CategoryInitialState;
    default:
      return state;
  }
}

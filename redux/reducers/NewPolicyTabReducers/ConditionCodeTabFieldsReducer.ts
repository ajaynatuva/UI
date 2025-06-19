import {
  CONDITION_CODE_FIELDS,
  RESET_CONDITION_CODE_FIELDS,
}  from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface conditionCodeTabFieldState {
  conditionCodeAction: { label: string; value: number };
  conditionTabTableData: any[];
  postConditionTypeData: any | null;
}
const conditionCodeTabFieldsIntialsState: conditionCodeTabFieldState = {
  conditionCodeAction: undefined,
  conditionTabTableData: [],
  postConditionTypeData: null,
} as const;

type conditionCodeTabFields = {
  type: typeof CONDITION_CODE_FIELDS | typeof RESET_CONDITION_CODE_FIELDS;
  payload: Partial<conditionCodeTabFieldState>;
};

export const ConditionCodeTabFieldsReducer = (
  state: conditionCodeTabFieldState = conditionCodeTabFieldsIntialsState,
  action: conditionCodeTabFields
): conditionCodeTabFieldState => {
  switch (action.type) {
    case CONDITION_CODE_FIELDS:
      return { ...state, ...action.payload };
    case RESET_CONDITION_CODE_FIELDS:
      return conditionCodeTabFieldsIntialsState;
    default:
      return state;
  }
};

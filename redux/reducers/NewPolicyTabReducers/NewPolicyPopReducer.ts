import { NEW_POLICY_CREATE_ARRAY } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';

export interface NewPolicyPopState {
  newpolicyCreateArray: any;
}
const intialState: NewPolicyPopState = {
  newpolicyCreateArray: [],
};
export default function NewPolicyPopReducer(
  state = intialState,
  action: { type: string; payload: any }
): NewPolicyPopState {
  switch (action.type) {
    case NEW_POLICY_CREATE_ARRAY:
      return {
        ...state,
        newpolicyCreateArray: action.payload,
      };
    default:
      return state;
  }
}

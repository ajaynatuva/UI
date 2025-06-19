import { RESET_NEW_POLICY_FIELDS, VALIDATE_NEW_POLICY } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface ValidatePolicyState {
    errors: { [key: string]: boolean };
    // other state properties
  }
  
  const initialState: ValidatePolicyState = {
    errors: {},
    // other initial states
  };
  
  const validatePolicyReducer = (state = initialState, action: any): ValidatePolicyState => {
    switch (action.type) {
      case VALIDATE_NEW_POLICY:
        return {
          ...state,
          ...action.payload // Update errors state with the dispatched payload
        };
        case RESET_NEW_POLICY_FIELDS:
          return {
            errors:{}
          }
      // other cases...
      default:
        return state;
    }
  };
  
  export default validatePolicyReducer;
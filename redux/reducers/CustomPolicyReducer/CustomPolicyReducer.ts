import {
  CLONE_ASSIGNMENT_CHECK,
  CLONE_TAXONOMY_CHECK,
  CUSTOM_JIRAID,
  CUSTOM_JIRA_DESCRIPTION,
  CUSTOM_JIRA_LINK,
  CUSTOM_NEW_POLICY_DATE,
  CUSTOM_POLICY_FORM,
  CUSTOM_POLICY_FORM_REST_STATE,
  CUSTOM_POLICY_IS_OPEN,
  CUSTOM_POLICY_VALIDATION,
} from '../../ApiCalls/CustomPolicyApis/CustomPolicyActionType';

export interface CustomPolicyState {
  customPolicyForm: any[];
  customJiraId: any;
  customJiraDesc: any;
  customJiraLink: any;
  customPolicyIsOpen: any;
  customNewPolicyDate: any;
  cloneAssignmentCheck: any;
  cloneTaxonomyCheck: any;

  customPolicyErrors: {
    customJiraId: boolean;
    customJiraDesc: boolean;
    customNewPolicyDate: boolean;
  };
}
const initialState: CustomPolicyState = {
  customPolicyForm: [],
  customJiraId: undefined,
  customJiraDesc: undefined,
  customJiraLink: undefined,
  customPolicyIsOpen: undefined,
  customNewPolicyDate: undefined,
  cloneAssignmentCheck: undefined,
  cloneTaxonomyCheck: undefined,
  customPolicyErrors: {
    customJiraId: false,
    customJiraDesc: false,
    customNewPolicyDate: false
  }
};
export default function CustomPolicyReducer(
  state = initialState,
  action: { type: string; payload: any }
): CustomPolicyState {
  switch (action.type) {
    case CUSTOM_JIRAID:
      return {
        ...state,
        customJiraId: action.payload,
        customPolicyErrors: { ...state.customPolicyErrors, customJiraId: false },
      };
    case CUSTOM_NEW_POLICY_DATE:
      return {
        ...state,
        customNewPolicyDate: action.payload,
        customPolicyErrors: {
          ...state.customPolicyErrors,
          customNewPolicyDate: false,
        },
      };
    case CUSTOM_JIRA_DESCRIPTION:
      return {
        ...state,
        customJiraDesc: action.payload,
        customPolicyErrors: { ...state.customPolicyErrors, customJiraDesc: false },
      };
    case CUSTOM_JIRA_LINK:
      return { ...state, customJiraLink: action.payload };
      case CUSTOM_POLICY_IS_OPEN:
        return { ...state, customPolicyIsOpen: action.payload };
    case CLONE_ASSIGNMENT_CHECK:
      return { ...state, cloneAssignmentCheck: action.payload };
      case CLONE_TAXONOMY_CHECK:
        return {...state, cloneTaxonomyCheck: action.payload};
    case CUSTOM_POLICY_FORM:
      return { ...state, customPolicyForm: action.payload };
    case CUSTOM_POLICY_VALIDATION:
      return { ...state, customPolicyErrors: action.payload };
    case CUSTOM_POLICY_FORM_REST_STATE:
      return {
        ...state,
        customPolicyErrors: initialState.customPolicyErrors,
        customJiraId: undefined,
        customJiraDesc: undefined,
        cloneAssignmentCheck:false,
        cloneTaxonomyCheck:false,
        customNewPolicyDate:undefined
      };
    default:
      return state;
  }
}

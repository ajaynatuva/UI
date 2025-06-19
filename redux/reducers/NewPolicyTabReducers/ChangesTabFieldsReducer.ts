import {
  CHANGES_TAB_FIELDS,
  CHANGES_TAB_TABLE,
  RESET_CHANGES_TAB_FIELDS,
  RESET_CHANGES_TAB_TABLE,
} from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';

export interface changesTabFieldState {
  jiraId: String;
  jiraDesc: String;
  jiraLink: String;
  userId: any;
  policyChangesKey: number;
  jiraIsOpen: any;
  changesTableData: any[];
  changesIsOpenB: any;
  isJiraValid: any;
  TempUser: { label: string; value: string };
}

const changesTabFieldsInitialState: changesTabFieldState = {
  jiraId: '',
  jiraDesc: '',
  jiraLink: '',
  jiraIsOpen: '',
  userId: null,
  policyChangesKey: undefined,
  changesTableData: [],
  changesIsOpenB: [],
  isJiraValid: '',
  TempUser: undefined,
} as const;

type changesTabFields = {
  type:
    | typeof CHANGES_TAB_FIELDS
    | typeof RESET_CHANGES_TAB_FIELDS
    | typeof CHANGES_TAB_TABLE
    | typeof RESET_CHANGES_TAB_TABLE;
  payload: Partial<changesTabFieldState>;
};

export const ChangesTabFieldsReducer = (
  state: changesTabFieldState = changesTabFieldsInitialState,
  action: changesTabFields
): changesTabFieldState => {
  switch (action.type) {
    case CHANGES_TAB_FIELDS:
      return { ...state, ...action.payload };
    case CHANGES_TAB_TABLE:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_CHANGES_TAB_FIELDS:
      return {
        ...state,
        jiraId: '',
        jiraDesc: '',
        jiraLink: '',
        jiraIsOpen: '',
        userId: null,
        isJiraValid: '',
        TempUser: undefined,
      };
    case RESET_CHANGES_TAB_TABLE:
      return {
        ...state,
        changesTableData: [],
      };
    default:
      return state;
  }
};

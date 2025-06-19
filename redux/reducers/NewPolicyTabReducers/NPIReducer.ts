import { NPI_FIELDS, RESET_NPI_FIELDS } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants";

export interface NPIState {
  clientCode: undefined;
  clientGroupCode: undefined;
  clientGroupId: undefined;
  lob: undefined;
  // claimType: [];
  claimType: { label: string; value: string }[]; // Explicitly defining label and value
  npi: '';
  deletedB: boolean;
  deactive: boolean;
  getNPITabledata: any[];
  NPIDeltaLink: any;
  NPITargetData: any;
  errors: { [key: string]: boolean };
}
const NPIInitialState: NPIState = {
  deactive: false,
  getNPITabledata: [],
  NPIDeltaLink: undefined,
  NPITargetData: undefined,
  clientCode: undefined,
  clientGroupCode: undefined,
  clientGroupId: undefined,
  lob: undefined,
  claimType: [],
  npi: '',
  deletedB: true,
  errors: {},
};

type NPIFields = {
  type: typeof NPI_FIELDS | typeof RESET_NPI_FIELDS;
  payload: Partial<NPIState>;
};

export default function NPIReducer(
  state: NPIState = NPIInitialState,
  action: NPIFields
): NPIState {
  switch (action.type) {
    case NPI_FIELDS:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_NPI_FIELDS:
      return {
        ...state,
        clientCode: undefined,
        clientGroupCode: undefined,
        clientGroupId: undefined,
        lob: undefined,
        claimType: [],
        npi: '',
        deletedB: true,
        errors: {},
        NPITargetData: undefined,
      };

    default:
      return state;
  }
}

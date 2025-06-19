import { RESET_TAX_ID_FIELDS, TAX_ID_FIELDS } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants";

export interface TaxIdState {
  clientCode: undefined;
  clientGroupCode: undefined;
  clientGroupId: undefined;
  lob: undefined;
  // claimType: [];
  claimType: { label: string; value: string }[]; // Explicitly defining label and value
  taxId: "";
  deletedB: boolean;
  deactive: boolean;
  getTaxIdTabledata: any[];
  taxIdDeltaLink: any;
  taxIdTargetData: any;
  errors: { [key: string]: boolean };
}
const TaxIdInitialState: TaxIdState = {
  deactive: false,
  getTaxIdTabledata: [],
  taxIdDeltaLink: undefined,
  taxIdTargetData: undefined,
  clientCode: undefined,
  clientGroupCode: undefined,
  clientGroupId: undefined,
  lob: undefined,
  claimType: [],
  taxId: "",
  deletedB: true,
  errors: {},
};

type TaxIdFields = {
  type: typeof TAX_ID_FIELDS | typeof RESET_TAX_ID_FIELDS;
  payload: Partial<TaxIdState>;
};

export default function TaxIdReducer(
  state: TaxIdState = TaxIdInitialState,
  action: TaxIdFields
): TaxIdState {
  switch (action.type) {
    case TAX_ID_FIELDS:
      return {
        ...state,
        ...action.payload,
      };
      case RESET_TAX_ID_FIELDS:
        return {
          ...state,
          clientCode: undefined,
          clientGroupCode: undefined,
          clientGroupId: undefined,
          lob: undefined,
          claimType: [],
          taxId: "",
          deletedB: true,
          errors:{},
          taxIdTargetData:undefined
        };
        
    default:
      return state;
  }
}

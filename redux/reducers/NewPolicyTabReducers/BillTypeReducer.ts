import { BILL_TYPE_FIELDS, BILL_TYPE_RESET } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants";

export interface BillTypeState {
  billTypeLink: { label: string; value: number };
  billTypeAction: { label: string; value: number };
}
const BillTypeInitialState: BillTypeState = {
  billTypeLink: undefined,
  billTypeAction: undefined,
};
type billTypeFields = {
  type: typeof BILL_TYPE_FIELDS | typeof BILL_TYPE_RESET;
  payload: Partial<BillTypeState>;
};

// Reducer Function
export default function BillTypeTabReducer(
  state: BillTypeState = BillTypeInitialState,
  action: billTypeFields
): BillTypeState {
  switch (action.type) {
    case BILL_TYPE_FIELDS:
      return { ...state, ...action.payload };
    case BILL_TYPE_RESET:
      return BillTypeInitialState;
    default:
      return state;
  }
}

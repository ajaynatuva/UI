import { CLIENT_ASSIGNMENT_FIELDS } from '../../ApiCalls/NewPolicyTabApis/AllPolicyConstants';
import { CLIENT_ASSIGNMENT_TAB_RESET } from '../../ApiCalls/NewPolicyTabApis/AllPolicyTabTypes';

export interface ClientAssignmentState {
  getClientAssignmentTableData:any;
  getActiveClientData:any;
  postClientAssignmentData:any;
  getActiveClientDataNotHp:any;

}
const ClientAssignmentInitialState: ClientAssignmentState = {
  getClientAssignmentTableData:[],
  getActiveClientData:[],
  postClientAssignmentData:[],
  getActiveClientDataNotHp:[]
};
type clientAssignmentFields = {
  type: typeof CLIENT_ASSIGNMENT_FIELDS | typeof CLIENT_ASSIGNMENT_TAB_RESET;
  payload: Partial<ClientAssignmentState>;
};

// Reducer Function
export default function ClientAssignmentTabReducer(
  state: ClientAssignmentState = ClientAssignmentInitialState,
  action: clientAssignmentFields
): ClientAssignmentState {
  switch (action.type) {
    case CLIENT_ASSIGNMENT_FIELDS:
      return { ...state, ...action.payload };
    case CLIENT_ASSIGNMENT_TAB_RESET:
      return ClientAssignmentInitialState;
    default:
      return state;
  }
}

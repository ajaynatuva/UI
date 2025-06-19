import {
  GET_CLIENT_EXCLUSION,
  GET_POLICY_EXCLUSION,
  GET_CLIENT_POLICY_EXCLUISON,
  POLICY_VALUE,
  CLIENT_GROUP_VALUE,
} from '../../ApiCalls/ClientPolicyExclusionsApis/ClientPolicyExclusionsTypes';
import { POST_CLIENT_ASSIGNMENT }  from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface ClientPolicyState {
  getPolicyExclusion: any[];
  getClientExclusion: any[];
  getclientPolicyExclusion: any[];
  policyValue: any[];
  clientGroupValue: any;
  postClientAssginment: any[];
}
const initialState: ClientPolicyState = {
  getPolicyExclusion: [],
  getClientExclusion: [],
  getclientPolicyExclusion: [],
  policyValue: undefined,
  clientGroupValue: undefined,
  postClientAssginment: [],
};

export default function ClientPolicyReducer(
  state = initialState,
  action: { type: string; payload: any }
): ClientPolicyState {
  switch (action.type) {
    case GET_POLICY_EXCLUSION:
      return { ...state, getPolicyExclusion: action.payload };
    case GET_CLIENT_EXCLUSION:
      return { ...state, getClientExclusion: action.payload };
    case GET_CLIENT_POLICY_EXCLUISON:
      return { ...state, getclientPolicyExclusion: action.payload };
    case POLICY_VALUE:
      return { ...state, policyValue: action.payload };
    case CLIENT_GROUP_VALUE:
      return { ...state, clientGroupValue: action.payload };
    case POST_CLIENT_ASSIGNMENT:
      return { ...state, postClientAssginment: action.payload };
    default:
      return state;
  }
}

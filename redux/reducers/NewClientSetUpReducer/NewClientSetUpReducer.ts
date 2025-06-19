import {
  CLIENTCODE,
  CLIENTGROUPCODE,
  CLIENTSTARTDATE,
  GET_ALL_CHANGES_DATA,
  GET_TOTAL_CLIENT_ASSIGNMENT_DATA,
  JIRADESCRIPTION,
  JIRAID,
  POLICYCLIENTCODE,
  POLICYCLIENTGROUPCODE,
  POLICYCLIENTGROUPCODEDETAILS,
  POLICYCLIENTGROUPCODEDETAILS1,
  POLICYIDS,
  RESETNEWCLIENT,
} from '../../ApiCalls/NewClientSetUpApis/NewClientSetUpTypes';

export interface NewClientSetUpState {
  jiraId: any;
  jiraDescription: any;
  clientCode: any;
  clientGroupCode: any;
  clientStartDate: any;
  clientAssignmentData: any;
  policyClientCode: any;
  policyClientGroupCode: [];
  policyClientGroupCodeDetails: [];
  allChangesData: any[];
  policyIds: [];
  policyClientGroupCodeDetails1: [];
}
const initialState: NewClientSetUpState = {
  jiraId: undefined,
  jiraDescription: undefined,
  clientCode: undefined,
  clientGroupCode: [],
  clientStartDate: undefined,
  clientAssignmentData: [],
  policyClientCode: undefined,
  policyClientGroupCode: [],
  policyClientGroupCodeDetails: [],
  allChangesData: [],
  policyIds: [],
  policyClientGroupCodeDetails1: [],
};

export default function NewClientSetUpReducer(
  state = initialState,
  action: { type: string; payload: any }
): NewClientSetUpState {
  switch (action.type) {
    case JIRAID:
      return { ...state, jiraId: action.payload };
    case JIRADESCRIPTION:
      return { ...state, jiraDescription: action.payload };
    case CLIENTCODE:
      return { ...state, clientCode: action.payload };
    case CLIENTGROUPCODE:
      return { ...state, clientGroupCode: action.payload };
    case CLIENTSTARTDATE:
      return { ...state, clientStartDate: action.payload };
    case GET_TOTAL_CLIENT_ASSIGNMENT_DATA:
      return { ...state, clientAssignmentData: action.payload };
    case POLICYCLIENTCODE:
      return { ...state, policyClientCode: action.payload };
    case POLICYCLIENTGROUPCODE:
      return { ...state, policyClientGroupCode: action.payload };
    case POLICYCLIENTGROUPCODEDETAILS:
      return { ...state, policyClientGroupCodeDetails: action.payload };
    case POLICYCLIENTGROUPCODEDETAILS1:
      return { ...state, policyClientGroupCodeDetails1: action.payload };
    case GET_ALL_CHANGES_DATA:
      return { ...state, allChangesData: action.payload };
    case POLICYIDS:
      return { ...state, policyIds: action.payload };
    case RESETNEWCLIENT:
      return {
        ...state,
        clientCode: '',
        jiraId: '',
        jiraDescription: '',
        clientGroupCode: [],
        clientStartDate: '',
        policyClientCode: '',
        policyClientGroupCode: [],
        clientAssignmentData: [],
        policyClientGroupCodeDetails: [],
        policyIds: [],
      };
    default:
      return state;
  }
}

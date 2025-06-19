import {
  DELTA_CONFIG,
  GET_GROUP_TASK,
  GET_MY_TASK,
  GET_RATIONALE_DATA,
  GET_TOTAL_NUMBER_OF_ROWS,
} from '../../ApiCalls/TaskApis/TaskApiType';

export interface TaskState {
  myTask: any[];
  groupTasks: any[];
  totalMfsData: any[];
  selectedDeltaConfigTask: any;
  rationale: any;
  getTotalNUmberOfRows: 0;
}

const initialState: TaskState = {
  myTask: [],
  groupTasks: [],
  selectedDeltaConfigTask: [],
  rationale: [],
  totalMfsData: [],
  getTotalNUmberOfRows: 0,
};

export default function TaskReducer(
  state = initialState,
  action: { type: string; payload: any }
): TaskState {
  switch (action.type) {
    case GET_MY_TASK:
      return { ...state, myTask: action.payload };
    case GET_GROUP_TASK:
      return { ...state, groupTasks: action.payload };
    case DELTA_CONFIG:
      return { ...state, selectedDeltaConfigTask: action.payload };
    case GET_TOTAL_NUMBER_OF_ROWS:
      return {...state, getTotalNUmberOfRows: action.payload,};
    case GET_RATIONALE_DATA:
      return { ...state, rationale: action.payload };
    default:
      return state;
  }
}

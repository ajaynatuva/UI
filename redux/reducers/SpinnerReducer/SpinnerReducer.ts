import { SET_IS_LOADING } from '../../ApiCalls/UserApis/UserApiActionType';

export interface SpinnerReducerState {
  isLoading: boolean;
}

const initialState: SpinnerReducerState = {
  isLoading: false,
};

export default function SpinnerReducer(
  state = initialState,
  action: { type: string; payload: any }
): SpinnerReducerState {
  switch (action.type) {
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

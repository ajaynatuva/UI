import { GRID_COLUMNS } from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"


export interface GridState {
    getGridColumns: any
}

const initialState: GridState = {
    getGridColumns: []
};
export default function AggridReducer(
    state = initialState,
    action: { type: string, payload: any }
): GridState {
    switch (action.type) {
        case GRID_COLUMNS:
            return { ...state, getGridColumns: action.payload }
        default:
            return state;
    }
}
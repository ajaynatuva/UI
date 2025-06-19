import {
  SELECTED_QUARTER,
  SELECTED_CPT_CODE,
  SELECTED_COLUMN_II,
  SELECTED_SOURCE,
  GET_TOTAL_NUMBER_OF_ROWS,
  RESET_STATE_OF_VIEW_META,
  GET_TRUNCATED,
  MAXUNITSLKPKEY,
  CCI_RATIONAL_DESC,
} from '../../ApiCalls/ReferentialDataApi/ReferetialDataTypes';

export interface ReferentialDataState {
  selectedQuarter: { label: string; value: string };
  selectedCptCode: any;
  selectedColumnII: any;
  selectedSource: { label: string; value: string };
  getTotalNumberOfRows: 0;
  truncated: any;
  maxUnitsLkpKey: { label: string; value: string };
  cciRationalDesc: any[];
}
const initialState: ReferentialDataState = {
  selectedCptCode: '',
  selectedColumnII: '',
  selectedQuarter: undefined,
  selectedSource: undefined,
  getTotalNumberOfRows: 0,
  truncated: [],
  maxUnitsLkpKey: undefined,
  cciRationalDesc: [],
};
export default function ReferentialDataReducer(
  state = initialState,
  action: { type: string; payload: any }
): ReferentialDataState {
  switch (action.type) {
    case SELECTED_QUARTER:
      return {
        ...state,
        selectedQuarter: action.payload,
      };
    case SELECTED_CPT_CODE:
      return {
        ...state,
        selectedCptCode: action.payload,
      };
    case SELECTED_COLUMN_II:
      return {
        ...state,
        selectedColumnII: action.payload,
      };
    case SELECTED_SOURCE:
      return {
        ...state,
        selectedSource: action.payload,
      };
    case GET_TOTAL_NUMBER_OF_ROWS:
      return {
        ...state,
        getTotalNumberOfRows: action.payload,
      };
    case GET_TRUNCATED:
      return { ...state, truncated: action.payload };

    case MAXUNITSLKPKEY:
      return {
        ...state,
        maxUnitsLkpKey: action.payload,
      };
      case CCI_RATIONAL_DESC:
        return {
          ...state,
          cciRationalDesc: action.payload,
        };
    case RESET_STATE_OF_VIEW_META: {
      return {
        ...state,
        selectedCptCode: '',
        selectedQuarter: null,
        selectedSource: null,
        selectedColumnII: '',
        maxUnitsLkpKey: null,
        truncated: [],
        getTotalNumberOfRows:0
        
      };
    }
    default:
      return state;
  }
}

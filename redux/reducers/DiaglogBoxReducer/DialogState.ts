import { DIALOG }  from "../../ApiCalls/NewPolicyTabApis/AllPolicyConstants"

export interface DialogState {
  isDialog: boolean;
  message: string;
  title: string;
}

const initialState: DialogState = {
  isDialog: false,
  message: '',
  title: '',
};

export default function DialogReducer(
  state = initialState,
  action: {
    type: string;
    payload: { isDialog: boolean; message: string; title: string };
  }
): DialogState {
  switch (action.type) {
    case DIALOG:
      //@ts-ignore
      return {
        ...state,
        isDialog: action.payload.isDialog,
        message: action.payload.message,
        title: action.payload.title,
      };
    default:
      return state;
  }
}

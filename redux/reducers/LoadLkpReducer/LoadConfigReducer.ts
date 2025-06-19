// import { GET_CON_CODE,LOADSPINNER,UPLOAD_LOOKUP } from "../../actions/LoadConfigActionTypes";

// export interface LoadConfigState {
//   conCode: any[];
//   loadspinner:boolean;
//   uploadLookup:any[];
// }
// const options = [

//     {value:'SpecsLookUp',name:'Spec Lookup '},

//     {value:"SubSpecLookUp",name:"Sub Spec Lookup "},

//     {value:"MinMaxAgeLookUp",name:"MinMaxAge Lookup "},

//     {value:"ReverseCodeLookUp",name:"Reverse Code Lookup "},

//     {value:"BillTypeLookUp",name:"Bill Type Lookup "},

//     {value:"ConditionCodeLookUp",name:"Condition Code Lookup "},

//     {value:"ModLookUp",name:"Mod Lookup "},

//     {value:"PosLookUp",name:"Pos Lookup "},

//     {value:"PolicyCatLookUp",name:"Policy Category Lookup "},

//     {value:"ReasonCodeLookUp",name:"Reason Code Lookup "},

// ];
// const initialState: LoadConfigState = {
//   conCode: options,
//   loadspinner:false,
//   uploadLookup:[]

// };

// export default function LoadConfigStateReducer(
//   state = initialState,
//   action: { type: string; payload: any }
// ): LoadConfigState {
//   switch (action.type) {
//     case GET_CON_CODE:
//       return { ...state, conCode: action.payload };
//       case UPLOAD_LOOKUP:
//       return { ...state, uploadLookup: action.payload };
//       case LOADSPINNER:
//               return{...state,loadspinner:action.payload};
//       case UPLOAD_LOOKUP:
//                return { ...state, uploadLookup: action.payload };
//     default:
//       return state;
//   }
// }
